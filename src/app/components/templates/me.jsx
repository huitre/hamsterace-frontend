var React = require('react');
    Router = require('react-router'),
    RouteHandler = Router.RouteHandler,

    mui = require('material-ui'),
    AppBar = require('../appbar.jsx'),
    LeftNav = require('../leftnav.jsx'),
    AppBar = mui.AppBar,
    AppCanvas = mui.AppCanvas,
    Menu = mui.Menu,
    IconButton = mui.IconButton;

var Me = React.createClass({

  mixins: [Router.State, Router.Navigation],

  render: function() {
    
    var title = 'Hamsterace';

    return (
      <AppCanvas predefinedLayout={1} className="me">
        <LeftNav />
        <section id="content">
          <AppBar
            className="mui-dark-theme"
            title={title}
            zDepth={0}>
          </AppBar>

          <RouteHandler />
        </section>
      </AppCanvas>
    );
  }
});

module.exports = Me;