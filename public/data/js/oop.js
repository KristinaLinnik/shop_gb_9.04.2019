'use strict';
const API_URL = "http://localhost:3000";
//Запрос на сервер
function sendRequest(url) {
    return new Promise(
        ((resolve) => {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', url); // настройка запроса
            xhr.send();
            xhr.addEventListener("load", function() {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    resolve(JSON.parse(xhr.responseText));
                }else{
                    reject(console.log("Request failed: " + xhr.statusText))
                }
            });

        })
    )
}
//Отрисовка еденицы товара
class Item {
    constructor(url, title, price) {
        this.url = url;
        this.title = title;
        this.price = price;
    }
    render() {
        return ` <li class="shop-item">
            <a class="shop-item-link" href = 'single-page.html' style="background-image: url(${this.url})"></a>
            <a class="add-to-card" href="#">Add to card</a>
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
        return sendRequest(`${API_URL}/data/js/products.json`).then(
            (catalog) => {
                this.catalog = catalog.map(item => new Item(item.url, item.title, item.price));
            }
        );
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
    constructor(url, title, price, color, size, quantity) {
        super(url, title, price);
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
                            <div class="delete-good-btn action">
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
        return sendRequest(`${API_URL}/data/js/products.json`).then(
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
    () =>{
        document.querySelector('.rows-wrap').innerHTML = cart.renderCart();
        document.querySelector('#all-total').innerHTML = cart.calculateSum();
        const $totalsum = document.querySelectorAll('.total-sum');
        $totalsum.forEach((item)=>item.innerHTML = cart.calculateSum()-(cart.calculateSum() * 0.1));
    }
);




