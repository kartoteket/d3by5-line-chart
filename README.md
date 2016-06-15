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
The line chart inherits all options from the [d3by5 base chart](https://github.com/kartoteket/d3by5-base-chart) and extends these with options specific for Line Charts:

* **axis** 
  Maps data columns to chart axis (x and y).

  *Default value:*  `{x: 0, y: 1}` First column maps to the X-axis. Second column maps to the Y-axis. 

  ​

## EXAMPLE
See folder `./example`. If missing, re-create with `npm run build`.

## LICENCE
[MIT](https://opensource.org/licenses/MIT)
