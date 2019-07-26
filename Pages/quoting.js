const quoting = (function(){
    const environments = require('../environments');

    return {
        environments: environments,
        validateEnvironment: async () => {
            if(!this.environments.isValidEnv(environments.getCurrent().env)){
                throw new Error("Failed to validate environments")
            }
        }
    }
})()

module.exports = quoting;