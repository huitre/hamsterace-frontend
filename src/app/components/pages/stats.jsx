var React = require('react'),
    Router = require('react-router'),
    mui = require('material-ui'),
    ReactD3 = require('react-d3'),
    BarChart = ReactD3.BarChart,
    Config = require('../../config'),

    PostList = require('../postlist.jsx').PostList,
    Post = require('../postlist.jsx').Post,
    HappBar = require('../happbar.jsx');

var StatsList = React.createClass({displayName: 'StatsList',
  render: function () {    
    var distanceStats = null,
        speedStats = null;

    if (this.props.data.distance) {
      var distanceStatsData = [{
            name : "distance en " + this.props.data.distance.units,
            values : null
          }];
      distanceStatsData[0].values = this.props.data.distance.datas.map(function (data, i) {
        return {
          x : i,
          y : data.distance * 1000
        }
      });
      console.log(distanceStatsData);
      distanceStats = (
          <Post>
            <BarChart
              data={distanceStatsData}
              width={400}
              height={400}
              margin={{top: 10, bottom: 50, left: 50, right: 10}}/>
          </Post>
        );
    }
    return (
      <section>
        {distanceStats}
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