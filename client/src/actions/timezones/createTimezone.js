import { axios } from '../utils';
import { CREATE_TIMEZONE_SUCCESS, CREATE_TIMEZONE_PENDING, CREATE_TIMEZONE_ERROR } from '../types';

const createTimezone = ({ name, timezone, userId }) =>
    dispatch => {
        dispatch({
            type: CREATE_TIMEZONE_PENDING
        });
        return axios()
            .post(`/users/${userId}/timezones`, { name, timezone })
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
                return err;
            });
    };

export default createTimezone;
