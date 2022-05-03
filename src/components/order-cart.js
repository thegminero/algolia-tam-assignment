import aa from 'search-insights';

class OrderCart {
  constructor() {
    this._initOrderCart();
  }

  _initOrderCart() {
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
      this._emptyCart();
    });
  }
  _emptyCart() {
    sessionStorage.setItem('ElectronicProductsCart', '{}');
    window.location.reload();
  };
};
export default OrderCart;