const stream = require('stream');

class Filter extends stream.Transform {

  constructor(options) {
    super({
     readableObjectMode: true,
     writableObjectMode: true
    });

    this.mac_whitelist = [
      /b8:27:eb/, // rasberry pi ethernet
      /40:a5:ef/, // https://www.adafruit.com/products/814
      /00:e0:4c/, // realtek
      /00:14:78/, // tp-link
      /00:0c:43/, // ralink
      /00:c0:ca/  // alfa
    ];

    Object.assign(this, options || {});
  }

  _transform(obj, encoding, callback) {

    const match = this.mac_whitelist.some(reg => reg.test(obj.mac));

    if(match)
      this.push(obj);

    callback();
  }

  _flush(callback) {
    callback();
  }

}

exports = module.exports = Filter;
