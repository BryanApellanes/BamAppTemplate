#!/bin/sh

npx browserify Pages/$1/main.js -o Pages/dist/$1/main.js 
npm run open -- /page:$1/main $2