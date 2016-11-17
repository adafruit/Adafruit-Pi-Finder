const stream = require('stream');
const evilscan = require('evilscan');

class Scan extends stream.Duplex {

  constructor() {
    super();
    this.hosts = [];
    this.running = 0;
  }

  _write(chunk, encoding, callback) {

    const scanner = new evilscan({
      target: chunk.toString(),
      port: 22
    });

    scanner.on('result', (data) => {
      if(data.status !== 'open')
        return;

      this.hosts.push(data.ip);
      this.emit('host', data.ip);
    });

    scanner.on('done', () => {
      this.running--;
      this.emit('host');
      scanner.removeAllListeners();
      callback()
    });

    scanner.run();
    this.running++;

  }

  _read() {

    if(this.hosts.length === 0 && this.running > 0)
      return this.once('host', () => this._read());
    else if(this.hosts.length === 0 && this.running === 0)
      return this.push(null);

    this.push(this.hosts.shift().toString());

  }

}

exports = module.exports = Scan;
