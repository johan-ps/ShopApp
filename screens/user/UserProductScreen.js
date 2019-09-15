import React from 'react';
import {View, Text, FlatList, Button, Alert} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import * as productActions from '../../store/actions/products';

import ItemCard from '../../components/ItemCard';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';

import Colors from '../../constants/Colors';

const UserProductsScreen = props => {
    const dispatch = useDispatch();
    const userProducts = useSelector(state => state.products.userProducts);
    const onSelectHandler = id => {
        props.navigation.navigate({
            routeName: 'EditProducts',
            params: {
                productId: id
            }
        })
    }

    if (userProducts.length === 0) {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <Text>No products found, maybe start creating some?</Text>
            </View>
        )
    }

    return (
        <FlatList
            data={userProducts}
            keyExtractor={item => item.id}
            renderItem={itemData => (
                <ItemCard
                    image={itemData.item.imageUrl}
                    title={itemData.item.title}
                    price={itemData.item.price}
                    onSelect={() => onSelectHandler(itemData.item.id)}
                >
                    <Button color={Colors.primary} title='Edit' onPress={() => onSelectHandler(itemData.item.id)} />
                    <Button color={Colors.primary} title='Delete' onPress={() => {
                        Alert.alert('Warning!', 'Are you sure you want to delete this item?', [
                            {text: 'NO', style: 'cancel'},
                            {text: 'YES', style: 'default', onPress: () => dispatch(productActions.deleteItem(itemData.item.id))}
                        ])
                    }} />
                </ItemCard>
            )}
        />
    )
}   

UserProductsScreen.navigationOptions = navigationData => {
    return {
        headerTitle: 'User Products',
        headerLeft: (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item title='menu' iconName='md-menu' onPress={() => {
                    navigationData.navigation.toggleDrawer();
                }} />
            </HeaderButtons>
        ),
        headerRight: (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item title='menu' iconName='md-add' onPress={() => {
                    navigationData.navigation.navigate('EditProducts')
                }} />
            </HeaderButtons>
        )
    }
}

export default UserProductsScreen;