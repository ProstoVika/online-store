import './styles.css'
import {ProductList, productDOM} from "./lego/product";
import {Filter} from "./lego/filter";
import {Cart} from "./lego/cart";


export class MainController {
    private readonly productList: ProductList;
    private filter: Filter;
    private readonly productDOM: Element;
    private readonly line: HTMLElement;

    constructor(productDOM: Element, cart: Cart) {
        this.productDOM = document.querySelector(".products-container")!;
        this.productList = new ProductList(this.productDOM, cart);
        this.filter = new Filter(this.productList);
        this.line = document.getElementById('line')!;

        this.updateView();
        window.addEventListener('scroll', this.progressBar);
    }
    private progressBar() {
        let windowScroll = document.body.scrollTop || document.documentElement.scrollTop;
        let windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        let width_progress_line = (windowScroll / windowHeight) * 100;
        this.line.style.width = width_progress_line + '%';
    }

    private updateView = async (): Promise<void> => {
        await this.productList.fetchProducts();
        const filteredProducts = this.filter.getFilteredProducts();
        this.filter.filterRenderProducts(filteredProducts);
        this.progressBar();
    }
}

export const cart = new Cart();
export const mainController = new MainController(productDOM, cart);

