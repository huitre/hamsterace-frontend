var React = require('react');
    Router = require('react-router'),
    RouteHandler = Router.RouteHandler,

    mui = require('material-ui'),
    AppCanvas = mui.AppCanvas,
    LeftNav = require('../leftnav.jsx');

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