'use strict';
var photos = [
    'data/img/gallery/card-singe-1.jpg',
    'data/img/gallery/card-singe-2.jpg',
    'data/img/gallery/card-singe-3.jpg',
    'data/img/gallery/card-singe-4.jpg',
    'data/img/gallery/card-single-5.jpg'
];

var multiItemSlider = (function () {

    function _isElementVisible(element) {
        var rect = element.getBoundingClientRect(),
            vWidth = window.innerWidth || doc.documentElement.clientWidth,
            vHeight = window.innerHeight || doc.documentElement.clientHeight,
            elemFromPoint = function (x, y) {
                return document.elementFromPoint(x, y)
            };
        if (rect.right < 0 || rect.bottom < 0
            || rect.left > vWidth || rect.top > vHeight)
            return false;
        return (
            element.contains(elemFromPoint(rect.left, rect.top))
            || element.contains(elemFromPoint(rect.right, rect.top))
            || element.contains(elemFromPoint(rect.right, rect.bottom))
            || element.contains(elemFromPoint(rect.left, rect.bottom))
        );
    }

    return function (selector, config) {
        var
            _mainElement = document.querySelector(selector), // основный элемент блока
            _sliderWrapper = _mainElement.querySelector('.slider__wrapper'), // обертка для .slider-item
            _sliderItems = _mainElement.querySelectorAll('.slider__item'), // элементы (.slider-item)
            _sliderImages = _mainElement.querySelectorAll('.slider__img'), // элементы (.slider-img)
            _sliderControls = _mainElement.querySelectorAll('.slider__control'), // элементы управления
            _sliderControlLeft = _mainElement.querySelector('.slider__control_left'), // кнопка "LEFT"
            _sliderControlRight = _mainElement.querySelector('.slider__control_right'), // кнопка "RIGHT"
            _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width), // ширина обёртки
            _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width), // ширина одного элемента
            _positionLeftItem = 0, // позиция левого активного элемента
            _transform = 0, // значение транфсофрмации .slider_wrapper
            _step = _itemWidth / _wrapperWidth * 100, // величина шага (для трансформации)
            _items = [], // массив элементов
            _interval = 0,
            _html = _mainElement.innerHTML,
            _states = [
                {active: false, minWidth: 0, count: 1},
                {active: false, minWidth: 980, count: 2}
            ],
            _config = {
                isCycling: false, // автоматическая смена слайдов
                direction: 'right', // направление смены слайдов
                interval: 5000, // интервал между автоматической сменой слайдов
                pause: true // устанавливать ли паузу при поднесении курсора к слайдеру
            };

        for (var key in config) {
            if (key in _config) {
                _config[key] = config[key];
            }
        }
        for (var photo in photos) {
            console.log(photos[photo]);
            for (var slideImg in _sliderImages) {
                console.log(_sliderImages[slideImg]);


            }
        }


        // наполнение массива _items
        _sliderItems.forEach(function (item, index) {
            _items.push({item: item, position: index, transform: 0});
        });

        var _setActive = function () {
            var _index = 0;
            var width = parseFloat(document.body.clientWidth);
            _states.forEach(function (item, index, arr) {
                _states[index].active = false;
                if (width >= _states[index].minWidth)
                    _index = index;
            });
            _states[_index].active = true;
        }

        var _getActive = function () {
            var _index;
            _states.forEach(function (item, index, arr) {
                if (_states[index].active) {
                    _index = index;
                }
            });
            return _index;
        }

        var position = {
            getItemMin: function () {
                var indexItem = 0;
                _items.forEach(function (item, index) {
                    if (item.position < _items[indexItem].position) {
                        indexItem = index;
                    }
                });
                return indexItem;
            },
            getItemMax: function () {
                var indexItem = 0;
                _items.forEach(function (item, index) {
                    if (item.position > _items[indexItem].position) {
                        indexItem = index;
                    }
                });
                return indexItem;
            },
            getMin: function () {
                return _items[position.getItemMin()].position;
            },
            getMax: function () {
                return _items[position.getItemMax()].position;
            }
        }

        var _transformItem = function (direction) {
            var nextItem;
            if (!_isElementVisible(_mainElement)) {
                return;
            }
            if (direction === 'right') {
                _positionLeftItem++;
                if ((_positionLeftItem + _wrapperWidth / _itemWidth - 1) > position.getMax()) {
                    nextItem = position.getItemMin();
                    _items[nextItem].position = position.getMax() + 1;
                    _items[nextItem].transform += _items.length * 100;
                    _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
                }
                _transform -= _step;
            }
            if (direction === 'left') {
                _positionLeftItem--;
                if (_positionLeftItem < position.getMin()) {
                    nextItem = position.getItemMax();
                    _items[nextItem].position = position.getMin() - 1;
                    _items[nextItem].transform -= _items.length * 100;
                    _items[nextItem].item.style.transform = 'translateX(' + _items[nextItem].transform + '%)';
                }
                _transform += _step;
            }
            _sliderWrapper.style.transform = 'translateX(' + _transform + '%)';
        }

        var _cycle = function (direction) {
            if (!_config.isCycling) {
                return;
            }
            _interval = setInterval(function () {
                _transformItem(direction);
            }, _config.interval);
        }

        // обработчик события click для кнопок "назад" и "вперед"
        var _controlClick = function (e) {
            e.preventDefault();
            if (e.target.classList.contains('slider__control')) {
                var direction = e.target.classList.contains('slider__control_right') ? 'right' : 'left';
                _transformItem(direction);
                clearInterval(_interval);
                _cycle(_config.direction);
            }
        };

        // обработка события изменения видимости страницы
        var _handleVisibilityChange = function () {
            if (document.visibilityState === "hidden") {
                clearInterval(_interval);
            } else {
                clearInterval(_interval);
                _cycle(_config.direction);
            }
        }

        var _refresh = function () {
            clearInterval(_interval);
            _mainElement.innerHTML = _html;
            _sliderWrapper = _mainElement.querySelector('.slider__wrapper');
            _sliderItems = _mainElement.querySelectorAll('.slider__item');
            _sliderControls = _mainElement.querySelectorAll('.slider__control');
            _sliderControlLeft = _mainElement.querySelector('.slider__control_left');
            _sliderControlRight = _mainElement.querySelector('.slider__control_right');
            _wrapperWidth = parseFloat(getComputedStyle(_sliderWrapper).width);
            _itemWidth = parseFloat(getComputedStyle(_sliderItems[0]).width);
            _positionLeftItem = 0;
            _transform = 0;
            _step = _itemWidth / _wrapperWidth * 100;
            _items = [];
            _sliderItems.forEach(function (item, index) {
                _items.push({item: item, position: index, transform: 0});
            });
        }

        var _setUpListeners = function () {
            _mainElement.addEventListener('click', _controlClick);
            if (_config.pause && _config.isCycling) {
                _mainElement.addEventListener('mouseenter', function () {
                    clearInterval(_interval);
                });
                _mainElement.addEventListener('mouseleave', function () {
                    clearInterval(_interval);
                    _cycle(_config.direction);
                });
            }
            document.addEventListener('visibilitychange', _handleVisibilityChange, false);
            window.addEventListener('resize', function () {
                var
                    _index = 0,
                    width = parseFloat(document.body.clientWidth);
                _states.forEach(function (item, index, arr) {
                    if (width >= _states[index].minWidth)
                        _index = index;
                });
                if (_index !== _getActive()) {
                    _setActive();
                    _refresh();
                }
            });
        }

        // инициализация
        _setUpListeners();
        if (document.visibilityState === "visible") {
            _cycle(_config.direction);
        }
        _setActive();

        return {
            right: function () { // метод right
                _transformItem('right');
            },
            left: function () { // метод left
                _transformItem('left');
            },
            stop: function () { // метод stop
                _config.isCycling = false;
                clearInterval(_interval);
            },
            cycle: function () { // метод cycle
                _config.isCycling = true;
                clearInterval(_interval);
                _cycle();
            }
        }

    }
}());

