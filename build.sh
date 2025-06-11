node ./src/build_extension/build.js
webpack
cd build
mkdir static/content_scripts
mkdir static/content_css
mv -v static/js/main.*.js static/content_scripts/main.js
rm -rf static/js
mv -v static/css/main.*.css static/content_css/main.css
rm -rf static/css
rm -rf scripts/background.bundle.js.LICENSE.txt
