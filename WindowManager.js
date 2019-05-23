
var windowmanager = (function(){    
    return function(app, BrowserWindow){
        var windows = {},
            pageRoot = '/Pages/',
            app = app,
            BrowserWindow = BrowserWindow; // the constructor from electron
    
        return {
            app: app,
            setPageRoot: function(root){
                pageRoot = root;
            },
            start: function(pageName) {
                return this.createWindow(pageName, 1080, 800);
            },
            createWindow: function(name, width, height) {
                if(windows[name]){
                    return windows[name];
                }
                var win = new BrowserWindow({width: width, height: height});
                win.loadURL(`file://${__dirname}/${pageRoot}${name}.html`);
    
                win.on('closed', () => {
                    indexWindow = null;
                })      
                windows[name] = win;
                return win;
            },        
            exit: function(){
                for(winName in windows) {
                    this.exitWindow(winName);
                }
            },
            exitWindow: function(name) {
                windows[name].exit();
            },
            openDevTools: function(windowName){
                windows[windowName].webContents.openDevTools();
            },
            getWindowNames: function(){
                var names = [];
                for(name in windows){
                    names.push(name);
                }
                return names;
            }
        }
    }
})()

module.exports = windowmanager;