
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var Redirect = Router.Redirect;
var DefaultRoute = Router.DefaultRoute;

// Here we define all our material-ui ReactComponents.
//var Master = require('./components/master.jsx');
var Home = require('./components/pages/home.jsx'),
    Me = require('./components/templates/me.jsx'),
    Feed = require('./components/pages/feed.jsx');

/** Routes: https://github.com/rackt/react-router/blob/master/docs/api/components/Route.md
  * 
  * Routes are used to declare your view hierarchy.
  *
  * Say you go to http://www.hamsterace.com/#/me/feed
  * The react router will search for a route named 'me' and will recursively render its 
  * handler and its parent handler like so: Me > Feed > Master
  */

var AppRoutes = (
  <Route name="root" path="/" handler={Home}>
    <Route name="me" handler={Me}>
      <Route name="feed" handler={Feed} />
    </Route>
  </Route>
);

module.exports = AppRoutes;

