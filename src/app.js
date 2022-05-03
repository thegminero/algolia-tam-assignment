import ProductModalListeners from './components/product-view';
import ResultsPage from './components/results-page';

class SpencerAndWilliamsSearch {
  constructor() {
    this._initSearch();
    this._initProductModal();
  }

  _initSearch() {
    this.resultPage = new ResultsPage();
  }
  _initProductModal() {
    this.prodModalListeners = new ProductModalListeners();
  }
}
const app = new SpencerAndWilliamsSearch();
