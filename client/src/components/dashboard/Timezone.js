import React from 'react';
import { TableRow, TableRowColumn } from 'material-ui';
import moment from 'moment-timezone';
import { Clock } from './';
import { updateTimezone } from '../../actions';

const Timezone = ({ userId, timezoneId, name, timezone }) => {
    const utcOffset = moment().tz(timezone).format('Z');
    return (
        <TableRow>
            <TableRowColumn>{name}</TableRowColumn>
            <TableRowColumn>{timezone}</TableRowColumn>
            <TableRowColumn>{utcOffset}</TableRowColumn>
            <TableRowColumn><Clock timezone={timezone} /></TableRowColumn>
        </TableRow>
    );
};

export default Timezone;
