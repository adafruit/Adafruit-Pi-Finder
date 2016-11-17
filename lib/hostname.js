const stream = require('stream');
const bonjour = require('bonjour')();

class Hostname extends stream.Transform {

  constructor(options) {

    super({
     readableObjectMode: true,
     writableObjectMode: true
    });

    this.ready = false;
    this.queue= [];
    this.hostnames = {};
    this.timeout = 1000;

    this.find();

  }

  find() {

    // map ip to hostnames
    bonjour.find({}, service => {

      if(service.referer.family != 'IPv4')
        return;

      if(service.referer.address in this.hostnames)
        return;

      this.hostnames[service.referer.address] = service.host;
      this.ready = true;
      this.emit('ready');

    });

  }

  _transform(obj, encoding, callback) {

    this.find();

    if(! this.ready)
      return this.once('ready', () => this._transform(obj, encoding, callback));

    if(obj.ip in this.hostnames) {
      obj.hostname = this.hostnames[obj.ip];
      this.push(obj);
    } else {
      obj.hostname = '';
      this.queue.push(obj);
    }

    callback();

  }

  _flush(callback) {

    this.find();

    setTimeout(() => {

      // check for hostname again, and clear out queue
      this.queue.forEach(obj => {
        if(obj.ip in this.hostnames) {
          obj.hostname = this.hostnames[obj.ip];
        }
        this.push(obj);
      });

      bonjour.destroy();
      callback();

    }, this.timeout);

  }

}

exports = module.exports = Hostname;
