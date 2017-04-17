import { LOGIN_PENDING, LOGIN_SUCCESS, LOGIN_ERROR, SIGNUP_PENDING, SIGNUP_ERROR } from '../actions/types';

const defaultState = {
    authenticated: false,
    user: null,
    pending: false,
    error: false
};

const authReducer = (state = defaultState, action) => {
    switch (action.type) {
        case LOGIN_PENDING:
        case SIGNUP_PENDING:
            return {
                ...state,
                pending: true
            };
        case LOGIN_SUCCESS:
            return {
                authenticated: true,
                error: false,
                pending: false,
                user: action.payload
            };

        case LOGIN_ERROR:
        case SIGNUP_ERROR:
            return {
                ...state,
                pending: false,
                error: action.payload
            };
        default:
            return state;
    }
};

export default authReducer;
