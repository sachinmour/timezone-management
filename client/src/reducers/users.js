import {
    GET_USERS_ERROR,
    GET_USERS_SUCCESS,
    GET_USERS_PENDING,
    GET_USER_ERROR,
    GET_USER_SUCCESS,
    GET_USER_PENDING,
    UPDATE_USER_PENDING,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_ERROR,
    DELETE_USER_PENDING,
    DELETE_USER_SUCCESS,
    DELETE_USER_ERROR
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
        case GET_USER_PENDING:
        case UPDATE_USER_PENDING:
        case DELETE_USER_PENDING:
            return {
                ...state,
                pending: true
            };
        case GET_USER_SUCCESS:
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
        case UPDATE_USER_SUCCESS:
            return {
                ...state,
                error: false,
                pending: false,
                success: true,
                value: { ...state.value, ...action.payload }
            };
        case DELETE_USER_SUCCESS:
            return {
                ...state,
                error: false,
                pending: false,
                success: true,
                value: omit(state.value, [action.payload])
            };
        case GET_USERS_ERROR:
        case GET_USER_ERROR:
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
