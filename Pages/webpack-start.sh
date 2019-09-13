#!/bin/sh

npx webpack --config $1/webpack.config.js
npm run open -- /page:$1/main $2