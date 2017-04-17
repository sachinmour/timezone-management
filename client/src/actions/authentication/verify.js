import { axios } from '../utils';
import { push } from 'react-router-redux';
import { LOGIN_SUCCESS, LOGOUT } from '../types';

const verifyUser = dispatch => {
    return new Promise(resolve => {
        axios()
            .get('/verify')
            .then(response => {
                const { token, user } = response.data;
                sessionStorage.setItem('jwtToken', token);
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: user
                });
                dispatch(push('/'));
                resolve();
            })
            .catch(err => {
                sessionStorage.removeItem('jwtToken');
                dispatch({
                    type: LOGOUT,
                    payload: err
                });
                dispatch(push('/login'));
                resolve();
            });
    });
};

export default verifyUser;
