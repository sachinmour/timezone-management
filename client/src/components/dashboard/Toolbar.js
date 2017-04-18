import React from 'react';
import { IconMenu, Tabs, Tab } from 'material-ui';
import IconButton from 'material-ui/IconButton';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { push } from 'react-router-redux';
import { ActionHome, SocialPeople } from 'material-ui/svg-icons';
import NavigationExpandMoreIcon from 'material-ui/svg-icons/navigation/expand-more';
import MenuItem from 'material-ui/MenuItem';
import { Toolbar, ToolbarGroup } from 'material-ui/Toolbar';

const HeaderBar = ({ auth, push }) => {
    return (
        <Toolbar style={{ backgroundColor: '#00bcd4', height: '100%' }}>
            <ToolbarGroup style={{ flex: 1 }}>
                <Tabs style={{ width: '100%' }}>
                    <Tab icon={<ActionHome />} label="HOME" onActive={() => push('/')} />
                    {auth.authenticated && ['admin', 'manager'].includes(auth.user.role)
                        ? <Tab icon={<SocialPeople />} label="USERS" onActive={() => push('/users')} />
                        : null}
                </Tabs>
            </ToolbarGroup>
            <ToolbarGroup style={{ flex: 1, justifyContent: 'flex-end' }}>
                <IconMenu
                    iconButtonElement={
                        <IconButton touch={true}>
                            <NavigationExpandMoreIcon />
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
    auth: state.auth
});

const mapDispatchToProps = dispatch => bindActionCreators({push}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(HeaderBar);
