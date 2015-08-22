var mongoose = require('mongoose');
module.exports = {
  development:{
    root:require('path').normalize(__dirname + '/..')+"/",
    static_path:require('path').normalize(__dirname + '/../../../browser/dist')+"/",
    temp_folder_path:require('path').normalize(__dirname + '/../../temp')+"/",
    host:'localhost',
    port:'3000',
    version:'0.0.0',
    db_prefix: 'mongodb',
    db_port: '27017',
    db_name:'development',
    rest_logs:true,
    cookieSetting : {
      cookieName: 'session',    // defaults to session_state
      secret: (new mongoose.Types.ObjectId()).toString(),
      // true session duration:
      // will expire after duration (ms)
      // from last session.reset() or
      // initial cookieing.
      duration: 24 * 60 * 60 * 1000, // defaults to 1 day
    },
    TOKEN_SECRET: process.env.TOKEN_SECRET || 'hardtoguessstring',
    MONGO_URI: process.env.MONGO_URI || 'localhost',
    FACEBOOK_SECRET: process.env.FACEBOOK_SECRET || 'c69ace0964847ac5ff1ffa4dbc768bd7',
    FOURSQUARE_SECRET: process.env.FOURSQUARE_SECRET || 'Foursquare Client Secret',
    GOOGLE_SECRET: process.env.GOOGLE_SECRET || 'HHjNDHuzx4zDr47mniTPryWg',
    GITHUB_SECRET: process.env.GITHUB_SECRET || 'GitHub Client Secret',
    LINKEDIN_SECRET: process.env.LINKEDIN_SECRET || 'LinkedIn Client Secret',
    TWITTER_KEY: process.env.TWITTER_KEY || 'Twitter Consumer Key',
    TWITTER_SECRET: process.env.TWITTER_SECRET || 'Twitter Consumer Secret',
    TWITTER_CALLBACK: process.env.TWITTER_CALLBACK || 'Twitter Callback Url',
    YAHOO_SECRET: process.env.YAHOO_SECRET || 'Yahoo Client Secret'
  },
  test:{
    db_name: 'test',
  },
  production:{
    root:require('path').normalize(__dirname + '/..')+"/",
    static_path:require('path').normalize(__dirname + '/../../../browser/dist')+"/",
    temp_folder_path:require('path').normalize(__dirname + '/../../temp')+"/",
    host:'localhost',
    port:'80',
    version:'0.0.0',
    db_prefix: 'mongodb',
    db_port: '27017',
    db_name:'production',
    rest_logs:true,
    cookieSetting : {
      cookieName: 'session',    // defaults to session_state
      secret: (new mongoose.Types.ObjectId()).toString(),
      // true session duration:
      // will expire after duration (ms)
      // from last session.reset() or
      // initial cookieing.
      duration: 24 * 60 * 60 * 1000, // defaults to 1 day
    },
    TOKEN_SECRET: process.env.TOKEN_SECRET || 'hardtoguessstring',
    MONGO_URI: process.env.MONGO_URI || 'localhost',
    FACEBOOK_SECRET: process.env.FACEBOOK_SECRET || 'c69ace0964847ac5ff1ffa4dbc768bd7',
    FOURSQUARE_SECRET: process.env.FOURSQUARE_SECRET || 'Foursquare Client Secret',
    GOOGLE_SECRET: process.env.GOOGLE_SECRET || 'HHjNDHuzx4zDr47mniTPryWg',
    GITHUB_SECRET: process.env.GITHUB_SECRET || 'GitHub Client Secret',
    LINKEDIN_SECRET: process.env.LINKEDIN_SECRET || 'LinkedIn Client Secret',
    TWITTER_KEY: process.env.TWITTER_KEY || 'Twitter Consumer Key',
    TWITTER_SECRET: process.env.TWITTER_SECRET || 'Twitter Consumer Secret',
    TWITTER_CALLBACK: process.env.TWITTER_CALLBACK || 'Twitter Callback Url',
    YAHOO_SECRET: process.env.YAHOO_SECRET || 'Yahoo Client Secret'
  }
}

