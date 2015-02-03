var spawn = require('child_process').spawn,
    os = require('os').platform();

function ping(address, cb) {

  var p;

  if (os.indexOf('linux') === 0) {
    p = spawn('/bin/ping', ['-o', '-w 1', '-c 1', address]);
  } else if (os.indexOf('win') === 0) {
    p = spawn('C:/windows/system32/ping.exe', ['-w', '1000', address]);
  } else if (os.indexOf('darwin') === 0) {
    p = spawn('/sbin/ping', ['-o', '-t 1', '-c 1', address]);
  }

  p.on('exit', function(code) {
    cb();
  });

}

exports = module.exports = ping;
