import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { TextField } from 'material-ui';
import { get } from 'lodash';
import { Table } from 'react-bootstrap';
import { TableHeader, TableBody, TableRow, TableHeaderColumn, FloatingActionButton } from 'material-ui';
import { ContentAdd } from 'material-ui/svg-icons';
import { Timezone } from './';
import { getTimezones } from '../../actions';

class Timezones extends Component {
    constructor(props) {
        super(props);
        this.state = {
            filteredTimezones: [],
            filterAgainst: ''
        };
    }

    componentDidMount() {
        const { getTimezones, userId } = this.props;
        getTimezones({ userId });
    }

    componentWillReceiveProps(nextProps) {
        const { timezones } = nextProps;
        const { filterAgainst } = this.state;
        const expression = new RegExp(`.*${filterAgainst}.*`, 'i');
        this.setState(() => ({
            filteredTimezones: timezones.filter(({ name }) => expression.test(name))
        }));
    }

    filter(filterAgainst) {
        const { timezones } = this.props;
        const expression = new RegExp(`.*${filterAgainst}.*`, 'i');
        this.setState(() => ({
            filterAgainst,
            filteredTimezones: timezones.filter(({ name }) => expression.test(name))
        }));
    }

    renderTimezones() {
        const { userId, switchTimezoneDialog, switchDeleteTimezoneDialog } = this.props;
        const { filteredTimezones } = this.state;
        return filteredTimezones.map(timezone => (
            <Timezone
                key={timezone._id}
                name={timezone.name}
                timezone={timezone.timezone}
                switchDeleteTimezoneDialog={() => switchDeleteTimezoneDialog(timezone._id, userId)}
                switchTimezoneDialog={() => switchTimezoneDialog(timezone._id, userId)}
                userId={userId}
                timezoneId={timezone._id}
            />
        ));
    }

    render() {
        const { switchTimezoneDialog, timezones, userId } = this.props;
        const { filterAgainst, filteredTimezones } = this.state;
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
                {timezones.length > 0
                    ? <div style={{ width: '100%' }}>
                          <TextField value={filterAgainst} type="text" name="filterTimezones" onChange={(e, value) => this.filter(value)} />
                      </div>
                    : null}
                {filteredTimezones.length > 0
                    ? <Table responsive>
                          {tableHead}
                          <TableBody>
                              {this.renderTimezones()}
                          </TableBody>
                      </Table>
                    : null}
                <FloatingActionButton className="AddTimezone" mini={true} onClick={() => switchTimezoneDialog(null, userId)}>
                    <ContentAdd />
                </FloatingActionButton>
            </div>
        );
    }
}

const mapStateToProps = (state, props) => ({ timezones: get(state, ['timezones', 'value', props.userId], []) });

const mapDispatchToProps = dispatch => bindActionCreators({ getTimezones }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Timezones);
