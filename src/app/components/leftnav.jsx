var React = require('react'),
  Router = require('react-router'),
  mui = require('material-ui'),
  Avatar = require('./avatar.jsx'),

  menuItems = [
    { type: mui.MenuItem.Types.SUBHEADER, text: 'Navigation' },
    { route: '/me/', text: 'Mon Profil' },
    { route: '/me/feed', text: 'Mes Actus' },
    { route: '/me/stats', text: 'Mes Statistiques' },
    { route: '/me/friends', text: 'Mes Amis' },
    { route: '/me/badges', text: 'Mes Badges' },
    { route: '/me/guild', text: 'Ma guilde' }
  ];

var LeftNav = React.createClass({

  mixins: [Router.Navigation, Router.State],

  getInitialState: function() {
    return {
      selectedIndex: null
    };
  },

  render: function() {
    var header = <Avatar/>;

    return (
      <mui.LeftNav 
        ref="leftNav"
        docked={false}
        isInitiallyOpen={false}
        header={header}
        menuItems={menuItems}
        selectedIndex={this._getSelectedIndex()}
        onChange={this._onLeftNavChange} />
    );
  },

  toggle: function() {
    this.refs.leftNav.toggle();
  },

  _getSelectedIndex: function() {
    var currentItem;

    for (var i = menuItems.length - 1; i >= 0; i--) {
      currentItem = menuItems[i];
      if (currentItem.route && this.isActive(currentItem.route)) return i;
    };
  },

  _onLeftNavChange: function(e, key, payload) {
    this.transitionTo(payload.route);
  },

  _onHeaderClick: function() {
    this.refs.leftNav.close();
  }

});

module.exports = LeftNav;
