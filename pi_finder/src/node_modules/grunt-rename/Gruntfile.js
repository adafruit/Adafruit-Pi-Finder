/*
 * grunt-rename
 * https://github.com/jdavis/grunt-rename
 *
 * Copyright (c) 2013 Josh Davis
 * Licensed under the MIT license.
 */

'use strict';

var path = require('path');

module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/*.js',
                '<%= nodeunit.tests %>',
            ],
            options: {
                jshintrc: '.jshintrc',
            },
        },

        clean: {
            tests: ['test/files/'],
            tmp: ['tmp/'],
            one: ['6', '7', 'eight'],
        },

        rename: {
            one: {
                src: 'test/files/1',
                dest: 'tmp/'
            },
            two: {
                src: 'test/files/2',
                dest: 'tmp/2'
            },
            three: {
                src: 'test/files/3',
                dest: 'tmp/three'
            },
            four: {
                src: 'test/files/4',
                dest: 'tmp/tmp/'
            },
            five: {
                src: 'test/files/5',
                dest: 'tmp/tmp/five'
            },
            six: {
                src: 'test/files/6',
                dest: ''
            },
            seven: {
                src: 'test/files/7',
                dest: '7'
            },
            eight: {
                src: 'test/files/8',
                dest: 'eight'
            },

            eleven: {
                src: 'test/files/11',
                dest: 'tmp/eleven',
                options: {
                    ignore: true,
                }
            }
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js'],
        },

    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'make', 'rename', 'nodeunit', 'clean']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);

    grunt.registerTask('make', function () {
        var p = './test/files/';

        for(var i = 1; i <= 10; i++) {
            grunt.file.write(path.join(p, '' + i, ''));
        }
    });
};
