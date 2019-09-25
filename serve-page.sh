#!/bin/bash

if [ -z "$1" ] || [ $1 = "-help" ] || [ $1 = "-?" ] || [ $1 = "-h" ]
then
    printf "usage: serve-page.sh {STARTPAGE}\r\n"
    printf "\r\n"
    printf "Browserify's the specified 'STARTPAGE' then starts the bamweb server serving the current app"
    printf "\r\n"
    printf "\r\n"

else

STARTPAGE=$1

rm pages/dist/$STARTPAGE.bundle.js 

npx browserify pages/$STARTPAGE/$STARTPAGE.js -o pages/dist/$STARTPAGE/$STARTPAGE.bundle.js 

# todo implement this as bam /serve:appName

./bin/bamweb/bamweb /S /content:/opt/bam/content /verbose /apps:${PWD##*/}

fi