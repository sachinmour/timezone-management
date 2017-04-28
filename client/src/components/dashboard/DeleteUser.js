import React from 'react';
import { connect } from 'react-redux';
import { Dialog, RaisedButton } from 'material-ui';
import { bindActionCreators } from 'redux';
import { deleteUser } from '../../actions';

let DeleteUser = ({ open, switchDeleteUserDialog, deleteUser, status, _id }) => {
    const actions = [
        <RaisedButton
            style={{ marginRight: 10 }}
            keyboardFocused={true}
            label="Cancel"
            disabled={status.pending}
            secondary={true}
            onTouchTap={switchDeleteUserDialog}
        />,
        <RaisedButton
            label="Delete"
            className="DeleteUserClick"
            disabled={status.pending}
            primary={true}
            onTouchTap={() => deleteUser({ userId: _id }).then(switchDeleteUserDialog)}
        />
    ];
    return (
        <Dialog open={open} actions={actions} autoScrollBodyContent={true}>
            Delete User ?
        </Dialog>
    );
};

const mapStateToProps = state => ({
    status: { pending: state.users.pending }
});

const mapDispatchToProps = dispatch => bindActionCreators({ deleteUser }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DeleteUser);
