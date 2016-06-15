#!/bin/bash

PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

echo 'Version is -'$PACKAGE_VERSION'-'


# build line chart script
buildDist()
{
    mkdir -p dist && (
      browserify src/js/line-chart.js > dist/d3by5.linechart.js &&
      uglifyjs dist/d3by5.linechart.js -m -c > dist/d3by5.linechart.min.js
    )
}


# build example
buildExample()
{

  mkdir -p example && (

    # css
    node-sass --output-style expanded src/scss -o src/css &
    postcss -u autoprefixer -o example/css/main.css src/css/main.css &

    # js
    browserify src/js/main.js -o example/js/main.js;

    # copy assets
    cp src/index.html example/ &
    mkdir -p example/js/vendor  && cp -a src/js/vendor/. example/js/vendor/ &
    mkdir -p example/css/vendor && cp -a src/css/vendor/. example/css/vendor/ &
    & mkdir -p example/data && cp -a src/data/. example/data/
  )
}

buildDist
buildExample