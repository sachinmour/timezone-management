import { axios } from '../utils';
import { keyBy } from 'lodash';
import { push } from 'react-router-redux';
import { GET_USERS_SUCCESS, GET_USERS_PENDING, GET_USERS_ERROR } from '../types';

const getUsers = () =>
    dispatch => {
        dispatch({
            type: GET_USERS_PENDING
        });
        return axios()
            .get(`api/v1/users`)
            .then(response => {
                const users = response.data;
                dispatch({
                    type: GET_USERS_SUCCESS,
                    payload: keyBy(users, '_id')
                });
            })
            .catch(err => {
                if (err.response.status === 401) return dispatch(push('/logout'));
                dispatch({
                    type: GET_USERS_ERROR,
                    payload: err
                });
                throw err;
            });
    };

export default getUsers;
