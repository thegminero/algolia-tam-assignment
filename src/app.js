import ResultsPage from './components/results-page';

class SpencerAndWilliamsSearch {
  constructor() {
    this._initSearch();
  }

  _initSearch() {
    this.resultPage = new ResultsPage();
  }
}

const app = new SpencerAndWilliamsSearch();
