var React = require('react');
    Router = require('react-router'),
    RouteHandler = Router.RouteHandler,

    mui = require('material-ui');

var Avatar = React.createClass({

  mixins: [Router.State, Router.Navigation],

  render: function() {
    
    var title = 'Hamsterace';

    return (
      <div/>
    );
  }
});

module.exports = Avatar;