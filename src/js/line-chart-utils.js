'use:strict';
var _ = require('underscore')
  , d3 = require('d3')
  , utils = {}
;

module.exports = utils;

/**
 * [getAxisOptions description]
 * @return {[type]} [description]
 */
utils.getAxisOptions = function() {
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
utils.setAxisOptions = function(axis) {
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
utils._mapData = function (inData, colorAccessor) {
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
