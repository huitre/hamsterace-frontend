var React = require('react'),
    d3 = require('d3');


// d3Chart.js

var d3Chart = {};

d3Chart.create = function(el, props, state) {
  console.log('d3.create');
  var margin = {top: 30, right: 20, bottom: 30, left: 50},
      width = props.width,
      context = {h: 90, width: width},
      height = props.height,
      xAxis, yAxis,
      svg = d3.select(el), focus, context;

  this.dimensions = {w: width, h: height - context.h - margin.top - margin.bottom, margin: margin};
  this.context = context;
  
  svg = svg.append('svg')
        .attr('class', 'd3')
        .attr('width', width)
        .attr('height', height)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  focus = svg.append("g")
    .attr("class", "focus")
    .attr('width', width)
    .attr('height', height)
    .attr('clip-path', 'url(#clip)')

  context = svg.append("g")
    .attr("class", "context")
    .attr('height', context.h)
    .attr("transform", "translate(0," + (margin.top + context.h) + ")")
  
  svg.append("defs").append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", width)
      .attr("height", height);

  var scales = this.scales(el, state.domain);

  this.update(el, state);
}

d3Chart.update = function(el, state) {
  console.log('d3.update');

  // Re-compute the scales, and render the data points
  var scales = this.scales(el, state.domain);
  this.drawPoints(el, scales, state.data);
}


d3Chart.destroy = function(el) {
  // Any clean-up would go here
  // in this example there is nothing to do
}

d3Chart.scales = function (el, domain) {
    console.log('d3.scale');
    if (!domain) {
      return null;
    }
  
    var width = this.dimensions.w,
        height = this.dimensions.h, 
        x, y, y2;

    x = d3.time.scale()
      .domain(domain.x)
      .rangeRound([this.dimensions.margin.left, width - this.dimensions.margin.right]);
  
    y = d3.scale.linear()
      .domain(domain.y)
      .rangeRound([height - this.dimensions.margin.top -this.dimensions.margin.bottom, -this.dimensions.margin.bottom]);

    y2 = d3.scale.linear()
      .domain(domain.y)
      .rangeRound([this.context.h, 0]);

    z = 1;
    
    return {
      x: x, 
      y: y, 
      context: {
        x: x, 
        y: y2
      }
    };
}

d3Chart.drawAxes = function (el, scales, data) {

}

d3Chart.drawPoints = function (el, scales, data) {
  console.log('d3.drawPoints')
  var drawLines, // draw method for main area 
      drawContextLines, // draw method for minimap
      context, // our minimap
      focus, // main content
      xAxis, // generic x axis with time scale
      yAxis, // generic y axis with scale
      svg;

  
  xAxis = d3.svg.axis()
            .scale(scales.x)
            .orient("bottom")
  
  yAxis = d3.svg.axis()
            .scale(scales.y)
            .orient("left");
  
  drawLines = d3.svg.line()
                .x(function (d) { 
                  return scales.x(new Date(d.x).getTime()); 
                })
                .y(function (d) { return scales.y(d.y); })
                .interpolate("basis");

  drawContextLines = d3.svg.line()
                      .x(function (d) { 
                        return scales.x(new Date(d.x).getTime()); 
                      })
                      .y(function (d) { return scales.context.y(d.y); })
                      .interpolate("basis");

  svg = d3.select(el).selectAll('.focus');
  focus = d3.select(el).selectAll('.focus');
  context = d3.select(el).selectAll('.context');
  
  svg.append('g').attr('class', 'x axis').attr('transform', 'translate(0,' + (this.dimensions.h - this.dimensions.margin.bottom) + ')').call(xAxis);
  svg.append('g').attr('transform', 'translate(' + (this.dimensions.margin.left) + ',' + (this.dimensions.margin.top) + ')')
            .attr('class', 'axis').call(yAxis);

  focus.append('path').attr('d', drawLines(data, scales))
          .style('stroke-width', 1)
          .style('fill', '#fff')
          .style('stroke', '#3F51B5');

  context.append("g")
      .attr("class", "x axis")
      .attr("transform", 'translate(0,' + (this.dimensions.h - this.dimensions.margin.bottom) + ')')
      .call(xAxis);

  
  context.append('path')
          .attr("transform", 'translate(0,' + (this.dimensions.h - this.context.h - this.dimensions.margin.bottom) + ')')
          .attr('d', drawContextLines(data, scales))
          .style('stroke-width', 1)
          .style('fill', '#fff')
          .style('stroke', '#3F51B5')

  var self = this;
  function brushed() {
    //scales.x.domain(brush.empty() ? scales.x.domain() : brush.extent());
    //d3.time.scale().range([0, self.dimensions.w]).domain(brush.empty() ? scales.x.domain() : brush.extent())
    focus.select(".path").attr("d", drawLines(data, scales));
    focus.select(".x.axis").call(xAxis);
  }

  var brush = d3.svg.brush()
    .x(scales.x)
    .on("brush", brushed);

  context.append("g")
      .attr("class", "x brush")
      .attr("transform", 'translate(0,' + (this.dimensions.h - this.context.h - this.dimensions.margin.bottom) + ')')
      .call(brush)
    .selectAll("rect")
      .attr("y", -6)
      .attr("height", this.context.h + 7);
}

var LineChart = React.createClass({displayName: 'LineChart',
  propTypes: {
    data: React.PropTypes.array,
    domain: React.PropTypes.object
  },

  componentDidMount: function() {
    var el = this.getDOMNode();
    
    d3Chart.create(el, {
      width: this.props.width,
      height: this.props.height
    }, this.getChartState());
  },

  componentDidUpdate: function() {
    var el = this.getDOMNode();
    d3Chart.update(el, this.getChartState());
  },

  getChartState: function() {
    return {
      data: this.props.data,
      domain: this.props.domain || this._getDomain(this.props.data)
    };
  },

  _getDomain: function (data) {
    var domain = { x : 0, y : 0}

    domain.x = [
            d3.min(data, function (d) { return new Date(d.x).getTime() }),
            d3.max(data, function (d) { return new Date(d.x).getTime() })
        ];
    domain.y = [
          d3.min(data, function (d) { return d.y }), 
          d3.max(data, function (d) { return d.y })
        ];
    
    return domain;
  },

  componentWillUnmount: function() {
    var el = this.getDOMNode();
    
    d3Chart.destroy(el);
  },

  render: function() {
    return (
      <div className="Chart"></div>
    );
  }
});


if (typeof module !== 'undefined')
  module.exports = LineChart;