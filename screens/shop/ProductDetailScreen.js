import React from 'react';
import {
    Text,
    StyleSheet,
    View,
    Image,
    Button,
    ScrollView
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Colors from '../../constants/Colors';
import * as cartActions from '../../store/actions/cart';

const ProductsOverviewScreen = props => {
    const dispatch = useDispatch();
    const productId = props.navigation.getParam('productId', 'N/A')
    const selectedProduct = useSelector(state => state.products.availableProducts.find(prod => prod.id === productId))
    return (
        <ScrollView>
            <View>
                <Image style={styles.image} source={{uri: selectedProduct.imageUrl}}/>
                <View style={styles.button}>
                    <Button color={Colors.primary} title='Add to cart' onPress={() => {
                        dispatch(cartActions.addToCart(selectedProduct))
                    }} />
                </View>
                <Text style={styles.price}>${selectedProduct.price.toFixed(2)}</Text>
                <Text style={styles.description}>{selectedProduct.description}</Text>
            </View>
        </ScrollView>
    )
}

ProductsOverviewScreen.navigationOptions = navigationData => {
    const title = navigationData.navigation.getParam('productTitle', 'N/A')
    return {    
        headerTitle: title
    }
}

const styles = StyleSheet.create({
    image: {
        width: '100%',
        height: 300
    },
    button: {
        alignItems: 'center',
        marginVertical: 10
    },
    price: {
        fontSize: 20,
        color: '#888',
        textAlign: 'center',
        marginVertical: 20,
        fontFamily: 'OpenSans-Bold'
    },  
    description: {
        fontSize: 16,
        textAlign: "center",
        marginHorizontal: 20,
        fontFamily: 'OpenSans-Regular'
    }
})

export default ProductsOverviewScreen;