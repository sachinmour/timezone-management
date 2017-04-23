import { axios } from '../utils';
import { omitBy, isNil } from 'lodash';
import { UPDATE_USER_SUCCESS, UPDATE_USER_PENDING, UPDATE_USER_ERROR, RESET_USER_STATUS } from '../types';

const updateUser = user =>
    dispatch => {
        user = omitBy(user, isNil);
        const { email, password, role } = user;
        dispatch({
            type: UPDATE_USER_PENDING
        });
        return axios()
            .patch(`api/v1/users/${user._id}`, { email, password, role })
            .then(response => {
                const user = response.data;
                dispatch({
                    type: UPDATE_USER_SUCCESS,
                    payload: { [user._id]: user }
                });
                dispatch({
                    type: RESET_USER_STATUS
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
