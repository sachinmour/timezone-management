import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { FloatingActionButton } from 'material-ui';
import { ContentAdd } from 'material-ui/svg-icons';
import { bindActionCreators } from 'redux';
import { User, UserEditor, TimezoneEditor, DeleteTimezone } from './';
import { Authenticated } from '../authentication';
import { getUser } from '../../actions';

class Home extends Component {
    constructor() {
        super();
        this.state = {
            userId: undefined,
            timezoneId: undefined,
            dialogOpen: {
                user: false,
                timezone: false,
                deleteTimezone: false
            }
        };
        this.switchUserDialog = this.switchUserDialog.bind(this);
        this.switchTimezoneDialog = this.switchTimezoneDialog.bind(this);
        this.switchDeleteTimezoneDialog = this.switchDeleteTimezoneDialog.bind(this);
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

    render() {
        const { _id } = this.props;
        const { dialogOpen, timezoneId, userId } = this.state;
        return (
            <div>
                <User
                    allowed={true}
                    expandable={true}
                    switchDeleteTimezoneDialog={this.switchDeleteTimezoneDialog}
                    switchTimezoneDialog={this.switchTimezoneDialog}
                    switchUserDialog={this.switchUserDialog}
                    _id={_id}
                />
                <Authenticated
                    Component={FloatingActionButton}
                    mini={true}
                    className="AddUser"
                    access={['admin', 'manager']}
                    onClick={() => this.switchUserDialog()}
                    children={<ContentAdd />}
                />
                <UserEditor switchUserDialog={this.switchUserDialog} open={dialogOpen.user} _id={userId} />
                <TimezoneEditor
                    switchTimezoneDialog={this.switchTimezoneDialog}
                    open={dialogOpen.timezone}
                    timezoneId={timezoneId}
                    userId={_id}
                />
                <DeleteTimezone
                    switchDeleteTimezoneDialog={this.switchDeleteTimezoneDialog}
                    open={dialogOpen.deleteTimezone}
                    timezoneId={timezoneId}
                    userId={_id}
                />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    _id: get(state, ['auth', 'user', '_id'])
});

const mapDispatchToProps = dispatch => bindActionCreators({ getUser }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
