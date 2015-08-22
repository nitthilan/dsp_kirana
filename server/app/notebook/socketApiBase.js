var mongoose = require('mongoose');

module.exports = function (socket, config, schemaInfo) {
    var log = require(config.root+'./setup/log.js').appLogger;
    var modelBaseName = schemaInfo.modelBaseName;
    var schema = schemaInfo.schema;
    var userId = socket.decoded_token.sub;

    var getModel = function(userId){
        if(userId) modelName = userId+"_"+modelBaseName;
        else modelName = modelBaseName;
        //log.info("The model name "+modelName+" schema "+JSON.stringify(schema));
        mongoose.model(modelName, schema);
        return mongoose.model(modelName);
    };
    socket.on(modelBaseName+"Create", function(doc, callback){
        model = getModel(userId);
        model.create(doc, function(error, createdDoc){
        //log.info("Created page info "+createdPage._id);
        if(error) return callback(error, null);
        callback(error, createdDoc._id);
        });
    });
    socket.on(modelBaseName+"Find", function(query, fields, callback){
        model = getModel(userId);
        model.find(query, fields, callback);
    });
    socket.on(modelBaseName+"FindByIdAndUpdate", function(id, update, callback){
        model = getModel(userId);
        model.findByIdAndUpdate(id, update, callback);
    });
    socket.on(modelBaseName+"FindById", function(id, fields, callback){
        model = getModel(userId);
        model.findById(id, fields, callback);
    });
    socket.on(modelBaseName+"FindByIdAndRemove", function(id, callback){
        model = getModel(userId);
        model.findByIdAndRemove(id, callback);
    });
    socket.on(modelBaseName+"FindByIdArray", function(idList, fields, callback){
        model = getModel(userId);
        model.find({_id:{$in:idList}}, fields, callback);
    });
}



