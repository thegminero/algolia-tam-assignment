const resultHit = (hit, bindEvent) => `<a class="result-hit">
  <div class="result-hit__image-container">
    <img class="result-hit__image" src="${hit.image}" />
  </div>
  <div class="result-hit__details">
    <h3 class="result-hit__name">${hit._highlightResult.name.value}</h3>
    <div class="result-hit__prices">
    ${
      hit.has_discount
        ? `<p class="result-hit__original">$${hit.original_price}</p>`
        : ''
    }
    <p class="result-hit__price">$${hit.price}</p>
    </div>
  </div>
  <div class="result-hit__controls">
    <button type="button" id="view-item" class="result-hit__view" ${bindEvent(
      'view',
      hit,
      'Product Viewed'
    )} data-query-id="${hit.__queryID}" data-object-id="${
  hit.objectID
}" data-price="${hit.price}" data-name="${hit._highlightResult.name.value}" data-image="${hit.image}" data-description="${hit.description}">
      <svg width="24px" height="24px" viewBox="0 0 24 24" id="magicoon-Regular" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1{fill:white;}</style></defs><title>eye</title><g id="eye-Regular"><path id="eye-Regular-2" data-name="eye-Regular" class="cls-1" d="M21.229,10.116C19.914,7.925,16.966,4.25,12,4.25S4.086,7.925,2.771,10.116a3.656,3.656,0,0,0,0,3.768C4.086,16.075,7.035,19.75,12,19.75s7.914-3.675,9.229-5.866h0A3.652,3.652,0,0,0,21.229,10.116Zm-1.286,3C18.792,15.031,16.228,18.25,12,18.25s-6.791-3.219-7.943-5.138a2.16,2.16,0,0,1,0-2.224C5.209,8.969,7.773,5.75,12,5.75s6.792,3.219,7.943,5.138A2.155,2.155,0,0,1,19.943,13.112ZM12,7.75A4.25,4.25,0,1,0,16.25,12,4.255,4.255,0,0,0,12,7.75Zm0,7A2.75,2.75,0,1,1,14.75,12,2.752,2.752,0,0,1,12,14.75Z"/></g></svg>
    View</button>
    <button type="button" class="result-hit__cart" ${bindEvent(
      'click',
      hit,
      'Product Added to Cart'
    )} data-query-id="${hit.__queryID}" data-object-id="${
  hit.objectID
}" data-price="${hit.price}" data-name="${hit._highlightResult.name.value}">
    <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3.75 5.25H6L6.34615 8.25M6.34615 8.25L7.5 15.75H17.25L18.75 8.25H6.34615Z" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M9 18.75L9.00788 18.75" stroke="white" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M15 18.75L15.0079 18.75" stroke="white" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    Add To Cart</button>
  </div>
</a>`;

export default resultHit;
