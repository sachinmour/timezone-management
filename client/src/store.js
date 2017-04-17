import { createStore, applyMiddleware } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import { composeWithDevTools } from 'redux-devtools-extension';

// middleware
import reduxThunk from 'redux-thunk';

// import the root reducer
import rootReducer from './reducers';

// Create a history of your choosing (we're using a browser history in this case)
export const history = createHistory();

const middlewares = [reduxThunk, routerMiddleware(history)];

// if (process.env.NODE_ENV === 'development') {
//     const { logger } = require('redux-logger');
//     middlewares.push(logger);
// }

// use middleware
const middleware = applyMiddleware(...middlewares);

// creating store
const store = createStore(rootReducer, composeWithDevTools(middleware));

export default store;
