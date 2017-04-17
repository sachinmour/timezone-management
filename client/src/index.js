import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import store, { history } from './store';
import { verify } from './actions';
import routes from './routes';
import './index.css';

verify(store.dispatch).then(() => {
    ReactDOM.render(
        <Provider store={store}>
            <ConnectedRouter history={history}>
                {routes}
            </ConnectedRouter>
        </Provider>,
        document.getElementById('root')
    );
});
