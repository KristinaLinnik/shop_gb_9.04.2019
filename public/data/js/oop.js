'use strict';

//Запрос на сервер
function sendRequest(url) {
    return fetch(url).then((response) => response.json());
}

// function sendRequest(url) {
// return new Promise(
//     ((resolve) => {
//         const xhr = new XMLHttpRequest();
//         xhr.open('GET', url); // настройка запроса
//         xhr.send();
//         xhr.addEventListener("load", function() {
//             if (xhr.readyState === XMLHttpRequest.DONE) {
//                 if(xhr.status === 200){
//                     resolve(JSON.parse(xhr.responseText));
//                 }
//             }else{
//                 reject(console.log("Request failed: " + xhr.statusText))
//             }
//         });
//
//     })
// )
// }
const API_URL = "http://localhost:3000";

//Отрисовка еденицы товара
class Item {
    constructor(url, title, price, id) {
        this.url = url;
        this.title = title;
        this.price = price;
        this.id = id;
    }

    render() {
        return ` <li class="shop-item">
            <a class="shop-item-link" href = 'single-page.html' style="background-image: url(${this.url})"></a>
            <a class="add-to-card" href="#" data-id="${this.id}" >Add to card</a>
            <a href="single-page.html" class="item-brand">${this.title}</a>
             <p class="item-price pink">${this.price}</p>
        </li>`
    }
}

//отрисовка каталога
class ItemsList {
    constructor() {
        this.catalog = [];
    }

    fetchItems() {
        return sendRequest(`${API_URL}/products`).then(
            (catalog) => {
                this.catalog = catalog.map(item => new Item(item.url, item.title, item.price, item.id));
            });
    }

    render() {
        const itemsHtmls = this.catalog.map(Item => Item.render());
        return itemsHtmls.join("");
    }
}

const list = new ItemsList();
list.fetchItems().then(
    () => {
        document.querySelector(".shop-item-wrap").innerHTML = list.render();
    }
);

//отрисовка корзины
class Basket extends Item {
    constructor(url, title, price, color, size, quantity, id) {
        super(url, title, price, id);
        this.color = color;
        this.size = size;
        this.quantity = quantity;
        this.sum = quantity * price;

    }

    renderCart() {
        return `<div class="product-row">
                            <div class="product-details">
                                <div class="product-details-wrap">
                                    <div class="product-details-img"
                                         style="background: url(${this.url}) no-repeat center center; background-size: contain"></div>
                                    <div class="product-name">
                                        <h6 class="good-title"><a class='link-to-catalog' href="single-page.html">${this.title}</a></h6>
                                        <span class="color">Color:<span class="color-result">${this.color}</span></span><br>
                                        <span class="size">Size:<span class="size-result">${this.size}</span></span>
                                    </div>
                                </div>
                            </div>
                            <div class="unite-price">
                                ${this.price}
                           </div>
                            <div class="quantity" id="quantity">
                            ${this.quantity}
                                <!--<input type="number" class="quantity-box" placeholder="2">-->
                            </div>
                            <div class="shipping">
                                FREE
                            </div>
                            <div class="subtotal">
                                ${this.sum}
                            </div>
                            <div class="delete-good-btn action" data-id="${this.id}">
                                <i class="fas fa-times-circle"></i>
                            </div>
                        </div>`
    }
}

class CartList {
    constructor() {
        this.cartCatalog = [];
    }

    fetchGoods() {
        return sendRequest(`${API_URL}/cart`).then(
            (cartCatalog) => {
                this.cartCatalog = cartCatalog.map(good => new Basket(good.url, good.title, good.price, good.color, good.size, good.quantity));
            }
        );
    }

    calculateSum() {
        return this.cartCatalog.reduce((acc, item) => acc + item.price, 0);
    }

    renderCart() {
        const goodsHtmls = this.cartCatalog.map(good => good.renderCart());
        return goodsHtmls.join('');
    }
}

const cart = new CartList();
cart.fetchGoods().then(
    () => {
        const $catalogWrap = document.querySelector('.shop-item-wrap');
        const url = '/db.json/prducts/url'

        $catalogWrap.addEventListener('click', (event) => {
                event.preventDefault();
                if (event.target.classList.contains('add-to-card')) {
                    console.log('111');
                    fetch('/cart', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({url, title, price, color, size, quantity}),
                    }).then((response) => response.json())
                        .then((cart) => {
                            document.querySelector('.rows-wrap').innerHTML = cart.renderCart();
                            document.querySelector('#all-total').innerHTML = cart.calculateSum();
                        })
                }
            }
        );

        const $totalsum = document.querySelectorAll('.total-sum');
        $totalsum.forEach((item) => item.innerHTML = cart.calculateSum() - (cart.calculateSum() * 0.1));
    }
);







