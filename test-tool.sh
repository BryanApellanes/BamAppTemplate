#!/bin/sh

npx browserify Pages/Tools/$1/test.js -o Pages/dist/Tools/$1/test.js 
npm run open -- /page:Tools/$1/test $2