import React from 'react';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { Card, CardActions, CardHeader, CardText, RaisedButton } from 'material-ui';
import { get } from 'lodash';
import { Timezones } from './';
import { Authenticated } from '../authentication';

const User = (
    {
        authId,
        email,
        _id,
        role,
        allowed = false,
        expandable,
        switchTimezoneDialog,
        switchUserDialog,
        switchDeleteUserDialog,
        switchDeleteTimezoneDialog
    }
) => {
    if (!email) return null;
    return (
        <Card expandable={expandable} className="User">
            <CardHeader title={email} subtitle={role} actAsExpander={expandable} showExpandableButton={expandable} />
            <CardActions>
                <RaisedButton className="EditUser" label="Edit" primary={true} onClick={() => switchUserDialog(_id)} />
                {_id !== authId ? <RaisedButton label="Delete" secondary={true} onClick={() => switchDeleteUserDialog(_id)} /> : null}
            </CardActions>
            <CardText expandable={true}>
                {allowed
                    ? <Timezones
                          switchDeleteTimezoneDialog={(timezoneId, userId) => switchDeleteTimezoneDialog(timezoneId, userId)}
                          switchTimezoneDialog={(timezoneId, userId) => switchTimezoneDialog(timezoneId, userId)}
                          userId={_id}
                      />
                    : <Authenticated
                          Component={Timezones}
                          switchTimezoneDialog={(timezoneId, userId) => switchTimezoneDialog(timezoneId, userId)}
                          switchDeleteTimezoneDialog={(timezoneId, userId) => switchDeleteTimezoneDialog(timezoneId, userId)}
                          access={['admin']}
                          userId={_id}
                      />}
            </CardText>
        </Card>
    );
};

const getUserFromState = (state, props) => state.users.value[props._id];
const getIdFromAuth = state => get(state, ['auth', 'user', '_id']);
const getUser = createSelector([getUserFromState, getIdFromAuth], (user, authId) => ({ ...user, authId } || {}));

export default connect(getUser)(User);
