import React from 'react';
import { connect } from 'react-redux';
import isEmail from 'validator/lib/isEmail';
import { createSelector } from 'reselect';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import { TextField, SelectField } from 'redux-form-material-ui';
import { Dialog, RaisedButton, MenuItem } from 'material-ui';
import { get } from 'lodash';
import { bindActionCreators } from 'redux';
import { updateUser, createUser } from '../../actions';

let UserEditor = ({ open, switchUserDialog, updateUser, createUser, handleSubmit, initialValues, status, reset, valid }) => {
    const _id = get(initialValues, ['_id']);
    const changeUser = _id ? updateUser : createUser;
    const onSubmit = values => {
        if (!_id && (!values.password || values.password.length < 1)) {
            return Promise.reject(new SubmissionError({ password: 'Required' }));
        }
        return changeUser(values).then(() => {
            reset();
            switchUserDialog();
        });
    };
    const roles = ['user', 'manager', 'admin'];
    const actions = [
        <RaisedButton style={{ marginRight: 10 }} label="Cancel" disabled={status.pending} primary={true} onTouchTap={switchUserDialog} />,
        <RaisedButton
            label={_id ? 'Update' : 'Create'}
            disabled={status.pending}
            primary={true}
            keyboardFocused={true}
            onTouchTap={handleSubmit(onSubmit)}
        />
    ];
    return (
        <Dialog open={open} actions={actions} autoScrollBodyContent={true}>
            <Field name="email" component={TextField} hintText="Email" type="email" floatingLabelText="Email" />
            <Field name="role" component={SelectField} hintText="Role" floatingLabelText="Role">
                {roles.map(role => <MenuItem key={role} value={role} primaryText={role} />)}
            </Field>
            <Field name="password" component={TextField} type="password" hintText="Password" floatingLabelText="Password" />
        </Dialog>
    );
};

const validate = values => {
    const errors = {};
    if (!isEmail(values.email || '')) {
        errors.email = 'Not a valid email';
    }
    if (!values.role) {
        errors.role = 'Required';
    }
    return errors;
};

UserEditor = reduxForm({
    form: 'userEditor',
    enableReinitialize: true,
    validate
})(UserEditor);

const getUserFromState = (state, props) => ({
    status: {
        pending: state.users.pending
    },
    initialValues: state.users.value[props._id]
});
const getUser = createSelector([getUserFromState], user => user || {});

const mapDispatchToProps = dispatch => bindActionCreators({ updateUser, createUser }, dispatch);

export default connect(getUser, mapDispatchToProps)(UserEditor);
