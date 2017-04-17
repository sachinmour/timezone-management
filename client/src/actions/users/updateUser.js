import { axios } from '../utils';
import { UPDATE_USER_SUCCESS, UPDATE_USER_PENDING, UPDATE_USER_ERROR } from '../types';

const updateUser = ({ email, password, userId }) =>
    dispatch => {
        dispatch({
            type: UPDATE_USER_PENDING
        });
        return axios()
            .patch(`/users/${userId}`, { email, password })
            .then(response => {
                const user = response.data;
                dispatch({
                    type: UPDATE_USER_SUCCESS,
                    payload: user
                });
            })
            .catch(err => {
                dispatch({
                    type: UPDATE_USER_ERROR,
                    payload: err
                });
                return err;
            });
    };

export default updateUser;
