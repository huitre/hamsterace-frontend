var React = require('react'),
    Router = require('react-router'),
    mui = require('material-ui'),
    LineChart = require('../charts/linechart.jsx'),
    Config = require('../../config'),

    PostList = require('../postlist.jsx').PostList,
    Post = require('../postlist.jsx').Post,
    HappBar = require('../happbar.jsx');


var Stats = React.createClass({displayName: 'Stats',
  getInitialState: function() {
    return {
        "daily" : null,
        "weekly" : null,
        "monthly" : null,
        "summary" : null
    };
  },

  load : function () {
    var stats = ['daily', 'weekly', 'monthly'], self = this;

    for (var i in stats) {
      (function (type, self) {
        var req = H.ajax({
            url : Config.api.url + '/me/stats/' + (stats[i]),
            credentials: true,
            type: 'json',
            success : function (res, req) {
              var oldState = self.state;
              
              oldState[type] = res.stats;
              self.setState(oldState);
            },
            error : function (data, status,err) {
              console.error(status, err.toString());
              this.transitionTo('/');
            }
          })
        req.send();
      }(stats[i], self));
    }
  },

  componentDidMount: function() {
    this.load();
  },

  render: function() {
    
    var distanceStats = [], data;

    for (var type in this.state) {
      if (this.state[type] && this.state[type].hasOwnProperty('distance')) {
        data = this.state[type].distance.data.map(function (data) {
          return {
            x : new Date(data.createdAt),
            y : (data.distance || data.content ) * 1000
          }
        });
        
        distanceStats.push(
          <Post ref="post">
            <LineChart
              data={data}
              height={700}
              legend={true}
              xAxisTickInterval={{unit: 'minutes', interval: 1}}  title="Distance"/>
          </Post>
        )
      }
    }

    return (
      <section id="content">
        <HappBar
        title="Hamsterace > me > stats" />
        <section>
        {distanceStats}
        </section>
      </section>
    );
  }  
});

if (typeof module !== 'undefined')
  module.exports = Stats;