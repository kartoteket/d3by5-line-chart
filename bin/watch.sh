
# whatch example page
node-sass --output-style expanded -w src/scss -o src/css  &
postcss -u autoprefixer -w -o example/css/main.css src/css/main.css &

onchange 'src/index.html' -- cp src/index.html example/ &
onchange 'src/js/vendor' -v -- cp -a src/js/vendor/. example/js/vendor/ &
onchange 'src/css/vendor' -v -- cp -a src/css/vendor/. example/css/vendor/ &
onchange 'src/data' -v -- cp -a src/data/. example/css/vendor/ &

watchify src/js/main.js -o example/js/main.js --debug --verbose &

livereload ./example