# BamApp

This repository acts as the base for any bam application.

# TL;DR
```
npm run electron
```

Running the command above executes the npm script named "electron" defined in the package.json file.

# new-page.sh
The `new-page.sh` script is used to create a new page.  It takes 2 required arguments:

```
./new-page.sh /name:<REPLACE_WITH_PAGENAME> /title:<REPLACE_WITH_TITLE>
```

If a page by the specified name already exists, an error is displayed: 

```
file already exists: ./Pages/<PAGE_NAME>/main.html
```

To overwrite an existing page with a new page containing the default content, use the `/f` command line switch.

```
./new-page.sh /name:<REPLACE_WITH_PAGENAME> /title:<REPLACE_WITH_TITLE> /f
```

# open-page.sh

The open-page.sh script is a convenience script used to open a page in the Pages folder.  Specify the relative path from the `Pages` root folder; the script assumes that there is a file named `main.html` in the folder path specified:

```
./open-page.sh PAGE_NAME
```

Specify the `/dev` switch to open the developer console when the page is opened.

```
./open.sh PAGE_NAME /dev
```

# new-tool.sh
The `new-tool.sh` script is used to create a new tool page.  It takes 2 required arguments:

```
./new-tool.sh /name:<REPLACE_WITH_TOOL_NAME> /title:<REPLACE_WITH_TITLE>
```

If a tool by the specified name already exists, an error is displayed: `file already exists: ./Pages/Tools/TOOL_NAME/main.html`

A tool page has mocha testing tools baked in.

# open-tool.sh
The open-tool.sh script is a convenience script used to open a page in the `Pages/Tools` folder.  Specify the relative path from the `Pages/Tools` root folder; the script assumes that there is a file named `main.html` in the folder path specified:

```
./open-tool.sh TOOL_NAME
```

Specify the `/dev` switch to open the developer console when the tool page is opened.