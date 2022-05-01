import algoliasearch from 'algoliasearch';
import instantsearch from 'instantsearch.js';
import { createInsightsMiddleware } from 'instantsearch.js/es/middlewares';
import {
  searchBox,
  hits,
  pagination,
  refinementList,
} from 'instantsearch.js/es/widgets';
import aa from 'search-insights';

import resultHit from '../templates/result-hit';

/**
 * @class ResultsPage
 * @description Instant Search class to display content on main page.
 */
class ResultPage {
  constructor() {
    this._registerClient();
    this._registerWidgets();
    this._startSearch();
  }

  // eslint-disable-next-line jsdoc/require-description
  /**
   * @private
   * Handles creating the search client and creating an instance of instant search
   * @returns {void}
   */
  _registerClient() {
    this._searchClient = algoliasearch(
      'LTBRQZ4V1G',
      '0cb6538cfbc3b75986a59896f3642ca0'
    );

    this._searchInstance = instantsearch({
      indexName: 'ElectronicProducts',
      searchClient: this._searchClient,
    });

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

      document.getElementById('order-cart').addEventListener('click', () => {
        const cart = JSON.parse(
          sessionStorage.getItem('ElectronicProductsCart')
        );
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
    });

    // add insights middleware for events
    this._insightsMiddleware = createInsightsMiddleware({
      insightsClient: aa,
    });

    // register insights token/user
    aa('setUserToken', 'discount-user');

    this._searchInstance.use(this._insightsMiddleware);
  }

  // eslint-disable-next-line jsdoc/require-description
  /**
   * @private
   * Adds widgets to the Algolia instant search instance
   * @returns {void}
   */
  _registerWidgets() {
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
  // eslint-disable-next-line jsdoc/require-description
  /**
   * @private
   * Starts instant search after widgets are registered
   * @returns {void}
   */
  _startSearch() {
    this._searchInstance.start();
  }
}

export default ResultPage;
