class UpdateCart {
  constructor() {
    this._initUpdateCart();
  }

  _initUpdateCart() {
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
        this._updateCart();
      });
    });
  }
  _updateCart() {
    const cart = JSON.parse(sessionStorage.getItem('ElectronicProductsCart'));
    const cartItems = Object.keys(cart).length;
    document.getElementById('cart-badge').innerHTML = cartItems;
    document.getElementById('cart-total').innerHTML = cartItems;
  };
};
export default UpdateCart;
