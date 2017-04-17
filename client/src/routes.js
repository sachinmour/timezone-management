import React from 'react';
import store from './store';
import { Route } from 'react-router';
import { Login } from './components';

export default (
    <Route>
        <Route path="/login" component={Login} />
    </Route>
);
