import PRODUCTS from '../../data/dummy-data';
import { DELETE_ITEM, ADD_ITEM, UPDATE_ITEM, SET_PRODUCTS } from '../actions/products';
import Product from '../../models/product';

const initialState = {
    availableProducts: [],
    userProducts: []
}

export default (state = initialState, action) => {
    switch(action.type) {
        case SET_PRODUCTS:
            return {
                availableProducts: action.products,
                userProducts: action.userProducts
            }
        case DELETE_ITEM:
            const updatedUserProducts = state.userProducts.filter(prod => prod.id !== action.productId);
            const updatedAvailableProducts = state.availableProducts.filter(prod => prod.id !== action.productId);
            return {
                ...state,
                availableProducts: updatedAvailableProducts,
                userProducts: updatedUserProducts
            }
        case ADD_ITEM:
            const newProduct = new Product (
                action.productData.id,
                action.productData.ownerId,
                action.productData.title,
                action.productData.imageUrl,
                action.productData.description,
                action.productData.price
            )
            return {
                ...state,
                availableProducts: state.availableProducts.concat(newProduct),
                userProducts: state.userProducts.concat(newProduct)
            }
        case UPDATE_ITEM:
            const userProductIndex = state.userProducts.findIndex(prod => prod.id === action.productId);
            const availableProductIndex = state.availableProducts.findIndex(prod => prod.id === action.productId);
            const updatedProduct = new Product (
                action.productId,
                state.userProducts[userProductIndex].id,
                action.productData.title,
                action.productData.imageUrl,
                action.productData.description,
                state.userProducts[userProductIndex].price
            )
            const updatedUserProduct = [...state.userProducts];
            updatedUserProduct[userProductIndex] = updatedProduct;
            const updatedAvailableProduct = [...state.availableProducts];
            updatedAvailableProduct[availableProductIndex] = updatedProduct;
            return {
                ...state,
                availableProducts: updatedAvailableProduct,
                userProducts: updatedUserProduct
            }
        default:
            return state;
    }
}