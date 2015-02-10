/** In this file, we create a React component which incorporates components provided by material-ui */

var React = require('react'),
    Config = require('../../config'),
    mui = require('material-ui'),
    Router = require('react-router'),
    RaisedButton = mui.RaisedButton,
    FlatButton = mui.FlatButton,
    TextField = mui.TextField,
    Paper = mui.Paper;


var Comment = React.createClass({
  getInitialState : function () {
    return {}
  },

  componentDidMount : function () {

  },
  
  render: function () {
    return (
      <Paper zDepth={2}>
        <div className="avatar">
          <img src="" alt="avatar"/>
        </div>
        <div className="content">
          {this.props.content}
        </div>
        <div className="date">
          {this.props.date}
        </div>
        <FlatButton label="reply"/>
      </Paper>
    );
  }
})

var Post = React.createClass({
  getInitialState : function () {
    return {}
  },

  render: function () {
    return (
      <article>
      <Paper zDepth={1} className="post">
        <div>
          <div className="avatar">
            <img src="data:image/jpeg;base64,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" alt="avatar"/>
          </div>
          <span className="name">{this.props.author}</span>
        </div>
        <div className="content">
          {this.props.content}
        </div>
        <div className="date">
          {this.props.date}
        </div>
        <FlatButton label="reply"/>
      </Paper>
      <Paper zDepth={2} className="comment">
        {this.props.comment}
      </Paper>
      </article>
    );
  }
})


var PostList = React.createClass({
  render: function () {
    var post = this.props.data.map(function (post) {
      console.log(post);
      return (
        <Post author={post.PersonId} 
              date={post.updatedAt} 
              content={post.content} 
              comment={post.comment} />
      );
    });
    return (
      <section>
        {post}
      </section>
    )
  }
})

var Feed = React.createClass({
  
  mixins : [Router.state, Router.Navigation],

  getInitialState: function() {
    return {data : []};
  },

  load : function () {
    var req = ajax({
          url : Config.api.url + '/me/feed',
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

module.exports = Feed;