import { axios } from '../utils';
import { CREATE_TIMEZONE_SUCCESS, CREATE_TIMEZONE_PENDING, CREATE_TIMEZONE_ERROR } from '../types';

const createTimezone = ({ name, timezone, userId }) =>
    dispatch => {
        dispatch({
            type: CREATE_TIMEZONE_PENDING
        });
        return axios()
            .post(`api/v1/users/${userId}/timezones`, { name, timezone })
            .then(response => {
                const timezones = response.data;
                dispatch({
                    type: CREATE_TIMEZONE_SUCCESS,
                    payload: { [userId]: timezones }
                });
            })
            .catch(err => {
                dispatch({
                    type: CREATE_TIMEZONE_ERROR,
                    payload: err
                });
                throw err;
            });
    };

export default createTimezone;
