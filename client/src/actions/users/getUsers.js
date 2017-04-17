import { axios } from '../utils';
import { GET_USERS_SUCCESS, GET_USERS_PENDING, GET_USERS_ERROR } from '../types';

const getUsers = () =>
    dispatch => {
        dispatch({
            type: GET_USERS_PENDING
        });
        return axios()
            .get(`/users`)
            .then(response => {
                const users = response.data;
                dispatch({
                    type: GET_USERS_SUCCESS,
                    payload: users
                });
            })
            .catch(err => {
                dispatch({
                    type: GET_USERS_ERROR,
                    payload: err
                });
                throw err;
            });
    };

export default getUsers;
