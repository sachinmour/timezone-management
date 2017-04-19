import React from 'react';
import { createSelector } from 'reselect';
import { connect } from 'react-redux';
import { Card, CardActions, CardHeader, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import { Timezones } from './';
import { Authenticated } from '../authentication';

const User = ({ email, _id, role, allowed = false, expandable }) => {
    if (!email) return null;
    return (
        <Card expandable={expandable}>
            <CardHeader title={email} subtitle={role} actAsExpander={expandable} showExpandableButton={expandable} />
            <CardActions>
                <FlatButton label="Edit" />
                <FlatButton label="Delete" />
            </CardActions>
            <CardText expandable={true}>
                {allowed ? <Timezones userId={_id} /> : <Authenticated Component={Timezones} access={['admin']} userId={_id} />}
            </CardText>
        </Card>
    );
};

const getUserFromState = (state, props) => state.users.value[props._id];
const getUser = createSelector([getUserFromState], user => user || {});

export default connect(getUser)(User);
