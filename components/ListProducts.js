import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ListProducts = props => {
    return (
        <View style={styles.cartItem}>
            <Text style={styles.itemData} numberOfLines={1} ellipsizeMode={'tail'} >
                <Text style={styles.quantity}>{props.quantity}x </Text> {props.productTitle}
            </Text>
            <View style={styles.itemData}>
                <Text style={styles.itemData}>${props.sum.toFixed(2)}</Text>
                {props.deletable && (<TouchableOpacity onPress={props.onRemove} style={styles.delete}>
                    <Icon name="md-trash" color='red' size={23} />
                </TouchableOpacity>)}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cartItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        backgroundColor: 'white',
    },
    itemData: {
        flexDirection: 'row',
        fontFamily: 'OpenSans-Bold',
        alignItems: 'center',
        fontSize: 16,
    },
    quantity: {
        fontFamily: 'OpenSans-Regular',
        color: '#888',
        fontSize: 16
    },
    delete: {
        marginLeft: 20
    }
})

export default ListProducts;