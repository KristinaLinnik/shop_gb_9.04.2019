'use strict';
window.onload = function () {

    cartGenerate();

};

//Запрос на сервер
function sendRequest(url) {
    return fetch(url).then((response) => response.json());
}

const API_URL = "http://localhost:3000";

//Отрисовка еденицы товара
class Item {
    constructor(url, title, price, id, color, size) {
        this.url = url;
        this.title = title;
        this.price = price;
        this.id = id;
        this.color = color;
        this.size = size;
    }

    render() {
        return ` <li class="shop-item">
            <a class="shop-item-link" href = 'single-page.html' style="background-image: url(${this.url})"></a>
            <a class="add-to-card" href="#" data-id="${this.id}" data-title="${this.title}" data-price="${this.price}" data-url="${this.url}" data-color="${this.color}" data-size="${this.size}">Add to card</a>
            <a href="single-page.html" class="item-brand">${this.title}</a>
             <p class="item-price pink">${this.price}</p>
        </li>`
    }
}

const searchBtn = document.querySelector('.btn-search');
const searchText = document.querySelector('#filter');
searchBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
    list.filterItems(searchText.value);
    document.querySelector(".shop-item-wrap").innerHTML = list.render();

});

//отрисовка каталога
class ItemsList {
    constructor() {
        this.catalog = [];
    }

    fetchItems() {
        return sendRequest(`${API_URL}/products`).then(
            (catalog) => {
                this.catalog = catalog.map(item => new Item(item.url, item.title, item.price, item.id, item.color, item.size));
                this.filteredItems = this.catalog;

            });
    }

    render() {
        let itemsHtmls = this.filteredItems.map(Item => Item.render());
        return itemsHtmls.join("");
        // if(searchText.value === ' ') {
        // console.log('input is empty');
        // } else {
        // itemsHtmls = this.filteredItems.map(Item => Item.render());
        // }
    }

    filterItems(value) {
        const regexp = new RegExp(value, 'i');
        this.filteredItems = this.catalog.filter((item) => regexp.test(item.title));
        // this.filteredItems.forEach(el => {
        // if(el.title === item.title){
        // console.log(el);
        // return(el)
        // }
        // })
        // console.log(this.filteredItems.title)
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
        super(url, title, price, id, size, color);
        this.quantity = quantity;
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
                               $ ${this.quantity * this.price}
                            </div>
                            <div class="delete-good-btn action" data-id="${this.id}" data-quantity="${this.quantity}">
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
                this.cartCatalog = cartCatalog.map(good => new Basket(good.url, good.title, good.price, good.color, good.size, good.quantity, good.id));

            }
        );
    }

    calculateSum() {
        return this.cartCatalog.reduce((acc, item) => acc + (+item.price * item.quantity), 0);
    }

    renderCart() {
        const goodsHtmls = this.cartCatalog.map(good => good.renderCart());
        return goodsHtmls.join('');
    }

    addToCart(data) {
        if (data.quantity > 1) {
            fetch(`/cart/${data.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({quantity: data.quantity}),
            })
                .then((response) => response.json())
                .then(() => cartGenerate())
        } else {
            fetch('/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(...data, quantity),
            })
                .then((response) => response.json())
                .then(cart.fetchGoods())
                .then(() => cartGenerate())
        }

    }

    deleteGood(et, dataSet) {
        if (dataSet.quantity >= 1) {
            fetch(`/cart/${dataSet.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({quantity: dataSet.quantity})
            })
                .then((response) => response.json())
                .then(() => cartGenerate())
                .then(() => delete et.dataset)


        } else {
            fetch(`/cart/${dataSet.id}`, {method: 'delete'})
                .then(() => {
                    cartWrapper.removeChild(et.parentElement);
                })
                .then(() => cartGenerate())
                .then(() => delete et.dataset)
        }
    }
}

const cart = new CartList();

function cartGenerate() {
    cart.fetchGoods()
        .then(
            () => {
                document.querySelector('.rows-wrap').innerHTML = cart.renderCart();
                document.querySelector('#all-total').innerHTML = '$ ' + cart.calculateSum();
                const $totalsum = document.querySelectorAll('.total-sum');
                $totalsum.forEach((item) => item.innerHTML = '$ ' + (cart.calculateSum() - (cart.calculateSum() * 0.1)));
            }
        )

}

const $catalogWrap = document.querySelector('.shop-item-wrap');
const url = '/db.json/products';

$catalogWrap.addEventListener('click', (event) => {
        event.preventDefault();
        if (event.target.classList.contains('add-to-card')) {
            const data = event.target.dataset;
            const data2 = quan(data);
            cart.addToCart(data2);
        }
    }
);

function quan(data) {
    if (!data["quantity"] || data["quantity"] <= 0) {
        data["quantity"] = 1;
    } else if (data["quantity"] >= 1) {
        data["quantity"]++
    }
    return data
}


const cartWrapper = document.querySelector('#parentOfCart');
cartWrapper.addEventListener('click', (event) => {
        const et = event.target.parentElement;
        let dataSet = event.target.parentElement.dataset;
        const goodInCatalog = document.querySelectorAll('.add-to-card');
        for (let i = 0; i < goodInCatalog.length; i++) {
            if (goodInCatalog[i].dataset.id === dataSet.id) {
                parseInt(goodInCatalog[i].dataset.quantity--);
            }
        }
        if (event.target.parentElement.classList.contains('delete-good-btn')) {
            dataSet.quantity = parseInt(dataSet.quantity) - 1;
            cart.deleteGood(et, dataSet);
        }
    }
);






