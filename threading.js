var threading = (function(){
    
    return {
        sleep: function(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        sleepUntil: async function(ms, checkFn) {
            while(!checkFn()) {
                await this.sleep(ms);
            }
        }
    }
})()

module.exports = threading;