var React = require('react'),
    Config = require('../config'),
    mui = require('material-ui'),
    Router = require('react-router'),
    FlatButton = mui.FlatButton,
    TextField = mui.TextField,
    Paper = mui.Paper,
    FloatButton = mui.FloatingActionButton,
    IconButton = mui.IconButton,
    DropDownIcon = mui.DropDownIcon;

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
              <IconButton iconClassName="svg-ic_done_24px"/>
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
            <span className="date">{this.props.date}</span>
            <p className="value">{this.props.content}</p>
          </div>
      </div>
    );
  }
});

var CommentBox = React.createClass({
  render : function () {
    var CommentList = null;

    if (this.props.data && this.props.data.length) {
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
    return {
      comments: this.props.comments,
      actions : [
        { text: 'Supprimer'},
        { text: 'Cacher'},
      ]
    }
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
          }.bind(this)
        })
    req.send();
  },
  render: function () {
    var title = "",
        commentBox = ""

    if (this.props.title)
      title = <h1>{this.props.title}</h1>

    if (this.props.postId)
      commentBox = <CommentBox 
                      avatar='images/avatar-not-found.gif'
                      postId={this.props.postId}
                      data={this.state.comments} 
                      onCommentFormSubmit={this.handleCommentSubmit} 
                      key={'commentbox-' + this.props.postId}/>
    return (
      <article>
        <Paper zDepth={1} className={this.props.className || "card"}>
          {title}
          <div className="content">
            {this.props.children}
            <DropDownIcon iconClassName="svg-ic_more_vert_grey_24px" menuItems={this.state.actions} />
          </div>
          {commentBox}
        </Paper>
      </article>
    );
  }
})


var PostForm = React.createClass({
  render: function () {
    return (
      <Paper zDepth={1} className="card">
        <h1 className="comments">Quoi de neuf ?</h1>
        <div className="comments">
          <img src={this.props.avatar} alt="avatar" className="avatar"/>
          <div className="inline-form">
            <span className="author"></span>
            <form action={this.props.action} method="post" onSubmit={this.props.onPostFormSubmit}>
              <TextField
                name="content" 
                multiLine={true} />
              <IconButton iconClassName="svg-ic_done_24px"/>
            </form>
          </div>
        </div>
      </Paper>
    );
  }
})

var PostList = React.createClass({
  render: function () {
    var post = this.props.data.map(function (post) {
      var image = post.Person.Image ? 'images/' + post.Person.Image.resource : 'images/avatar-not-found.gif',
          key = 'post-' + post.id,
          updatedAt = new Date(post.updatedAt).toFrenchDate();

      return (
        <Post comments={post.Comments} 
              postId={post.id} 
              key={key}
              {...this.props}>
              <img src={image} alt="avatar" className="avatar"/>
              <div>
                <p className="author">{post.Person.PersonDetails[0].firstname} {post.Person.PersonDetails[0].name}</p>
                <p className="date">{updatedAt}</p>
                <p className="value">{post.content}</p>
              </div>
        </Post>
      );
    });

    var postForm = this.props.showForm ? <PostForm {...this.props}/> : null;

    return (
      <section>
        <article id="newPost">
          {postForm}
        </article>
        {post}
      </section>
    )
  }
})


if (typeof module !== 'undefined') {
  module.exports = {
    CommentForm : CommentForm,
    Comment : Comment,
    CommentBox : CommentBox,
    Post : Post,
    PostForm : PostForm,
    PostList : PostList
  }
  /*
  module.exports = CommentForm;
  module.exports = Comment;
  module.exports = CommentBox;
  module.exports = Post;
  module.exports = PostForm;
  module.exports = PostList;
  */
}

