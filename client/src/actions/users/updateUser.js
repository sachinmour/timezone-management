import { axios } from '../utils';
import { UPDATE_USER_SUCCESS, UPDATE_USER_PENDING, UPDATE_USER_ERROR } from '../types';

const updateUser = ({ email, password, userId }) =>
    dispatch => {
        dispatch({
            type: UPDATE_USER_PENDING
        });
        return axios()
            .patch(`api/v1/users/${userId}`, { email, password })
            .then(response => {
                const user = response.data;
                dispatch({
                    type: UPDATE_USER_SUCCESS,
                    payload: { [user._id]: user }
                });
            })
            .catch(err => {
                dispatch({
                    type: UPDATE_USER_ERROR,
                    payload: err
                });
                throw err;
            });
    };

export default updateUser;
