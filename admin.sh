#!/bin/bash

npx browserify Pages/Tools/MAIN/main.js -o Pages/dist/Tools/MAIN/main.js 
npm run open -- /page:Tools/MAIN/main $2