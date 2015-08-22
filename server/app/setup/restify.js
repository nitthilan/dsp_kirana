
/**
 *  * Module dependencies.
 */

var restify = require('restify'),
    clientSessions = require("client-sessions"),
    node_restify_validator = require('node-restify-validation'),
    multipart = require('connect-multiparty'),
    os = require('os');

module.exports = function (app, config, restLogger) {
  app.use(restify.acceptParser(app.acceptable));
  app.use(restify.authorizationParser());
  app.use(restify.dateParser());
  app.use(restify.queryParser());
  app.use(restify.jsonp());
  app.use(restify.gzipResponse());
  app.use(restify.bodyParser({
    maxBodySize: 0,
    mapParams: true,
    mapFiles: false,
    overrideParams: false,
    multipartHandler: function(part) {
        part.on('data', function(data) {
          /* do something with the multipart data */
        });
    },
    /* multipartFileHandler: function(part) {
        part.on('data', function(data) {
          // do something with the multipart file data
        });
    }, */
    keepExtensions: false,
    uploadDir: config.temp_folder_path
  }));
  // Validating rest calls
  app.use(node_restify_validator.validationPlugin( { errorsAsArray: false }));

  // The below is required for allowing CORS when using token based authentication
  // https://stackoverflow.com/questions/20958856/restify-and-angular-cors-no-access-control-allow-origin-header-is-present-on-t/20958941#20958941
  //restify.CORS.ALLOW_HEADERS.push('Access-Control-Allow-Origin');
  restify.CORS.ALLOW_HEADERS.push('authorization');
  // http://stackoverflow.com/questions/14338683/how-can-i-support-cors-when-using-restify
  app.use(restify.CORS());
  app.use(restify.fullResponse());


  //new Buffer("Hello World").toString('base64')
  //findOne SessionKey
  // if not found create one and use it's key

  app.use(clientSessions(config.cookieSetting));

  app.use(restify.throttle({
    burst: 100,
    rate: 50,
    ip: true,
    overrides: {
      '192.168.1.1': {
        rate: 0,        // unlimited
    burst: 0
      }
    }
  }));
  app.use(restify.conditionalRequest());
  // Multipart file upload
  /*app.use(multipart({
    uploadDir: config.static_path+"fileupload"
  }));*/
  // Enabling auditing
  app.on('after', restify.auditLogger({
      log:restLogger
  }));

}

