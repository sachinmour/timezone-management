import { axios } from '../utils';
import { DELETE_USER_SUCCESS, DELETE_USER_PENDING, DELETE_USER_ERROR } from '../types';

const deleteUser = ({ userId }) =>
    dispatch => {
        dispatch({
            type: DELETE_USER_PENDING
        });
        return axios()
            .delete(`api/v1/users/${userId}`)
            .then(response => {
                dispatch({
                    type: DELETE_USER_SUCCESS,
                    payload: userId
                });
            })
            .catch(err => {
                dispatch({
                    type: DELETE_USER_ERROR,
                    payload: err
                });
                throw err;
            });
    };

export default deleteUser;
