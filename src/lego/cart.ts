import {CartItemsClass, CartItemsInterface, ProductInterface} from "../inter/interfaces";

export class Cart {
    private items: CartItemsInterface[] = [];
    cartContainer: HTMLElement | null;

    private cartVisible: boolean = false;////////////////I am not quite sure////

    constructor() {
        this.cartContainer = document.querySelector('.cart-container');
        this.initListeners();
        this.loadCart();
    }

    public CartVisibility(): void {
        this.cartVisible = !this.cartVisible;
        if (this.cartContainer) {
            this.cartContainer.classList.toggle('show-cart-container', this.cartVisible);
        }
    }

    public loadCart(): void {
        const cartData = localStorage.getItem('cart');
        if (cartData) {
            this.items = JSON.parse(cartData);
            this.displayCartItems();
        }
    }

    public saveCart(): void {
        const cartData = JSON.stringify(this.items);
        localStorage.setItem('cart', cartData);
    }

    private initListeners(): void {
        document.addEventListener('DOMContentLoaded', (): void => {
            const cartButton = document.getElementById('cart-btn');
            if (cartButton) {
                cartButton.addEventListener('click', () => {
                    if (this.cartContainer) {
                        this.cartContainer.classList.toggle('show-cart-container');
                    }
                });
            }
        });
    }

    public getTotalItemsCount(): number {
        return this.items.length;
    }

    public removeItem(item: CartItemsInterface): void {
        const elementId = `item-${item.id}`;
        const cartElement = document.getElementById(elementId);
        if (cartElement) {
            cartElement.remove();
        }

        const index = this.items.findIndex((i) => i.id === item.id);
        if (index !== -1) {
            this.items.splice(index, 1);
            this.displayCartItems();
            this.saveCart();
        }
    }

    public displayCartItems(): void {

             const cartCountInfo = document.getElementById('cart-count-info');
        if (cartCountInfo !== null && this.cartContainer) {
            this.cartContainer.innerHTML = '';
            if (this.items.length === 0) {
                const emptyCartMessage = document.createElement('div');
                emptyCartMessage.textContent = 'Your shopping bag is empty...';
                emptyCartMessage.classList.add('empty-cart');
                this.cartContainer.appendChild(emptyCartMessage);

                const goToShoppingContainer = document.createElement('div');
                goToShoppingContainer.classList.add('go-to-shopping-container');

                const goToShoppingButton = document.createElement('button');
                goToShoppingButton.textContent = 'CONTINUE SHOPPING...';
                goToShoppingButton.classList.add('go-to-shopping-btn');
                goToShoppingButton.addEventListener('click', () => {
                    window.location.href = 'http://localhost:63342/index.html';
                });
                goToShoppingContainer.appendChild(goToShoppingButton);
                this.cartContainer.appendChild(goToShoppingContainer);

            } else {
                let total = 0;
                for (let item of this.items) {
                    const cartElement = document.createElement('div');
                    cartElement.id = `item-${item.id}`;
                    cartElement.classList.add('item');
                    cartElement.innerHTML = `
                         <img src="${window.origin + '/' +  item.product.image}" alt="product image">
                        <div class="cart-item-info">
                            <h3 class="cart-item-name">${item.product.title}</h3>
                            <span class="company-btn">${item.product.company}</span>
                            <span class="cart-item-price">${item.product.price}</span>
                        </div>
                        <div>
                            <i class="fa fa-chevron-up" data-id=${item.id}></i>
                            <p class="item-quantity">${item.quantity}</p>
                            <i class="fa fa-chevron-down" data-id=${item.id}></i>
                        </div>
                        <button type="button" class="cart-item-del-btn">
                            <i class="fas fa-times">remove</i>
                        </button>
                    `;

                    const removeButton = cartElement.querySelector('.cart-item-del-btn') as HTMLButtonElement;
                    if (removeButton) {
                        removeButton.addEventListener('click', () => {
                            this.removeItem(item);
                        });
                    }

                    const topButton = cartElement.querySelector(".fa-chevron-up") as HTMLElement;
                    const bottomButton = cartElement.querySelector(".fa-chevron-down") as HTMLElement;

                    if (topButton && bottomButton) {
                        topButton.addEventListener("click", () => {
                            this.changeItemQuantity(item, item.quantity + 1);
                        });

                        bottomButton.addEventListener("click", () => {
                            if (item.quantity > 1) {
                                this.changeItemQuantity(item, item.quantity - 1);
                            }
                        });
                    }

                    this.cartContainer.appendChild(cartElement);
                    const itemTotal = item.quantity * item.product.price;
                    total += itemTotal;
                }

                const cartTotal = document.createElement('div');
                cartTotal.id = 'cart-total';
                cartTotal.innerHTML = `Total: $${total}`;
                this.cartContainer.appendChild(cartTotal);
            }
            cartCountInfo.textContent = String(this.getTotalItemsCount());
        }
    }

    public addItem(item: ProductInterface): void {

        const existingItem = this.findItemById(item.id);
        if (!existingItem) {
            const newItem: CartItemsInterface = new CartItemsClass(item.id, item, 1)
            this.items.push(newItem);
            this.saveCart();
            this.displayCartItems();
            this.updateCartTotal();
        }
    }

    private findItemById(itemId: number): CartItemsInterface | undefined {
        return this.items.find((item) => item.id === itemId);
    }

    private changeItemQuantity(item: CartItemsInterface, newQuantity: number): void {
        const index = this.items.indexOf(item);
        if (index !== -1) {
            if (newQuantity > 0) {
                item.quantity = newQuantity;
                this.saveCart();
                const elementId = `item-${item.id}`;
                const quantityElement = document.getElementById(elementId)?.querySelector(".item-quantity");
                if (quantityElement) {
                    quantityElement.textContent = String(newQuantity);
                }
                this.updateCartTotal();
            } else {
                this.removeItem(item);
            }
        }
    }

    private updateCartTotal(): void {
        const cartTotal = document.getElementById('cart-total');
        if (cartTotal) {
            let total = 0;
            for (const item of this.items) {
                const itemTotal = item.quantity * item.product.price;
                total += itemTotal;
            }
            cartTotal.innerHTML = `Total: $${total.toFixed(2)}`;
        }
    }
}

export const cart = new Cart();
