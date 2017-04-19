import { axios } from '../utils';
import { UPDATE_TIMEZONE_SUCCESS, UPDATE_TIMEZONE_PENDING, UPDATE_TIMEZONE_ERROR } from '../types';

const updateTimezone = ({ name, timezone, userId, timezoneId }) =>
    dispatch => {
        dispatch({
            type: UPDATE_TIMEZONE_PENDING
        });
        return axios()
            .patch(`api/v1/users/${userId}/timezones/${timezoneId}`, { name, timezone })
            .then(response => {
                const timezone = response.data;
                dispatch({
                    type: UPDATE_TIMEZONE_SUCCESS,
                    payload: { [userId]: timezone }
                });
            })
            .catch(err => {
                dispatch({
                    type: UPDATE_TIMEZONE_ERROR,
                    payload: err
                });
                throw err;
            });
    };

export default updateTimezone;
