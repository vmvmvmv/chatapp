import { 
    LOGIN_SUCCESS, 
    LOGIN_FAIL,
    ADD_MESSAGE
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
    roomMessages: []
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
            createdAt: action.payload.at
        }]
    }
};

export default createReducer(DEFAULT_STATE, {
    [LOGIN_SUCCESS]: setUserParams,
    [ADD_MESSAGE]: addMessage
});