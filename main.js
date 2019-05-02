const { app, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');
const args = require('./cli-args');

var windowmanager = require('./WindowManager')(app, BrowserWindow);

app.on('ready', () => {
    var page = 'tests';
    if(args["page"]){
        page = args["page"];
    }
    windowmanager.start(page);
    if(args["dev"]) {
        windowmanager.openDevTools(page);
    }
})

