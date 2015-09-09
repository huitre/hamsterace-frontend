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
    
    var stats = {}, // React.Card 
        tabs = [], 
        data, // data transformee pour le graph
        title, 
        dataType = ['distance', 'speed'], // types de data
        i;

    for (var type in this.state) {
      Stats[type] = [];
      for (var dType in dataType) {       
        if (this.state[type] && this.state[type].hasOwnProperty(dataType[dType])) {
          i = this.state[type][dataType[dType]];
          
          data = i.data.map(function (data) {
            var y = (data.distance || data.content );
            
            y = y || 0;

            return {
              x : new Date(data.createdAt),
              y : y / 100
            }
          });
          

          title = dataType[dType] + "en " +  + type;
          
          stats[type] = 
            <Card title="Distance" id={'card-' + type}>
              <LineChart
                data={data}
                height={500}
                max={i.max}
                average={i.average}
                legend={true}
                interpolate="basis" />
            </Card>
          
        }
      }
    }

    for (var s in stats) {
      tabs.push(
        <Tab
          label={s}>
            {stats[s]}
        </Tab>
      )
    }


    return (
      <Tabs>
        {tabs}
      </Tabs> 
    );
  }  
});

if (typeof module !== 'undefined')
  module.exports = Stats;