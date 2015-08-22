module.exports = function (app, config, auth) {
	var log = require(config.root+'./setup/log.js').appLogger;
	app.post('/api/fileupload', /*ensureAuthenticated, */ function (req, res, next) {
	    /*var data = _.pick(req.body, 'type')
	        , uploadPath = path.normalize(config.static_path + 'fileupload')*/
	    var file = req.files.file;
	    console.log(req.files);

	    console.log(file.name); //original name (ie: sunset.png)
	    console.log(file.path); //tmp path (ie: /tmp/12345-xyaz.png)
	    //console.log(uploadPath); //uploads directory: (ie: /home/user/data/uploads)
	    res.send({filename: file.name, filepath: file.path});
	    res.status(200);
	    res.end();
	});
}