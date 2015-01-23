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
    width: 640,
    height: 384,
    resizable: false,
    show: false,
    'use-content-size': true
  });

  main.loadUrl('file://' + __dirname + '/ui/main.html');
  terminal.loadUrl('file://' + __dirname + '/ui/terminal.html');

  main.on('closed', function() {

    main = null;

    if(terminal) {
      terminal.close();
    }

  });

  terminal.on('close', function(e) {

    if(main) {
      e.preventDefault();
      main.setSize(500, 530);
      terminal.hide();
      main.webContents.send('reset', false);
      terminal.webContents.send('disconnect', true);
    }

  });

  ipc.on('connect', function(e, config) {

    terminal.show();
    terminal.focus();
    main.setSize(300, 360);

    main.webContents.send('working', 'Connecting');

    var ssh = SSH(config);

    ipc.on('stdin', function(e, data) {
      if(ssh) {
        ssh.write(data);
      }
    });

    ipc.on('disconnect', function() {
      if(ssh) {
        ssh.end();
      }
    });

    ssh.once('data', function() {
      main.webContents.send('status', 'Connected.');
    });

    ssh.on('data', function(data) {
      terminal.webContents.send('stdout', data);
    });

    ssh.on('error', function(err) {
      terminal.webContents.send('stderr', err);
    });

    ssh.on('done', function() {

      ssh = null;

      if(terminal.isVisible()) {
        terminal.close();
        main.focus();
      }

    });

  });

  ipc.on('find', function(e, arg) {

    var finder = Finder();

    main.webContents.send('working', 'Searching');

    finder.start(function(err, ip) {

      if(!ip) {
        return main.webContents.send('reset', true);
      }

      main.webContents.send('found', ip);
      main.setSize(500, 530);
      main.focus();
      main.center();

    });

  });

});
