/**
 * Example of browserify implementation of d3by5-line-chart
 * =====================================================
 */


 var d3 = require('d3')
   , _ = require('underscore')
   , linechart  = require('./line-chart.js');

/**
 * Example 1 - Simple line graph
 * Based on https://bl.ocks.org/mbostock/3883245
 */

  // Load data
 d3.json("data/data.json", function(error, data) {

  if(error) {
    console.log(error);
    return;
  }

  // Describe data
  data = [
    {
      label: "Syria",
      columns : [
        {
         "label"  : "Date",        // what to call this data column
          "type"   : "date",       // what type of data is in it
          "format" : "%d-%b-%y",   // (optional) what format is it in
        },
        {
          "label"  : "Close",
          "type"   : "number",
        }
      ],
      values : data
    }
  ];

  //  Initalize chart module with options and bind data
  var axis = {
              y: {
                label:'topp',
              },
              x : {
                label: 'supert',
                ticks: [1]
              }};

  var chart = linechart()
            // .width(300)
            .height(500)
            .fillColor('blue')
            .margin(20,50,50,50)
            .axis(axis)
            .data(data);


 // call chart with dom element hook (d3 select)
 d3.select('#js-chart-1').call(_.bind(chart.init, chart));
 console.log(chart.axis());
});








/**
 * Example 2 - Line graph with mulitple data series
 * Based on https://bl.ocks.org/mbostock/3884955
 */

  // Load data
 d3.json("data/data3.json", function(error, data) {

  if(error) {
    console.log(error);
    return;
  }

  // Describe data
  data = [
    {
      label: "Tempratures in three major cities",
      columns : [
        {
          "label"  : "Date",       // what to call this data column
           "type"   : "date",      // what type of data is in it
          "format" : "%Y%m%d",     // (optional) what format is it in
        },
        {"label" : "New York"},
        {"label" : "San Fransisco"},
        {"label" : "Austin"},
      ],
      values : data
    }
  ];


 // Initalize chart module with setOptions() and bind data
  var chart = linechart()
            .setOptions(
            {
              yLabel : 'Temprature',
              xLabel : false,
              width : 860
            })
            .data(data);

 // call chart with dom element hook (d3 select)
 d3.select('#js-chart-2').call(_.bind(chart.init, chart));

});





/**
 * Example 3 - other data set
 * Data from UDI [https://www.udi.no/statistikk-og-analyse/statistikk/asylsoknader-enslige-mindrearige-asylsokere-etter-statsborgerskap-og-maned-2015/]
 */
 d3.json("data/data2.json", function(error, data) {

  if(error) {
    console.log(error);
    return;
  }

  data = [
    {
      label: "Enslige mindreårige asylsøkere",
      columns : [
        {
          "label"  : "Måned 2015",
          "type"   : "date",
          "format" : "%m-%Y",
        },
        {
          "label"  : "Antall Enslige mindreårige asylsøkere",
        }
      ],
      values : data
    }
  ];

  // Initalize chart and bind data (using default options)
  var chart = linechart()
              .margin(50)
              .xLabel('2015')
              .data(data);

  d3.select('#js-chart-3').call(_.bind(chart.init, chart));
});


