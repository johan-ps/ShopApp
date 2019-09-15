import React, {useState} from 'react';
import {
    View,
    Text,
    FlatList,
    Button,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import Colors from '../../constants/Colors';
import { useSelector, useDispatch } from 'react-redux';
import ListProducts from '../../components/ListProducts';
import * as cartActions from '../../store/actions/cart';
import * as orderActions from '../../store/actions/orders';

const CartScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const sendOrderHandler = async () => {
        setIsLoading(true);
        await dispatch(orderActions.addOrder(cartItems, price));
        setIsLoading(false);
    }

    const price = useSelector(state => state.cart.totalAmount);
    const cartItems = useSelector(state => {
        const transformedCartItems = [];
        for (let key in state.cart.items) {
            transformedCartItems.push({
                productId: key,
                productTitle: state.cart.items[key].productTitle,
                productPrice: state.cart.items[key].productPrice,
                quantity: state.cart.items[key].quantity,
                sum: state.cart.items[key].sum
            })
        }
        return transformedCartItems.sort((a, b) => a.productId > b.productId ? 1 : -1);
    })

    return (
        <View style={styles.container}>
            <View style={styles.orderContainer}>
                <Text style={styles.total}>Total: <Text style={styles.price}>${Math.round(price.toFixed(2) * 100) / 100}</Text></Text>
                {isLoading ? (<ActivityIndicator size='small' color={Colors.primary} />) : (
                    <Button disabled={cartItems.length === 0} color={Colors.accent} title='ORDER NOW' onPress={sendOrderHandler} />
                )}
            </View>
            <View>
                <FlatList
                    data={cartItems}
                    renderItem={itemData => <ListProducts
                        quantity={itemData.item.quantity} 
                        sum={itemData.item.sum}
                        productTitle={itemData.item.productTitle}
                        onRemove={() => {dispatch(cartActions.removeFromCart(itemData.item.productId));}}
                        deletable
                    />}
                    keyExtractor={item => item.productId}
                    style={styles.listItem}
                />
            </View>
        </View>
    )
}

CartScreen.navigationOptions = {
    headerTitle: 'Your Cart'
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20
    },
    listItem: {
        marginHorizontal: 20
    },
    orderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        elevation: 5,
        marginBottom: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        padding: 10,
        alignItems: 'center'
    },
    total: {
        fontSize: 18,
        fontFamily: 'OpenSans-Bold'
    },
    price: {
        color: Colors.accent
    }
})

export default CartScreen;