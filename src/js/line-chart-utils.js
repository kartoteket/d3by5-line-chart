'use:strict';
var _ = require('underscore')
  , d3 = require('d3')
  , lineChartUtils = {}
;

module.exports = lineChartUtils;

/**
 * En egen parsa data metode for nå. Lager oss et seminar og bygger sammen mot base-metodene en gang i fremtiden
 *  * @return {[type]} data object
 */
lineChartUtils.parseData = function() {

  // populate the data object
  var data = this.options.data
    , title = data.title || ''
    , schema = data.schema || ''
    , values = data.values || ''
    , source = data.source || ''
    , column
    , idPrefix = this.options.idPrefix
    , that = this
    ;

  // create data schema
  _.each(_.keys(values[0]), function(label, i) {

    //get
    column        = schema[i] || {};

    column.id     = column.id || _.uniqueId(idPrefix);
    column.label  = label;
    column.color  = column.color || '#000';    // todo need a more complex function here

    // set
    schema[i]     = column;


  });

  // typecast data
  values = _.each(values, this._typeCast, this);


  // set data
  data = {
    title : title,
    schema : schema,
    values : values,
    source : source,
  };
  return data;
};


/**
 * A simple first iteration type caster.
 * @param  {object}   d   data object ({key: value})
 * @return {object}   d   data object ({key: value})
 */
lineChartUtils._typeCast = function(d) {
  var format
    , schema = this.options.data.schema;

    // loop trough schema column by column
  _.each(schema, function(column){

    switch (column.type) {
      case 'date':
        format = d3.time.format(column.format);
        d[column.label] = format.parse(d[column.label]);
        break;

      case 'string':
        d[column.label] = String(d[column.label]);
        break;

      case 'number':
      default:
        d[column.label] = +d[column.label];
        break;
    }

  });

  return d;
};


/**
 * [getAxisOptions description]
 * @return {[type]} [description]
 */
lineChartUtils.getAxisOptions = function() {
  return  {
    x : {
      axis   : this.options.xAxis,
      column : this.options.xColumn,
      label  : this.options.xLabel,
      scale  : this.options.xScale,
      ticks  : this.options.xTicks,
      align  : this.options.xAlign,
      pos    : this.options.xPos,
    },
    y : {
      axis   : this.options.yAxis,
      column : this.options.yColumn,
      label  : this.options.yLabel,
      scale  : this.options.yScale,
      ticks  : this.options.yTicks,
      align  : this.options.yAlign,
      pos    : this.options.yPos,
    },
  };
};


/**
 * [setAxisOptions description]
 * @param {[type]} axis [description]
 */
lineChartUtils.setAxisOptions = function(axis) {
  var that = this;
  if(_.isObject(axis) && ( _.has(axis, 'x') || _.has(axis, 'y')) ) {
    _.each(axis, function(obj, a) {
      _.each(obj, function(v, k) {
        k = k.substr(0, 1).toUpperCase() + k.substr(1);
        if(_.has(that.options, a+k)) {
          that.options[a+k] = v;
        } else {
          console.info('Error in .axis(): Malformed chart option "' +  a+k  + '". Property not set');
        }
      });
    });
  } else {
    console.info('Error in .axis(): Malformed input');
  }
};


/**
 * [_mapData description]
 * @param  {[type]} inData        [description]
 * @param  {[type]} colorAccessor [description]
 * @return {[type]}               [description]
 */
lineChartUtils._mapData = function (inData, colorAccessor) {
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
};
