'use strict';
const url = '/db.json/products';
const API_URL = "http://localhost:3000";
const searchBtn = document.querySelector('.btn-search');
const searchText = document.querySelector('#filter');
searchBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    list.filterItems(searchText.value);
    document.querySelector(".shop-item-wrap").innerHTML = list.render();
});
searchText.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        list.filterItems(event.target.value);
    }

    document.querySelector(".shop-item-wrap").innerHTML = list.render();


});
const $catalogWrap = document.querySelector('.shop-item-wrap');

//Запрос на сервер
function sendRequest(url) {
    return fetch(url).then((response) => response.json());
}

//Отрисовка еденицы товара
class Item {
    constructor(title, price, id, color, size, url = './data/img/no-image-icon.png') {
        this.title = title;
        this.price = price;
        this.id = id;
        this.color = color;
        this.size = size;
        this.url = url;
    }

    render() {
        return ` <li class="shop-item">
            <a class="shop-item-link" href = "single-page.html" style="background-image: url(${this.url})"></a>
            <a class="add-to-card" href="#" data-id="${this.id}" data-title="${this.title}" data-price="${this.price}" data-url="${this.url}" data-color="${this.color}" data-size="${this.size}">Add to card</a>
            <a href="single-page.html" class="item-brand">${this.title}</a>
             <p class="item-price pink">${this.price}</p>
        </li>`
    }
}

//отрисовка каталога
class ItemsList {
    constructor() {
        this.catalog = [];
        this.cart = [];
    }

    fetchCart() {
        fetch(`${API_URL}/cart`)
            .then(response => response.json())
            .then((items) => {
                this.cart = items;
            });
    }

    fetchItems() {
        return sendRequest(`${API_URL}/products`)
            .then(
                (catalog) => {
                    this.catalog = catalog.map(item => new Item(item.title, item.price, item.id, item.color, item.size, item.url));
                    this.filteredItems = [];
                    for (let i = 0; i < 12; i++) {
                        this.filteredItems.push(this.catalog[i])
                    };
                    console.log(this.filteredItems);
                });
    }

    render() {
        let itemsHtmls = this.filteredItems.map(Item => Item.render());
        return itemsHtmls.join("");


    }

    filterItems(value) {
        const regexp = new RegExp(value, 'i');
        this.filteredItems = this.catalog.filter((item) => regexp.test(item.title));
        document.querySelector('#scroll-filter').scrollIntoView({
            behavior: 'smooth'
        });
    }

