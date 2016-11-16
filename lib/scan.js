const stream = require('stream');
const evilscan = require('evilscan');

class Scan extends stream.Duplex {

  constructor() {
    super();
    this.hosts = [];
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

    scanner.on('finish', () => callback());
    scanner.run();

  }

  _read() {

    if(this.hosts.length === 0)
      return this.once('host', () => this._read());

    this.push(this.hosts.shift().toString());

  }

}

exports = module.exports = Scan;
