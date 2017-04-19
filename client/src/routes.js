import React from 'react';
import { MaterialUIWrapper } from './components/helpers';
import { Route, Switch } from 'react-router';
import { Login, Logout, Dashboard } from './components';

export default (
    <MaterialUIWrapper>
        <div>
            <Switch>
                <Route exact path="/login" component={Login} />
                <Route exact path="/logout" component={Logout} />
                <Route path="/" component={Dashboard} />
            </Switch>
        </div>
    </MaterialUIWrapper>
);
