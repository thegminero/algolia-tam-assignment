class ViewProduct {
  constructor() {
    this._initViewProduct();
  }

  _initViewProduct() {
    /* Add DOM Properties and hadnlers for product view */
    const viewProdcs = document.getElementsByClassName('result-hit__view');
    const viewProdcsElms = [...viewProdcs];
    viewProdcsElms.forEach((viewBtn) => {
      viewBtn.addEventListener('click', (event) => {
        const modal = document.getElementById('product-modal');
        modal.style.display = 'block';
        document.getElementById('mod-product-name').innerText =
          event.target.dataset.name;
        const prodImage = document.getElementById('prod-image');
        prodImage.src = event.target.dataset.image;
        prodImage.alt = event.target.dataset.name;
        document.getElementById('prod-price').innerText =
          event.target.dataset.price;
        document.getElementById('prod-desc').innerText =
          event.target.dataset.description;
        const addToCartModal = document.getElementById('add-to-cart');
        const prodViewId = event.target.dataset.objectId;
        addToCartModal.addEventListener('click', () => {
          document
            .querySelector(
              `button.result-hit__cart[data-object-id="${prodViewId}"]`
            )
            .click(event);
          modal.style.display = 'none';
        });
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
export default ViewProduct;
