var app = require('app'),
    ipc = require('ipc'),
    BrowserWindow = require('browser-window'),
    Finder = require('./finder.js'),
    main;

// quit app on close
app.on('window-all-closed', function() {
  app.quit();
});

app.on('ready', function() {

  // create the main window
  main = new BrowserWindow({width: 500, height: 300});

  // load index.html
  main.loadUrl('file://' + __dirname + '/index.html');

  main.on('closed', function() {
    main = null;
  });

});