    addToCart(data) {
        const cartItem = this.cart.find((entry) => entry.id === data.id);
        if (cartItem) {
            fetch(`/cart/${data.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({quantity: cartItem.quantity + 1}),
            })
                .then((response) => response.json())
                .then((item) => {
                    const itemIdx = this.cart.findIndex((entry) => entry.id === item.id);
                    this.cart[itemIdx].quantity = item.quantity;
                    console.log(this.cart)
                });
        } else {
            fetch('/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({...data, quantity: 1}),
            })
                .then((response) => response.json())
                .then((item) => {
                    this.cart.push(item);
                });
        }
        console.log(this.cart);

    }


}

const list = new ItemsList();
list.fetchItems().then(
    () => {
        document.querySelector(".shop-item-wrap").innerHTML = list.render();
        list.fetchCart()
    }
);
$catalogWrap.addEventListener('click', (event) => {
        if (event.target.classList.contains('add-to-card')) {
            event.preventDefault();
            let data = event.target.dataset;
            list.addToCart(data);
            // alert('this good added to cart!')


        }
    }
);

// let globalCatalog = [];
// function fetchGlobal(dataId) {
//     return sendRequest(`${API_URL}/products`).then((items) => {
//         const globalCatalog = items;
//         const cartItem = globalCatalog.find((entry) => entry.id === dataId);
//         console.log(cartItem);
//
//
//     });
// }


//отрисовка корзины
// class Basket extends Item {
//     constructor(url, title, price, color, size, quantity, id) {
//         super(title, price, id, size, color, url);
//         this.quantity = quantity;
//     }
//
//     renderCart() {
//         return `<div class="product-row">
//                             <div class="product-details">
//                                 <div class="product-details-wrap">
//                                     <div class="product-details-img"
//                                          style="background: url(${this.url}) no-repeat center center; background-size: contain"></div>
//                                     <div class="product-name">
//                                         <h6 class="good-title"><a class='link-to-catalog' href="single-page.html">${this.title}</a></h6>
//                                         <span class="color">Color:<span class="color-result">${this.color}</span></span><br>
//                                         <span class="size">Size:<span class="size-result">${this.size}</span></span>
//                                     </div>
//                                 </div>
//                             </div>
//                             <div class="unite-price">
//                                 ${this.price}
//                            </div>
//                             <div class="quantity" id="quantity">
//                             ${this.quantity}
//                                 <!--<input type="number" class="quantity-box" placeholder="2">-->
//                             </div>
//                             <div class="shipping">
//                                 FREE
//                             </div>
//                             <div class="subtotal">
//                                $ ${this.quantity * this.price}
//                             </div>
//                             <div class="delete-good-btn action" data-id="${this.id}" data-quantity="${this.quantity}">
//                                 <i class="fas fa-times-circle"></i>
//                             </div>
//                         </div>`
//     }
// }
//
// class CartList {
//     constructor() {
//         this.cartCatalog = [];
//     }
//
//     fetchGoods() {
//         return sendRequest(${API_URL}/cart).then(
//             (cartCatalog) => {
//                 this.cartCatalog = cartCatalog.map(good => new Basket(good.url, good.title, good.price, good.color, good.size, good.quantity, good.id));
//
//             }
//         );
//     }
//
//     calculateSum() {
//         return this.cartCatalog.reduce((acc, item) => acc + (+item.price * item.quantity), 0);
//     }
//
//     renderCart() {
//         const goodsHtmls = this.cartCatalog.map(good => good.renderCart());
//         return goodsHtmls.join('');
//     }
//
//     addToCart(data) {
//         if (data.quantity > 1) {
//             fetch(/cart/${data.id}, {
//                 method: 'PATCH',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({quantity: data.quantity}),
//             })
//                 .then((response) => response.json())
//                 .then(() => cartGenerate())
//         } else {
//             fetch('/cart', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(data),
//             })
//                 .then((response) => response.json())
//                 .then(cart.fetchGoods())
//                 .then(() => cartGenerate())
//         }
//
//     }
//
//     deleteGood(et, dataSet) {
//         if (dataSet.quantity >= 1) {
//             fetch(/cart/${dataSet.id}, {
//                 method: 'PATCH',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({quantity: dataSet.quantity})
//             })
//                 .then((response) => response.json())
//                 .then(() => cartGenerate())
//                 .then(() => delete et.dataset)
//
//
//         } else {
//             fetch(/cart/${dataSet.id}, {method: 'delete'})
//                 .then(() => {
//                     cartWrapper.removeChild(et.parentElement);
//                 })
//                 .then(() => cartGenerate())
//                 .then(() => delete et.dataset)
//         }
//     }
// }
//
// const cart = new CartList();
// function cartGenerate() {
//     cart.fetchGoods()
//         .then(
//             () => {
//                 document.querySelector('.rows-wrap').innerHTML = cart.renderCart();
//                 document.querySelector('#all-total').innerHTML = '$ ' + cart.calculateSum();
//                 const $totalsum = document.querySelectorAll('.total-sum');
//                 $totalsum.forEach((item) => item.innerHTML = '$ ' + (cart.calculateSum() - (cart.calculateSum() * 0.1)));
//             }
//         )
// }
//
// const $catalogWrap = document.querySelector('.shop-item-wrap');
// const cartWrapper = document.querySelector('#parentOfCart');
// const url = '/db.json/products';
// if (!$catalogWrap) {
//     cartWrapper.addEventListener('click', (event) => {
//             const et = event.target.parentElement;
//             let dataSet = event.target.parentElement.dataset;
//             const goodInCatalog = document.querySelectorAll('.add-to-card');
//             for (let i = 0; i < goodInCatalog.length; i++) {
//                 if (goodInCatalog[i].dataset.id === dataSet.id) {
//                     parseInt(goodInCatalog[i].dataset.quantity--);
//                 }
//             }
//             if (event.target.parentElement.classList.contains('delete-good-btn')) {
//                 dataSet.quantity = parseInt(dataSet.quantity) - 1;
//                 cart.deleteGood(et, dataSet);
//             }
//         }
//     );
//
//
// } else {
//
//     $catalogWrap.addEventListener('click', (event) => {
//             event.preventDefault();
//             if (event.target.classList.contains('add-to-card')) {
//                 const data = event.target.dataset;
//                 const data2 = quan(data);
//                 cart.addToCart(data2);
//             }
//         }
//     );
//
// }
//
//
// function quan(data) {
//     if (!data["quantity"] || data["quantity"] <= 0) {
//         data["quantity"] = 1;
//     } else if (data["quantity"] >= 1) {
//         data["quantity"]++
//     }
//     return data
// }
//
//
//