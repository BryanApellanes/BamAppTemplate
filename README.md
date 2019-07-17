# BamApp

This repository acts as the base for any bam application.

# TL;DR
```
npm run electron
```

Running the command above executes the npm script named "electron" defined in the package.json file.

# Open.sh

The open.sh script is a convenience script used to open a page in the Pages folder.  Specify the relative path to the pages root folder; the script assumes that there is a file named main.html in the folder path specified:

```
./open.sh JED/1812
```

Specify the `/dev` switch to open the developer console when the page is opened.

```
./open.sh JED/1812 /dev
```