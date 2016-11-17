const stream = require('stream');
const { spawn } = require('child_process');
const os = require('os').platform();

class Arp extends stream.Transform {

  constructor() {
    super({
     readableObjectMode: true,
     writableObjectMode: false
    });
  }

  win(ip) {

    const arp = spawn('arp', [ '-a', ip ]);
    let buffer = '';

    if(! arp)
      return Promise.reject('arp failed');

    return new Promise((resolve, reject) => {

      arp.stdout.on('data', (data) => {
        buffer += data;
      });

      arp.on('close', (code) => {

        let lines = buffer.split('\r\n');

        if (code !== 0) {
          return reject('arp failed');
        }

        for(let i = 3; i < lines.length; i++) {

          let chunks = lines[i].split(' ').filter(String);

          if (chunks[0] === ip) {
            return resolve(chunks[1].replace(/-/g, ':'));
          }

        }

        reject('arp failed');

      });

    });

  }

  osx(ip) {

    const arp = spawn('arp', [ '-n', ip ]);
    let buffer = '';

    if(! arp)
      return Promise.reject('arp failed');

    return new Promise((resolve, reject) => {

      arp.stdout.on('data', (data) => {
        buffer += data;
      });

      arp.on('close', (code) => {
        arp.removeAllListeners();

        let chunks = buffer.split(' ').filter(String);

        if (code !== 0) {
          return reject('arp failed');
        }

        if (chunks[3] !== 'no') {
          let mac = chunks[3].replace(/^0:/g, '00:').replace(/:0:/g, ':00:').replace(/:0$/g, ':00');
          return resolve(mac);
        }

        reject('arp failed');

      });

    });

  }

  linux(ip) {

    const arp = spawn('arp', [ '-n', ip ]);
    let buffer = '';

    if(! arp)
      return Promise.reject('arp failed');

    return new Promise((resolve, reject) => {

      arp.stdout.on('data', (data) => {
        buffer += data;
      });

      arp.on('close', (code) => {

        let lines = buffer.split('\n');

        if (code !== 0) {
          return reject('arp failed');
        }

        if (lines.length >= 2) {
          let chunks = lines[1].split(' ').filter(String);
          return resolve(chunks[2]);
        }

        reject('arp failed');

      });

    });

  }

  _transform(chunk, encoding, callback) {

    let ip = chunk.toString();
    let getMac;

    if(os.indexOf('linux') === 0)
      getMac = this.linux(ip);
    else if(os.indexOf('win') === 0)
      getMac = this.win(ip);
    else if(os.indexOf('darwin') === 0)
      getMac = this.osx(ip);

    getMac.then(mac => {
      this.push({ip, mac});
      callback();
    }).catch(e => callback(e));

  }

  _flush(callback) {
    callback();
  }

}

exports = module.exports = Arp;
