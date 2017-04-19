import React, { Component } from 'react';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { bindActionCreators } from 'redux';
import { User } from './';
import { getUser } from '../../actions';

class Home extends Component {
    componentWillMount() {
        const { getUser, _id } = this.props;
        getUser(_id);
    }

    render() {
        const { _id } = this.props;
        return <User allowed={true} expandable={true} _id={_id} />;
    }
}

const mapStateToProps = state => ({
    _id: get(state, ['auth', 'user', '_id'])
});

const mapDispatchToProps = dispatch => bindActionCreators({ getUser }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Home);
