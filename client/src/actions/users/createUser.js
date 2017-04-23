import { axios } from '../utils';
import { CREATE_USER_SUCCESS, CREATE_USER_PENDING, CREATE_USER_ERROR, RESET_USER_STATUS } from '../types';

const createUser = ({ email, password, role }) =>
    dispatch => {
        dispatch({
            type: CREATE_USER_PENDING
        });
        return axios()
            .post(`api/v1/users`, { email, password, role, login: false })
            .then(response => {
                const user = response.data;
                dispatch({
                    type: CREATE_USER_SUCCESS,
                    payload: { [user._id]: user }
                });
                dispatch({
                    type: RESET_USER_STATUS
                });
            })
            .catch(err => {
                dispatch({
                    type: CREATE_USER_ERROR,
                    payload: err
                });
                throw err;
            });
    };

export default createUser;
