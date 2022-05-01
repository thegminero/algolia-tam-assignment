import algoliasearch from 'algoliasearch';
import { Amplify, API, Auth } from 'aws-amplify';
import instantsearch from 'instantsearch.js';
import { createInsightsMiddleware } from 'instantsearch.js/es/middlewares';
import {
  searchBox,
  hits,
  pagination,
  refinementList,
} from 'instantsearch.js/es/widgets';
import aa from 'search-insights';

import awsExports from '../aws-exports';
import resultHit from '../templates/result-hit';

/**
 * @class ResultsPage
 * @description Instant Search class to display content on main page.
 */
class ResultPage {
  constructor() {
    this._registerAWS();
    this._registerClient();
  }

  _registerAWS() {
    Amplify.configure(awsExports);
    Auth.configure(awsExports);
  }
  // eslint-disable-next-line jsdoc/require-description
  /**
   * @private
   * Handles creating the search client and creating an instance of instant search
   * @returns {void}
   */
  _registerClient() {
    const fetchIndexVars = () => {
      const response = API.get('tam', '/envars', {
        responseType: 'json',
      });
      return response;
    };
    fetchIndexVars()
      .then((res) => {
        this._searchClient = algoliasearch(
          res.secrets[1].Value,
          res.secrets[0].Value
        );
        this._searchInstance = instantsearch({
          indexName: 'ElectronicProducts',
          searchClient: this._searchClient,
        });
      })
      .then(() => {
        this._addBindEvents();
        this._registerWidgets();
        this._startSearch();
      });
  }

  // eslint-disable-next-line jsdoc/require-description
  /**
   * @private
   * Adds widgets to the Algolia instant search instance
   * @returns {void}
   */
  _registerWidgets() {
    if (this._searchInstance) {
      this._searchInstance.addWidgets([
        searchBox({
          container: '#searchbox',
        }),
        hits({
          container: '#hits',
          templates: {
            item: resultHit,
          },
        }),
        pagination({
          container: '#pagination',
        }),
        refinementList({
          container: '#brand-facet',
          attribute: 'brand',
        }),
        refinementList({
          container: '#categories-facet',
          attribute: 'categories',
        }),
      ]);
    }
  }
  // eslint-disable-next-line jsdoc/require-description
  /**
   * @private
   * Starts instant search after widgets are registered
   * @returns {void}
   */
  _startSearch() {
    if (this._searchInstance) {
      this._searchInstance.start();
    }
  }

  _addBindEvents() {
    const emptyCart = () => {
      sessionStorage.setItem('ElectronicProductsCart', '{}');
      window.location.reload();
    };
    // actions to perform when updating cart (mostly badge counts)
    const updateCart = () => {
      const cart = JSON.parse(sessionStorage.getItem('ElectronicProductsCart'));
      const cartItems = Object.keys(cart).length;
      document.getElementById('cart-badge').innerHTML = cartItems;
      document.getElementById('cart-total').innerHTML = cartItems;
    };

    // add insights middleware for events
    const insightsMiddleware = createInsightsMiddleware({
      insightsClient: aa,
    });

    // register insights token/user
    aa('setUserToken', 'discount-user');

    this._searchInstance.use(insightsMiddleware);

    // wait for instasearch hits to render to attach eventListeners to
    // action items - such as add to cart and view buttons
    this._searchInstance.on('render', () => {
      const hitCarts = document.getElementsByClassName('result-hit__cart');
      const addToCartElms = [...hitCarts];
      addToCartElms.forEach((addBtn) => {
        addBtn.addEventListener('click', (event) => {
          const cartItems = JSON.parse(
            sessionStorage.getItem('ElectronicProductsCart')
          );
          const hitDetails = {
            queryId: event.target.dataset.queryId,
            price: event.target.dataset.price,
            name: event.target.dataset.name,
          };
          cartItems[event.target.dataset.objectId] = hitDetails;
          sessionStorage.setItem(
            'ElectronicProductsCart',
            JSON.stringify(cartItems)
          );
          updateCart();
        });
      });
    });

    document.getElementById('order-cart').addEventListener('click', () => {
      const cart = JSON.parse(sessionStorage.getItem('ElectronicProductsCart'));
      // eslint-disable-next-line guard-for-in
      for (const item in cart) {
        aa('convertedObjectIDsAfterSearch', {
          index: 'ElectronicProducts',
          eventName: 'Product Bought',
          userToken: 'discount-user',
          objectIDs: [item],
          queryID: cart[item].queryId,
        });
      }
      emptyCart();
    });
  }
}

export default ResultPage;
