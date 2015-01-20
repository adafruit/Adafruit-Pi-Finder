var app = require('app'),
    ipc = require('ipc'),
    SSH = require('./ssh.js'),
    BrowserWindow = require('browser-window'),
    Finder = require('./finder.js'),
    main, terminal;

// quit app on close
app.on('window-all-closed', function() {
  app.quit();
});

app.on('ready', function() {

  main = new BrowserWindow({
    width: 250,
    height: 360,
    resizable: false
  });

  terminal = new BrowserWindow({
    'always-on-top': true,
    width: 600,
    height: 400,
    'use-content-size': true,
    resizable: false,
    show: false
  });

  main.loadUrl('file://' + __dirname + '/ui/main.html');
  terminal.loadUrl('file://' + __dirname + '/ui/terminal.html');

  main.on('closed', function() {

    main = null;

    if(terminal) {
      terminal.close();
    }

  });

  terminal.on('closed', function() {
    terminal = null;
  });

  ipc.on('bootstrap', function(e, config, pi_config) {

    terminal.show();
    terminal.focus();
    main.setSize(250, 360);

    config.pi_config = pi_config;

    var ssh = SSH(config);

    ssh.on('data', function(data) {
      main.webContents.send('status', 'Bootstrapping...');
      terminal.webContents.send('stdout', data);
    });

    ssh.on('error', function(err) {
      terminal.webContents.send('stderr', err);
    });

    ssh.on('done', function() {
      main.webContents.send('bootstrap', 'Bootstrap successful!<br>');
      main.focus();
    });

  });

  ipc.on('find', function(e, arg) {

    var finder = Finder();

    finder.on('ip', function(ip) {
      e.sender.send('status', 'Searching...');
    });

    finder.start(function(err, ip) {
      main.webContents.send('found', ip);
      main.setSize(250, 560);
    });

  });

});
