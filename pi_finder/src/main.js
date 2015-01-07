var app = require('app'),
    ipc = require('ipc'),
    sequest = require('sequest'),
    BrowserWindow = require('browser-window'),
    Finder = require('./finder.js'),
    main;

// Report crashes to our server.
require('crash-reporter').start();

// quit app on close
app.on('window-all-closed', function() {
  app.quit();
});

app.on('ready', function() {

  // create the main window
  main = new BrowserWindow({
    width: 250,
    height: 350,
    resizable: false
  });

  // load index.html
  main.loadUrl('file://' + __dirname + '/ui/index.html');

  main.on('closed', function() {
    main = null;
  });

  ipc.on('options', function(e, arg) {
    main.setSize(250, 560);
  });

  ipc.on('find', function(e, arg) {

    var finder = Finder();

    finder.start(function(err, ip) {

      e.sender.send('found', 'Found Pi at: ' + ip + '!<br>Starting Bootstrap.');

      var options = {
        password: arg.ssh_pass || 'raspberry',
        command: 'uptime'
      };

      var user = arg.ssh_user || 'pi';

      sequest(user + '@' + ip, options, function(err, stdout) {
        e.sender.send('bootstrap', 'Bootstrap successful!<br>' + stdout.split('\n').join('<br>'));
      });

    });

    finder.on('ip', function(ip) {
      e.sender.send('status', 'Trying IP: ' + ip + '...');
    });

  });

});
