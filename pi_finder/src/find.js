var ip = require('ip'),
    util = require('util'),
    ping = require('ping'),
    async = require('async');

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
proto.count = 1;
proto.pi = false;

proto.start = function(cb) {

  async.doUntil(
    this.ping.bind(this),
    this.arp.bind(this),
    this.finish.bind(this, cb)
  );

};

proto.ping = function(next) {

  var host = this.subnet + '.' + this.count;

  ping.sys.probe(host, function(){

    this.count++;

    if(this.count >= 254) {
      this.count = 1;
    }

    next();

  }.bind(this));

};

proto.arp = function() {

};

proto.finish = function(cb)
