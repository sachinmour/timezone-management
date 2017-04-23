import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { get, omit } from 'lodash';
import { push } from 'react-router-redux';

class Authenticated extends Component {
    componentWillMount() {
        const { authenticated, push } = this.props;
        if (!authenticated) {
            push('/login');
        }
    }

    componentWillUpdate(nextProps) {
        const { push } = this.props;
        if (!nextProps.authenticated) {
            push('/login');
        }
    }

    render() {
        const { user, access, Component } = this.props;
        if (access.includes(user.role)) {
            return <Component {...omit(this.props, ['access', 'user', 'Component', 'push', 'authenticated'])} />;
        }
        return null;
    }
}

const mapStateToProps = state => ({
    authenticated: state.auth.authenticated,
    user: get(state, ['users', 'value', get(state, ['auth', 'user', '_id'])], {})
});

const mapDispatchToProps = dispatch => bindActionCreators({ push }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Authenticated);

Authenticated.propTypes = {
    access: PropTypes.array.isRequired
};
