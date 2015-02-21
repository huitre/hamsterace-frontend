/** In this file, we create a React component which incorporates components provided by material-ui */

var React = require('react'),
    Config = require('../../config'),
    mui = require('material-ui'),
    Router = require('react-router'),
//    RaisedButton = mui.RaisedButton,
    FlatButton = mui.FlatButton,
    TextField = mui.TextField,
    Paper = mui.Paper,
    FloatButton = mui.FloatingActionButton,
    IconButton = mui.IconButton;


var CommentForm = React.createClass({
  render: function () {
    return (
      <div className="comments">
          <img src={this.props.avatar} alt="avatar" className="avatar"/>
          <div className="inline-form">
            <span className="author">{this.props.author.firstname} {this.props.author.name}</span>
            <form action={this.props.action} method="post" onSubmit={this.props.onCommentFormSubmit}>
              <TextField
                name="content" 
                multiLine={true} />
              <IconButton icon="action-done"/>
            </form>
          </div>
      </div>
    );
  }
});

var Comment = React.createClass({
  render: function () {
    return (
      <div className="comments">
          <img src={this.props.avatar} alt="avatar" className="avatar"/>
          <div>
            <span className="author">{this.props.author.firstname} {this.props.author.name}</span>
            <p className="value">{this.props.content}</p>
            <p className="date">
            {this.props.date}
            </p>
          </div>
      </div>
    );
  }
});

var CommentBox = React.createClass({
  render : function () {
    var CommentList = null;

    if (this.props.data.length) {
      CommentList = this.props.data.map(function (post) {
        var updatedAt = new Date(post.updatedAt).toFrenchDate(),
            image = post.Person ? post.Person.Image ? 'images/' + post.Person.Image.resource : 'images/avatar-not-found.gif' : 'images/avatar-not-found.gif',
            author = post.Person ? post.Person.PersonDetails[0] : '',
            key = 'comment-' + post.id;

        return (
            <Comment 
              avatar={image}
              author={author} 
              date={updatedAt} 
              content={post.content}
              key={key} />
        );
      });
    }
    return (
      <div>
        {CommentList}
        <CommentForm
              avatar={this.props.avatar} 
              author="TODO"
              action="me/feed/comment/"
              postId={this.props.postId}
              onCommentFormSubmit={this.props.onCommentFormSubmit} />
      </div>
    );
  }
});

var Post = React.createClass({
  getInitialState : function () {
    return {comments: this.props.comments}
  },

  handleCommentSubmit : function (e) {
    e.preventDefault();
    e.stopPropagation();
    var action = H.toApiUrl(e.currentTarget.action),
        req = H.ajax({
          url : Config.api.url + action + this.props.postId,
          form: e.currentTarget,
          credentials: true,
          type: 'json',
          success : function (res, req) {
            this.setState({comments: this.state.comments.concat([res])});
          }.bind(this),
          error : function (e) {
            console.log(e);
          }
        })
    req.send();
  },
  render: function () {
    var updatedAt = new Date(this.props.date).toFrenchDate(), self = this;
    return (
      <article>
        <Paper zDepth={1} className="card">
          <div className="content">
            <img src={this.props.avatar} alt="avatar" className="avatar"/>
            <div>
              <p className="author">{this.props.author.firstname} {this.props.author.name}</p>
              <p className="date">{updatedAt}</p>
              <p className="value">{this.props.content}</p>
            </div>
          </div>
          <CommentBox 
            avatar='images/avatar-not-found.gif'
            postId={this.props.postId}
            data={this.state.comments} 
            onCommentFormSubmit={this.handleCommentSubmit} 
            key={'commentbox-' + this.props.postId}/>
        </Paper>
      </article>
    );
  }
})


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
        <div className="comments">
          <img src={this.props.avatar} alt="avatar" className="avatar"/>
          <div className="inline-form">
            <span className="author"></span>
            <form action={this.props.action} method="post" onSubmit={this.props.onPostFormSubmit}>
              <TextField
                name="content" 
                multiLine={true} />
              <IconButton icon="action-done"/>
            </form>
          </div>
        </div>
        {post}
      </section>
    )
  }
})

var Feed = React.createClass({
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

  load : function () {
    var req = H.ajax({
          url : Config.api.url + '/me/feed',
          credentials: true,
          type: 'json',
          success : function (res, req) {
            this.setState({data : res.feed})
          }.bind(this),
          error : function (data, status,err) {
            console.error(status, err.toString());
          }
        })
    req.send();
  },

  componentDidMount: function() {
    this.load();
    //setInterval(this.load, 2000);
  },

  render: function() {
    var title = 'Hamsterace',
        iconMenuItems = [
           { payload: '1', text: 'Live Answer', icon: 'communication_phone', number: '10' },
           { payload: '2', text: 'Voicemail', icon: 'communication_voicemail',  number: '5' },
           { payload: '3', text: 'Starred', icon: 'action_stars', number: '3' },
           { payload: '4', text: 'Shared', icon: 'action_thumb_up',  number: '12' }
        ];
    return (
      <section id="content">
        <AppBar showMenuIconButton={false}>
          <nav>
            <DropDownIcon icon="navigation-more-vert" menuItems={iconMenuItems} />
            <IconButton
              className="mui-app-bar-navigation-icon-button"
              icon={ this.props.icon || "navigation-menu"}
              onTouchTap={this._onMenuIconButtonTouchTap} />
            <IconButton icon="action-search" />
          </nav>
          <h1>Hamsterace > me > feed</h1>
          <div id="mainAction">
            <FloatButton iconClassName="mui-app-bar-navigation-icon-button" onClick={this.onNewPostClickHandler}/>
          </div>
        </AppBar>
        <PostList data={this.state.data} onPostFormSubmit={this.onPostFormSubmit} action="/me/feed/post/"/>
      </section>
    );
  }  
});
 
module.exports = Feed;