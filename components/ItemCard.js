import React from 'react';
import {
    TouchableNativeFeedback,
    View,
    Text,
    Image,
    StyleSheet,
} from 'react-native';
import Colors from '../constants/Colors';

const ItemCard = props => {
    return (
        <View style={styles.cardContainer}>
            <View style={styles.touchable}>
                <TouchableNativeFeedback onPress={props.onSelect} useForeground>
                    <View>
                        <View style={styles.imageContainer}>
                            <Image style={styles.image} source={{uri: props.image}} />
                        </View>
                        <View style={styles.details}>
                            <Text style={styles.title}>{props.title}</Text>
                            <Text style={styles.price}>${props.price.toFixed(2)}</Text>
                        </View>
                        <View style={styles.buttonContainer}>
                            {props.children}
                        </View>
                    </View>
                </TouchableNativeFeedback>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cardContainer: {
        height: 300,
        borderRadius: 10,
        elevation: 5,
        margin: 20,
        backgroundColor: 'white',
    },
    touchable: {
        borderRadius: 10,
        overflow: 'hidden'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: '25%',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    details: {
        alignItems: 'center',
        height: '15%',
        paddingVertical: 10
    },
    imageContainer: {
        width: '100%',
        height: '60%',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        overflow: 'hidden'
    },
    image: {
        width: '100%',
        height: '100%'
    },
    title: {
        fontSize: 18,
        marginVertical: 4,
        fontFamily: 'OpenSans-Bold'
    },
    price: {
        fontSize: 14,
        color: '#888',
        fontFamily: 'OpenSans-Regular'
    }
})

export default ItemCard;