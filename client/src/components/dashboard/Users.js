import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { bindActionCreators } from 'redux';
import { keys, sortBy } from 'lodash';
import { FloatingActionButton } from 'material-ui';
import { ContentAdd } from 'material-ui/svg-icons';
import { getUsers } from '../../actions';
import { User, TimezoneEditor, UserEditor, DeleteUser, DeleteTimezone } from './';

class Users extends Component {
    constructor() {
        super();
        this.state = {
            timezoneId: undefined,
            userId: undefined,
            dialogOpen: {
                user: false,
                timezone: false,
                deleteUser: false,
                deleteTimezone: false
            }
        };
        this.switchUserDialog = this.switchUserDialog.bind(this);
        this.switchTimezoneDialog = this.switchTimezoneDialog.bind(this);
        this.switchDeleteUserDialog = this.switchDeleteUserDialog.bind(this);
        this.switchDeleteTimezoneDialog = this.switchDeleteTimezoneDialog.bind(this);
    }

    componentWillMount() {
        const { getUsers } = this.props;
        getUsers();
    }

    switchTimezoneDialog(newTimezoneId, newUserId) {
        this.setState(({ dialogOpen }) => ({
            timezoneId: newTimezoneId,
            userId: newUserId,
            dialogOpen: {
                ...dialogOpen,
                timezone: !dialogOpen.timezone
            }
        }));
    }

    switchDeleteTimezoneDialog(newTimezoneId, newUserId) {
        this.setState(({ dialogOpen }) => ({
            timezoneId: newTimezoneId,
            userId: newUserId,
            dialogOpen: {
                ...dialogOpen,
                deleteTimezone: !dialogOpen.deleteTimezone
            }
        }));
    }

    switchUserDialog(newUserId) {
        this.setState(({ dialogOpen }) => ({
            userId: newUserId,
            dialogOpen: {
                ...dialogOpen,
                user: !dialogOpen.user
            }
        }));
    }

    switchDeleteUserDialog(newUserId) {
        this.setState(({ dialogOpen }) => ({
            userId: newUserId,
            dialogOpen: {
                ...dialogOpen,
                deleteUser: !dialogOpen.deleteUser
            }
        }));
    }

    render() {
        const { users, authUser } = this.props;
        const { timezoneId, userId, dialogOpen } = this.state;
        const expandable = ['admin'].includes(get(users, [authUser._id, 'role']));
        const UsersHTML = sortBy(keys(users), id => users[id].role + users[id].email).map(_id => (
            <User
                switchUserDialog={this.switchUserDialog}
                switchTimezoneDialog={this.switchTimezoneDialog}
                switchDeleteUserDialog={this.switchDeleteUserDialog}
                switchDeleteTimezoneDialog={this.switchDeleteTimezoneDialog}
                expandable={expandable}
                key={_id}
                {...users[_id]}
            />
        ));
        return (
            <div>
                {UsersHTML}
                <FloatingActionButton className="AddUser" mini={true} onClick={() => this.switchUserDialog()}>
                    <ContentAdd />
                </FloatingActionButton>
                <UserEditor switchUserDialog={this.switchUserDialog} open={dialogOpen.user} _id={userId} />
                <TimezoneEditor
                    switchTimezoneDialog={this.switchTimezoneDialog}
                    open={dialogOpen.timezone}
                    timezoneId={timezoneId}
                    userId={userId}
                />
                <DeleteUser switchDeleteUserDialog={this.switchDeleteUserDialog} open={dialogOpen.deleteUser} _id={userId} />
                <DeleteTimezone
                    switchDeleteTimezoneDialog={this.switchDeleteTimezoneDialog}
                    open={dialogOpen.deleteTimezone}
                    timezoneId={timezoneId}
                    userId={userId}
                />
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
