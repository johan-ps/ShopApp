import React, {useCallback, useEffect, useReducer, useState} from 'react';
import {View, Text, StyleSheet, TextInput, ScrollView, Alert, KeyboardAvoidingView, ActivityIndicator} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import ItemCard from '../../components/ItemCard';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../../components/HeaderButton';
import * as productActions from '../../store/actions/products';
import Input from '../../components/Input';
import Colors from '../../constants/Colors';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE'

const formReducer = (state, action) => {
    if (action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        }
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        }
        let updatedFormIsValid = true;
        for (let key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid &&  updatedValidities[key]
        }
        return {
            formIsValid: updatedFormIsValid,
            inputValues: updatedValues,
            inputValidities: updatedValidities
        }
    }
    return state;
}

const EditProductScreen = props => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    const dispatch = useDispatch();
    const itemId = props.navigation.getParam('productId');
    const selectedProduct = useSelector(state => state.products.userProducts.find(prod => prod.id === itemId));

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: selectedProduct ? selectedProduct.title : '',
            imageUrl: selectedProduct ? selectedProduct.imageUrl : '',
            price: '',
            description: selectedProduct ? selectedProduct.description : ''
        }, 
        inputValidities: {
            title: selectedProduct ? true : false,
            imageUrl: selectedProduct ? true : false,
            description: selectedProduct ? true : false,
            price: selectedProduct ? true : false,
        }, 
        formIsValid: selectedProduct ? true : false,
    })

    useEffect(() => {
        if (error) {
            Alert.alert('An error occurred!', error, [{
                text: 'Okay'
            }])
        }
    }, [error])

    const submitHandler = useCallback(async () => {
        if (!formState.formIsValid) {
            Alert.alert('Invalid Input!', 'Please check the errors in the form', [{
                text: 'Okay'
            }])
            return;
        }
        setError(null);
        setIsLoading(true);
        try {
            if (selectedProduct) {
                await dispatch(productActions.updateItem(
                    itemId, 
                    formState.inputValues.title, 
                    formState.inputValues.description, 
                    formState.inputValues.imageUrl))
            } else {
                await dispatch(productActions.addItem(
                    formState.inputValues.title, 
                    formState.inputValues.description, 
                    formState.inputValues.imageUrl,
                    +formState.inputValues.price))
            }
            props.navigation.goBack();
        } catch (err) {
            setError(err.message);
        }
        setIsLoading(false);
    }, [dispatch, itemId, formState]);

    useEffect(() => {
        props.navigation.setParams({
            submit: submitHandler
        })
    }, [submitHandler]);



    const onChangeText = useCallback((inputId, inputValue, inputValidity) => {
        dispatchFormState({type: FORM_INPUT_UPDATE, value: inputValue, isValid: inputValidity, input: inputId})
    }, [dispatchFormState])

    if (isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size='large' color={Colors.primary} />
            </View>
        )
    }

    return (
        
        <ScrollView>
            <KeyboardAvoidingView style={{flex: 1}} behavior='padding' keyboardVerticalOffset={150}>
                <View style={styles.container}>
                    <Input
                        id='title'
                        onInputChange={onChangeText}
                        initialValue={selectedProduct ? selectedProduct.title : ''}
                        initiallyValid={!!selectedProduct}
                        label={'Title'}
                        errorText='Please enter a valid title!'
                        autoCorrect
                        autoCapitalize='sentences'
                        returnKeyType='next'
                        required
                    />
                    <Input
                        onInputChange={onChangeText}
                        id='imageUrl'
                        initialValue={selectedProduct ? selectedProduct.imageUrl : ''}
                        initiallyValid={!!selectedProduct}
                        label={'Image Url'}
                        errorText='Please enter a valid image!'
                        required
                    />
                    {
                        selectedProduct ? null : (<Input
                            onInputChange={onChangeText}
                            id='price'
                            keyboardType={'decimal-pad'}
                            label={'Price'}
                            errorText='Please enter a valid price!'
                            required
                            min={0.1}
                        />)
                    }
                    <Input
                        onInputChange={onChangeText}
                        id='description'
                        initialValue={selectedProduct ? selectedProduct.description : ''}
                        initiallyValid={!!selectedProduct}
                        label={'Desription'}
                        errorText='Please enter a valid description!'
                        autoCorrect
                        autoCapitalize='sentences'
                        multiline
                        numberOfLines={3}
                        required
                        minLength={5}
                    />
                </View>
            </KeyboardAvoidingView>
        </ScrollView>
       
    )
}   

EditProductScreen.navigationOptions = navigationData => {
    const isEdit = navigationData.navigation.getParam('productId');
    const submitFunction = navigationData.navigation.getParam('submit');
    return {
        headerTitle: isEdit ? 'Edit Product' : 'Add Product',
        headerRight: (
            <HeaderButtons HeaderButtonComponent={HeaderButton}>
                <Item title='menu' iconName='md-checkmark' onPress={submitFunction} />
            </HeaderButtons>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: 20
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default EditProductScreen;