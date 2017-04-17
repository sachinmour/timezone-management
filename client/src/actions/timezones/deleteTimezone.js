import { axios } from '../utils';
import { DELETE_TIMEZONE_SUCCESS, DELETE_TIMEZONE_PENDING, DELETE_TIMEZONE_ERROR } from '../types';

const deleteTimezone = ({ userId, timezoneId }) =>
    dispatch => {
        dispatch({
            type: DELETE_TIMEZONE_PENDING
        });
        return axios()
            .delete(`/users/${userId}/timezones/${timezoneId}`)
            .then(response => {
                dispatch({
                    type: DELETE_TIMEZONE_SUCCESS,
                    payload: { userId, timezoneId }
                });
            })
            .catch(err => {
                dispatch({
                    type: DELETE_TIMEZONE_ERROR,
                    payload: err
                });
                return err;
            });
    };

export default deleteTimezone;
