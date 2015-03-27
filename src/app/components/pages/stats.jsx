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
      
      <Tabs> 
        <Tab label="Item One" > 
          <div className="tab-template-container"> 
            <h2 className="mui-font-style-headline">Tab One Template Example</h2> 
            <p> 
              This is an example of a tab template! 
            </p> 
            <p> 
              You can put any sort of HTML or react component in here. 
            </p> 
          </div> 
        </Tab> 
        <Tab label="Item Two" > 
          <div className="tab-template-container"> 
            <h2 className="mui-font-style-headline">Tab Two Template Example</h2> 
            <p> 
              This is another example of a tab template! 
            </p> 
            <p> 
              Fair warning - the next tab routes to home! 
            </p> 
          </div> 
        </Tab> 
        <Tab 
          label="Item Three" 
          route="home" 
          > 
        {distanceStats}
        </Tab>
      </Tabs> 
      
    );
  }  
});

if (typeof module !== 'undefined')
  module.exports = Stats;