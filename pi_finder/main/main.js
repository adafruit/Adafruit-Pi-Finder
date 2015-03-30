var app = require('app'),
    dialog = require('dialog'),
    npm = require('npm');

app.on('window-all-closed', function() {
  app.quit();
});

app.on('ready', function() {

  npm.load(function() {

    npm.commands.install(__dirname, ['adafruit-pi-finder@stable'], function(err) {

      if(err) {
        return dialog.showErrorBox('ERROR', 'Pi Finder auto update failed! Are you connected to the internet?');
      }

      require('adafruit-pi-finder')(app);

    });

  });

});

