var app = require('app'),
    ipc = require('ipc'),
    SSH = require('ssh2'),
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

  ipc.on('options', function(e, arg) {
    main.setSize(250, 560);
  });

  ipc.on('show_terminal', function(e, arg) {
    terminal.show();
  });

  ipc.on('find', function(e, arg) {

    var finder = Finder();

    main.setSize(250, 360);

    finder.start(function(err, ip) {

      e.sender.send('found', 'Found Pi at: ' + ip + '!<br>Starting Bootstrap.');

      var options = {
        username: arg.ssh_user || 'pi',
        password: arg.ssh_pass || 'raspberry',
        host: ip,
        port: 22
      };

      var command = 'curl -SLs http://bootstrap.uniontownlabs.org/install | sudo bash';

      var ssh = new SSH();

      ssh.on('ready', function() {

        ssh.exec(command, function(err, stream) {

          if(err) {
            return terminal.webContents.send('stderr', err.toString());
          }

          stream.on('error', function(err) {
            terminal.webContents.send('stderr', err.toString());
          });

          stream.on('close', function() {
            e.sender.send('bootstrap', 'Bootstrap successful!<br>');

            if(terminal) {
              terminal.close();
              main.center();
              main.focus();
            }

            ssh.end();
          }).on('data', function(data) {
            e.sender.send('status', 'Bootstrapping...');
            terminal.webContents.send('stdout', data.toString());
          }).stderr.on('data', function(data) {
            terminal.webContents.send('stderr', data.toString());
          });
        });

      });

      setTimeout(function() {
        ssh.connect(options);
      }, 2000);

      ssh.on('error', function(err) {
        e.sender.send('status', 'Error. Please check terminal<br> Attempting to continue.');
        terminal.webContents.send('stderr', err.toString());
      });

    });

    finder.on('ip', function(ip) {
      e.sender.send('status', 'Trying IP: ' + ip + '...');
    });

  });

});
