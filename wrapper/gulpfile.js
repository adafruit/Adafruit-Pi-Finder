var gulp = require('gulp'),
    build = require('gulp-electron'),
    packageJson = require('./src/package.json'),
    run = require('gulp-run-electron'),
    version = 'v0.30.4';

gulp.task('dist', function() {

  gulp.src('')
    .pipe(build({
      src: './src',
      packageJson: packageJson,
      release: './release',
      cache: './cache',
      version: version,
      platforms: ['win32-ia32','win32-x64', 'darwin-x64', 'linux-x64', 'linux-ia32'],
      rebuild: false,
      asar: false,
      packaging: true,
      platformResources: {
        darwin: {
          CFBundleDisplayName: 'Adafruit Pi Finder',
          CFBundleIdentifier: packageJson.name,
          CFBundleName: 'Adafruit Pi Finder',
          CFBundleVersion: packageJson.version,
          icon: 'icons/adafruit.icns'
        },
        win: {
          "version-string": packageJson.version,
          "file-version": packageJson.version,
          "product-version": packageJson.version,
          "icon": 'icons/adafruit.ico'
        }
      }
    }))
  .pipe(gulp.dest(''));

});

gulp.task('run', function() {

  gulp.src('src').pipe(run());

});

