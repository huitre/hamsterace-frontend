var React = require('react'),
    Router = require('react-router'),
    mui = require('material-ui'),
    LineChart = require('../charts/linechart.jsx'),
    Config = require('../../config'),

    PostList = require('../postlist.jsx').PostList,
    Post = require('../postlist.jsx').Post,
    HappBar = require('../happbar.jsx');

var StatsList = React.createClass({displayName: 'StatsList',

  // Display a zoomable line chart with distance values
  renderSpeed : function (data) {
    if (data.speed) {
      //this.props.data.speed.datas = data.speed.datas.slice(0, 40);
      var speedStatsData = [{
            name : "vitesse en " + data.speed.units,
            values : null
          }];
      speedStatsData[0].values = data.speed.data.map(function (data) {
        return {
          x : new Date(data.time),
          y : data.speed
        }
      });
      
      speedStats = (
          <Post>
            <LineChart
              data={speedStatsData}
              width={1200}
              height={500}
              legend={true}
              xAxisTickInterval={{unit: 'minutes', interval: 1}}  title="Vitesse"/>
          </Post>
        );
      return speedStats;
    }
    return null;
  },
  
  // Display a zoomable line chart with distance values
  renderDistance : function (data) {
     if (data.distance) {
      //this.props.data.distance.datas = this.props.data.distance.datas.slice(0, 300);
      var distanceStatsData = [{
            name : "distance en " + data.distance.units,
            values : null
          }];
      distanceStatsData[0].values = data.distance.data.map(function (data) {
        return {
          x : new Date(data.createdAt),
          y : data.distance * 1000
        }
      });
      console.log(distanceStatsData)
      distanceStats = (
          <Post>
            <LineChart
              data={distanceStatsData[0].values}
              width={1200}
              height={500}
              legend={true}
              xAxisTickInterval={{unit: 'minutes', interval: 1}}  title="Distance"/>
          </Post>
        );
      return distanceStats;
    }
    return null;
  },

  // Display a pie chart with percentage of activities
  renderSummary : function () {

  },

  render: function () {    
    var stats = [],
        summary = null;
/*
    if (this.props.data.daily) {
      stats.push(this.renderDistance(this.props.data.daily))
      stats.push(this.renderSpeed(this.props.data.daily))
    }

    if (this.props.data.weekly) {
      stats.push(this.renderDistance(this.props.data.weekly))
      stats.push(this.renderSpeed(this.props.data.weekly))
    }
*/
    if (this.props.data.monthly) {
      stats.push(this.renderDistance(this.props.data.monthly))
  //    stats.push(this.renderSpeed(this.props.data.monthly))
    }

    return (
      <section>
        {summary}
        {stats}
      </section>
    )
  }
})

var Stats = React.createClass({displayName: 'Stats',
  getInitialState: function() {
    return {
        daily : null,
        weekly : null,
        monthly : null,
        summary : null
    };
  },

  load : function () {
    var req = H.ajax({
          url : Config.api.url + '/me/stats',
          credentials: true,
          type: 'json',
          success : function (res, req) {
            this.setState({
              daily : res.stats,
              weekly : this.state.weekly,
              monthly : this.state.monthly,
              summary : this.state.summary
            })
          }.bind(this),
          error : function (data, status,err) {
            console.error(status, err.toString());
            this.transitionTo('/');
          }
        })
    req.send();
    var req2 = H.ajax({
          url : Config.api.url + '/me/stats/weekly',
          credentials: true,
          type: 'json',
          success : function (res, req) {
            this.setState({
              daily : this.state.daily,
              weekly : res.stats,
              monthly : this.state.monthly,
              summary : this.state.summary
            })
          }.bind(this),
          error : function (data, status,err) {
            console.error(status, err.toString());
            this.transitionTo('/');
          }
        })
    req2.send();
    var req3 = H.ajax({
          url : Config.api.url + '/me/stats/monthly',
          credentials: true,
          type: 'json',
          success : function (res, req) {
            this.setState({
              daily : this.state.daily,
              weekly : this.state.weekly,
              monthly : res.stats,
              summary : this.state.summary
            })
          }.bind(this),
          error : function (data, status,err) {
            console.error(status, err.toString());
            this.transitionTo('/');
          }
        })
    req3.send();
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
          data={this.state} 
          onPostFormSubmit={this.onPostFormSubmit} 
          action="/me/feed/post/" 
          avatar="images/avatar-not-found.gif"/>
      </section>
    );
  }  
});

if (typeof module !== 'undefined')
  module.exports = Stats;