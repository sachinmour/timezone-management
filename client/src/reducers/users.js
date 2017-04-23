import {
    GET_USERS_ERROR,
    GET_USERS_SUCCESS,
    GET_USERS_PENDING,
    CREATE_USER_ERROR,
    CREATE_USER_PENDING,
    CREATE_USER_SUCCESS,
    GET_USER_ERROR,
    GET_USER_SUCCESS,
    GET_USER_PENDING,
    UPDATE_USER_PENDING,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_ERROR,
    DELETE_USER_PENDING,
    DELETE_USER_SUCCESS,
    DELETE_USER_ERROR,
    RESET_USER_STATUS
} from '../actions/types';
import { omit } from 'lodash';
import { handleError } from './utils';

const defaultState = {
    pending: false,
    success: false,
    error: false,
    value: {}
};

const usersReducer = (state = defaultState, action) => {
    switch (action.type) {
        case GET_USERS_PENDING:
        case CREATE_USER_PENDING:
        case GET_USER_PENDING:
        case UPDATE_USER_PENDING:
        case DELETE_USER_PENDING:
            return {
                ...state,
                pending: true
            };
        case GET_USER_SUCCESS:
        case UPDATE_USER_SUCCESS:
        case CREATE_USER_SUCCESS:
            return {
                ...state,
                error: false,
                pending: false,
                success: true,
                value: { ...state.value, ...action.payload }
            };
        case GET_USERS_SUCCESS:
            return {
                ...state,
                error: false,
                pending: false,
                success: true,
                value: action.payload
            };
        case DELETE_USER_SUCCESS:
            return {
                ...state,
                error: false,
                pending: false,
                success: true,
                value: omit(state.value, [action.payload])
            };
        case RESET_USER_STATUS:
            return {
                ...state,
                error: false,
                pending: false,
                success: false
            };
        case GET_USERS_ERROR:
        case GET_USER_ERROR:
        case CREATE_USER_ERROR:
        case UPDATE_USER_ERROR:
        case DELETE_USER_ERROR:
            return {
                ...state,
                pending: false,
                error: handleError(action.payload)
            };
        default:
            return state;
    }
};

export default usersReducer;
