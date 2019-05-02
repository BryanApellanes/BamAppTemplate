var arg1 = process.argv[2];

const { app, BrowserWindow } = require('electron');


var windowmanager = require('./WindowManager')(app, BrowserWindow);

app.on('ready', () => {
    windowmanager.start("tests");
    if(arg1 == "dev") {
        windowmanager.openDevTools("tests");
    }
})

