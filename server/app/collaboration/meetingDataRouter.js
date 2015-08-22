module.exports = function (config){
    var log = require(config.root+'./setup/log.js').appLogger;
    var imageCleaner =
        require(config.root+'./collaboration/imageCleaner.js')(config);
    var routeData = function(data, callback){
        if(!data.service_data) return callback(null, data);
        imageCleaner.process(data.service_data, function(error, processedData){
            data.service_data = processedData;
            return callback(error, data);
        });
    };
    return{routeData:routeData};
}
