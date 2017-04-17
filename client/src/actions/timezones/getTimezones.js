import { axios } from '../utils';
import { GET_TIMEZONES_SUCCESS, GET_TIMEZONES_PENDING, GET_TIMEZONES_ERROR } from '../types';

const getTimezones = ({ userId }) =>
    dispatch => {
        dispatch({
            type: GET_TIMEZONES_PENDING
        });
        return axios()
            .get(`/users/${userId}/timezones`)
            .then(response => {
                const timezones = response.data;
                dispatch({
                    type: GET_TIMEZONES_SUCCESS,
                    payload: { [userId]: timezones }
                });
            })
            .catch(err => {
                dispatch({
                    type: GET_TIMEZONES_ERROR,
                    payload: err
                });
                return err;
            });
    };

export default getTimezones;
