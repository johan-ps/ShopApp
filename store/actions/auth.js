import AsyncStorage from '@react-native-community/async-storage';

// export const SIGNUP = 'SIGN UP';
// export const LOGIN = 'LOGIN';
export const AUTHENTICATE = 'AUTHENTICATE';
export const LOGOUT = 'LOGOUT';

let timer;

export const authenticate = (userId, token, expiryTime) => {
    return dispatch => {
        dispatch(setLogoutTimer(expiryTime))
        dispatch({type: AUTHENTICATE, userId: userId, token: token})
    }
}

export const signup = (email, password) => {
    return async dispatch => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCuqBoobfrXlA8wjZB-Yakqk61U5CRNXSg', {
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true
            })
        })

        if (!response.ok) {
            const errorResData = await response.json();
            const errorMsg = errorResData.error.message;
            let msg = 'Something went wrong!'
            if (errorMsg === 'EMAIL_EXISTS') {
                msg = 'This email is already used by another account!'
            }
            throw new Error (msg)
        }

        const resData = await response.json();
        // dispatch({type: SIGNUP, token: resData.idToken, userId: resData.localId})
        dispatch(authenticate(resData.localId, resData.idToken, parseInt(resData.expiresIn)*1000))
        const expirationDate = new Data(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
        saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    }
}

export const login = (email, password) => {
    return async dispatch => {
        const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCuqBoobfrXlA8wjZB-Yakqk61U5CRNXSg', {
            method: 'POST',
            header: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password,
                returnSecureToken: true
            })
        })

        if (!response.ok) {
            const errorResData = await response.json();
            const errorMsg = errorResData.error.message;
            let msg = 'Something went wrong!'
            if (errorMsg === 'EMAIL_NOT_FOUND') {
                msg = 'This email could not be found!'
            } else if (errorMsg === 'INVALID_PASSWORD') {
                msg = 'This password is not valid!'
            }
            throw new Error (msg)
        }

        const resData = await response.json();
        // dispatch({type: SIGNUP, token: resData.idToken, userId: resData.localId})
        dispatch(authenticate(resData.localId, resData.idToken, parseInt(resData.expiresIn)*1000))
        const expirationDate = new Date(new Date().getTime() + parseInt(resData.expiresIn) * 1000);
        saveDataToStorage(resData.idToken, resData.localId, expirationDate);
    }
}

export const logout = () => {
    clearLogoutTimer()
    AsyncStorage.removeItem('userData')
    return {type: LOGOUT}
}

const clearLogoutTimer = () => {
    if (timer) {
        clearTimeout(timer);
    }
}

const setLogoutTimer = expirationTime => {
    return dispatch => {
        timer = setTimeout(() => {
            dispatch(logout());
        }, expirationTime);
    }
}

const saveDataToStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem('userData', JSON.stringify({
        token: token,
        userId: userId,
        expiryDate: expirationDate.toISOString()
    }))
}