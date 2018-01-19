export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAIL = 'LOGIN_FAIL';

export const ADD_MESSAGE = 'ADD_MESSAGE';
export const UPDATE_USER_LIST = 'UPDATE_USER_LIST';
export const UPDATE_ROOM_LIST = 'UPDATE_ROOM_LIST';

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

export const updateUserList = (list) => {
    return {
        type: UPDATE_USER_LIST,
        payload: list
    }
};

export const updateRoomList = (list) => {
    return {
        type: UPDATE_ROOM_LIST,
        payload: list
    }
};