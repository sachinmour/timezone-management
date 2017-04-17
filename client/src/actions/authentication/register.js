import axios from 'axios';
import { push } from 'react-router-redux';
import { SIGNUP_PENDING, LOGIN_SUCCESS, SIGNUP_ERROR } from '../types';

const registerUser = ({ email, password, role }) =>
    dispatch => {
        dispatch({
            type: SIGNUP_PENDING
        });
        return axios
            .post('/register', { email, password, role })
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
                    type: SIGNUP_ERROR,
                    payload: err
                });
                throw err;
            });
    };

export default registerUser;
