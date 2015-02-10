var React = require('react');
    Router = require('react-router'),
    RouteHandler = Router.RouteHandler,

    mui = require('material-ui'),
    AppBar = require('./components/headerbar.jsx'),
    AppCanvas = mui.AppCanvas,
    Menu = mui.Menu,
    IconButton = mui.IconButton;

var ScrollSpy = React.createClass({

  mixins: [Router.State],

  getInitialState = function () {
    return {
        viewport: window.document.documentElement,
        enter: 'bottom'
    }
  }
  
  render: function() {},
  
  getViewportH: function() {
    var client = this.config.viewport[ 'clientHeight' ],
        inner  = window[ 'innerHeight' ]

    if ( this.config.viewport == window.document.documentElement ) {
      return ( client < inner ) ? inner : client
    }
    return client
  },

  scrollY: function() {
    if ( this.config.viewport == window.document.documentElement ) return window.pageYOffset
    return this.config.viewport.scrollTop + this.config.viewport.offsetTop
  },

  getOffset: function( el ) {
    var offsetTop  = 0
      , offsetLeft = 0

    do {

      if ( !isNaN( el.offsetTop  )) offsetTop  += el.offsetTop
      if ( !isNaN( el.offsetLeft )) offsetLeft += el.offsetLeft

    } while ( el = el.offsetParent )

    return {
      top: offsetTop,
      left: offsetLeft
    }
  },

  isElemInViewport: function( elem ) {
    var elHeight = elem.domEl.offsetHeight
      , elTop    = this.getOffset( elem.domEl ).top
      , elBottom = elTop + elHeight
      , vFactor  = elem.config.vFactor || 0

    return ( elTop + elHeight * vFactor < this.scrolled + this.getViewportH() )
        && ( elBottom - elHeight * vFactor > this.scrolled )
        || ( elem.domEl.currentStyle ? elem.domEl.currentStyle : window.getComputedStyle( elem.domEl, null ) ).position == 'fixed'
  }
})

module.exports = ScrollSpy;