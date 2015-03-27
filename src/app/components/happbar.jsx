var React = require('react'),
    mui = require('material-ui'),
    AppBar = mui.AppBar,
    DropDownIcon = mui.DropDownIcon,
    IconButton = mui.IconButton,
    FloatButton = mui.FloatingActionButton;


var HappBar = React.createClass({
  onMenuChange: function (e) {
    console.log(e)
  },
  render: function () {
    console.log(this.refs)
    var iconMenuItems = [
           { payload: '1', text: 'Se deconnecter'},
        ];
    return (
        <AppBar showMenuIconButton={false}>
          <nav>
            <DropDownIcon iconClassName="svg-ic_more_vert_24px" menuItems={iconMenuItems} onChange={this.onMenuChange}/>
            <IconButton
              iconClassName="svg-ic_menu_24px" onClick={this.props.onMenuIconButtonTouchTap}/>
            <IconButton iconClassName="svg-ic_search_24px" />
          </nav>
          <h1>{this.props.title}</h1>
          <div id="mainAction">
            <FloatButton iconClassName="svg-ic_add_24px" onClick={this.props.onClickHandler}/>
          </div>
        </AppBar>
      );
  }
});

if (typeof module !== 'undefined')
  module.exports = HappBar;