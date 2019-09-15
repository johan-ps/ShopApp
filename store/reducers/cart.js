import { ADD_TO_CART, REMOVE_FROM_CART } from '../actions/cart';
import CardItem from '../../models/cart-item';
import { ADD_ORDER } from '../actions/orders';
import { DELETE_USER_ITEM } from '../actions/products';
const initialState = {
    items: {},
    totalAmount: 0
}

export default (state = initialState, action) => {
    switch (action.type) {
        case ADD_TO_CART:
            const addedProduct = action.product;
            const prodPrice = addedProduct.price;
            const prodTitle = addedProduct.title;
            let cartItem;
            if (state.items[addedProduct.id]) {
                cartItem = new CardItem(
                    state.items[addedProduct.id].quantity + 1,
                    prodPrice,
                    prodTitle,
                    state.items[addedProduct.id].sum + prodPrice
                )
            } else {
                 cartItem = new CardItem(1, prodPrice, prodTitle, prodPrice);
            }
            return {
                ...state,
                items: {...state.items, [addedProduct.id]: cartItem},
                totalAmount: state.totalAmount + prodPrice
            }
        case REMOVE_FROM_CART:
            const productQuantity = state.items[action.productId].quantity;
            const curProduct = state.items[action.productId];
            let updatedCartItems;
            if (productQuantity > 1) {
                const updatedCartItem = new CardItem(
                    curProduct.quantity - 1,
                    curProduct.productPrice,
                    curProduct.productTitle,
                    curProduct.sum - curProduct.productPrice
                )
                updatedCartItems = {...state.items, [action.productId]: updatedCartItem}
            } else {
                updatedCartItems = {...state.items};
                delete updatedCartItems[action.productId];
            }
            return {
                ...state,
                items: updatedCartItems,
                totalAmount: state.totalAmount - curProduct.productPrice
            }
        case ADD_ORDER: 
            return initialState;
        case DELETE_USER_ITEM:
            if (!state.items[action.productId]) {
                return state;
            }
            const newCartItems = {...state.items};
            const updatedAmount = state.totalAmount - newCartItems[action.productId].sum;
            delete newCartItems[action.productId];
            return {
                ...state,
                items: newCartItems,
                totalAmount: updatedAmount
            }
        default:
            return state;
    }
}
