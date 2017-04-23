import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { FloatingActionButton } from 'material-ui';
import { ContentAdd } from 'material-ui/svg-icons';
import { bindActionCreators } from 'redux';
import { User, UserEditor, TimezoneEditor } from './';
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
                timezone: false
            }
        };
        this.switchUserDialog = this.switchUserDialog.bind(this);
        this.switchTimezoneDialog = this.switchTimezoneDialog.bind(this);
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
        const { _id } = this.props;
        const { dialogOpen, timezoneId, userId } = this.state;
        return (
            <div>
                <User
                    allowed={true}
                    expandable={true}
                    switchTimezoneDialog={this.switchTimezoneDialog}
                    switchUserDialog={this.switchUserDialog}
                    _id={_id}
                />
                <Authenticated
                    Component={FloatingActionButton}
                    mini={true}
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
            </div>
        );
    }
}

const mapStateToProps = state => ({
    _id: get(state, ['auth', 'user', '_id'])
});

const mapDispatchToProps = dispatch => bindActionCreators({ getUser }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
