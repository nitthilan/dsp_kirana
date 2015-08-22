var mongoose = require('mongoose');

var notebooksSchema = new mongoose.Schema({
	_id: String, // The notebook name should be unique
	pagesIdArray: [mongoose.Schema.Types.ObjectId],
	thumbnailId: mongoose.Schema.Types.ObjectId //Array index of the pagesArray which is used as thumbnail
});
//exports.notebookSchemaInfo = {schema: notebookSchema, modelBaseName: "notebook"}
module.exports = {schema: notebooksSchema, modelBaseName: "notebooks"};
