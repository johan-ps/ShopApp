import Product from "../../models/product";
export const DELETE_ITEM = 'DELETE_ITEM';
export const ADD_ITEM = 'ADD_ITEM'
export const UPDATE_ITEM = 'UPDATE_ITEM'
export const SET_PRODUCTS = 'SET_PRODUCTS'

export const fetchProducts = () => {
    return async (dispatch, getState) => {
        try {
            const userId = getState().auth.userId;
            const response = await fetch('https://shopapp-e12f6.firebaseio.com/products.json')

            if (!response.ok) {
                throw new Error ('Something went wrong!');
            }

            const resData = await response.json();
            const loadedProducts = [];
            for (let key in resData) {
                loadedProducts.push(new Product(
                    key, 
                    resData[key].ownerId, 
                    resData[key].title, 
                    resData[key].imageUrl, 
                    resData[key].description,
                    resData[key].price
                ))
            }

            dispatch({
                type: SET_PRODUCTS,
                products: loadedProducts,
                userProducts: loadedProducts.filter(prod => prod.ownerId === userId)
            })
        } catch (err) {
            throw err
        }
    }
}

export const deleteItem = productId => {
    return async (dispatch, getState) => {
        const response = await fetch(`https://shopapp-e12f6.firebaseio.com/products/${productId}.json?auth=${getState().auth.token}`, {
            method: 'DELETE'
        })

        if (!response.ok) {
            throw new Error ('Something went wrong')
        }

        dispatch({
            type: DELETE_ITEM,
            productId: productId
        })
    }
}

export const addItem = (title, description, imageUrl, price) => {
    return async (dispatch, getState) => {
        const userId = getState().auth.userId;
        const response = await fetch(`https://shopapp-e12f6.firebaseio.com/products.json?auth=${getState().auth.token}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                imageUrl,
                price,
                ownerId: userId
            })
        })

        const resData = await response.json();

        dispatch({
            type: ADD_ITEM,
            productData: {
                id: resData.name,
                title,
                description,
                imageUrl,
                price,
                ownerId: userId
            }
        })
    }
}

export const updateItem = (id, title, description, imageUrl) => {
    return  async (dispatch, getState) => {
        const response = await fetch(`https://shopapp-e12f6.firebaseio.com/products/${id}.json?auth=${getState().auth.token}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title,
                description,
                imageUrl
            })
        })

        if (!response.ok) {
            throw new Error ('Something went wrong')
        }

        dispatch({
            type: UPDATE_ITEM,
            productId: id,
            productData: {
                title,
                description,
                imageUrl
            }
        })
    }
}