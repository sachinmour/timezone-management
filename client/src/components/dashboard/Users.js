import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { bindActionCreators } from 'redux';
import { getUsers } from '../../actions';
import { keys, sortBy } from 'lodash';
import { User } from './';

class Users extends Component {
    componentWillMount() {
        const { getUsers } = this.props;
        getUsers();
    }

    render() {
        const { users, authUser } = this.props;
        const expandable = ['admin'].includes(get(users, [authUser._id, 'role']));
        const UsersHTML = sortBy(keys(users), id => users[id].role + users[id].email).map(_id => (
            <User expandable={expandable} key={_id} {...users[_id]} />
        ));
        return (
            <div>
                {UsersHTML}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    users: state.users.value,
    authUser: state.auth.user
});

const mapDispatchToProps = dispatch => bindActionCreators({ getUsers }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Users);
