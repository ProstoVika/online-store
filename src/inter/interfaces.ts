export interface ProductInterface{
    id: number;
    image: string;
    title: string;
    company: string;
    price: number;
}

export interface CartItemsInterface{
    id: number;
    product: ProductInterface;
    quantity: number;
}

export class CartItemsClass implements CartItemsInterface{
    constructor(
        public id: number,
        public product: ProductInterface,
        public quantity: number
    ) {
    }
}






