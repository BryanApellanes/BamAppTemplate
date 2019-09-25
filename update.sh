#!/bin/bash

# TODO: this should check if the folder ~/.bam/content is a symlink 

# copies $1 to ~/.bam/content/apps/$1

APPNAME=${PWD##*/}

echo removing ~/.bam/content/apps/$APPNAME
# rm -fr ~/.bam/content/apps/$APPNAME

echo copying . to ~/.bam/content/apps/$APPNAME
cp -R . ~/.bam/content/apps/$APPNAME
