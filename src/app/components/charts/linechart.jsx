var React = require('react'),
    d3 = require('d3');


// d3Chart.js

var d3Chart = {};

d3Chart.create = function(el, props, state) {
  console.log('d3.create');
  var margin = {top: 30, right: 20, bottom: 30, left: 50},
      width = props.width - margin.left - margin.right,
      height = props.height - margin.top - margin.bottom,
      xAxis, yAxis,
      svg = d3.select(el), focus, context;

  this.dimensions = {w: width, h: height, margin: margin};
  
  svg = svg.append('svg')
        .attr('class', 'd3')
        .attr('width', width)
        .attr('height', height)
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  focus = svg.append("g")
    .attr("class", "focus")

  svg.append("defs").append("clipPath")
      .attr("id", "clip")
    .append("rect")
      .attr("width", width)
      .attr("height", height);


  context = svg.append("g")
    .attr("class", "context")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  var scales = this.scales(el, state.domain);
  
  // this.drawAxes(el, scales, state.data);

  this.update(el, state);
}

d3Chart.update = function(el, state) {
  console.log('d3.update');

  // Re-compute the scales, and render the data points
  var scales = this.scales(el, state.domain);
  
  this.drawPoints(el, scales, state.data);
  this.drawAxes(el, scales, state.data);
  this.setZoom(el, scales, state.data);
}

d3Chart.setZoom = function (el, scales, data) {
  var svg = d3.select(el).selectAll('.clipsvg'),
      zoom = d3.behavior.zoom()
              .scaleExtent([1, 1])
              .x(scales.x)
              .on('zoom', function() { 
                svg.select('.data').attr('d', drawLines(data, scales));
              });
  svg.call(zoom);
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
        x, y, z;
    
    x = d3.time.scale()
      .domain(domain.x)
      .rangeRound([0, width - this.dimensions.margin.left - this.dimensions.margin.right]);
  
    y = d3.scale.linear()
      .domain(domain.y)
      .rangeRound([height - this.dimensions.margin.top - this.dimensions.margin.bottom, 0]);

    z = 1;
    
    return {x: x, y: y, z: z};
}

d3Chart.drawAxes = function (el, scales, data) {
  var xAxis, yAxis, svg;

  xAxis = d3.svg.axis()
            .scale(scales.x)
            .orient("bottom")
  
  yAxis = d3.svg.axis()
            .scale(scales.y)
            .orient("left");
  
  svg = d3.select(el).selectAll('.focus');
  svg.append('g').attr('class', 'axis').attr('transform', 'translate(' + this.dimensions.margin.left + ',' + (this.dimensions.h - this.dimensions.margin.bottom) + ')').call(xAxis);
  svg.append('g').attr('transform', 'translate(' + (this.dimensions.margin.left) + ',' + (this.dimensions.margin.top) + ')')
            .attr('class', 'axis').call(yAxis);
}

d3Chart.drawPoints = function (el, scales, data) {
  console.log('d3.drawPoints')
  var drawLines, p;

  drawLines = d3.svg.line()
                    .x(function (d) { 
                      return scales.x(new Date(d.x).getTime()); 
                    })
                    .y(function (d) { return scales.y(d.y); })
                    .interpolate("basis");
  
  d3.select(el).selectAll('.focus').append('path').attr('d', drawLines(data, scales))
          .style('stroke-width', 1)
          .style('fill', '#fff')
          .style('stroke', '#3F51B5');
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
    var domain = { x : 0, y : 0},
        minDate = new Date(d3.min(data, function (d) { return new Date(d.x).getTime() }) - 8.64e7),
        maxDate = new Date(d3.max(data, function (d) { return new Date(d.x).getTime() }) + 8.64e7);
    domain.x = [
            /*d3.min(data, function (d) { return new Date(d.x).getTime() }), 
            d3.max(data, function (d) { return new Date(d.x).getTime() })*/
            new Date(minDate - 8.64e7),
            new Date(maxDate + 8.64e7)
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