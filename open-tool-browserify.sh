#!/bin/bash

npx browserify Pages/Tools/$1/main.js -o Pages/dist/Tools/$1/main.js 
npm run open -- /page:Tools/$1/main $2