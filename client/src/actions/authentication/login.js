import axios from 'axios';
import { push } from 'react-router-redux';
import { LOGIN_ERROR, LOGIN_PENDING, LOGIN_SUCCESS } from '../types';

const loginUser = ({ email, password }) =>
    dispatch => {
        dispatch({
            type: LOGIN_PENDING
        });
        return axios
            .post('/login', { email, password })
            .then(response => {
                const { token, user } = response.data;
                sessionStorage.setItem('jwtToken', token);
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: user
                });
                dispatch(push('/'));
            })
            .catch(err => {
                dispatch({
                    type: LOGIN_ERROR,
                    payload: err
                });
                return err;
            });
    };

export default loginUser;
