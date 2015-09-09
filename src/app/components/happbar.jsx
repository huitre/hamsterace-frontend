var React = require('react'),
    mui = require('material-ui'),
    AppBar = mui.AppBar,
    DropDownIcon = mui.DropDownIcon,
    IconButton = mui.IconButton,
    FloatButton = mui.FloatingActionButton;


var HappBar = React.createClass({

  getInitialState : function () {
    return {
      title : ''
    }
  },

  setTitle : function (title) {
    this.setState({title: title});
  },

  onMenuChange: function (e) {
    
  },

  render: function () {
    var iconMenuItems = [
           { payload: '1', text: 'Se deconnecter'},
        ], mainAction;

    if (this.props.mainAction) {
      mainAction = <div id="mainAction">
        <FloatButton iconClassName="svg-ic_add_24px" onClick={this.props.onClickHandler}/>
      </div>
    } else {
      mainAction = <div/>
    }
  
    return (
        <AppBar showMenuIconButton={false}>
          <nav>
            <DropDownIcon iconClassName="svg-ic_more_vert_24px" menuItems={iconMenuItems} onChange={this.onMenuChange}/>
            <IconButton
              iconClassName="svg-ic_menu_24px" onClick={this.props.onMenuIconButtonTouchTap}/>
            <IconButton iconClassName="svg-ic_search_24px" />
          </nav>
          <h1>{this.state.title}</h1>
          {mainAction}
        </AppBar>
      );
  }
});

if (typeof module !== 'undefined')
  module.exports = HappBar;