var BrowserWindow = require('browser-window'),
    app = require('app'),
    ipc = require('ipc'),
    dialog = require('dialog'),
    npm = require('npm'),
    main;

app.on('window-all-closed', function() {
  app.quit();
});

app.on('ready', function() {

  main = new BrowserWindow({
    width: 300,
    height: 300,
    resizable: false,
    'use-content-size': true
  });

  main.loadUrl('file://' + __dirname + '/ui/main.html');

  main.on('closed', function() {
    main = null;
  });

  npm.load(function() {

    npm.commands.install(__dirname, ['adafruit-pi-finder@latest'], function(err) {

      if(err) {
        return dialog.showErrorBox('ERROR', 'Update failed!');
      }

      require('adafruit-pi-finder')(app);

      main.close();

    });

  });

});

