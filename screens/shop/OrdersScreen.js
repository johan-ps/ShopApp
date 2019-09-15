import React, {useEffect, useState} from 'react';
import { View, FlatList, Text, ActivityIndicator, StyleSheet } from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import * as orderActions from '../../store/actions/orders';

import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import OrderCard from '../../components/OrderCard';
import Colors from '../../constants/Colors';

const OrdersScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const orders = useSelector(state => state.orders.orders);
    const dispatch = useDispatch();

    useEffect(() => {
        setIsLoading(true);
        dispatch(orderActions.fetchOrders()).then(setIsLoading(false));
    }, [dispatch])

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        )
    }

    if (orders.length === 0) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>No orders found, maybe start ordering some products?</Text>
            </View>
        )
    }

    return (
        <FlatList
            data={orders}
            keyExtractor={item => item.id}
            renderItem={itemData => (
                <OrderCard 
                    price={itemData.item.totalAmount}
                    date={itemData.item.readDate}
                    items={itemData.item.items}
                />
            )}
        />
    )
}

OrdersScreen.navigationOptions = navigationData => {
    return {
        headerTitle: 'Orders',
        headerLeft: (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item title='menu' iconName='md-menu' onPress={() => {
                    navigationData.navigation.toggleDrawer();
                }} />
            </HeaderButtons>
        )
    }
}

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default OrdersScreen;