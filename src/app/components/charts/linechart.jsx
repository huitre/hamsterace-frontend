var React = require('react'),
    d3 = require('d3');


// d3Chart.js

var d3Chart = function (props) {
  //console.log('d3Chart constructor');
  var margin = {top: 30, right: 20, bottom: 30, left: 50},
      width = props.width,
      context = {h: 90, width: width},
      height = props.height;

  this.dimensions = {
    w: width - margin.left - margin.right, 
    h: height - context.h - margin.bottom,
    ow: width,
    oh: height,
    margin: margin, 
    context: context
  };

  this.interpolate = props.interpolate || 'basis';
};

d3Chart.prototype.create = function(el, state) {
  //console.log('d3.create');

  var xAxis, yAxis,
      svg = d3.select(el), focus, context,
      margin = this.dimensions.margin;

  svg = svg.append('svg')
        .attr('class', 'd3')
        .attr('width', this.dimensions.ow)
        .attr('height', this.dimensions.oh)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // main drawing area
  focus = svg.append("g")
      .attr("class", "focus")
      .attr('width', this.dimensions.ow)
      .attr('height', this.dimensions.oh)
  
  focus.append('path')
  focus.append('g').attr('class', 'x axis')
  focus.append('g').attr('class', 'y axis')


  // mini map drawing area
  context = svg.append("g")
    .attr("class", "context")
    .attr('height', this.dimensions.context.h)
    .attr("transform", "translate(0," + (margin.top + this.dimensions.context.h) + ")")
  
  context.append('path')
  context.append("g").attr("class", "x axis")
  context.append("g")
      .attr("class", "x brush")
      .attr("transform", 'translate(0,' + (this.dimensions.h - this.dimensions.context.h - this.dimensions.margin.bottom) + ')')

  svg.append("defs").append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", this.dimensions.w - margin.left - margin.right)
      .attr("height", this.dimensions.h)
    .attr("transform", "translate(" + (margin.left + 1) + ",0)");

  var scales = this.scales(el, state.domain);

  this.update(el, state);
}

d3Chart.prototype.update = function(el, state) {
  //console.log('d3.update');

  // Re-compute the scales, and render the data points
  var scales = this.scales(el, state.domain);
  this.drawPoints(el, scales, state.data);
}


d3Chart.prototype.destroy = function(el) {

}

d3Chart.prototype.scales = function (el, domain) {
    //console.log('d3.scale', this.dimensions);
    if (!domain) {
      return null;
    }
  
    var width = this.dimensions.w,
        height = this.dimensions.h, 
        x, x2, y, y2;

    x = d3.time.scale()
      .domain(domain.x)
      .rangeRound([this.dimensions.margin.left, width - this.dimensions.margin.right]);

    y = d3.scale.linear()
      .domain(domain.y)
      .rangeRound([height - this.dimensions.margin.top -this.dimensions.margin.bottom, -this.dimensions.margin.bottom]);

    x2 = d3.time.scale()
      .domain(domain.x)
      .rangeRound([this.dimensions.margin.left, width - this.dimensions.margin.right]);
  
    y2 = d3.scale.linear()
      .domain(domain.y)
      .rangeRound([this.dimensions.context.h, 0]);

    z = 1;
    
    return {
      x: x, 
      y: y, 
      context: {
        x: x2, 
        y: y2
      }
    };
}

d3Chart.prototype.drawAxes = function (el, scales, data) {

}

d3Chart.prototype.resize = function (el, state) {
  this.dimensions.w = el.clientWidth - this.dimensions.margin.left - this.dimensions.margin.right;

  d3.select(el).select('#clip').select('rect')
    .attr("width", this.dimensions.w - this.dimensions.margin.right)
    .attr("height", this.dimensions.h)

  this.update(el, state);
}

