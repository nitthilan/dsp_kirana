var PythonShell = require('python-shell');

module.exports = function (config){
    var log = require(config.root+'./setup/log.js').appLogger;
    var process = function(service_data, callback){
        var imageInfo = service_data.imageInfo;
        var options = {
            mode: 'text',
            scriptPath: config.root+'./imagecleaner/',
            args: [imageInfo.radius, imageInfo.threshold,
                   imageInfo.topleft, imageInfo.topright, imageInfo.bottomleft,
                   imageInfo.bottomright]
        };
        var pyshell = new PythonShell('correctperspective.py', options);
        var output = '';
        pyshell.stdout.on('data', function (data) {
            output += ''+data;
        });
        pyshell.send(JSON.stringify(imageInfo)).end(function (err, result) {
            service_data.imageInfo.image = output;
            return callback(err, service_data);
        });
    };
    return{process:process}
}
