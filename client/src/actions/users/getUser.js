import { axios } from '../utils';
import { GET_USER_SUCCESS, GET_USER_PENDING, GET_USER_ERROR } from '../types';

const getUser = _id =>
    dispatch => {
        dispatch({
            type: GET_USER_PENDING
        });
        return axios()
            .get(`api/v1/users/${_id}`)
            .then(response => {
                const user = response.data;
                dispatch({
                    type: GET_USER_SUCCESS,
                    payload: { [user._id]: user }
                });
            })
            .catch(err => {
                dispatch({
                    type: GET_USER_ERROR,
                    payload: err
                });
                throw err;
            });
    };

export default getUser;
