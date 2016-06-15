/**
 * Example browserify implementation of d3by5-line-chart
 * =====================================================
 */


 var d3 = require('d3')
   , _ = require('underscore')
   , linechart  = require('./line-chart.js');


/**
 * Example 1
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
          "label"  : "Date",       // what to call this data column
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

  // Initalize chart module with options and bind data
  var chart1 = linechart()
            .width(600)
            .height(500)
            .fillColor('blue')
            .margin(20,20,50,50)
            .data(data);

 // call chart with dom element hook (d3 select)
 d3.select('#js-chart-1').call(_.bind(chart1.init, chart1));
 console.table(chart1.data());
});



/**
 * Example 2
 * Data from UDI [https://www.udi.no/statistikk-og-analyse/statistikk/asylsoknader-enslige-mindrearige-asylsokere-etter-statsborgerskap-og-maned-2015/]
 */
 d3.json("data/data2.json", function(error, data) {

  if(error) {
    console.log(error);
    return;
  }

  data= [
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
  var chart2 = linechart().data(data);

  d3.select('#js-chart-2').call(_.bind(chart2.init, chart2));
});


