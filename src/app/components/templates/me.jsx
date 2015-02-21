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
    return (
      <AppCanvas predefinedLayout={1} className="me">
        <LeftNav />
          <RouteHandler me={this.props.me} />
      </AppCanvas>
    );
  },
  _onMenuIconButtonTouchTap : function () {}
});

module.exports = Me;