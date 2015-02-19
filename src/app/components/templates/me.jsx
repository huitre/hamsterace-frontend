var React = require('react');
    Router = require('react-router'),
    RouteHandler = Router.RouteHandler,

    mui = require('material-ui'),
    //AppBar = require('../appbar.jsx'),
    LeftNav = require('../leftnav.jsx'),
    AppBar = mui.AppBar,
    AppCanvas = mui.AppCanvas,
    Menu = mui.Menu,
    IconButton = mui.IconButton,
    Toolbar = mui.Toolbar,
    ToolbarGroup = mui.ToolbarGroup,
    DropDownIcon = mui.DropDownIcon;

var Me = React.createClass({

  mixins: [Router.State, Router.Navigation],

  render: function () {
    
    var title = 'Hamsterace',
        iconMenuItems = [
           { payload: '1', text: 'Live Answer', icon: 'communication_phone', number: '10' },
           { payload: '2', text: 'Voicemail', icon: 'communication_voicemail',  number: '5' },
           { payload: '3', text: 'Starred', icon: 'action_stars', number: '3' },
           { payload: '4', text: 'Shared', icon: 'action_thumb_up',  number: '12' }
        ];

    return (
      <AppCanvas predefinedLayout={1} className="me">
        <LeftNav />
        <section id="content">

          <AppBar showMenuIconButton={false}>
            <nav>
              <DropDownIcon icon="navigation-more-vert" menuItems={iconMenuItems} />
              <IconButton
                className="mui-app-bar-navigation-icon-button"
                icon={ this.props.icon || "navigation-menu"}
                onTouchTap={this._onMenuIconButtonTouchTap} />
              <IconButton icon="action-search" />
            </nav>
            <h1>Hamsterace</h1>
            </AppBar>

          <RouteHandler />
        </section>
      </AppCanvas>
    );
  },
  _onMenuIconButtonTouchTap : function () {}
});

module.exports = Me;