var slider = multiItemSlider('.slider', {
    isCycling: true
})




//
// var photos = [
//     'data/img/gallery/card-singe-1.jpg',
//     'data/img/gallery/card-singe-2.jpg',
//     'data/img/gallery/card-singe-3.jpg',
//     'data/img/gallery/card-singe-4.jpg',
//     'data/img/gallery/card-single-5.jpg'
// ];
// var photosFull = [
//     'data/img/gallery/card-singe-1.jpg',
//     'data/img/gallery/card-singe-2.jpg',
//     'data/img/gallery/card-singe-3.jpg',
//     'data/img/gallery/card-singe-4.jpg',
//     'data/img/gallery/card-single-5.jpg'
// ];
//
// var gallery = document.querySelector('.gallery');
// var btnSlide = document.querySelectorAll('.slide-btn');
// var fullPhoto = document.querySelector('.gallery__photo-full');
// fullPhoto.style = 'background-image: url(' + photosFull[0] + ')';
//
//
// var thumbnails = document.querySelectorAll('.gallery__photo-preview');
// // var fullPhoto = document.querySelector('.full-photo');
//
// var addThumbnailClickHandler = function (thumbnail, photo) {
//
//     thumbnail.addEventListener('click', function () {
//         console.log('Click');
//         for (var i = 0; i < thumbnails.length; i++) {
//             if (event.target === thumbnails[i]) {
//                 fullPhoto.style = 'background-image: url(' + photos[i] + ')';
//             }
//
//         }
//     });
// };
// for (var i = 0; i < thumbnails.length; i++) {
//     addThumbnailClickHandler(thumbnails[i], photos[i]);
//     thumbnails[i].style = 'background-image: url(' + photos[i] + ')';
// }
// gallery.addEventListener('click', function () {
//     event.preventDefault();
//     console.log(gallery);
//     for (var i = 0; i < photosFull.length; i++) {
//         // btnSlide[i] = event.target;
//         if (event.target.classList.contains('next-slide')) {
//             // if (i === 4) {
//                 fullPhoto.style = thumbnails[i].nextSibling();
//
//             // } else {
//             //     fullPhoto.style = 'background-image: url(' + photosFull[i + 1] + ')';
//             //
//                 console.log('Click');
//             // }
//         }
//         else if (event.target.classList.contains('prev-slide')) {
//             // if (i === 0) {
//                 fullPhoto.style =  thumbnails[i].style.previousSibling();
//
//             // } else {
//             //     fullPhoto.style = 'background-image: url(' + photosFull[i - 1] + ')';
//             //
//                 console.log('bams');
//             // }
//         }
//     }
//
// });


