import React from 'react';
import { TableRow, TableRowColumn, FloatingActionButton } from 'material-ui';
import { EditorModeEdit } from 'material-ui/svg-icons';
import moment from 'moment-timezone';
import { Clock } from './';

const Timezone = ({ name, timezone, switchTimezoneDialog }) => {
    const utcOffset = moment().tz(timezone).format('Z');
    return (
        <TableRow>
            <TableRowColumn>
                <FloatingActionButton mini={true} onClick={switchTimezoneDialog}>
                    <EditorModeEdit />
                </FloatingActionButton>
            </TableRowColumn>
            <TableRowColumn>{name}</TableRowColumn>
            <TableRowColumn>{timezone}</TableRowColumn>
            <TableRowColumn>{utcOffset}</TableRowColumn>
            <TableRowColumn><Clock timezone={timezone} /></TableRowColumn>
        </TableRow>
    );
};

export default Timezone;
