#!/bin/bash

if [ -z "$1" ] || [ $1 = "-help" ] || [ $1 = "-?" ] || [ $1 = "-h" ]
then
    printf "usage: serve-section.sh {section}\r\n"
    printf "\r\n"
    printf "Browserify's the main.js of the specified 'section' then starts the bamweb server serving the current app"
    printf "\r\n"
    printf "\r\n"
else

# browserifys the 'main.js' of the specified section then starts the bamweb server

SECTION=$1

rm pages/dist/$SECTION/main.bundle.js 

npx browserify pages/$SECTION/main.js -o pages/dist/$SECTION/main.bundle.js 

# todo implement this as bam /serve:appName

./bin/bamweb/bamweb /S /content:/opt/bam/content /verbose /apps:${PWD##*/}

fi