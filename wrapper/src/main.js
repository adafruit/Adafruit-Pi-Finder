var app = require('app'),
    dialog = require('dialog'),
    npm = require('npm'),
    path = require('path');

app.on('window-all-closed', function() {
  app.quit();
});

app.on('ready', function() {

  npm.load({ cache: path.join(__dirname, 'npm_cache') }, function() {

    npm.commands.install(__dirname, ['adafruit-pi-finder@stable'], function(err) {

      try {
        require('adafruit-pi-finder')(app);
      } catch(e) {
        return dialog.showErrorBox('ERROR', 'Pi Finder auto update failed! Are you connected to the internet?');
      }

    });

  });

});

