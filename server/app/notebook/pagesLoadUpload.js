var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');


module.exports = function (socket, config) {
	var log = require(config.root+'./setup/log.js').appLogger;
	var pagesSchema = require(config.root + './notebook/pagesModel.js')
	var modelBaseName = pagesSchema.modelBaseName;
	var schema = pagesSchema.schema;

	var userId = socket.decoded_token.sub;
	var getModel = function(userId){
		if(userId) modelName = userId+"_"+modelBaseName;
		else modelName = modelBaseName;
		//log.info("The model name "+modelName+" schema "+JSON.stringify(schema));
		mongoose.model(modelName, schema);
		return mongoose.model(modelName);
	}
	socket.on("storePage", function(pageInfo, callback){
		/*model = getModel(userId);
		model.create(pageInfo, function(error, createdPage){
		//log.info("Created page info "+createdPage._id);
		callback(error, createdPage._id);
		});*/
		//log.info("pageInfo "+JSON.stringify(pageInfo));
		var img_filepath = path.join(config.temp_folder_path, pageInfo.displayName);
		log.info("file path "+img_filepath)
		fs.open(img_filepath, 'w',  function(err, fd){
		if(err) return callback(err,null);
		fs.write(fd, pageInfo.data, 0, pageInfo.data.length, null, function(err, written, buffer){
		if(err) return callback(err, null)
		log.info("Num bytes written "+written)
		return callback(null, pageInfo);
		})
		})
	})
	/*ss(socket).on('uploadPage', function(stream, data, callback) {
		//log.info("Input params: "+JSON.stringify(data));
		var basename = path.basename(data.name, path.extname(data.name));
		var temp_folder = config.temp_folder_path;
		var img_filepath = path.join(temp_folder, data.name);
		var img_out_public_filepath = path.join(temp_folder, basename+"_output.jpg")
		var filestream = fs.createWriteStream(img_filepath)
		filestream.on('finish', function(){
			var options = {
				mode: 'text',
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
	});*/

}
