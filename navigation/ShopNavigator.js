import React from 'react';
import {SafeAreaView, Button, View} from 'react-native';
import { createStackNavigator, createAppContainer, createDrawerNavigator, createSwitchNavigator, DrawerItems } from 'react-navigation';
import {useDispatch} from 'react-redux';
import Colors from '../constants/Colors';
import Icon from 'react-native-vector-icons/Ionicons';
import * as authActions from '../store/actions/auth';
import ProductsOverviewScreen from '../screens/shop/ProductsOverviewScreen';
import ProductDetailScreen from '../screens/shop/ProductDetailScreen';
import CartScreen from '../screens/shop/CartScreen';
import OrdersScreen from '../screens/shop/OrdersScreen';
import UserProductScreen from '../screens/user/UserProductScreen';
import EditProductScreen from '../screens/user/EditProductScreen';
import AuthScreen from '../screens/user/AuthScreen';
import StartupScreen from '../screens/StartupScreen';

const defaultNavOptions = {
    headerTitle: 'A Screen',
    headerStyle: {
        backgroundColor: Colors.primary
    },
    headerTintColor: 'white', 
    headerTitleStyle: {
        fontFamily: 'OpenSans-Bold'
    }       
}

const ProductsNavigator = createStackNavigator({
    ProductsOverview: ProductsOverviewScreen,
    ProductDetail: ProductDetailScreen,
    Cart: CartScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (
            <Icon name='md-cart' size={23} color={drawerConfig.tintColor} />
    )
    },
    defaultNavigationOptions: defaultNavOptions
})

const OrdersNavigator = createStackNavigator({
    orders: OrdersScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (
            <Icon name='md-list' size={23} color={drawerConfig.tintColor} />
        )
    },
    defaultNavigationOptions: defaultNavOptions
})

const AdminNavigator = createStackNavigator({
    UserProducts: UserProductScreen,
    EditProducts: EditProductScreen
}, {
    navigationOptions: {
        drawerIcon: drawerConfig => (
            <Icon name='md-create' size={23} color={drawerConfig.tintColor} />
        )
    },
    defaultNavigationOptions: defaultNavOptions
})

const ShopNavigator = createDrawerNavigator({
    Products: ProductsNavigator,
    Orders: OrdersNavigator,
    Admin: AdminNavigator
}, {
    contentOptions: {
        activeTintColor: Colors.primary
    },
    contentComponent: props => {
        const dispatch = useDispatch();
        return (
            <View style={{flex: 1}}>
                <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
                    <DrawerItems {...props}  />
                    <Button title="Logout" color={Colors.primary} onPress={() => {
                        dispatch(authActions.logout())
                        // props.navigation.navigate('Auth');
                    }} />
                </SafeAreaView>
            </View>
        )
    }
})

const AuthNavigator = createStackNavigator({
    Auth: AuthScreen
}, {
    defaultNavigationOptions: defaultNavOptions
})

const MainNavigator = createSwitchNavigator({
    Startup: StartupScreen,
    Auth: AuthNavigator,
    Shop: ShopNavigator
})

export default createAppContainer(MainNavigator);