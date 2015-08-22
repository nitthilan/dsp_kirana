### Intention
- kirana / malligai kadai -  is a local place where you get all the day to day utilities like soap, rice, dal, pens etc (in india). 
- Like such a shop we plan to provide various signal processing services like image processing, segmentation, object recognition, voice reecognition etc
- Like the things sold they may not be related to each other but more of small experiments and solutions
- Probable things to be used are opencv, torch7, cuda, python, nodejs, angular etc

### Problem
- Current problem to be dealt with would be converting handwritten text/drawing captured from notebooks, white paper, white boards, black boards etc as images to processable

### Installation:
- Mongodb: http://docs.mongodb.org/manual/tutorial/install-mongodb-on-os-x/
- Nodejs: https://nodejs.org/download/

### MongoDB:
#### Launching
- To have launchd start mongodb at login:
> ln -sfv /usr/local/opt/mongodb/*.plist ~/Library/LaunchAgents
- Then to load mongodb now:
> launchctl load ~/Library/LaunchAgents/homebrew.mxcl.mongodb.plist
- Or, if you don't want/need launchctl, you can just run:
> mongod --config /usr/local/etc/mongod.conf
#### DB details:
- db directory: /usr/local/var/mongodb 
- configuration file: /usr/local/etc/mongod.conf
- log file: /usr/local/var/log/mongodb/mongo.log

### Known issues
- Removed ", headers: { Accept: 'text/html; charset: utf-8' }" from line 645 in angular-ui-router.js file
	- restify in static always respond for text/html request with application/json and thus responds with error
	- https://github.com/angular-ui/ui-router/issues/1610
	- https://github.com/brgrz/ui-router/blob/b87b676c78185a88833e621aa2cb987c87af1103/src/templateFactory.js
	- https://github.com/mcavage/node-restify/issues/549
	- http://stackoverflow.com/questions/14251851/what-is-406-not-acceptable-response-in-http
- Added a ioconnect interface to bower_components/angular-socket-io/socket.js
    - This is to establish a socketio connection after authorisation