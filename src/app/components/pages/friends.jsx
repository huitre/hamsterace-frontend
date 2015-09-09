var React = require('react'),
    Config = require('../../config'),
    mui = require('material-ui'),
    Paper = mui.Paper,
    Router = require('react-router'),
    PostList = require('../postlist.jsx').PostList,
    HappBar = require('../happbar.jsx');


var Friends = React.createClass({
  mixins: [Router.Navigation],

  getInitialState: function() {
    return {data : []};
  },

  load : function () {
    var req = H.ajax({
          url : Config.api.url + '/me/friends',
          credentials: true,
          type: 'json',
          success : function (res, req) {
            this.setState({data : res})
          }.bind(this),
          error : function (data, status, err) {
            console.log('error lors du chargement, redirection vers la home')
            this.transitionTo('/');
          }.bind(this)
        })
    req.send();
  },

  componentDidMount: function() {
    this.props.appbar.setTitle('Mes amis');
    this.load();
  },

  render: function() {

    var friends = this.state.data.map(function (friend) {
      var image = 'images/avatar-not-found.gif',
          key = 'friend-' + friend.id,
          updatedAt = new Date(friend.updatedAt).toFrenchDate();

      return (
          <Paper zDepth={1} className="card small">
              <div className="content">
                <img src='images/avatar-not-found.gif' alt="avatar" className="avatar"/>
                <div>
                  <p className="author">{friend.firstname} {friend.name}</p>
                  <p className="date">{updatedAt}</p>
                  <p className="value">{friend.content}</p>
                  <button id={friend.id} >Supprimer</button>
                </div>
              </div>
          </Paper>
      );
    });

    return (
      <section>
        <article>
          {friends}
        </article>
      </section>
    );
  }  
});

if (typeof module !== 'undefined')
  module.exports = Friends;