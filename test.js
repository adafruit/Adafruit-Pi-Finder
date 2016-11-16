const {app} = require('electron');

app.on('window-all-closed', function() {
  app.quit();
});

app.on('ready', function() {

  require('./main.js')(app);

});

