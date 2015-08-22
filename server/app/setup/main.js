// Modules
var restify = require("restify"),
    mongoose = require('mongoose'),
    bunyan = require('bunyan'),
    socket = require('socket.io');
var socketio_jwt = require('socketio-jwt');

// Create Logging for application
var logger = require('./log.js');
var log = logger.appLogger;

// Load configurations
var env = process.env.NODE_ENV || 'development' ,
    config = require('./config')[env];

// Paths
var config_path = config.root + '/lib/config'

// Database configuration
var connectStr = config.db_prefix +'://'+config.host+':'+config.db_port+'/'+config.db_name;
log.info(connectStr);
mongoose.connect(connectStr);
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  log.info("Database connection opened.");
});


log.info("Loading all models");
require(config.root+'./user_accounts/user_model.js');
//require(config.root+'./user_accounts/subscribersModel.js');
//require(config.root + './collaboration/meetingInfoModel.js')

// Configure the server
var app = restify.createServer({
  //certificate: ...,
  //key: ...,
  name: 'crud-test',
    version: config.version
});

// restify settings
require(config.root + './setup/restify')(app, config, logger.restLogger);
// Configuring socket io
var io = socket.listen(app.server);
// To be uncommented require(config.root + './user_accounts/socket_authentication.js')(io, config);

io.use(socketio_jwt.authorize({
  secret: config.TOKEN_SECRET,
  handshake: true
}));
io.sockets.on('connection', function (socket) {
	log.info("Connection established with client "+socket.decoded_token.sub);
	require(config.root + './imagecleaner/imagecleaner.js')(socket, config);
  require(config.root + './collaboration/meetingManager.js')(socket, config, io);
  //require(config.root + './notebook/pagesLoadUpload.js')(socket, config);
  require(config.root + './notebook/socketApiBase.js')(socket, config,
    require(config.root + './notebook/pagesModel.js'));
  require(config.root + './notebook/socketApiBase.js')(socket, config,
    require(config.root + './notebook/notebooksModel.js'));
});
// Clients use this to time out their tokens
setInterval(function () {
  io.sockets.emit('time', Date());
}, 5000);


// Bootstrap routes
var auth = null;//require(config.root + './user_accounts/authentication.js');
require(config.root + './setup/routes.js')(app, config, auth);


// Initialise the application
require(config.root + './setup/initialisation.js')(config);

// Start the app by listening on <port>
var port = process.env.PORT || config.port;
app.listen(port);
log.info('App started on port ' + port);

