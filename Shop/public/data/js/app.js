'use strict';

let app = {
    selector: {
        body: document.querySelector('body'),
        sendFormBtn: document.querySelector('#ddd'),
        login: document.querySelector('.js-login'),
        logout: document.querySelector('.js-logout'),
        searchBtn: document.querySelector('.btn-search'),
        searchText: document.querySelector('#filter'),
        catalogWrap: document.querySelector('.shop-item-wrap'),
        sliderWrapper: document.querySelector('.slider__wrapper'),
        cartWrapper: document.querySelector('#parentOfCart'),

    },
    html: {},
    modal: {
        registration: `
        <div class="form-block_main-wrap active">
            <div class="form-block_popup">
                <a class="close-btn" href=""></a>
    
                <form id="registrationForm" class="send-form_data">
                    <h3 class="form-head">login
                    </h3>
                    <input name="name" class="send-form_input" placeholder="please, enter your name" required>
                    <input name="email" class="send-form_input" type="email" placeholder="please, enter your email" required>
                    <input name="password" class="send-form_input" type="password" placeholder="please, enter your password" required>
                    <button class="send-form_btn">Send</button>
                    <p class="send-form_personal-text">This site respects the confidentiality policy.</p>
    
                </form>
            </div>
        </div>`,
        myAccount: `
<div class="form-block_main-wrap active">
        <div class="form-block_popup">
            <a class="close-btn" href=""></a>

            <form class="send-form_data" id = "myAccountForm">
                <h3 class="form-head">login
                </h3>
                <input class="send-form_input" type="email" placeholder="please, enter your email" required>
                <input class="send-form_input" type="password" placeholder="please, enter your password" required>
                <button class="send-form_btn" type="submit">Send</button>
                <p class="send-form_personal-text">If aren\`t registered, <a href="#" class="create-account">create
                    account</a></p>

            </form>
        </div>
    </div>`,
    },
    helper: {
        setCookie: (name, value, days) => {
            let expires = "";
            if (days) {
                let date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toUTCString();
            }
            document.cookie = name + "=" + (value || "") + expires + "; path=/";
        },
        getCookie: (name) => {
            let nameEQ = name + "=";
            let ca = document.cookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i];
                while (c.charAt(0) == ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
            }
            return null;
        },
        eraseCookie: (name) => {
            document.cookie = name + '=; Max-Age=-99999999;';
        },
        getUrlParameter: (name) => {
            name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            let regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
            let results = regex.exec(location.search);

            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        },
        popupEvents: (close) => {
            if (close) {
                document.querySelector('.' +
                    '' +
                    'popup_index-page_overlay').classList.remove('active');
                document.querySelector('.popup-parameters').style = 'display: none';
                document.querySelector('body').style = 'overflow: visible';
            } else {
                document.querySelector('.popup_index-page_overlay').classList.add('active');
                document.querySelector('.popup-parameters').style = 'display: block';
                document.querySelector('body').style = 'overflow: hidden';
                app.helper.closePopup()
            }
        },
        closePopup: () => {
            let $closeBtn = document.querySelector('.close-btn');
            $closeBtn.addEventListener('click', () => {
                event.preventDefault();
                app.helper.popupEvents(true)
            });

        }
    },
    action: {
        userActions: () => {
            let session = localStorage.getItem('logged');
            if (session) {
                app.selector.logout.style = 'display:block';
            } else {
                app.selector.login.style = 'display:block';
            }

            app.selector.login.addEventListener('click', (event) => {
                event.preventDefault();
                app.action.openPopupMyAccount();
            });

            app.selector.logout.addEventListener('click', (event) => {
                event.preventDefault();

                localStorage.removeItem('logged');

                window.location.reload();
            });
        },
        openPopupMyAccount: () => {
            document.querySelector('.popupWrap').innerHTML = app.modal.myAccount;
            document.querySelector('.popup_index-page_overlay').classList.add('active');
            document.querySelector('body').style = 'overflow: hidden';

            let $loginForm = document.querySelector('#myAccountForm');
            $loginForm.addEventListener('submit', (event) => {
                event.preventDefault();

                let email = $loginForm.querySelector('input[type="email"]').value,
                    password = $loginForm.querySelector('input[type="password"]').value;

                let list = new UsersList();
                list.fetchByEmail(email).then(() => {
                    let user = list.user;
                    if (user) {
                        if (user.password === password) {
                            localStorage.setItem('logged', user.email);

                            window.location.reload();
                        } else {
                            alert('The password is incorrect')
                        }
                    } else {
                        alert('Access denied')
                    }
                });
            });

            let $createAccount = document.querySelector('.create-account');
            $createAccount.addEventListener('click', (event) => {
                event.preventDefault();
                document.querySelector('.popupWrap').innerHTML = app.modal.registration;
                document.querySelector('.popup_index-page_overlay').classList.add('active');
                document.querySelector('body').style = 'overflow: hidden';

                event.preventDefault();

                let $registration = document.querySelector('#registrationForm');
                $registration.addEventListener('submit', (event) => {
                    event.preventDefault();

                    let name = $registration.querySelector('input[name="name"]').value,
                        email = $registration.querySelector('input[name="email"]').value,
                        password = $registration.querySelector('input[name="password"]').value.trim();

                    if (/^[a-zA-Z\s]+$/.test(name) === false) {
                        alert('The name is incorrect');
                        return false;
                    }

                    if (/\S+@\S+\.\S+/.test(email) === false) {
                        alert('The email is incorrect');
                        return false;
                    }

                    if (password.length < 5) {
                        alert('The password length should be at least 5 symbols');
                        return false;
                    }

                    let list = new UsersList();
                    list.addToJson({
                        "name": name,
                        "email": email,
                        "password": password,
                    }).then(() => {
                        list.fetchByEmail(email).then(() => {
                            let user = list.user;
                            if (user) {
                                localStorage.setItem('logged', user.email);

                                window.location.reload();
                            } else {
                                alert('The user already exists')
                            }
                        });
                    });
                });
            })
        },
        renderCatalog: () => {
            let list = new ItemsList();
            list.fetchItems().then(() => {
                app.selector.catalogWrap.innerHTML = list.render();
                list.fetchCart();
            });
            app.selector.catalogWrap.addEventListener('click', (event) => {
                if (event.target.classList.contains('add-to-card')) {
                    event.preventDefault();
                    app.helper.popupEvents();
                    let data = event.target.dataset;
                    let $perciseAddBtn = document.querySelector('#percise-add');
                    $perciseAddBtn.addEventListener('click', () => {
                        let sendForm = document.querySelector('#PersonalProductSettingsForm');
                        let inputSize = sendForm.querySelector('#size').value;
                        let inputQuantity = sendForm.querySelector('#count').value;
                        data.size = inputSize;
                        list.addToCart(data, inputQuantity);
                        alert('Added to cart');
                        event.preventDefault();
                        app.helper.popupEvents(true);

                    });
                }
            });
            app.selector.searchBtn.addEventListener('click', (evt) => {
                evt.preventDefault();
                list.filterItems(searchText.value);
                app.selector.catalogWrap.innerHTML = list.render();
            });
            app.selector.searchText.addEventListener('keydown', (event) => {
                if (event.keyCode === 13) {
                    event.preventDefault();
                    list.filterItems(event.target.value);
                }

                app.selector.catalogWrap.innerHTML = list.render();
            });

        },

    },
    init: {
        homepage: () => {
            app.action.userActions();
            app.action.renderCatalog();
        },
        cartPage: () => {
            app.action.userActions();
            let cart = new CartList();
            const clearCartBtn = document.querySelector('#clearCart');
            clearCartBtn.addEventListener('click', () => {
                cart.clearCart();
                cartGenerate();

            });

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

            app.selector.cartWrapper.addEventListener('click', (event) => {
                    const data = event.target.parentElement.dataset;
                    if (event.target.parentElement.classList.contains('delete-good-btn')) {
                        cart.deleteGood(data);
                        cartGenerate()
                    }
                }
            );
            cartGenerate();
        },
        productPage: () => {
            app.action.userActions();
            app.action.renderCatalog();
            let $leftMenu = document.querySelector('.left-aside');
            $leftMenu.addEventListener('click', evt => {
                evt.preventDefault();
                if (evt.target.classList.contains('category-btn')) {
                    let sibling = evt.target.nextElementSibling;
                    if (sibling.classList.contains('show')) {
                        sibling.classList.remove('show');
                    } else {
                        sibling.classList.add('show').style('transition:opacity .5s;');

                    }
                }

            });


        },
        singlePage: () => {
            app.action.userActions();

        }
    }
};