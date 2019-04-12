'use strict';

//Запрос на сервер

function sendRequest(url) {
    return fetch(url).then((response) => response.json());
}

const API_URL = "http://localhost:3000";

window.onload = function (event) {
    cartGenerate();
    event.preventDefault()
};

class Basket {
    constructor(title, price, color, size, quantity, id, url = './data/img/no-image-icon.png') {
        this.title = title;
        this.price = price;
        this.color = color;
        this.size = size;
        this.quantity = quantity;
        this.id = id;
        this.url = url;


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
        this.cart = [];
    }

    fetchCart() {
        fetch(`${API_URL}/cart`)
            .then(response => response.json())
            .then((items) => {
                this.cart = items;
            });
    }

    fetchGoods() {
        return sendRequest(`${API_URL}/cart`).then(
            (cartCatalog) => {
                this.cartCatalog = cartCatalog.map(good => new Basket(good.title, good.price, good.color, good.size, good.quantity, good.id, good.url));
                this.filteredItems = this.cartCatalog;

            }
        );
    }

    calculateSum() {
        return this.cartCatalog.reduce((acc, item) => acc + (+item.price * item.quantity), 0);
    }

    renderCart() {
        const goodsHtmls = this.filteredItems.map(good => good.renderCart());
        return goodsHtmls.join('');
    }

    deleteGood(data) {
        if (data.quantity > 1) {
            fetch(`${API_URL}/cart/${data.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({quantity: data.quantity - 1}),
            })
                .then((response) => response.json())
                .then((item) => {
                    const itemIdx = this.cart.findIndex((entry) => entry.id === item.id);
                    this.cart[itemIdx].quantity = item.quantity;
                })


        } else {
            fetch(`${API_URL}/cart/${data.id}`, {
                method: 'DELETE',
            })
                .then(() => {
                    this.cart = this.cart.filter((cartItem) => cartItem.id !== data.id);
                });
        }
    }

    filterItems(value) {
        const regexp = new RegExp(value, 'i');
        this.filteredItems = this.cartCatalog.filter((item) => regexp.test(item.title));
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
                cart.fetchCart();
            }
        )
}

const cartWrapper = document.querySelector('#parentOfCart');
cartWrapper.addEventListener('click', (event) => {
        const data = event.target.parentElement.dataset;
        if (event.target.parentElement.classList.contains('delete-good-btn')) {
            cart.deleteGood(data);
            cartGenerate()
        }
    }
);


const searchBtn = document.querySelector('.btn-search');
const searchText = document.querySelector('#filter');
searchBtn.addEventListener('click', (evt) => {
    evt.preventDefault();
        // if(event.keyCode === 13){
            cart.filterItems(searchText.value);
            document.querySelector(".rows-wrap").innerHTML = cart.renderCart();

        // }



});
searchText.addEventListener('keydown', (event) => {
    // event.preventDefault()
    if(event.keyCode === 13){
        event.preventDefault()

        cart.filterItems(event.target.value);

    }
    document.querySelector(".rows-wrap").innerHTML = cart.renderCart();

});







