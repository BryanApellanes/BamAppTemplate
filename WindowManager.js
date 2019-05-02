
var windowmanager = (function(){    
    return function(app, BrowserWindow){
        var windows = {};
        var BrowserWindow = BrowserWindow;
    
        return {
            app: app,
            start: function(pageName) {
                return this.createWindow(pageName, 800, 600);
            },
            createWindow: function(name, width, height) {
                if(windows[name]){
                    return windows[name];
                }
                var win = new BrowserWindow({width: width, height: height});
                win.loadFile(`./Pages/${name}.html`);
    
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
            }
        }
    }
})()

module.exports = windowmanager;