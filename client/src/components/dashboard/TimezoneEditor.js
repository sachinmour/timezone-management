import React from 'react';
import moment from 'moment-timezone';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import { reduxForm, Field } from 'redux-form';
import { TextField, AutoComplete } from 'redux-form-material-ui';
import { AutoComplete as MUIAutoComplete } from 'material-ui';
import { Dialog, RaisedButton } from 'material-ui';
import { get } from 'lodash';
import { bindActionCreators } from 'redux';
import { updateTimezone, createTimezone } from '../../actions';

let TimezoneEditor = (
    { open, userId, change, switchTimezoneDialog, updateTimezone, createTimezone, handleSubmit, initialValues, status, valid, formValues }
) => {
    const _id = get(initialValues, ['_id']);
    const timezoneValue = get(formValues, ['timezone']);
    let fieldTimezoneValue = '';
    if (timezoneValue) {
        fieldTimezoneValue = { text: `(${moment().tz(timezoneValue).format('Z')}) ${timezoneValue}` };
    }
    const changeTimezone = _id ? updateTimezone : createTimezone;
    const onSubmit = values => {
        const data = Object.assign({}, values);
        data.timezoneId = values._id;
        data.userId = userId;
        return changeTimezone(data).then(switchTimezoneDialog);
    };
    const timezoneOptions = moment.tz.names().map(zone => {
        const utcOffset = moment().tz(zone).format('Z');
        return {
            text: `(${utcOffset}) ${zone}`,
            value: zone
        };
    });
    const updateValue = (field, value) => {
        change(field, value);
    };
    const actions = [
        <RaisedButton
            style={{ marginRight: 10 }}
            label="Cancel"
            disabled={status.pending}
            primary={true}
            onTouchTap={switchTimezoneDialog}
        />,
        <RaisedButton
            label={_id ? 'Update' : 'Create'}
            disabled={status.pending || !valid}
            primary={true}
            keyboardFocused={true}
            onTouchTap={handleSubmit(onSubmit)}
        />
    ];
    return (
        <Dialog open={open} actions={actions} autoScrollBodyContent={true}>
            <Field name="name" component={TextField} hintText="Name" type="text" floatingLabelText="Name" />
            <Field
                name="timezone"
                component={AutoComplete}
                floatingLabelText="Timezone"
                openOnFocus
                filter={MUIAutoComplete.fuzzyFilter}
                dataSourceConfig={{ text: 'text', value: 'value' }}
                input={{
                    value: fieldTimezoneValue,
                    onChange: updateValue.bind(null, 'timezone')
                }}
                dataSource={timezoneOptions}
                maxSearchResults={5}
            />
        </Dialog>
    );
};

const validate = values => {
    const errors = {};
    if (!values.name || values.name.length < 1) {
        errors.name = 'Not a valid name';
    }
    if (!moment.tz.zone(get(values, ['timezone'] || ''))) {
        errors.timezone = 'Not a valid Timezone';
    }
    return errors;
};

TimezoneEditor = reduxForm({
    form: 'timezoneEditor',
    enableReinitialize: true,
    validate
})(TimezoneEditor);

const getTimezoneFromState = (state, props) => ({
    status: {
        pending: state.timezones.pending,
        success: state.timezones.success,
        error: state.timezones.error
    },
    initialValues: get(state.timezones.value, [props.userId], []).find(timezone => timezone._id === props.timezoneId),
    formValues: get(state, ['form', 'timezoneEditor', 'values'])
});
const getTimezone = createSelector([getTimezoneFromState], timezone => timezone || {});

const mapDispatchToProps = dispatch => bindActionCreators({ updateTimezone, createTimezone }, dispatch);

export default connect(getTimezone, mapDispatchToProps)(TimezoneEditor);
