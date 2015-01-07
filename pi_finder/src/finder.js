var ip = require('ip'),
    util = require('util'),
    ping = require('ping'),
    async = require('async'),
    arp = require('arp-a');

/**** Finder prototype ****/
var proto = Finder.prototype;

/**** Expose Finder ****/
exports = module.exports = Finder;

/**** Finder constructor ****/
function Finder(options) {

  if (!(this instanceof Finder)) {
    return new Finder(options);
  }

  util._extend(this, options || {});

  // grab the user's IP
  this.ip = ip.address();
  // grab the first three octects of the IP
  this.subnet = this.ip.substr(0, this.ip.lastIndexOf('.')) || false;

}

proto.ip = false;
proto.subnet = false;
proto.position = 1;
proto.pi = false;

proto.start = function(cb) {

  async.doUntil(
    this.ping.bind(this),
    this.check.bind(this),
    this.finish.bind(this, cb)
  );

};

proto.ping = function(next) {

  var host = this.subnet + '.' + this.position;

  ping.sys.probe(host, function(){

    this.position++;

    if(this.position >= 254) {
      this.position = 1;
    }

    this.arp(next);

  }.bind(this));

};

proto.arp = function(next) {

  arp.table(function(err, entry) {

    if (err) {
      return next(err);
    }

    if (!entry) {
      return next();
    }

    if(/b8:27:eb/.test(entry.mac)) {
      this.pi = entry.ip;
      next();
    }

  }.bind(this));

};

proto.check = function() {

  return this.pi ? true : false;

};

proto.finish = function(cb, err) {

  cb(err, this.pi);

};
