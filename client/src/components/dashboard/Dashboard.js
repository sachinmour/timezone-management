import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { Route, Switch } from 'react-router';
import { bindActionCreators } from 'redux';
import { Home, Toolbar, Users } from './';
import { getUser } from '../../actions';

class Dashboard extends Component {
    componentWillMount() {
        const { getUser, _id } = this.props;
        getUser(_id);
    }

    render() {
        const { location: { pathname } } = this.props;
        return (
            <div>
                <Toolbar path={pathname} />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/users" component={Users} />
                </Switch>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    _id: get(state, ['auth', 'user', '_id'])
});

const mapDispatchToProps = dispatch => bindActionCreators({ getUser }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
