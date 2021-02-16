// src/__tests__/cart.test.ts

import { cartService } from '../domain/services/Cart.service';
import { IProductRepository } from '../infrastructure/repositories/product.repository';
import { productListMock } from '../infrastructure/http/mocks/products';
import { Product } from '../domain/models/Product';

const productRepository: IProductRepository = {
    getProducts: async () => {
        return productListMock.map((productDto): Product => ({ id: productDto.id, title: productDto.title, price: productDto.price }));
    },
    getProductsById: async id => {
        return productListMock.map((productDto): Product => ({ id: productDto.id, title: productDto.title, price: productDto.price }));
    }
};

test('Car can not contain more than 5 products', async () => {
    const cart = cartService.createCart();
    const products = await productRepository.getProducts();

    cartService.addProductToCart(cart, products[0]);
    cartService.addProductToCart(cart, products[1]);
    cartService.addProductToCart(cart, products[2]);
    cartService.addProductToCart(cart, products[3]);
    cartService.addProductToCart(cart, products[4]);
    expect(cart.products.length).toEqual(5);

    cartService.addProductToCart(cart, products[5]);
    expect(cart.products.length).toEqual(5);
});

test('Add same product to cart', async () => {
    const cart = cartService.createCart();
    const products = await productRepository.getProducts();

    cartService.addProductToCart(cart, products[0]);
    expect(cart.products.length).toEqual(1);

    cartService.addProductToCart(cart, products[0]);
    expect(cart.products.length).toEqual(1);

    cartService.addProductToCart(cart, products[1]);
    expect(cart.products.length).toEqual(2);
});

test('Total cart price can not exceed 100 €', async () => {
    const cart = cartService.createCart();
    const products = await productRepository.getProducts();

    cartService.addProductToCart(cart, products[6]);
    expect(cart.products.length).toEqual(1);

    cartService.addProductToCart(cart, products[5]);
    expect(cart.products.length).toEqual(1);
});
