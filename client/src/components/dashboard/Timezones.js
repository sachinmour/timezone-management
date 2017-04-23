import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { get } from 'lodash';
import { Table } from 'react-bootstrap';
import { TableHeader, TableBody, TableRow, TableHeaderColumn, FloatingActionButton } from 'material-ui';
import { ContentAdd } from 'material-ui/svg-icons';
import { Timezone } from './';
import { getTimezones } from '../../actions';

class Timezones extends Component {
    componentDidMount() {
        const { getTimezones, userId } = this.props;
        getTimezones({ userId });
    }

    renderTimezones() {
        const { timezones, userId, switchTimezoneDialog } = this.props;
        return timezones.map(timezone => (
            <Timezone
                key={timezone._id}
                name={timezone.name}
                timezone={timezone.timezone}
                switchTimezoneDialog={() => switchTimezoneDialog(timezone._id, userId)}
                userId={userId}
                timezoneId={timezone._id}
            />
        ));
    }

    render() {
        const { switchTimezoneDialog } = this.props;
        const tableHead = (
            <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                <TableRow>
                    <TableHeaderColumn />
                    <TableHeaderColumn>Name</TableHeaderColumn>
                    <TableHeaderColumn>Timezone</TableHeaderColumn>
                    <TableHeaderColumn>UTC Difference</TableHeaderColumn>
                    <TableHeaderColumn>Current Time</TableHeaderColumn>
                </TableRow>
            </TableHeader>
        );
        return (
            <div>
                <Table responsive>
                    {tableHead}
                    <TableBody>
                        {this.renderTimezones()}
                    </TableBody>
                </Table>
                <FloatingActionButton mini={true} onClick={() => switchTimezoneDialog()}>
                    <ContentAdd />
                </FloatingActionButton>
            </div>
        );
    }
}

const mapStateToProps = (state, props) => ({ timezones: get(state, ['timezones', 'value', props.userId], []) });

const mapDispatchToProps = dispatch => bindActionCreators({ getTimezones }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Timezones);
