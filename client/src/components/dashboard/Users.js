import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { bindActionCreators } from 'redux';
import { keys, sortBy } from 'lodash';
import { FloatingActionButton } from 'material-ui';
import { ContentAdd } from 'material-ui/svg-icons';
import { getUsers } from '../../actions';
import { User, TimezoneEditor, UserEditor } from './';

class Users extends Component {
    constructor() {
        super();
        this.state = {
            timezoneId: undefined,
            userId: undefined,
            dialogOpen: {
                user: false,
                timezone: false
            }
        };
        this.switchUserDialog = this.switchUserDialog.bind(this);
        this.switchTimezoneDialog = this.switchTimezoneDialog.bind(this);
    }

    componentWillMount() {
        const { getUsers } = this.props;
        getUsers();
    }

    switchTimezoneDialog(newTimezoneId, newUserId) {
        this.setState(({ timezoneId, userId, dialogOpen }) => ({
            timezoneId: newTimezoneId || timezoneId,
            userId: newUserId || userId,
            dialogOpen: {
                ...dialogOpen,
                timezone: !dialogOpen.timezone
            }
        }));
    }

    switchUserDialog(newUserId) {
        this.setState(({ dialogOpen, userId }) => ({
            userId: newUserId || userId,
            dialogOpen: {
                ...dialogOpen,
                user: !dialogOpen.user
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
                expandable={expandable}
                key={_id}
                {...users[_id]}
            />
        ));
        return (
            <div>
                {UsersHTML}
                <FloatingActionButton mini={true} onClick={() => this.switchUserDialog()}>
                    <ContentAdd />
                </FloatingActionButton>
                <UserEditor switchUserDialog={this.switchUserDialog} open={dialogOpen.user} _id={userId} />
                <TimezoneEditor
                    switchTimezoneDialog={this.switchTimezoneDialog}
                    open={dialogOpen.timezone}
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
