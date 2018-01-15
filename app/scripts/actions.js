export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';

export const ADD_MESSAGE = 'ADD_MESSAGE';

export const loginSuccess = (params) => {
    return {
        type: LOGIN_SUCCESS,
        payload: params
    }
};

export const loginError = (error) => {
    return {
        type: LOGIN_SUCCESS,
        payload: error
    }
};

export const addMessage = (msg) => {
    return {
        type: ADD_MESSAGE,
        payload: msg
    }
};