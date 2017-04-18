import React from 'react';
import { MaterialUIWrapper } from './components/helpers';
import { Route } from 'react-router';
import { Login, Toolbar, Logout } from './components';

export default (
    <MaterialUIWrapper>
        <div>
            <Route exact path="/login" component={Login} />
            <Route exact path="/logout" component={Logout} />
            <Route exact path="/" component={Toolbar} />
        </div>
    </MaterialUIWrapper>
);
