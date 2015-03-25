var React = require('react'),
    Router = require('react-router'),
    mui = require('material-ui'),
    Tabs = mui.Tabs,
    Tab = mui.Tab,
    LineChart = require('../charts/linechart.jsx'),
    Config = require('../../config'),

    Card = require('../card.jsx'),
    HappBar = require('../happbar.jsx'); 


var Stats = React.createClass({displayName: 'Stats',
  getInitialState: function() {
    return {
        "hourly" : null,
        "daily" : null,
        "weekly" : null,
        "monthly" : null,
        "summary" : null
    };
  },

  load : function () {
    var stats = ['hourly', 'daily', 'weekly', 'monthly'], self = this;

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
    
    var distanceStats = [], data, title;

    for (var type in this.state) {
      if (this.state[type] && this.state[type].hasOwnProperty('distance')) {
        data = this.state[type].distance.data.map(function (data) {
          var y = (data.distance || data.content );
          
          y = y || 0;

          return {
            x : new Date(data.createdAt),
            y : y / 100
          }
        });
        
        if (type == 'monthly')
          console.log(data)
        title = "Distance en mètres " + type;
        console.log('pushing ' + type, this.state[type].distance.data.length)
        distanceStats.push(
          <Card title="Distance">
            <LineChart
              data={data}
              height={500}
              legend={true}
              className="tab-template-container"
              interpolate="linear"
              xAxisTickInterval={{unit: 'minutes', interval: 1}}/>
          </Card>
        )
      }
    }

    console.log(distanceStats)

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