import React, {useState} from 'react';
import {
    TouchableNativeFeedback,
    View,
    Text,
    Image,
    StyleSheet,
    Button
} from 'react-native';
import Colors from '../constants/Colors';
import ListProducts from './ListProducts';

const ItemCard = props => {
    const [showDetails, setShowDetails] = useState(false);
    return (
        <View style={styles.cardContainer}>
            <View style={styles.details}>
                <Text style={styles.price}>${props.price.toFixed(2)}</Text>
                <Text style={styles.date}>{props.date}</Text>
            </View>
            <Button color={Colors.primary} title={showDetails ? 'HIDE DETAILS' : 'SHOW DETAILS'} onPress={() => {
                setShowDetails(prevState => !prevState)
            }} />
            {showDetails && (<View style={styles.detailItems}>
                {props.items.map(cartItem => (
                    <ListProducts
                        key={cartItem.productId}
                        quantity={cartItem.quantity}
                        productTitle={cartItem.productTitle}
                        sum={cartItem.sum}
                        deletable={false}
                    />
                ))}
            </View>)}
        </View>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        borderRadius: 10,
        elevation: 5,
        margin: 20,
        backgroundColor: 'white',
        padding: 10,
        alignItems: 'center'
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        alignItems: 'center',
        width: '100%'
    },
    price: {
        fontFamily: 'OpenSans-Bold',
        fontSize: 18
    },
    date: {
        fontFamily: 'OpenSans-Regular',
        fontSize: 18,
        color: '#888'
    },
    detailItems: {
        width: '100%'
    }
})

export default ItemCard;