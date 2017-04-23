import React from 'react';
import { MaterialUIWrapper } from './components/helpers';
import { Route, Switch } from 'react-router';
import { Login, Logout, Dashboard, Register } from './components';

export default (
    <MaterialUIWrapper>
        <div>
            <Switch>
                <Route exact path="/login" component={Login} />
                <Route exact path="/logout" component={Logout} />
                <Route exact path="/register" component={Register} />
                <Route path="/" component={Dashboard} />
            </Switch>
        </div>
    </MaterialUIWrapper>
);
