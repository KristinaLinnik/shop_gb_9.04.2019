'use strict';




// $(document).ready(function () {
//
//     $('.collapse').collapse()
//     $('#user-rating-form').on('change', '[name="rating"]', function () {
//         $('#selected-rating').text($('[name="rating"]:checked').val());
//     });
//
// });

var catalog = [
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
var goodsInDrop = document.querySelector('.drop-wrap-cart');

var cart = [];
var $cart = document.querySelector('#parentOfCart');
var $catalog = document.querySelector('#catalog-wrap');

var allTotal = document.querySelector('#all-total');
allTotal.textContent = 'Empty';
var totalSum = document.querySelectorAll('.total-sum');
for (var j = 0; j < totalSum.length; j++) {
    totalSum[j].textContent = 'Empty';
}

$catalog.addEventListener('click', handleBuyClick);

function sumOfCart() {
    var sum = 0;
    if (cart.length === 0) {
        allTotal.textContent = 'Empty';
        for (var k = 0; k < totalSum.length; k++) {
            totalSum[k].textContent = 'Empty';
        }
    } else {

        for (var i = 0; i < cart.length; i++) {
            sum = sum + cart[i].price * cart[i].quantity;
            document.querySelector('#all-total').textContent = '$ ' + sum;
            for (var j = 0; j < totalSum.length; j++) {
                totalSum[j].textContent = '$ ' + (sum - (sum * 0.1));
            }
        }
    }
}

function getProductByName(name) {
    var product = null;
    for (var i = 0; i < catalog.length; i++) {
        if (catalog[i].title === name) {
            product = catalog[i];
        }
    }

    return product;
}

function returnDeleteBtn(cart) {
    var deleteBtns = document.querySelectorAll('.delete-good-btn');
    // console.log(deleteBtns);
    for (var i = 0; i < deleteBtns.length; i++) {
        var deleteBtn = deleteBtns[i];
        deleteBtn.addEventListener('click', function (event) {
            event.preventDefault();
            var deleteElement = event.target.parentElement.parentNode;
            console.log(deleteElement)
            if (deleteElement.classList.contains('drop-wrap-cart')) {
                // console.log(deleteElement)
                nameofDeleteElement = deleteElement.querySelector('.head-drop-desc').textContent;
                indexOfDeleted = getProductIndex(nameofDeleteElement);
                cart.splice(indexOfDeleted, 1);
                this.parentElement.remove();
            } else if (deleteElement.classList.contains('product-row')) {
                // console.log(deleteElement)
                var nameofDeleteElement = deleteElement.querySelector('.good-title').textContent;
                var indexOfDeleted = getProductIndex(nameofDeleteElement);
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
    var idx = -1;
    for (var i = 0; i < cart.length; i++) {
        if (cart[i].title === name) {
            idx = i;
        }
    }

    return idx;
}

function handleBuyClick(event) {
    event.preventDefault();
    if (event.target.className === 'add-to-card') {
        var $product = event.target.parentElement;
        var name = $product.querySelector('.item-brand').textContent;
        var price = +$product.querySelector('.item-price').textContent;
        var product = getProductByName(name);
        var idx = getProductIndex(name);
        if (idx === -1) {
            // товара в корзине еще нет
            cart.push(product);
        } else {
            cart[idx].quantity++;
        }

        $cart.innerHTML = '';
        buildCart(cart);

        goodsInDrop.innerHTML = '';
        buildDropCart(cart)


        // console.log(cart);
        sumOfCart();
        // returnDeleteBtn(cart);
    }
}

function buildCart(cart) {
    for (var i = 0; i < cart.length; i++) {
        var goodInCart = cart[i];
        var $templateCart = document.querySelector('#template-cart-catalog').children[0].cloneNode(true);
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


    returnDeleteBtn(cart);


}

function buildCatalog(products) {
    for (var i = 0; i < products.length; i++) {
        // console.log(products.length);
        var product = products[i];
        // console.log(product);
        var $template = document.querySelector('#catalog-wrap-template').children[0].cloneNode(true);
        // console.log($template);
        $template.querySelector('.shop-item-link').style = 'background-image: url(' + product.url + ')';
        var btnAddToCart = $template.querySelector('.add-to-card');
        btnAddToCart.textContent = 'Add to cart';
        btnAddToCart.href = '#';
        btnAddToCart.id = i;
        $template.querySelector('.item-brand').textContent = product.title;
        $template.querySelector('.item-price').textContent = product.price;


        $catalog.appendChild($template);


    }

}

buildCatalog(catalog);

var parentDrop = document.querySelector('#parent-drop-cart');

function buildDropCart(cart) {

    for (var i = 0; i < cart.length; i++) {
        var goodInCart = cart[i];
        // console.log(goodsInDrop);
        if (i < 2) {

            var $cartDropTemplate = document.querySelector('#template-drop-cart').children[0].cloneNode(true);
            $cartDropTemplate.querySelector('.drop-img').style = 'background-image: url(' + goodInCart.url + ')';
            $cartDropTemplate.querySelector('.head-drop-desc').textContent = goodInCart.title;
            $cartDropTemplate.querySelector('.sum-count').textContent = goodInCart.quantity + ' x';
            $cartDropTemplate.querySelector('.sum-dollar').textContent = '$' + goodInCart.price;
            $cartDropTemplate.querySelector('.delete-good-btn').id = i;


            parentDrop.insertBefore($cartDropTemplate, parentDrop.firstChild);

        }
    }

}