d3Chart.prototype.drawPoints = function (el, scales, data) {
  //console.log('d3.drawPoints', el, scales, data);
  var drawLines, // draw method for main area 
      drawContextLines, // draw method for minimap
      context, // our minimap
      focus, // main content
      xAxis, // generic x axis with time scale
      yAxis, // generic y axis with scale
      xAxisContext, // generic axis for minimap
      svg,
      Xdomain = scales.x.domain();

  
  xAxis = d3.svg.axis()
            .scale(scales.x)
            .orient("bottom")
  xAxisContext = d3.svg.axis()
            .scale(scales.context.x)
            .orient("bottom")


  yAxis = d3.svg.axis()
            .scale(scales.y)
            .orient("left");
  
  drawLines = d3.svg.line()
                .defined(function(d) { return d.y != null; })
                .x(function (d) { 
                  return scales.x(d.x); 
                })
                .y(function (d) {return scales.y(d.y); })
                .interpolate(this.interpolate);
  focus = d3.select(el).selectAll('.focus');
  
  // we create x axxis and y axxis
  focus.select('.x.axis').attr('transform', 'translate(0,' + (this.dimensions.h - this.dimensions.margin.bottom) + ')').call(xAxis);
  focus.select('.y.axis').attr('transform', 'translate(' + (this.dimensions.margin.left) + ',' + (this.dimensions.margin.top) + ')').call(yAxis);

                
  focus.select('path')
          .datum(data)
          .attr('class', 'chart')
          .attr('d', drawLines)
          .attr('transform', 'translate(0,' + (this.dimensions.margin.bottom) + ')')
          .style('stroke-width', 1)
          .style('fill', '#fff')
          .style('stroke', '#3F51B5')
          .attr('clip-path', 'url(#clip)')

  // minimap goes here
  context = d3.select(el).selectAll('.context');

  drawContextLines = d3.svg.line()
                      .defined(function(d) { return d.y != null; })
                      .x(function (d) { 
                        return scales.context.x(d.x); 
                      })
                      .y(function (d) { return scales.context.y(d.y); })
                      .interpolate(this.interpolate);

  context.select('.x.axis')
      .attr("transform", 'translate(0,' + (this.dimensions.h - this.dimensions.margin.bottom) + ')')
      .call(xAxisContext);

  
  context.select('path')
          .datum(data)
          .attr("transform", 'translate(0,' + (this.dimensions.h - this.dimensions.context.h - this.dimensions.margin.bottom) + ')')
          .attr('d', drawContextLines)
          .style('stroke-width', 1)
          .style('fill', '#fff')
          .style('stroke', '#3F51B5')

  // minimap selection and events
  function brushed() {
    scales.x.domain(brush.empty() ? Xdomain : brush.extent());
    focus.select("path.chart").attr("d", drawLines);
    focus.select(".x.axis").call(xAxis);
  }

  var brush = d3.svg.brush()
    .x(scales.context.x)
    .on('brush', brushed)


 context.select('.x.brush')
      .call(brush)
    .selectAll("rect")
      .attr("y", -6)
      .attr("height", this.dimensions.context.h + 7);


}

var Minimap = React.createClass({displayName: 'Minimap',
  propTypes: {
    data: React.PropTypes.array,
    domain: React.PropTypes.object,
    chart: React.PropTypes.object
  },

  componentDidMount: function() {
    var el = this.getDOMNode();
  },

  componentDidUpdate: function() {
    var el = this.getDOMNode();
    
    /*this.d3Chart.update(el, this.getChartState());*/
  },

  getChartState: function() {
    return {
      data: this.props.data,
      domain: this.props.domain || this._getDomain(this.props.data)
    };
  },

  componentWillUnmount: function() {
    var el = this.getDOMNode();
  },

  render: function() {
    return (
      <div className="Chart"></div>
    );
  }
});

var LineChart = React.createClass({displayName: 'LineChart',
  propTypes: {
    data: React.PropTypes.array,
    domain: React.PropTypes.object    
  },

  componentDidMount: function() {
    var self = this;
    this._id = this.generateId();
    this.el = document.querySelector('#' + this._id) || this.getDOMNode();

    if (!this.props.width)
      window.addEventListener('resize', function (e) {
        self.d3Chart.resize(self.el, self.getChartState())
      })
    
    this.d3Chart = new d3Chart({
        width: this.props.width || this.el.parentElement.clientWidth,
        height: this.props.height || this.el.parentElement.clientHeight,
        interpolate: this.props.interpolate
      });

    this.d3Chart.create(this.getDOMNode(), this.getChartState());
  },

  getChartState: function() {
    return {
      data: this.props.data,
      domain: this.props.domain || this.getDomain(this.props.data)
    };
  },

  generateId: function () {
    return 'react-d3chart-' + (Math.ceil(Math.random() * 100))
  },

  getDomain: function (data) {
    var domain = { x : 0, y : 0}, max, min;

    domain.x = [
            d3.min(data, function (d) { return new Date(d.x) }),
            d3.max(data, function (d) { return new Date(d.x) })
        ];

    min = d3.min(data, function (d) { return d.y });
    max = d3.max(data, function (d) { return d.y });
    domain.y = [
          min, 
          max + max * 0.1
        ];
    
    return domain;
  },

  componentWillUnmount: function() {
    var el = this.el;
    
    this.d3Chart.destroy(el);
  },

  render: function() {
    //console.log('LineChart.render')
    return (
      <div className="Chart" id={this._id}></div>
    );
  }
});


if (typeof module !== 'undefined')
  module.exports = LineChart;