# d3by5-line-chart
Thed3by5-line-chart is part of the d3by5 graph tools.

## NOTE
This is as for now a company internal project, see [C3](https://github.com/c3js/c3) or [NVD3](https://github.com/novus/nvd3) for D3 fully functional chart libraries.


## INSTALL AND BUILD

```bash
npm install
npm run build
```

Include
```
d3by5.linechart.js
```
or
```
d3by5.linechart.min.js
```

## DEPENDENCIES
* Underscore
* d3
* d3by5-base-chart. The base-chart is not a registered npm module, get it [here](https://github.com/kartoteket/d3by5-base-chart). Bootstrapped as module on `npm install` via [npm link](https://docs.npmjs.com/cli/link)

In package.json;
```json
"scripts": {
    "preinstall": "npm link ../d3by5-base-chart",
    "link": "npm link ../d3by5-base-chart",
}
```


## API
* All methods (except getOptions(), setOptions()) are getters/setters. Called without arguments they return the current option value. Called with arguments sets option value and returns chart.

  ​

| Method / option | Argument(s)          | Default Value  | Description                              |
| --------------- | -------------------- | -------------- | ---------------------------------------- |
|                 |                      |                |                                          |
| **data**        |                      |                |                                          |
| .data()         | object               |                |                                          |
|                 |                      |                |                                          |
| **layout**      |                      |                |                                          |
| .width()        | int                  | 640            | Sets the graph total width, including internal margins. |
| .height()       | int                  | 480            | Sets the graph total height, including internal margins. |
| .fillColor()    | string or array      | blue           |                                          |
| .margin()       | int [,int, int, int] | 20, 20, 50, 50 | Margins around graph. To accomandate tick labels etc. |
|                 |                      |                |                                          |
| **axis**        |                      |                |                                          |
| .xAxis()        | bool                 | true           | Toggles X axis on/off. True or false.    |
| .xColumn()      | int                  | 0              | Map data column to X axis.               |
| .xLabel()       | string               | ''             | Defaults to xColumn label if set in data-obj. |
| .xScale()       | string               | date           | Data type scale for X axis.              |
| .xAlign()       | string               | bottom         | Align ticks on X axis. Bottom or top.    |
| .xPos()         | string               | bottom         | Position X axis. Bottom or top.          |
| .xTicks()       | int [,string]        | 10             | Number of ticks and optional format      |
| .yAxis()        | bool                 | true           | Toggles Y axis on/off. True or false.    |
| .yColumn()      | int                  | 1              | Map data column to Y axis.               |
| .yLabel()       | string               | ''             | Defaults to yColumn label if set in data-obj. |
| .yScale()       | string               | linear         | Data type scale for Y axis.              |
| .yAlign()       | string               | left           | Align ticks on Y axis. Left or right.    |
| .yPos()         | string               | left           | Position Y axis. Left or right.          |
| .yTicks()       | int [,string]        | 10             | Number of ticks and optional format      |
|                 |                      |                |                                          |
| **Other**       |                      |                |                                          |
| idPrefix        | string               | id-            | Prefix for id-attribute attached to data-visualisations (eg bar or line) |
|                 |                      |                |                                          |
| **Shortcuts**   |                      |                |                                          |
| .axis()         | object               |                | Sets all axis properties in one object. Call wihtout arguments to see object form. |
| .setOptions()   | object               |                | Sets all available options in on object  |
| .getOptions     |                      |                | Get all options as object.               |



## EXAMPLE

See folder `./example`. (Created with `npm run build`.)

## LICENCE
[MIT](https://opensource.org/licenses/MIT)
