var React = require('react'),
    Router = require('react-router'),
    mui = require('material-ui'),
    ReactD3 = require('react-d3'),
    AreaChart = ReactD3.LineChart,
    Config = require('../../config'),

    PostList = require('../postlist.jsx').PostList,
    Post = require('../postlist.jsx').Post,
    HappBar = require('../happbar.jsx');

var StatsList = React.createClass({displayName: 'StatsList',
  render: function () {    
    var distanceStats = null,
        speedStats = null;

    if (this.props.data.distance) {
      this.props.data.distance.datas = this.props.data.distance.datas.slice(0, 40);
      var distanceStatsData = [{
            name : "distance en " + this.props.data.distance.units,
            values : null
          }];
      distanceStatsData[0].values = this.props.data.distance.datas.map(function (data) {
        return {
          x : new Date(data.createdAt),
          y : data.distance * 1000
        }
      });
      
      distanceStats = (
          <Post>
            <AreaChart
              data={distanceStatsData}
              width={1400}
              height={500}
              legend={true}
              xAxisTickInterval={{unit: 'hours', interval: 1}}  title="Distance"/>
          </Post>
        );
    }

    if (this.props.data.speed) {
      this.props.data.speed.datas = this.props.data.speed.datas.slice(0, 40);
      var speedStatsData = [{
            name : "vitesse en " + this.props.data.speed.units,
            values : null
          }];
      speedStatsData[0].values = this.props.data.speed.datas.map(function (data) {
        return {
          x : new Date(data.time),
          y : data.speed
        }
      });
      
      speedStats = (
          <Post>
            <AreaChart
              data={speedStatsData}
              width={1400}
              height={500}
              legend={true}
              xAxisTickInterval={{unit: 'hours', interval: 1}}  title="Vitesse"/>
          </Post>
        );
    }
    return (
      <section>
        {distanceStats}
        {speedStats}
      </section>
    )
  }
})

var Stats = React.createClass({displayName: 'Stats',
  getInitialState: function() {
    return {data : []};
  },

  load : function () {
    var req = H.ajax({
          url : Config.api.url + '/me/stats',
          credentials: true,
          type: 'json',
          success : function (res, req) {
            this.setState({data : res.stats})
          }.bind(this),
          error : function (data, status,err) {
            console.error(status, err.toString());
            this.transitionTo('/');
          }
        })
    req.send();
  },

  componentDidMount: function() {
    this.load();
  },

  render: function() {
    return (
      <section id="content">
        <HappBar
        title="Hamsterace > me > stats" 
        onClickHandler={this.onNewPostClick}/>
        <StatsList 
          data={this.state.data} 
          onPostFormSubmit={this.onPostFormSubmit} 
          action="/me/feed/post/" 
          avatar="images/avatar-not-found.gif"/>
      </section>
    );
  }  
});

if (typeof module !== 'undefined')
  module.exports = Stats;