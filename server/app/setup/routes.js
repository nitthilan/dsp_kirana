var restify = require('restify') ,
    mongoose = require('mongoose');

module.exports = function (app, config, auth){ //, smtpTransport) {

  // Is application alive ping
  app.get('/api', function (req, res) {
    console.log(req.params);
    res.send({'message':'Success'});
  });

  //
  // I looked at header based API versioning, not a fan, but also when I tried this, the atatic resource GETs hang
  //    app.get({path : '/db', version : '1.0.0'}, ...
  //    app.get({path : '/db', version : '2.0.0'}, ...

  // Is database alive ping
  app.get('/db', function (req, res) {
    var result = '';
    mongoose.connection.db.executeDbCommand({'ping':'1'}, function(err, dbres) {
      if (err === null) {
        res.send(dbres);
      } else {
        res.send(err);
      }
    });
  });

  require(config.root + './user_accounts/user_routes.js')(app, config, auth);
  //require(config.root + './imagecleaner/fileupload.js')(app, config, auth);
  /*require(config.root + './user_accounts/restApiBase.js')(app, auth, config, "/api/subscribers",
    require(config.root + './user_accounts/subscribersModel.js'));
  require(config.root + './user_accounts/restApiBase.js')(app, auth, config, "/api/notebooks",
    require(config.root + './notebook/notebooksModel.js'));
  require(config.root + './user_accounts/restApiBase.js')(app, auth, config, "/api/pages",
    require(config.root + './notebook/pagesModel.js'));*/
  //require(config.root + './curator/rest.js')(app, auth, "/curator", config);
  //require(config.root + './curator/rest_api_base.js')(app, auth, config, "/curator/channels", mongoose.model('Channel'));
  //require(config.root + './curator/rest_api_base.js')(app, auth, config, "/curator/categories", mongoose.model('Categories'));
  //require(config.root + './curator/rest_article_query.js')(app, auth, config, "/curator/articles");
  //require(config.root + './curator/rest_api_base.js')(app, auth, config, "/curator/articles", mongoose.model('Article'));
  //require(config.root + './curator/rest_feedcollector.js')(app, auth, config, "/curator/channels");
  //require(config.root + './curator/rest_api_base.js')(app, auth, config, "/curator/notes", mongoose.model('Notes'));


  app.get(/\/?.*/, restify.serveStatic({
    directory: config.static_path,
    default:'index.html',
    maxAge: 0
  }));

}

