#!/bin/bash

rm pages/dist/$1/main.bundle.js 

npx browserify pages/$1/main.js -o pages/dist/$1/main.bundle.js 

# todo implement this as bam /serve:appName

./bin/bamweb/bamweb /S /content:/opt/bam/content /verbose /apps:${PWD##*/}
