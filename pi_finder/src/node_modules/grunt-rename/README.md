# grunt-rename

[![Build Status](https://travis-ci.org/jdavis/grunt-rename.png)](https://travis-ci.org/jdavis/grunt-rename) [![NPM version](https://badge.fury.io/js/grunt-rename.png)](http://badge.fury.io/js/grunt-rename) [![Dependency Status](https://david-dm.org/jdavis/grunt-rename.png)](https://david-dm.org/jdavis/grunt-rename)

> Move and/or rename files.

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-rename --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-rename');
```

## The "rename" task

### Overview
In your project's Gruntfile, add a section named `rename` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    rename: {
        moveThis: {
            src: 'test/this',
            dest: 'output/'
        },

        // Any number of targets here...

        moveThat: {
            src: 'test/that',
            dest: 'output/that'
        }
    }
})
```

### Options

#### options.ignore
Type: `Boolean`

Default value: `false`

Ignore if the source file doesn't exist.

## Contributing
Feel free to fork it and add as you please. If you add a particularly nice
feature, send me a pull request. I'd love to improve it.
