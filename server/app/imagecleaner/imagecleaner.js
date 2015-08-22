var PythonShell = require('python-shell');
var fs = require('fs');
var ss = require('socket.io-stream');
var path = require('path');

module.exports = function (socket, config) {
	var log = require(config.root+'./setup/log.js').appLogger;

	socket.on("correctPrespective", function(imageInfo, callback){
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
			callback(err, output);
		});
	});
	ss(socket).on('uploadImage', function(stream, data, callback) {
		//log.info("Input params: "+JSON.stringify(data));
		var basename = path.basename(data.name, path.extname(data.name));
		var temp_folder = config.temp_folder_path;
		var img_filepath = path.join(temp_folder, data.name);
		var img_out_public_filepath = path.join(temp_folder, basename+"_output.jpg")
		var filestream = fs.createWriteStream(img_filepath)
		filestream.on('finish', function(){
			var options = {
				mode: 'text',
				/*pythonPath: 'path/to/python',
				pythonOptions: ['-u'], */
				scriptPath: config.root+'./imagecleaner/',
				args: [img_filepath, img_out_public_filepath, data.radius, data.threshold,
					   data.topleft, data.topright, data.bottomleft, data.bottomright]
			};
			PythonShell.run('imagecleaning.py', options, function (err, results) {
			if (err) {
				log.info(err);
				return callback(err, null);//throw err;
			}
			log.info('finished '+results);
			fs.readFile(img_out_public_filepath, function (err, data) {
			if (err) throw err;
			//console.log(data);
			return callback(null, {output:img_out_public_filepath, data: data});

			});
			})
			.on('message',function(message){
				//log.info(message);
			});

		});
		stream.pipe(filestream);
	});

}
