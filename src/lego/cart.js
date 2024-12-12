"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cart = exports.Cart = void 0;
var interfaces_1 = require("../inter/interfaces");
var Cart = /** @class */ (function () {
    function Cart() {
        this.items = [];
        this.cartVisible = false; ////////////////I am not quite sure////
        this.cartContainer = document.querySelector('.cart-container');
        this.initListeners();
        this.loadCart();
    }
    Cart.prototype.CartVisibility = function () {
        this.cartVisible = !this.cartVisible;
        if (this.cartContainer) {
            this.cartContainer.classList.toggle('show-cart-container', this.cartVisible);
        }
    };
    Cart.prototype.loadCart = function () {
        var cartData = localStorage.getItem('cart');
        if (cartData) {
            this.items = JSON.parse(cartData);
            this.displayCartItems();
        }
    };
    Cart.prototype.saveCart = function () {
        var cartData = JSON.stringify(this.items);
        localStorage.setItem('cart', cartData);
    };
    Cart.prototype.initListeners = function () {
        var _this = this;
        document.addEventListener('DOMContentLoaded', function () {
            var cartButton = document.getElementById('cart-btn');
            if (cartButton) {
                cartButton.addEventListener('click', function () {
                    if (_this.cartContainer) {
                        _this.cartContainer.classList.toggle('show-cart-container');
                    }
                });
            }
        });
    };
    Cart.prototype.getTotalItemsCount = function () {
        return this.items.length;
    };
    Cart.prototype.removeItem = function (item) {
        var elementId = "item-".concat(item.id);
        var cartElement = document.getElementById(elementId);
        if (cartElement) {
            cartElement.remove();
        }
        var index = this.items.findIndex(function (i) { return i.id === item.id; });
        if (index !== -1) {
            this.items.splice(index, 1);
            this.displayCartItems();
            this.saveCart();
        }
    };
    Cart.prototype.displayCartItems = function () {
        var _this = this;
        var cartCountInfo = document.getElementById('cart-count-info');
        if (cartCountInfo !== null && this.cartContainer) {
            this.cartContainer.innerHTML = '';
            if (this.items.length === 0) {
                var emptyCartMessage = document.createElement('div');
                emptyCartMessage.textContent = 'Your shopping bag is empty...';
                emptyCartMessage.classList.add('empty-cart');
                this.cartContainer.appendChild(emptyCartMessage);
                var goToShoppingContainer = document.createElement('div');
                goToShoppingContainer.classList.add('go-to-shopping-container');
                // const goToShoppingButton = document.createElement('button');
                // goToShoppingButton.textContent = 'CONTINUE SHOPPING...';
                // goToShoppingButton.classList.add('go-to-shopping-btn');
                // goToShoppingButton.addEventListener('click', () => {
                //     window.location.href = 'http://localhost:63342/index.html';
                // });
                // goToShoppingContainer.appendChild(goToShoppingButton);
                this.cartContainer.appendChild(goToShoppingContainer);
            }
            else {
                var total = 0;
                var _loop_1 = function (item) {
                    var cartElement = document.createElement('div');
                    cartElement.id = "item-".concat(item.id);
                    cartElement.classList.add('item');
                    cartElement.innerHTML = "\n                         <img src=\"".concat(window.origin + '/' + item.product.image, "\" alt=\"product image\">\n                        <div class=\"cart-item-info\">\n                            <h3 class=\"cart-item-name\">").concat(item.product.title, "</h3>\n                            <span class=\"company-btn\">").concat(item.product.company, "</span>\n                            <span class=\"cart-item-price\">").concat(item.product.price, "</span>\n                        </div>\n                        <div>\n                            <i class=\"fa fa-chevron-up\" data-id=").concat(item.id, "></i>\n                            <p class=\"item-quantity\">").concat(item.quantity, "</p>\n                            <i class=\"fa fa-chevron-down\" data-id=").concat(item.id, "></i>\n                        </div>\n                        <button type=\"button\" class=\"cart-item-del-btn\">\n                            <i class=\"fas fa-times\">remove</i>\n                        </button>\n                    ");
                    var removeButton = cartElement.querySelector('.cart-item-del-btn');
                    if (removeButton) {
                        removeButton.addEventListener('click', function () {
                            _this.removeItem(item);
                        });
                    }
                    var topButton = cartElement.querySelector(".fa-chevron-up");
                    var bottomButton = cartElement.querySelector(".fa-chevron-down");
                    if (topButton && bottomButton) {
                        topButton.addEventListener("click", function () {
                            _this.changeItemQuantity(item, item.quantity + 1);
                        });
                        bottomButton.addEventListener("click", function () {
                            if (item.quantity > 1) {
                                _this.changeItemQuantity(item, item.quantity - 1);
                            }
                        });
                    }
                    this_1.cartContainer.appendChild(cartElement);
                    var itemTotal = item.quantity * item.product.price;
                    total += itemTotal;
                };
                var this_1 = this;
                for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
                    var item = _a[_i];
                    _loop_1(item);
                }
                var cartTotal = document.createElement('div');
                cartTotal.id = 'cart-total';
                cartTotal.innerHTML = "Total: $".concat(total);
                this.cartContainer.appendChild(cartTotal);
            }
            cartCountInfo.textContent = String(this.getTotalItemsCount());
        }
    };
    Cart.prototype.addItem = function (item) {
        var existingItem = this.findItemById(item.id);
        if (!existingItem) {
            var newItem = new interfaces_1.CartItemsClass(item.id, item, 1);
            this.items.push(newItem);
            this.saveCart();
            this.displayCartItems();
            this.updateCartTotal();
        }
    };
    Cart.prototype.findItemById = function (itemId) {
        return this.items.find(function (item) { return item.id === itemId; });
    };
    Cart.prototype.changeItemQuantity = function (item, newQuantity) {
        var _a;
        var index = this.items.indexOf(item);
        if (index !== -1) {
            if (newQuantity > 0) {
                item.quantity = newQuantity;
                this.saveCart();
                var elementId = "item-".concat(item.id);
                var quantityElement = (_a = document.getElementById(elementId)) === null || _a === void 0 ? void 0 : _a.querySelector(".item-quantity");
                if (quantityElement) {
                    quantityElement.textContent = String(newQuantity);
                }
                this.updateCartTotal();
            }
            else {
                this.removeItem(item);
            }
        }
    };
    Cart.prototype.updateCartTotal = function () {
        var cartTotal = document.getElementById('cart-total');
        if (cartTotal) {
            var total = 0;
            for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
                var item = _a[_i];
                var itemTotal = item.quantity * item.product.price;
                total += itemTotal;
            }
            cartTotal.innerHTML = "Total: $".concat(total.toFixed(2));
        }
    };
    return Cart;
}());
exports.Cart = Cart;
exports.cart = new Cart();
