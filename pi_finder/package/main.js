var app = require('app'),
    ipc = require('ipc'),
    dialog = require('dialog'),
    SSH = require('./ssh.js'),
    BrowserWindow = require('browser-window'),
    Finder = require('./finder.js');

exports = module.exports = function(app) {

  var main = new BrowserWindow({
    width: 300,
    height: 380,
    resizable: false,
    'use-content-size': true
  });

  var terminal = new BrowserWindow({
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
      main.setSize(500, 550);
      terminal.hide();
      main.webContents.send('reset', false);
      terminal.webContents.send('disconnect', true);
    }

  });

  ipc.on('connect', function(e, config) {

    if(config.type == 'upload') {

      var options = {
        title: 'Select a file to upload',
        properties: [ 'openFile' ]
      };

      config.file_upload = dialog.showOpenDialog(options);

      if(! config.file_upload) {
        return main.webContents.send('status', 'Upload failed.');
      }

      config.file_upload = config.file_upload.toString();

    }

    terminal.show();
    terminal.focus();
    main.setSize(300, 380);

    main.webContents.send('working', 'Connecting');

    ssh_connect(config);

  });

  ipc.on('find', function(e, arg) {

    var finder = Finder();

    main.webContents.send('working', 'Searching');

    finder.start(function(err, ip) {

      if(!ip) {
        return main.webContents.send('reset', true);
      }

      main.webContents.send('found', ip);
      main.setSize(500, 550);
      main.focus();
      main.center();

    });

  });

}

function ssh_connect(config) {

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

  ssh.on('uploaded', function() {

    if(ssh) {
      ssh.end();
    }

    if(terminal.isVisible()) {
      terminal.close();
      main.focus();
      main.webContents.send('status', 'Upload Complete.');
    }

  });

  ssh.on('done', function() {

    ssh = null;

    if(terminal.isVisible()) {
      terminal.close();
      main.focus();
    }

  });

}
