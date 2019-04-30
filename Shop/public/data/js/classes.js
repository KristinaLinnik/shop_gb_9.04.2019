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
            <a class="shop-item-link" href="single-page.html?id=${this.id}" style="background-image: url(${this.url})"></a>
            <a class="add-to-card" href="#" data-id="${this.id}" data-title="${this.title}" data-price="${this.price}" data-url="${this.url}" data-color="${this.color}" data-size="${this.size}">Add to card</a>
            <a href="single-page.html?id=${this.id}" class="item-brand">${this.title}</a>
             <p class="item-price pink">${this.price}</p>
        </li>`
    }

}

//отрисовка каталога
class ItemsList {
    constructor() {
        this.catalog = [];
        this.cart = [];
        this.item =[]
    }

    fetchCart() {
        fetch(`${API_URL}/cart`)
            .then(response => response.json())
            .then((items) => {
                this.cart = items;
            });
    }

    fetchItemById(id) {
        return sendRequest(`${constant.API_URL}/products`)
            .then(
                (catalog) => {
                    this.item = catalog.find(item => item.id === parseInt(id));
                })
    }
    renderSlider() {
        let html ='';
        for (let img of this.item.images){
            html += ` <div class="slider__item">
                            <div class='slider__img' style=" background-image: url(${img.url});"></div>
                        </div>`;
        }


        return html;
    }

    fetchItems() {
        return sendRequest(`${constant.API_URL}/products`)
            .then(
                (catalog) => {
                    this.catalog = catalog.map(item => new Item(item.title, item.price, item.id, item.color, item.size, item.url));
                    this.filteredItems = [];
                    for (let i = 0; i < 12; i++) {
                        this.filteredItems.push(this.catalog[i])
                    }
                    ;
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

    addToCart(data, inputQuantity) {
        const cartItem = this.cart.find((entry) => entry.id === data.id);
        if (cartItem) {
            fetch(`/cart/${data.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({quantity: inputQuantity, size: data.size}),
            })
                .then((response) => response.json())
                .then((item) => {
                    const itemIdx = this.cart.findIndex((entry) => entry.id === item.id);
                    this.cart[itemIdx].quantity = item.quantity;

                });
        } else {
            fetch('/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({...data, quantity: inputQuantity}),
            })
                .then((response) => response.json())
                .then((item) => {
                    this.cart.push(item);
                });
        }
    }
}

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

//отрисовка корзины
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
        fetch(`${API_URL}/cart/${data.id}`, {
            method: 'DELETE',
        })
            .then(() => {
                this.cart = this.cart.filter((cartItem) => cartItem.id !== data.id);
            });
    }
    clearCart() {
        for (let i = 0; i < this.cart.length; i++) {
            let item = this.cart[i];
            fetch(`${API_URL}/cart/${item.id}`, {
                method: 'DELETE',
            })
                .then(() => {
                    this.cart = [];
                    this.cartCatalog = [];
                });
        }

    }


    filterItems(value) {
        const regexp = new RegExp(value, 'i');
        this.filteredItems = this.cartCatalog.filter((item) => regexp.test(item.title));
    }
}

class UsersList {
    constructor() {
        this.list = [];
        this.user =[]
    }

    fetchByEmail(email) {
        return sendRequest(`${constant.API_URL}/users`)
            .then(
                (list) => {
                    this.user = list.find(user => user.email === email);
                })
    }

    fetchById(id) {
        return sendRequest(`${constant.API_URL}/users`)
            .then(
                (list) => {
                    this.user = list.find(user => user.id === parseInt(id));
                })
    }

    fetchUsers() {
        return sendRequest(`${constant.API_URL}/users`)
            .then(
                (list) => {
                    this.list = list.map(item => new User(item.id, item.username, item.email, item.password));

                });
    }

    addToJson(data) {
        return this.fetchByEmail(data.email).then(() => {
            let user = this.user;
            if (!user) {
                return this.fetchUsers().then(() => {
                    let cnt = this.list.length;
                    data.id = cnt+1;
                    fetch('/users', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data),
                    });
                })
            }
        });
    }
}

class User {
    constructor(id, username, email, password) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
    }
}



