import {
    CREATE_TIMEZONE_PENDING,
    CREATE_TIMEZONE_SUCCESS,
    CREATE_TIMEZONE_ERROR,
    GET_TIMEZONES_ERROR,
    GET_TIMEZONES_SUCCESS,
    GET_TIMEZONES_PENDING,
    UPDATE_TIMEZONE_PENDING,
    UPDATE_TIMEZONE_SUCCESS,
    UPDATE_TIMEZONE_ERROR,
    DELETE_TIMEZONE_PENDING,
    DELETE_TIMEZONE_SUCCESS,
    DELETE_TIMEZONE_ERROR
} from '../actions/types';
import { handleError } from './utils';
import { keys, get } from 'lodash';

const defaultState = {
    pending: false,
    success: false,
    error: false,
    value: {}
};

const timezonesReducer = (state = defaultState, action) => {
    switch (action.type) {
        case GET_TIMEZONES_PENDING:
        case UPDATE_TIMEZONE_PENDING:
        case DELETE_TIMEZONE_PENDING:
        case CREATE_TIMEZONE_PENDING:
            return {
                ...state,
                pending: true
            };
        case CREATE_TIMEZONE_SUCCESS:
        case GET_TIMEZONES_SUCCESS:
            return {
                ...state,
                error: false,
                pending: false,
                success: true,
                value: { ...state.value, ...action.payload }
            };
        case UPDATE_TIMEZONE_SUCCESS: {
            const userId = keys[action.payload][0];
            const timezoneId = action.payload[userId]._id;
            const timezones = {
                [userId]: get(state, ['value', userId], []).map(zone => {
                    if (zone._id === timezoneId) {
                        return action.payload[userId];
                    }
                    return zone;
                })
            };
            return {
                ...state,
                error: false,
                pending: false,
                success: true,
                value: { ...state.value, ...timezones }
            };
        }
        case DELETE_TIMEZONE_SUCCESS: {
            const { userId, timezoneId } = action.payload;
            const timezones = {
                [userId]: get(state, ['value', userId], []).filter(zone => zone._id !== timezoneId)
            };
            return {
                ...state,
                error: false,
                pending: false,
                success: true,
                value: { ...state.value, ...timezones }
            };
        }
        case GET_TIMEZONES_ERROR:
        case UPDATE_TIMEZONE_ERROR:
        case DELETE_TIMEZONE_ERROR:
        case CREATE_TIMEZONE_ERROR:
            return {
                ...state,
                pending: false,
                error: handleError(action.payload)
            };
        default:
            return state;
    }
};

export default timezonesReducer;
