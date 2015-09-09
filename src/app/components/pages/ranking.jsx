var React = require('react'),
    Config = require('../../config'),
    mui = require('material-ui'),
    DropDownMenu = mui.DropDownMenu,
    Paper = mui.Paper,
    Menu = mui.Menu,
    Tabs = mui.Tabs,
    Tab = mui.Tab,
    Router = require('react-router'),
    PostList = require('../postlist.jsx').PostList,
    HappBar = require('../happbar.jsx');


var Ranking = React.createClass({
  getInitialState: function() {
    return {
      data : [],
      order : { summary : ['sum', 'max', 'average'], activity : ['percent'] }
    };
  },

  getOrder : function (payload) {
    var oldState = this.state;
    switch (payload) {
      case '/max':
        return { summary : ['max', 'sum', 'average'], activity : ['percent'] }
      break;
      case '/average':
        return { summary : ['average', 'sum', 'max'], activity : ['percent'] }
      break;
      case '/activity':
        return { activity : ['percent'], summary : ['sum', 'max', 'average']}
      break;
      default :
        return { summary : ['sum', 'max', 'average'], activity : ['percent'] }
      break;
    }
  },

  load : function (type) {
    type = type || 'distance';
    var order = this.getOrder(type);
    var req = H.ajax({
          url : Config.api.url + '/ranking/' + type,
          credentials: true,
          type: 'json',
          success : function (res, req) {
            var oldState = this.state;
            oldState['data'] = res;
            oldState['order'] = order;
            this.setState(oldState)
          }.bind(this),
          error : function (data, status, err) {
            this.transitionTo('/');
          }.bind(this)
        })
    req.send();
  },

  componentDidMount: function() {
    this.props.appbar.setTitle('Classement');
    this.load(null);
  },

  _onMenuChange : function (evt, index, object) {
    this.load(object.payload);
  },

  getRankings : function () {
    var rankTitle = ['er', 'ème'],
        rankDesc = {sum : 'Distance ', average : 'Moy. ', max: 'Max ', percent : 'Actif '};

    return this.state.data.map(function (ranking, rank) {
      var value = [], data = this.state;
      for (var i in data.order) {
        for (var j in data.order[i]) {
          if (i == 'summary')
            value.push(<p className="value">{rankDesc[data.order[i][j]]} {H.converter.toKm(ranking[i][data.order[i][j]])}</p>)
          else
            value.push(<p className="value">{rankDesc[data.order[i][j]]} {Math.round(ranking[i][data.order[i][j]]*100)/100 + '%'}</p>)
        }
      }
      if (ranking.friend) {
        friend = ranking.friend
      }
      if (ranking.person) {
        friend = ranking.person
      }
      if (friend) {
        return (
            <Paper zDepth={1} className="card classement">
              <div className="content">
                <img src='images/avatar-not-found.gif' alt="avatar" className="avatar"/>
                <div>
                  <div className={'rank ' + 'rank-' + rank}>{(rank + 1) + rankTitle[rank > 0 ? 1 : 0]}</div>
                  <p className="author">{friend.firstname}&nbsp;{friend.name}</p>
                  {value}
                </div>
              </div>
            </Paper>
        );
      } 
    }.bind(this));
  },

  render : function () {
    var Rankings = this.getRankings();

    return (
      <div>
        <DropDownMenu menuItems={this.props.menuItems} onChange={this._onMenuChange}/>
        {Rankings}
      </div>
    );
  }

})

var Rankings = React.createClass({
  mixins: [Router.Navigation],

  getInitialState: function() {
    return {
      currentIndex : 0,
      tab : [{
          data : [],
          order : { summary : ['sum', 'max', 'average'], activity : ['percent'] }
        },{
          data : [],
          order : { summary : ['sum', 'max', 'average'], activity : ['percent'] }
        }]
    };
  },

  getOrder : function (payload) {
    var oldState = this.state;
    switch (payload) {
      case '/max':
        return { summary : ['max', 'sum', 'average'], activity : ['percent'] }
      break;
      case '/average':
        return { summary : ['average', 'sum', 'max'], activity : ['percent'] }
      break;
      case '/activity':
        return { activity : ['percent'], summary : ['sum', 'max', 'average']}
      break;
      default :
        return { summary : ['sum', 'max', 'average'], activity : ['percent'] }
      break;
    }
  },

  load : function (type, indexTab) {
    type = type || 'distance';
    var order = this.getOrder(type);
    var req = H.ajax({
          url : Config.api.url + '/ranking/' + type,
          credentials: true,
          type: 'json',
          success : function (res, req) {
            var oldState = this.state;
            oldState.tab[indexTab]['data'] = res;
            oldState.tab[indexTab]['order'] = order;
            oldState.currentIndex = indexTab;
            this.setState(oldState)
          }.bind(this),
          error : function (data, status, err) {
            this.transitionTo('/');
          }.bind(this)
        })
    req.send();
  },

  componentDidMount: function() {
    this.props.appbar.setTitle('Classement');
    //this.load(null, 0);
  },

  _onTabsChange : function (index, object) {
    /*var oldState = this.state;
    oldState.currentIndex = index;
    this.setState(oldState);*/
  },

  _onMenuChange : function (evt, index, object) {
    this.load(object.payload, 0);
  },

  _onMenuChange2 : function (evt, index, object) {
    this.load(object.payload, 1);
  },

  render: function() {

    var menuItems = [
      { payload: 'friends', text: 'Le plus loin' },
      { payload: 'friends/max', text: 'Le plus endurant' },
      { payload: 'friends/average', text: 'Le plus regulier' },
      { payload: 'friends/activity', text: 'Le sur-excite !' },
    ], menuItems2 = [
      { payload: 'distance', text: 'Le plus loin' },
      { payload: 'distance/max', text: 'Le plus endurant' },
      { payload: 'distance/average', text: 'Le plus regulier' },
      { payload: 'activity', text: 'Le sur-excite !' },
    ]

    return (
      <Tabs> 
        <Tab label="Mes Amis" > 
          <div className="tab-template-container"> 
            <h2 className="mui-font-style-headline">Tab One Template Example</h2> 
              <Ranking menuItems={menuItems}/>
          </div> 
        </Tab> 
        <Tab label="Tout le monde" > 
          <div className="tab-template-container"> 
            <h2 className="mui-font-style-headline">Tab Two Template Example</h2> 
              <Ranking menuItems={menuItems2}/>
          </div> 
        </Tab> 
      </Tabs>
    )
  }
});

if (typeof module !== 'undefined')
  module.exports = Rankings;
