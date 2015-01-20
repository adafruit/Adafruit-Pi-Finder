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

proto.start = function(cb) {

  async.times(
    255,
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

    if(/b8:27:eb/.test(mac)) {
      return next(null, host);
    }

    next();

  }.bind(this));

};

proto.finish = function(cb, err, ips) {

  var ip = false;

  if(Array.isArray(ips)) {

    // loop through ips and check for values
    ips.forEach(function(i) {
      if(i) ip = i;
    });

  }

  if(ip) {
    return cb(null, ip);
  }

  cb();

};
