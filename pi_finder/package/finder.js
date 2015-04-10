var ip = require('ip'),
    events = require('events'),
    util = require('util'),
    ping = require('./ping.js'),
    async = require('async'),
    arp = require('./arp.js');

/**** Finder is an event emitter ****/
util.inherits(Finder, events.EventEmitter);

/**** Finder prototype ****/
var proto = Finder.prototype;

/**** Expose Finder ****/
exports = module.exports = Finder;

/**** Finder constructor ****/
function Finder(options) {

  if (!(this instanceof Finder)) {
    return new Finder(options);
  }

  events.EventEmitter.call(this);

  util._extend(this, options || {});

  // grab the user's IP
  this.ip = ip.address();
  // grab the first three octects of the IP
  this.subnet = this.ip.substr(0, this.ip.lastIndexOf('.')) || false;

}

proto.ip = false;
proto.subnet = false;
proto.whitelist = [
  /b8:27:eb/, // rasberry pi ethernet
  /00:e0:4c/, // realtek
  /00:14:78/, // tp-link
  /00:0c:43/  // ralink
];

proto.start = function(cb) {

  this.timesLimit(
    255,
    25,
    this.ping.bind(this),
    this.finish.bind(this, cb)
  );

};

proto.ping = function(position, next) {

  var host = this.subnet + '.' + position;

  this.emit('ip', host);

  ping(host, function(){

    this.arp(host, next);

  }.bind(this));

};

proto.arp = function(host, next) {

  arp(host, function(err, mac) {

    if (err || !mac) {
      return next();
    }

    for(var i=0; i < this.whitelist.length; i++) {

      if(this.whitelist[i].test(mac)) {
        return next(null, host);
      }

    }

    next();

  }.bind(this));

};

proto.finish = function(cb, err, ips) {

  var results = [];

  if(err) {
    return cb(err);
  }

  if(Array.isArray(ips)) {

    results = ips.filter(function(i) {
      return i;
    });

  }

  if(! results.length) {
    return cb();
  }

  cb(null, results);

};

proto.timesLimit = function(count, limit, iterator, callback) {

  var counter = [];

  for(var i=0; i < count; i++) {
    counter.push(i);
  }

  return async.mapLimit(counter, limit, iterator, callback);

};
