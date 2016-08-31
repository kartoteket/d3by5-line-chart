'use:strict';
var _ = require('underscore')
 , d3 = require('d3')
 , d3by5 = require('d3by5')
 , utils = require('./line-chart-utils')
;

module.exports = LineChart;

/**
 * The entrypoint
 * @return {[type]} [description]
 */
function LineChart () {

  var chart = {

    options : {
      data : {},
      margin: {top: 50, right: 50, bottom: 50, left: 50 },
      width: 640,
      height: 400,
      fillColor: '',
      lineWidth: 2,
      idPrefix: 'lineId-',

      lineDataPoints: false,
      lineDataValues: false,
      xAxis: true,
      xColumn: 0,
      xLabel: '',
      xScale: 'date',
      xTicks: d3.svg.axis().ticks(),
      xAlign: 'bottom',
      xPos: 'bottom',

      yAxis: true,
      yColumn: 1,
      yLabel: '',
      yScale: 'linear',
      yTicks: d3.svg.axis().ticks(),
      yAlign: 'left',
      yPos: 'left',
    },

    init: function (selection) {

      if (arguments.length) {
        this.selection = selection;
        this.draw();
      }
      return this;
    },


    draw: function () {

      var that = this
        , opt = this.options                                                  // just to shorten...
        , margin = opt.margin
        , width = opt.width  - margin.left - margin.right
        , height = opt.height - margin.top - margin.bottom
        , data = this.parseData()
        , x = {}
        , y = {}
        , series
        , dom
        , svg
        , lines
        , line
        , lineColor = opt.data[0].color
        , lineId = opt.data[0].id
      ;


      this.selection.each(function() {


        /**
        * Prepare to draw
        */

        // set X and Y dimensions. X must refer to a data column. Y can be anything, including an empty string or undefined
        x.dimension = data.schema[opt.xColumn].label || console.error('The data column used for the X axis must have a label!');
        y.dimension = opt.yLabel || data.schema[opt.yColumn].label || '';


        // set X and Y labels
        x.label = opt.xLabel || opt.xLabel === false ? opt.xLabel : x.dimension;
        y.label = opt.yLabel || opt.yLabel === false ? opt.yLabel : y.dimension;


        // set scale relative to type. X defaults to date. Y default to linear. //TODO: normalise number to linear. Make linear/date constants
        x.scale = (opt.xScale === 'linear' || data.schema[opt.xColumn].type === 'linear') ? d3.scale.linear() : d3.time.scale();
        y.scale = (opt.yScale === 'date' || data.schema[opt.yColumn].type === 'date') ? d3.time.scale() : d3.scale.linear();


        // set axes
        x.axis = d3by5.axis().show(opt.xAxis).pos(opt.xPos).scale(x.scale).align(opt.xAlign).ticks(opt.xTicks);
        y.axis = d3by5.axis().show(opt.yAxis).pos(opt.yPos).scale(y.scale).align(opt.yAlign).ticks(opt.yTicks);

        // set series (lines to draw = all data columns except x-dimension). TODO: Too compact, not readable; re-factor...
        series = _.map(_.filter(_.pluck(data.schema, 'label'), function(key) {return key !== x.dimension;}), function(label, i){
          return {
            id: data.schema[i].id, // TODO: verifiser om dette funker
            label: label,
            values: data.values.map(function(d) {
              var value = {};                     // done the heavy way si we can use variables as keys...
              value[x.dimension] = d[x.dimension];
              value[y.dimension] = d[label];
              return value;
            })
          };
        });

        // set input domain
        x.scale.domain(d3.extent(data.values, function(d) { return d[x.dimension]; }));
        y.scale.domain([
          d3.min(series, function(s) {return d3.min(s.values, function(v) {return v[y.dimension]; }); }),   // must use min/max (instead of extent) to support multiple series
          d3.max(series, function(s) {return d3.max(s.values, function(v) { return v[y.dimension]; }); })
        ]);


        // set output range
        x.scale.range([0, width]);
        y.scale.range([height, 0]);


        // set line
        line = d3.svg.line()
          // .interpolate("basis")    // TODO: add option to interpolate
          .x(function(d) { return x.scale(d[x.dimension]); })
          .y(function(d) { return y.scale(d[y.dimension]); });


        // tmp colorizer
        var color = d3.scale.category10();
        color.domain(_.pluck(series, 'label'));


        /**
         * draw svg
         */
        dom = d3.select(this);

        // remove old
        if (that.svg) {
          that.svg.remove();
        }

        //create svg
        svg = dom.append('svg')
            .attr('class', 'chart line-chart')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
          .append('g')
              .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        //xAxis
        if(x.axis()) {
          var _xAxis = svg.append('g')
              .attr('class', 'x axis')
              .attr('transform', 'translate(0,' + (x.axis.pos() === 'top' ? 0 : height) + ')')
              .call(x.axis());

          if(x.label) {
            _xAxis.append('text')
              .attr('x', width)
              .attr('y', '-1.1em')
              .attr('dy', '.71em')
              .style('text-anchor', 'end')
              .text(x.label);
          }
        }

        //yAxis
        if(y.axis()) {
          var _yAxis = svg.append('g')
              .attr('class', 'y axis')
              .attr('transform', 'translate(' + (y.axis.pos() === 'right' ? width : 0) + ', 0)')
              .call(y.axis());

          if(y.label) {
            _yAxis.append('text')
              .attr('transform', 'rotate(-90)')
              .attr('y', 6)
              .attr('dy', '.71em')
              .style('text-anchor', 'end')
              .text(y.label);
          }
        }

        // serie(s) / line(s)
        lines = svg.selectAll(".serie")
            .data(series)
            .enter()
          .append("g")
            .attr("class", function(d) {return "serie " + d.label; });

        lines.append("path")
            .attr('id', function(d) {
              return d.id;
            })
            .attr("class", "line")
            .attr("d", function(d) {return line(d.values); })
            .style("stroke", function(d) { return color(d.label); })
            .style("stroke-width", opt.lineWidth)
            .style('fill','none');



        // data points on line
        if(opt.lineDataPoints) {
          var point = lines.append("g")
            .attr("class", "line-point")
            .style("fill", function(d) { return color(d.label); });

          point.selectAll('circle')
            .data(function(d){return d.values; })
            .enter()
            .append('circle')
            .attr("cx", function(d) {
              return x.scale(d[x.dimension]);
            })
            .attr("cy", function(d) {
              return y.scale(d[y.dimension]);
            })
            .attr("r", 5);
        }

        if(opt.lineDataValues) {
          var val = lines.append('g')
            .attr('class','line-point-value');

          val.selectAll('text')
            .data(function(d,i){ return d.values;})
            .enter()
            .append('text')
            .attr("x", function(d, i) {
                return x.scale(d[x.dimension]);
            })
            .attr("y", function(d, i) {
              return y.scale(d[y.dimension]);
            })
            .attr('dy', -10)
            .attr("text-anchor", "middle")
            .style('fill', '#fff')            //todo -> option
            .style('font-size', '10px')       //todo -> option
            .text(function(d) {
              return d[y.dimension];
            });
        }

          });
    },


    /**
     * Line chart specific setters/getters
     */

    data: function(value) {
      return arguments.length ? (this.options.data = value, this) : this.options.data;
    },

    lineWidth: function(value) {
      return arguments.length ? (this.options.lineWidth = value, this) : this.options.lineWidth;
    },
    lineDataPoints: function(value) {
      return arguments.length ? (this.options.lineDataPoints = value, this) : this.options.lineDataPoints;
    },
    lineDataValues: function(value) {
      return arguments.length ? (this.options.lineDataValues = value, this) : this.options.lineDataValues;
    },
    xAxis: function(value) {
      return arguments.length ? (this.options.xAxis = value, this) : this.options.xAxis;
    },
    xColumn: function(value) {
      return arguments.length ? (this.options.xColumn = value, this) : this.options.xColumn;
    },
    xLabel: function(value) {
      return arguments.length ? (this.options.xLabel = value, this) : this.options.xLabel;
    },
    xScale: function(value) {
      return arguments.length ? (this.options.xScale = value, this) : this.options.xScale;
    },
    xAlign: function(value) {
      return arguments.length ? (this.options.xAlign = value, this) : this.options.xAlign;
    },
    xPos: function(value) {
      return arguments.length ? (this.options.xPos = value, this) : this.options.xPos;
    },
    xTicks: function() {
      return arguments.length ? (this.options.xTicks = this.slice.call(arguments), this) : this.options.xTicks;
    },
    yAxis: function(value) {
      return arguments.length ? (this.options.yAxis = value, this) : this.options.yAxis;
    },
    yColumn: function(value) {
      return arguments.length ? (this.options.yColumn = value, this) : this.options.yColumn;
    },
    yLabel: function(value) {
      return arguments.length ? (this.options.yLabel = value, this) : this.options.yLabel;
    },
    yScale: function(value) {
      return arguments.length ? (this.options.yScale = value, this) : this.options.yScale;
    },
    yAlign: function(value) {
      return arguments.length ? (this.options.yAlign = value, this) : this.options.yAlign;
    },
    yPos: function(value) {
      return arguments.length ? (this.options.yPos = value, this) : this.options.yPos;
    },
    yTicks: function() {
      return arguments.length ? (this.options.yTicks = this.slice.call(arguments), this) : this.options.yTicks;
    },

    // extra bulk setters/getters
    axis: function(value) {
      return arguments.length ? (this.setAxisOptions(value), this) : this.getAxisOptions();
    },
    setOptions: function(value) {
      return arguments.length ? (_.extend(this.options, value), this) : this.options.axis;
    },
    getOptions: function() {
      return this.options;
    },



  };

  // extend chart from base
  // chart.options = _.extend(d3by5.base.options, chart.options); //Does not work. base options are preserved between instances
  chart = _.extend(d3by5.base, chart, utils);

  return (chart.init());
}