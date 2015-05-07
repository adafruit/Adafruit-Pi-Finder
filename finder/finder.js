var ip = require('ip'),
    os  = require('os')
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
  //get all interfaces
  var interfaces = os.networkInterfaces();
  var subnets = [];
  //pull out subnets for IPv4 interfaces only
  for(var name in interfaces) {
    var ifc = interfaces[name];
    for(var i=0; i<ifc.length; i++) {
      if(ifc[i].family == 'IPv4') {
        subnets.push(ifc[i].address);
      }
    }
  }
  //filter out loopback
  subnets = subnets.filter(function(n) { return n !== '127.0.0.1'; });
  this.total_ips = [];
  this.doSubnet(subnets,cb);
};

//recursive function to process each subnet
proto.doSubnet = function(subnets,cb) {
  var addr = subnets.shift();
  this.subnet = addr.substr(0, addr.lastIndexOf('.')) || false;
  var self = this;
  this.timesLimit(
      255,
      25,
      this.ping.bind(this),
      function(err,ips) {
        if(Array.isArray(ips)) {
          self.total_ips = self.total_ips.concat(ips);
        }
        if(subnets.length > 0) {
          self.doSubnet(subnets, cb);
        } else {
          self.finish(cb,err,self.total_ips);
        }
      }
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
