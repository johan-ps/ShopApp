import React, {useEffect, useState, useCallback} from 'react';
import {
    View,
    FlatList,
    Text,
    StyleSheet,
    Button,
    ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as cartActions from '../../store/actions/cart';
import * as productActions from '../../store/actions/products';

import ItemCard from '../../components/ItemCard';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';

import Colors from '../../constants/Colors';

const ProductsOverviewScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [error, setError] = useState ();
    const products = useSelector(state => state.products.availableProducts);
    const dispatch = useDispatch();

    const loadProducts = useCallback(async () => {
        setError(null);
        setIsRefreshing(true);
        try {
            await dispatch(productActions.fetchProducts())
        } catch (err) {
            setError(err.message);
        }
        setIsRefreshing(false);
    }, [dispatch, setIsRefreshing, setError]);

    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', loadProducts);
        return () => {
            willFocusSub.remove();
        }
    }, [loadProducts])

    useEffect(() => {
        setIsLoading(true);
        loadProducts().then(() => {setIsLoading(false)});
    }, [loadProducts, setIsLoading])

    const onSelectHandler = (id, title) => {
        props.navigation.navigate({
            routeName: 'ProductDetail',
            params: {
                productId: id,
                productTitle: title
            }
        })
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>An error occured!</Text>
                <Button title="Try Again" onPress={loadProducts} />
            </View>
        ) 
    }

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.primary} />
            </View>
        )
    }

    if (!isLoading && products.length === 0) {
        return (
            <View style={styles.centered}>
                <Text>No products found. Maybe try adding sum.</Text>
            </View>
        ) 
    }

    return (
        <FlatList 
            onRefresh={loadProducts}
            refreshing={isRefreshing}
            data={products}
            keyExtractor={(item, index) => item.id}
            renderItem={itemData => 
                <ItemCard
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onSelect={() => {onSelectHandler(itemData.item.id, itemData.item.title)}}
                >
                    <Button color={Colors.primary} title='Details' onPress={() => {onSelectHandler(itemData.item.id, itemData.item.title)}} />
                    <Button color={Colors.primary} title='Add to Cart' onPress={() => {
                        dispatch(cartActions.addToCart(itemData.item))
                    }}/>
                </ItemCard>
            }
        />
    )
}

ProductsOverviewScreen.navigationOptions = navigationData => {
    return {
        headerTitle: 'All Products',
        headerRight: (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item title='cart' iconName='md-cart' onPress={() => {
                    navigationData.navigation.navigate('Cart')
                }} />
            </HeaderButtons>
        ),
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

export default ProductsOverviewScreen;