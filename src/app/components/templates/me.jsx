var React = require('react');
    Router = require('react-router'),
    RouteHandler = Router.RouteHandler,

    mui = require('material-ui'),
    AppCanvas = mui.AppCanvas,
    LeftNav = require('../leftnav.jsx'),
    HappBar = require('../happbar.jsx');

var Me = React.createClass({

  mixins: [Router.State, Router.Navigation],

  render: function () {
    console.log('Me.jsx.render', this)
    return (
      <AppCanvas predefinedLayout={1} className="me">
        <section id="content">
          <LeftNav ref="leftnav"/>
          <HappBar
            ref="appbar" 
            onMenuIconButtonTouchTap={this._onMenuIconButtonTouchTap} />
            <RouteHandler 
              me={this.props.me} 
              appbar={this.refs.appbar} 
              leftnav={this.refs.leftnav} />
        </section>
      </AppCanvas>
    );
  },

  _onMenuIconButtonTouchTap: function() {
    if (this.refs.leftnav)
      this.refs.leftnav.toggle()
  }
});

module.exports = Me;