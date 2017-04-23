import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import isEmail from 'validator/lib/isEmail';
import { Errors } from '../helpers';
import { RaisedButton, MenuItem } from 'material-ui';
import { registerUser } from '../../actions';
import styled from 'styled-components';
import { TextField, SelectField } from 'redux-form-material-ui';

const Page = styled.div`
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background-color: #00bcd4;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Form = styled.form`
    max-width: 360px;
    width: 100%;
    background-color: white;
    padding: 20px;
`;

const Heading = styled.div`
    display: flex;
    padding-top: 20px;
    justify-content: center;
    font-size: 20px;
`;

class Register extends Component {
    handleRegister(values) {
        const { reset } = this.props;
        return this.props.registerUser(values).catch(err => reset());
    }

    render() {
        const { handleSubmit, auth } = this.props;
        const roles = ['user', 'manager', 'admin'];
        return (
            <Page>
                <Form onSubmit={handleSubmit(this.handleRegister.bind(this))} className="register-page--form">
                    <Errors error={auth.error} />
                    <Heading>Timezone Management</Heading>
                    <div style={{ height: 90 }}>
                        <Field
                            name="email"
                            component={TextField}
                            style={{ width: '100%' }}
                            hintText="Email"
                            type="email"
                            floatingLabelText="Email"
                        />
                    </div>
                    <div style={{ height: 90 }}>
                        <Field name="role" style={{ width: '100%' }} component={SelectField} hintText="Role" floatingLabelText="Role">
                            {roles.map(role => <MenuItem key={role} value={role} primaryText={role} />)}
                        </Field>
                    </div>
                    <div style={{ height: 90 }}>
                        <Field
                            name="password"
                            component={TextField}
                            style={{ width: '100%' }}
                            type="password"
                            hintText="Password"
                            floatingLabelText="Password"
                        />
                    </div>
                    <div className="register-page--form--actions">
                        <RaisedButton type="submit" label="Register" primary={true} />
                    </div>
                </Form>
            </Page>
        );
    }
}

const validate = values => {
    const errors = {};
    if (!isEmail(values.email || '')) {
        errors.email = 'Not a valid email';
    }
    if (!values.password) {
        errors.password = 'Required';
    }
    return errors;
};

Register = reduxForm({
    form: 'register',
    validate
})(Register);

const mapStateToProps = state => ({ auth: state.auth });
const mapDispatchToProps = dispatch => bindActionCreators({ registerUser }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Register);
