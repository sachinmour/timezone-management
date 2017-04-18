import { Component } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { LOGOUT } from '../../actions/types';

class Logout extends Component {
    componentDidMount() {
        const { dispatch, push } = this.props;
        dispatch({
            type: LOGOUT
        });
        push('/login');
    }

    render() {
        return null;
    }
}

const mapDispatchToProps = dispatch => ({ dispatch, push: route => dispatch(push(route)) });

export default connect(null, mapDispatchToProps)(Logout);
