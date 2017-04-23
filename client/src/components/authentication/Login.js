import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import isEmail from 'validator/lib/isEmail';
import { Errors } from '../helpers';
import { RaisedButton } from 'material-ui';
import { loginUser } from '../../actions';
import styled from 'styled-components';
import { TextField } from 'redux-form-material-ui';

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

class Login extends Component {
    handleLogin(values) {
        const { reset } = this.props;
        return this.props.loginUser(values).catch(err => reset());
    }

    render() {
        const { handleSubmit, auth, push } = this.props;
        return (
            <Page>
                <Form onSubmit={handleSubmit(this.handleLogin.bind(this))} className="login-page--form">
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
                        <Field
                            name="password"
                            component={TextField}
                            style={{ width: '100%' }}
                            type="password"
                            hintText="Password"
                            floatingLabelText="Password"
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <RaisedButton type="submit" label="Login" primary={true} />
                        <RaisedButton label="Register" onClick={() => push('/register')} />
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

Login = reduxForm({
    form: 'login',
    validate
})(Login);

const mapStateToProps = state => ({ auth: state.auth });
const mapDispatchToProps = dispatch => bindActionCreators({ loginUser, push }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Login);
