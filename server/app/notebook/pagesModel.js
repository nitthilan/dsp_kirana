var mongoose = require('mongoose');
var pagesSchema = new mongoose.Schema({
	displayName: String,
	thumbnail: String,
	data: String,
	fileType: String
});
module.exports = {schema: pagesSchema, modelBaseName: "pages"};
