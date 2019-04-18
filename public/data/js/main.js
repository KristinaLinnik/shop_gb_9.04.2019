'use strict';
// $(document).ready(function () {
//
//     $('.collapse').collapse()
//     $('#user-rating-form').on('change', '[name="rating"]', function () {
//         $('#selected-rating').text($('[name="rating"]:checked').val());
//     });
//
// });

let catalog = [
    {
        title: 'MANGO PEOPLE T-SHIRT',
        color: 'red',
        size: 'XS',
        price: 5,
        url: './data/img/product_1.jpg',
        alt: 'MANGO PEOPLE T-SHIRT',
        quantity: 1
    },
    {
        title: 'MANGO PEOPLE DRESS',
        color: 'BLACK',
        size: 'M',
        price: 10,
        url: './data/img/product_2.jpg',
        alt: 'MANGO PEOPLE DRESS',
        quantity: 1
    },
    {
        title: 'MANGO PEOPLE SKIRT',
        color: 'WHITE',
        size: 'S',
        price: 15,
        url: './data/img/product_3.jpg',
        alt: 'MANGO PEOPLE SKIRT',
        quantity: 1
    }
];
let goodsInDrop = document.querySelector('.drop-wrap-cart');

let cart = [];
let $cart = document.querySelector('#parentOfCart');
let $catalog = document.querySelector('#catalog-wrap');

let allTotal = document.querySelector('#all-total');
allTotal.textContent = 'Empty';
let totalSum = document.querySelectorAll('.total-sum');
for (let j = 0; j < totalSum.length; j++) {
    totalSum[j].textContent = 'Empty';
}

$catalog.addEventListener('click', handleBuyClick);

function sumOfCart() {
    let sum = 0;
    if (cart.length === 0) {
        allTotal.textContent = 'Empty';
        for (let k = 0; k < totalSum.length; k++) {
            totalSum[k].textContent = 'Empty';
        }
    } else {

        for (let i = 0; i < cart.length; i++) {
            sum = sum + cart[i].price * cart[i].quantity;
            document.querySelector('#all-total').textContent = '$ ' + sum;
            for (let j = 0; j < totalSum.length; j++) {
                totalSum[j].textContent = '$ ' + (sum - (sum * 0.1));
            }
        }
    }
}

function getProductByName(name) {
    let product = null;
    for (let i = 0; i < catalog.length; i++) {
        if (catalog[i].title === name) {
            product = catalog[i];
        }
    }

    return product;
}

function returnDeleteBtn(cart) {
    let deleteBtns = document.querySelectorAll('.delete-good-btn');
    for (let i = 0; i < deleteBtns.length; i++) {
        let deleteBtn = deleteBtns[i];
        deleteBtn.addEventListener('click', function (event) {
            event.preventDefault();
            let deleteElement = event.target.parentElement.parentNode;
            console.log(deleteElement)
            if (deleteElement.classList.contains('drop-flex-card')) {
                console.log(deleteElement)
                let nameofDeleteElement = deleteElement.querySelector('.head-drop-desc').textContent;
                console.log(nameofDeleteElement);
                let indexOfDeleted = getProductIndex(nameofDeleteElement);
                cart.splice(indexOfDeleted, 1);
                this.parentElement.remove();
            } else if (deleteElement.classList.contains('product-row')) {
                // console.log(deleteElement)
                let nameofDeleteElement = deleteElement.querySelector('.good-title').textContent;
                console.log(nameofDeleteElement);

                let indexOfDeleted = getProductIndex(nameofDeleteElement);
                cart.splice(indexOfDeleted, 1);
                this.parentElement.remove();
            }
            ;
            $cart.innerHTML = '';
            buildCart(cart);
            goodsInDrop.innerHTML = '';
            buildDropCart(cart)

            sumOfCart(cart);


        })
    }
}

function getProductIndex(name) {
    let idx = -1;
    for (let i = 0; i < cart.length; i++) {
        if (cart[i].title === name) {
            idx = i;
        }
    }

    return idx;
}

function handleBuyClick(event) {
    event.preventDefault();
    if (event.target.className === 'add-to-card') {
        let $product = event.target.parentElement;
        let name = $product.querySelector('.item-brand').textContent;
        let price = +$product.querySelector('.item-price').textContent;
        let product = getProductByName(name);
        let idx = getProductIndex(name);
        if (idx === -1) {
            // товара в корзине еще нет
            cart.push(product);
        } else {
            cart[idx].quantity++;
        }

        $cart.innerHTML = '';
        buildCart(cart);

        goodsInDrop.innerHTML = '';
        buildDropCart(cart);




        // console.log(cart);
        sumOfCart();
        // returnDeleteBtn(cart);
    }
}

function buildCart(cart) {
    for (let i = 0; i < cart.length; i++) {
        let goodInCart = cart[i];
        let $templateCart = document.querySelector('#template-cart-catalog').children[0].cloneNode(true);
        $templateCart.querySelector('.product-details-img').style = 'background-image: url(' + goodInCart.url + ')';
        $templateCart.querySelector('.color-result').textContent = goodInCart.color;
        $templateCart.querySelector('.size-result').textContent = goodInCart.size;
        $templateCart.querySelector('.link-to-catalog').href = "single-page.html";
        $templateCart.querySelector('.good-title').textContent = goodInCart.title;
        $templateCart.querySelector('.unite-price').textContent = goodInCart.price;
        $templateCart.querySelector('#quantity').textContent = goodInCart.quantity;
        $templateCart.querySelector('.shipping').textContent = 'free';
        $templateCart.querySelector('.delete-good-btn').id = i;
        $templateCart.querySelector('.subtotal').textContent = goodInCart.price * goodInCart.quantity;
        $cart.appendChild($templateCart);

    }




}

function buildCatalog(products) {
    for (let i = 0; i < products.length; i++) {
        // console.log(products.length);
        let product = products[i];
        // console.log(product);
        let $template = document.querySelector('#catalog-wrap-template').children[0].cloneNode(true);
        // console.log($template);
        $template.querySelector('.shop-item-link').style = 'background-image: url(' + product.url + ')';
        let btnAddToCart = $template.querySelector('.add-to-card');
        btnAddToCart.textContent = 'Add to cart';
        btnAddToCart.href = '#';
        btnAddToCart.id = i;
        $template.querySelector('.item-brand').textContent = product.title;
        $template.querySelector('.item-price').textContent = product.price;


        $catalog.appendChild($template);


    }

}

buildCatalog(catalog);

let parentDrop = document.querySelector('#parent-drop-cart');

function buildDropCart(cart) {

    for (let i = 0; i < cart.length; i++) {
        let goodInCart = cart[i];
        // console.log(goodsInDrop);
        if (i < 2) {

            let $cartDropTemplate = document.querySelector('#template-drop-cart').children[0].cloneNode(true);
            $cartDropTemplate.querySelector('.drop-img').style = 'background-image: url(' + goodInCart.url + ')';
            $cartDropTemplate.querySelector('.head-drop-desc').textContent = goodInCart.title;
            $cartDropTemplate.querySelector('.sum-count').textContent = goodInCart.quantity + ' x';
            $cartDropTemplate.querySelector('.sum-dollar').textContent = '$' + goodInCart.price;
            $cartDropTemplate.querySelector('.delete-good-btn').id = i;


            parentDrop.insertBefore($cartDropTemplate, parentDrop.firstChild);

        }
    }
    returnDeleteBtn(cart);


}


