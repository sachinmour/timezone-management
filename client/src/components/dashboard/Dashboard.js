import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { Route } from 'react-router';
import { bindActionCreators } from 'redux';
import { User, Toolbar, Users } from './';
import { getUser } from '../../actions';

class Dashboard extends Component {
    componentWillMount() {
        const { getUser, _id } = this.props;
        getUser(_id);
    }

    render() {
        const { _id, location: { pathname } } = this.props;
        return (
            <div>
                <Toolbar path={pathname} />
                <Route exact path="/" render={() => <User allowed={true} expandable={true} _id={_id} />} />
                <Route exact path="/users" component={Users} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    _id: get(state, ['auth', 'user', '_id'])
});

const mapDispatchToProps = dispatch => bindActionCreators({ getUser }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
