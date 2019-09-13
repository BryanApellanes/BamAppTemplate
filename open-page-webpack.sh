#!/bin/sh

npx webpack --config Pages/$1/webpack.config.js
npm run open -- /page:$1/main $2