// var slider = document.querySelector('.carousel-inner');
// console.log(slider);
//
// var initialPoint;
// var finalPoint;
// slider.addEventListener('touchstart', function(event) {
//     event.preventDefault();
//     event.stopPropagation();
//     initialPoint=event.changedTouches[0];
// }, false);
// slider.addEventListener('touchend', function(event) {
//     event.preventDefault();
//     event.stopPropagation();
//     finalPoint=event.changedTouches[0];
//     var xAbs = Math.abs(initialPoint.pageX - finalPoint.pageX);
//     var yAbs = Math.abs(initialPoint.pageY - finalPoint.pageY);
//     if (xAbs > 20 || yAbs > 20) {
//         if (xAbs > yAbs) {
//             if (finalPoint.pageX < initialPoint.pageX){
//                 console.log('СВАЙП ВЛЕВО')
//                 /*СВАЙП ВЛЕВО*/}
//             else{
//                 console.log('СВАЙП ВПРАВО')
//
//                 /*СВАЙП ВПРАВО*/}
//         }
//         else {
//             if (finalPoint.pageY < initialPoint.pageY){
//                 console.log('СВАЙП ВВЕРХ')
//
//                 /*СВАЙП ВВЕРХ*/}
//             else{
//                 console.log('СВАЙП ВНИЗ')
//
//                 /*СВАЙП ВНИЗ*/}
//         }
//     }
// }, false);