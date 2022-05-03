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

import OrderCart from './order-cart';
import UpdateCart from './update-cart';
import ViewProduct from './view-products';

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
    // Get Secrets (Api Key and AppId from AWS)
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
  _initUpdateToCart() {
    // Update Cart event DOM propertie and event listener(s)
    this.updateCart = new UpdateCart();
  }
  _initOrderCart() {
    // Order Cart event listener(s)
    this.orderCart = new OrderCart();
  }
  _initProductViewModal() {
    // View Product Modal DOM properties and event listener(s)
    this.viewProdModal = new ViewProduct();
  }
  _addBindEvents() {
    // add insights middleware for events
    const insightsMiddleware = createInsightsMiddleware({
      insightsClient: aa,
    });

    // register insights token/user
    aa('setUserToken', 'discount-user');

    this._searchInstance.use(insightsMiddleware);

    // wait for instasearch hits to render to attach eventListeners to
    // action items - such as add to cart and view buttons on each hit
    this._searchInstance.on('render', () => {
      this._initUpdateToCart();
      this._initProductViewModal();
    });
    // init the Order Cart Listeners btn
    this._initOrderCart();
  }
}

export default ResultPage;
