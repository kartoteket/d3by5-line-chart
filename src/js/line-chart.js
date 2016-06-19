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
      idPrefix: 'lineId-',
      axis: {x: 0, y: 1},
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
        , margin = this.options.margin
        , width = this.options.width  - margin.left - margin.right
        , height = this.options.height - margin.top - margin.bottom
        , data = this.options.data[0].values        // TODO: what if mulitple datasets...?
        , columns = this.options.data[0].columns
        , x
        , y
        , xColumn
        , yColumn
        , xDimension
        , yDimension
        , xAxis
        , yAxis
        , dom
        , svg
        , series
        , seriesKeys
        , lines
        , line
        , lineColor = this.options.data[0].color
        , lineId = this.options.data[0].id
      ;

      this.selection.each(function() {

       /**
        * Prepare to draw
        */


        // X-axis defaults to first data column. Y-axis defaults to second datacolumn.
        // Can be override with chart.axis() that takes either an [int] as reference to a column
        // or an object {label, [type, format]}
        xColumn = isNaN(that.options.axis.x) ? that.options.axis.x : columns[that.options.axis.x];
        yColumn = isNaN(that.options.axis.y) ? that.options.axis.y : columns[that.options.axis.y];
        xDimension = xColumn.label;
        yDimension = yColumn.label;


        // get series (lines to draw)
        seriesKeys =  d3.keys(data[0]).filter(function(key) {
          return key !== xDimension;
        });

        series = seriesKeys.map(function(name){
          return {
            name: name,
            values: data.map(function(d) {
              var value = {};                     // done the heavy way to use variables as keys...
              value[xDimension] = d[xDimension];
              value[yDimension] = d[name];
              return value;
            })
          };
        });

        // tmp colorizer
        var color = d3.scale.category10();
        color.domain(seriesKeys);

        // set scale relative to type. X defaults to date. Y default to linear.
        x = (xColumn.hasOwnProperty('type') && xColumn.type === 'linear') ? d3.scale.linear() : d3.time.scale();
        y = (yColumn.hasOwnProperty('type') && yColumn.type === 'date') ? d3.time.scale() : d3.scale.linear();

        // set axis. TODO: option to control axis visibility and position
        xAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom');

        yAxis = d3.svg.axis()
            .scale(y)
            .orient('left');

        // Domain and range
        x.range([0, width]);
        y.range([height, 0]);

        x.domain(d3.extent(data, function(d) { return d[xDimension]; }));
//        y.domain(d3.extent(data, function(d) { return d[yDimension]; }));  //TODO min/max fo rmultiple series

        y.domain([
          d3.min(series, function(s) { return d3.min(s.values, function(v) { return v[yDimension]; }); }),
          d3.max(series, function(s) { return d3.max(s.values, function(v) { return v[yDimension]; }); })
        ]);



        // set line
        line = d3.svg.line()
//            .interpolate("basis") // TODO: add option to interpolate
            .x(function(d) { return x(d[xDimension]); })
            .y(function(d) { return y(d[yDimension]); });



        /**
         * draw svg
         */
        dom = d3.select(this);

        // remove old
        if (dom.select('svg')) {
          dom.select('svg').remove();
        }

        svg = dom.append('svg')
            .attr('class', 'chart line-chart')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
          .append('g')
              .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        svg.append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(0,' + height + ')')
            .call(xAxis)
          .append('text')
            .attr('x', width)
            .attr('y', '-1.1em')
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text(xDimension);

        svg.append('g')
            .attr('class', 'y axis')
            .call(yAxis)
          .append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', 6)
            .attr('dy', '.71em')
            .style('text-anchor', 'end')
            .text(yDimension);

        lines = svg.selectAll(".serie")
            .data(series)
            .enter()
          .append("g")
            .attr("class", function(d) {
              return "serie " + d.name;
            });

        lines.append("path")
            .attr('id', lineId)
            .attr("class", "line")
            .attr("d", function(d) { return line(d.values); })
            .style("stroke", function(d) { return color(d.name); })
            .style('fill','none');

      //   svg.append('path')
      //       .datum(data)
      //       .style('stroke', lineColor)
      //       .attr('id', lineId)
      //       .attr('class', 'line')
      //       .attr('d', line)
      //       .style('fill','none');

      });
    },



    /**
     * [_mapData description]
     * @param  {[type]} inData        [description]
     * @param  {[type]} colorAccessor [description]
     * @return {[type]}               [description]
     */
    _mapData : function (inData, colorAccessor) {
      var idPrefix = this.options.idPrefix
        , that = this
        , values = []
      ;
      data = inData.map(function (d, i) {

        if (_.isArray(d.values)) {


          // Map keys to values in object-form
            _.each(d.values, function(value){
              values.push(_.object(_.pluck(d.columns, 'label'), value));
            });

          // TODO: what if not keys..... ???!?

          // typecast data
         values = _.each(values, that._typeCast, that);

          // set values to parsed values
          d.values = values;
        }

        d.color = d.color || colorAccessor(i);
        d.id    = d.id || _.uniqueId(idPrefix);

        return d;
      });

      return data;
    },



    /**
     * Line chart specific setters/getters
     */
    axis: function (value) {
      if (!arguments.length) return this.options.height;
      this.options.axis = value;
      return this;
    }

  };

  // extend chart from base
  // chart.options = _.extend(d3by5.base.options, chart.options); //Does not work. base options are preserved between instances
  chart = _.extend(d3by5.base, chart, utils);

  return (chart.init());
}