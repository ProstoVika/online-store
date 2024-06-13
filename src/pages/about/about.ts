 import './about.css'
 import { Cart } from "../../lego/cart";
 import {productDOM, ProductList} from "../../lego/product";

 export class AboutController {
     private readonly cart: Cart;
     private productList: ProductList;

     constructor() {
         this.cart = new Cart();
         this.productList = new ProductList(productDOM, this.cart);
         window.addEventListener('scroll', this.progressBar);
     }
     private progressBar(): void {
         const line = document.getElementById('line');
         if (!line) return;
         const windowScroll = document.body.scrollTop || document.documentElement.scrollTop;
         const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
         const width_progress_line = (windowScroll / windowHeight) * 100;
         line.style.width = width_progress_line + '%';
     }

     public initializeAboutPage(): void {

         console.log(window.origin)
         const cartContainer = document.getElementById('about-cart-container');
         if (cartContainer) {
             this.cart.cartContainer = cartContainer;
             this.cart.loadCart();
             this.cart.displayCartItems();
         }

         const cartButton = document.getElementById('cart-btn');
         if (cartButton) {
             cartButton.addEventListener('click', () => {
                 this.cart.CartVisibility();
                 this.cart.displayCartItems();
             });
         }
     }
 }

 export const aboutController = new AboutController();
 aboutController.initializeAboutPage();