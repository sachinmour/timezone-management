import React from 'react';
import { connect } from 'react-redux';
import { Dialog, RaisedButton } from 'material-ui';
import { bindActionCreators } from 'redux';
import { deleteTimezone } from '../../actions';

let DeleteTimezone = ({ open, switchDeleteTimezoneDialog, deleteTimezone, status, timezoneId, userId }) => {
    const actions = [
        <RaisedButton
            style={{ marginRight: 10 }}
            keyboardFocused={true}
            label="Cancel"
            disabled={status.pending}
            secondary={true}
            onTouchTap={switchDeleteTimezoneDialog}
        />,
        <RaisedButton
            label="Delete"
            disabled={status.pending}
            primary={true}
            onTouchTap={() => deleteTimezone({ timezoneId, userId }).then(switchDeleteTimezoneDialog)}
        />
    ];
    return (
        <Dialog open={open} actions={actions} autoScrollBodyContent={true}>
            Delete Timezone ?
        </Dialog>
    );
};

const mapStateToProps = state => ({
    status: { pending: state.timezones.pending }
});

const mapDispatchToProps = dispatch => bindActionCreators({ deleteTimezone }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DeleteTimezone);
