import { 
    LOGIN_SUCCESS, 
    LOGIN_FAIL,
    ADD_MESSAGE,
    UPDATE_USER_LIST,
    UPDATE_ROOM_LIST
} from './actions'

const createReducer = (initial, handlers) => {
    return (state = initial, action) => {
        if (handlers.hasOwnProperty(action.type)) {
            return handlers[action.type](state, action)
        } else {
            return state;
        }
    }
};

const DEFAULT_STATE = {
    userName: '',
    room: '',
    usersInRoom: [],
    roomMessages: [],
    allRooms: []
};

const setUserParams = (state, action) => {
    return {
        ...state,
        userName: action.payload.name,
        room: action.payload.room
    }
};

const addMessage = (state, action) => {
    return {
        ...state,
        roomMessages: [...state.roomMessages, {
            from: action.payload.from,
            text: action.payload.text,
            createdAt: action.payload.at,
            coords: action.payload.coords ? action.payload.coords : null
        }]
    }
};

const updateUserList = (state, action) => {
    return {
        ...state,
        usersInRoom: action.payload
    }
};

const updateRoomList = (state, action) => {
    return {
        ...state,
        allRooms: action.payload
    }
};

export default createReducer(DEFAULT_STATE, {
    [LOGIN_SUCCESS]: setUserParams,
    [ADD_MESSAGE]: addMessage,
    [UPDATE_USER_LIST]: updateUserList,
    [UPDATE_ROOM_LIST]: updateRoomList
});