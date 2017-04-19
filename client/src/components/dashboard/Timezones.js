import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { sortBy, get } from 'lodash';
import { Table, TableHeader, TableBody, TableRow, TableHeaderColumn } from 'material-ui';
import { Timezone } from './';
import { getTimezones } from '../../actions';

class Timezones extends Component {
    componentDidMount() {
        const { getTimezones, userId } = this.props;
        getTimezones({ userId });
    }

    renderTimezones() {
        const { timezones, userId } = this.props;
        return sortBy(timezones, zone => zone.name).map(timezone => (
            <Timezone key={timezone._id} name={timezone.name} timezone={timezone.timezone} userId={userId} timezoneId={timezone._id} />
        ));
    }

    render() {
        const tableHead = (
            <TableHeader>
                <TableRow>
                    <TableHeaderColumn>Name</TableHeaderColumn>
                    <TableHeaderColumn>Timezone</TableHeaderColumn>
                    <TableHeaderColumn>UTC Difference</TableHeaderColumn>
                    <TableHeaderColumn>Current Time</TableHeaderColumn>
                </TableRow>
            </TableHeader>
        );
        return (
            <div>
                <Table>
                    {tableHead}
                    <TableBody>
                        {this.renderTimezones()}
                    </TableBody>
                </Table>
            </div>
        );
    }
}

const mapStateToProps = (state, props) => ({ timezones: get(state, ['timezones', 'value', props.userId], []) });

const mapDispatchToProps = dispatch => bindActionCreators({ getTimezones }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Timezones);
