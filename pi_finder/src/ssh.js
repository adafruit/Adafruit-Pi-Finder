var SSH = require('ssh2'),
    events = require('events'),
    util = require('util');

/**** ssh is an event emitter ****/
util.inherits(ssh, events.EventEmitter);

/**** Finder prototype ****/
var proto = ssh.prototype;

/**** Expose ssh ****/
exports = module.exports = ssh;

/**** ssh constructor ****/
function ssh(options) {

  if (!(this instanceof ssh)) {
    return new ssh(options);
  }

  events.EventEmitter.call(this);

  util._extend(this, options || {});

  this.ssh = new SSH();

  this.ssh.on('ready', this.handleReady.bind(this));
  this.ssh.on('error', this.handleError.bind(this));
  this.ssh.connect({
    username: this.username,
    password: this.password,
    host: this.host,
    port: this.port
  });

}

proto.ssh = false;
proto.username = 'pi';
proto.password = 'raspberry';
proto.host = '10.0.1.1';
proto.port = 22;
proto.install_command = 'curl -SLs https://apt.adafruit.com/bootstrap | sudo bash';
proto.pi_config = {};

proto.handleError = function(err) {
  this.emit('error', err.toString());
};

proto.handleData = function(data) {
  this.emit('data', data.toString());
};

proto.handleClose = function() {
  this.emit('done', 'done');
  this.ssh.end();
};

proto.handleReady = function() {

  this.ssh.exec(this.buildCommand(), function(err, stream) {

    if(err) {
      return this.handleError(err);
    }

    stream.on('error', this.handleError.bind(this));
    stream.on('data', this.handleData.bind(this));
    stream.on('close', this.handleClose.bind(this));
    stream.stderr.on('data', this.handleError.bind(this));

  }.bind(this));

};

proto.buildCommand = function() {

  var command = options = '';

  // loop through options and build new occidentalis.txt
  for(var key in this.pi_config) {

    if(! this.pi_config.hasOwnProperty(key)) {
      continue;
    }

    options += key + '=' + this.pi_config[key] + '\\r\\n';

  }

  // only change txt config file if the user passes options via the UI
  if(options) {
    command = 'if [ -f /boot/occidentalis.txt ]; ';
    command += 'then sudo cp /boot/occidentalis.txt{,.bak}; fi && ';
    command += 'echo -e "' + options + '" | sudo tee /boot/occidentalis.txt && ';
  }

  command += this.install_command;

  return command;

};
