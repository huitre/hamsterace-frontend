var React = require('react'),
    Router = require('react-router'),
    RouteHandler = Router.RouteHandler,

    mui = require('material-ui');

var AppBar = React.createClass({

  mixins: [Router.State],

  render: function() {
    return (
      <header>
        <nav class="top-nav">
          <div class="container">
            <div class="nav-wrapper"><a class="page-title">Navbar</a></div>
          </div>
        </nav>
        <div class="container"><a href="#" data-activates="nav-mobile" class="button-collapse top-nav full"><i class="mdi-navigation-menu"></i></a></div>
      </header>
    );
  }

});

module.exports = AppBar;