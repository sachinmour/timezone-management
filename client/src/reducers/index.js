import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as formReducer } from 'redux-form';
import { LOGOUT } from '../actions/types';

const appReducer = combineReducers({
    router: routerReducer,
    form: formReducer
});

const rootReducer = (state, action) => {
    if (action.type === LOGOUT) {
        sessionStorage.removeItem('jwtToken');
        state = undefined;
    }
    return appReducer(state, action);
};

export default rootReducer;
