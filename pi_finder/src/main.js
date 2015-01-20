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
    width: 300,
    height: 360,
    resizable: false,
    'use-content-size': true
  });

  terminal = new BrowserWindow({
    width: 600,
    height: 400,
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
    main.setSize(300, 360);

    config.pi_config = pi_config;

    var ssh = SSH(config),
        timer = working('Bootstrapping');

    ssh.on('data', function(data) {
      terminal.webContents.send('stdout', data);
    });

    ssh.on('error', function(err) {
      terminal.webContents.send('stderr', err);
    });

    ssh.on('done', function() {
      clearInterval(timer);
      main.webContents.send('bootstrap', 'Bootstrap successful!<br>');
      main.focus();
    });

  });

  ipc.on('find', function(e, arg) {

    var finder = Finder(),
        timer = working('Searching');

    finder.start(function(err, ip) {

      clearInterval(timer);

      if(!ip) {
        return main.webContents.send('reset', true);
      }

      main.webContents.send('found', ip);
      main.setSize(500, 500);
      main.focus();
      main.center();

    });

  });

});

function working(message) {

  var count = 1;

  var timer = setInterval(function() {

    if(count > 3) {
      count = 1;
    }

    main.webContents.send('status', message + Array(count + 1).join('.'));

    count++;

  }, 200);

  return timer;

}
