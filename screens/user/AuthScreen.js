import React, {useReducer, useCallback, useState, useEffect} from 'react';
import {ScrollView, View, KeyboardAvoidingView, StyleSheet, Button, ActivityIndicator, Alert} from 'react-native';
import {useDispatch} from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import * as authActions from '../../store/actions/auth';

import Input from '../../components/Input';
import Colors from '../../constants/Colors';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

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

const AuthScreen = props => {
    const dispatch = useDispatch();
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [isSignup, setIsSignup] = useState(false);

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: ''
        }, 
        inputValidities: {
            email: false,
            password: false
        },
        formIsValid: false
    })

    useEffect(() => {
        if (error) {
            Alert.alert('An Error Occurred!', error, [{text: 'Okay'}])
        }
    }, [error])

    const authHandler = async () => {
        let action;
        if (isSignup) {
            action = authActions.signup(formState.inputValues.email, formState.inputValues.password);
        } else {
            action = authActions.login(formState.inputValues.email, formState.inputValues.password)
        }
        setError(null)
        setIsLoading(true);
        try {
            await dispatch(action)
            props.navigation.navigate('Shop')
        } catch (err) {
            setError(err.message)
            setIsLoading(false);
        }
    }

    const inputChangeHandler = useCallback((inputId, inputValue, inputValidity) => {
        dispatchFormState({type: FORM_INPUT_UPDATE, value: inputValue, isValid: inputValidity, input: inputId})
    }, [dispatchFormState])

    return (
        
            <LinearGradient colors={['#ffedff', '#ffe3ff']} style={styles.gradient}>
                <View style={styles.authContainer}>
                    <ScrollView>
                    <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={5} style={styles.screen}>
                        <Input 
                            id="email" 
                            label="E-mail" 
                            KeyboardType='email-address' 
                            required 
                            email 
                            autoCapitalize='none'
                            errorText='Please enter a valid email address'
                            onInputChange={inputChangeHandler}
                            initialValue=""
                        />
                        <Input 
                            id="password" 
                            label="Password" 
                            KeyboardType='default' 
                            secureTextEntry
                            required 
                            minLength={5}
                            autoCapitalize='none'
                            errorText='Please enter a valid password'
                            onInputChange={inputChangeHandler}
                            initialValue=""
                        />
                        <View style={styles.buttonContainer}>
                            {isLoading ? <ActivityIndicator size='small' color={Colors.primary} /> :
                                <Button title={isSignup ? 'Sign Up' : 'Login'} color={Colors.primary} onPress={authHandler} />
                            }
                        </View>
                        <View style={styles.buttonContainer}>
                            <Button title={`Switch to ${isSignup ? 'Login' : 'Sign up'}`} color={Colors.accent} onPress={() => {
                                setIsSignup(prevState => !prevState);
                            }} />
                        </View>
                        </KeyboardAvoidingView>
                    </ScrollView>
                </View>
            </LinearGradient>
    )
}

AuthScreen.navigationOptions = {
    headerTitle: 'Log in'
}

const styles = StyleSheet.create({
    authContainer: {
        maxHeight: 400,
        borderRadius: 10,
        elevation: 5,
        margin: 20,
        backgroundColor: 'white',
        width: '80%',
        maxWidth: 400,
        padding: 20
    },
    screen: {
        flex: 1,
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        marginTop: 10
    }
})

export default AuthScreen;