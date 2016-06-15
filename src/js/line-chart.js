'use:strict';
var _ = require('underscore')
 , d3 = require('d3')
 , base = require('d3by5-base-chart')
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
      fillColor : 'red'
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
        , xColumn = columns[that.options.axis.x] // X axis default to first column. Can be override with chart.axis()
        , yColumn = columns[that.options.axis.y]
        , xDimension = xColumn.label
        , yDimension = yColumn.label
        , xAxis
        , yAxis
        , dom
        , svg
        , line
        , lineColor = this.options.data[0].color
        , lineId = this.options.data[0].id
      ;

      this.selection.each(function() {

       /**
        * Prepare to draw
        */

        // set scale relative to type. X defaults to date. Y default to linear.
        x = (xColumn.type == 'linear') ? d3.scale.linear() : d3.time.scale();
        y = (yColumn.type == 'date') ? d3.time.scale() : d3.scale.linear();

        // set axis
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
        y.domain(d3.extent(data, function(d) { return d[yDimension]; }));

        // set line
        line = d3.svg.line()
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

        svg.append('path')
            .datum(data)
            .style('stroke', lineColor)
            .attr('id', lineId)
            .attr('class', 'line')
            .attr('d', line)
            .style('fill','none');
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
        , parsedValues = []
      ;

      data = inData.map(function (d, i) {

        if (_.isArray(d.values)) {

          // Bail out if keys does not match values
          if(d.columns && (d.columns.length !== d.values[0].length)) {
            console.error('Number of Keys ('+d.columns.length+') must match values ('+d.values[0].length+')');
            return false;
          }

          // Map keys to values in object-form
          _.each(d.values, function(value){
            parsedValues.push(_.object(_.pluck(d.columns, 'label'), value));
          });

          // what if not keys..... ?

          // typecast data
          parsedValues = _.each(parsedValues, that._typeCast, d);

          // set values to parsed values
          d.values = parsedValues;
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

  chart.options = _.extend(base.options, chart.options);
  chart = _.extend(base, chart);

  return (chart.init());
}