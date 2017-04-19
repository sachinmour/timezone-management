import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { get } from 'lodash';
import { push } from 'react-router-redux';
import { IconMenu, Tabs, Tab, IconButton, MenuItem, Toolbar, ToolbarGroup } from 'material-ui';
import { ActionHome, SocialPeople, NavigationExpandMore } from 'material-ui/svg-icons';

const HeaderBar = ({ authenticated, user, push, path }) => {
    return (
        <Toolbar style={{ backgroundColor: '#00bcd4', height: '100%' }}>
            <ToolbarGroup style={{ flex: 1 }} firstChild={true}>
                <Tabs style={{ width: '100%' }} value={path}>
                    <Tab icon={<ActionHome />} label="HOME" value="/" onActive={() => push('/')} />
                    {authenticated && ['admin', 'manager'].includes(user.role)
                        ? <Tab icon={<SocialPeople />} label="USERS" value="/users" onActive={() => push('/users')} />
                        : null}
                </Tabs>
            </ToolbarGroup>
            <ToolbarGroup style={{ flex: 1, justifyContent: 'flex-end' }} lastChild={true}>
                <IconMenu
                    iconButtonElement={
                        <IconButton touch={true}>
                            <NavigationExpandMore />
                        </IconButton>
                    }
                >
                    <MenuItem primaryText="Logout" onClick={() => push('/logout')} />
                </IconMenu>
            </ToolbarGroup>
        </Toolbar>
    );
};

const mapStateToProps = state => ({
    authenticated: state.auth.authenticated,
    user: get(state, ['users', 'value', get(state, ['auth', 'user', '_id'])], {})
});

const mapDispatchToProps = dispatch => bindActionCreators({ push }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(HeaderBar);
