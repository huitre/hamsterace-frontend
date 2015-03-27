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



var Card = React.createClass({
  getInitialState : function () {
    return {
      actions : [
        { text: 'Supprimer'},
        { text: 'Cacher'},
      ]
    }
  },

  render: function () {
    var title = "",
        commentBox = ""

    if (this.props.title)
      title = <h1>{this.props.title}</h1>


    return (
      <article>
        <Paper zDepth={1} className={"card"}>
          {title}
          <div>
            {this.props.children}
            <DropDownIcon iconClassName="svg-ic_more_vert_grey_24px" menuItems={this.state.actions} />
          </div>
        </Paper>
      </article>
    );
  }
})


if (typeof module !== 'undefined') {
  module.exports = Card
}

