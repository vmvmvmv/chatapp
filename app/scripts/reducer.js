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
    userName: 'J'
};

export default createReducer(DEFAULT_STATE, {});