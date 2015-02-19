/** In this file, we create a React component which incorporates components provided by material-ui */

var React = require('react'),
    Config = require('../../config'),
    mui = require('material-ui'),
    Router = require('react-router'),
    RaisedButton = mui.RaisedButton,
    FlatButton = mui.FlatButton,
    TextField = mui.TextField,
    Paper = mui.Paper,
    IconButton = mui.IconButton;


var PostList = React.createClass({
  render: function () {
    
    var post = this.props.data.map(function (post) {
      var image = post.Person.Image ? 'images/' + post.Person.Image.resource : 'images/avatar-not-found.gif',
          key = 'post-' + post.id;
      return (
        <Post avatar={image}
              author={post.Person.PersonDetails[0]} 
              date={post.updatedAt} 
              content={post.content} 
              comments={post.Comments} 
              postId={post.id} 
              key={key} />
      );
    });
    return (
      <section>
        {post}
      </section>
    )
  }
})

var Stats = React.createClass({
  getInitialState: function() {
    return {data : []};
  },

  load : function () {
    var req = H.ajax({
          url : Config.api.url + '/me/stats',
          credentials: true,
          type: 'json',
          success : function (res, req) {
            var response = JSON.parse(req.response);
            this.setState({data : response.feed})
          }.bind(this),
          error : function (data, status,err) {
            console.error(status, err.toString());
          }
        })
    req.send();
  },

  componentDidMount: function() {
    this.load();
  },

  render: function() {
    return (
      <PostList data={this.state.data}/>
    );
  }  
});

module.exports = Stats;