var React = require('react'),
    Config = require('../../config'),
    mui = require('material-ui'),
    Router = require('react-router'),
    PostList = require('../postlist.jsx').PostList,
    HappBar = require('../happbar.jsx');

var Feed = React.createClass({
  mixins: [Router.Navigation],

  getInitialState: function() {
    return {data : []};
  },

  onPostFormSubmit : function (e) {
    e.preventDefault();
    e.stopPropagation();
    var action = H.toApiUrl(e.currentTarget.action),
        req = H.ajax({
          url : Config.api.url + action,
          form: e.currentTarget,
          credentials: true,
          type: 'json',
          success : function (res, req) {
            this.state.data.unshift(res);
            this.setState({data: this.state.data});
          }.bind(this),
          error : function (e) {
            console.log(arguments)
          }
        })
    req.send();
  },

  onNewPostClick : function (e) {},

  load : function () {
    var req = H.ajax({
          url : Config.api.url + '/me/feed',
          credentials: true,
          type: 'json',
          success : function (res, req) {
            this.setState({data : res.feed})
          }.bind(this),
          error : function (data, status, err) {
            console.log('error lors du chargement, redirection vers la home')
            this.transitionTo('/');
          }.bind(this)
        })
    req.send();
  },

  componentDidMount: function() {
    this.load();
    //setInterval(this.load, 2000);
  },

  render: function() {
    return (
      <PostList showForm={true} data={this.state.data} onPostFormSubmit={this.onPostFormSubmit} action="/me/feed/post/" avatar="images/avatar-not-found.gif"/>
    );
  }  
});

if (typeof module !== 'undefined')
  module.exports = Feed;