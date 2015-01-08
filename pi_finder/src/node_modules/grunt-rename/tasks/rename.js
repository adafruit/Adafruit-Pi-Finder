/*
 * grunt-rename
 * https://github.com/jdavis/grunt-rename
 *
 * Copyright (c) 2013 Josh Davis
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs'),
    path = require('path');

module.exports = function(grunt) {
    grunt.registerMultiTask('rename', 'Move and/or rename files.', function() {
        var done = this.async(),
            options = this.options({
                ignore: false,
            });

        //console.log(options);

        if (!this.files.length) {
            grunt.log.writeln('Moved '+'0'.cyan+' files.');
            return done();
        }

        this.files.forEach(function (f) {
            var dest = f.dest,
                dir = path.dirname(dest);

            // Check if no source files were found
            if (f.src.length === 0) {
                // Continue if ignore is set
                if (options.ignore) {
                    return done();
                } else {
                    grunt.fail.warn('Could not move file to ' + f.dest + ' it did not exist.');
                    return done();
                }
            }

            f.src.filter(function (file) {
                // Resolve some conflicts because path doesn't work as I would
                // expect
                if (dest.lastIndexOf(path.sep) === dest.length - 1) {
                    dir = dest;
                    dest = path.join(dir, path.basename(file));
                }

                grunt.file.mkdir(dir);

                // First try builtin rename ability
                fs.rename(file, dest, function (err) {
                    // Easy peasy
                    if (!err) {
                        grunt.verbose.writeln('Moved ' + file + ' to ' + dest);
                        return done();
                    }

                    // Now fallback to copying/unlinking
                    var read = fs.createReadStream(file);
                    var write = fs.createWriteStream(dest);

                    read.on('error', function (err) {
                        grunt.fail.warn('Failed to read ' + file);
                        return done();
                    });

                    write.on('error', function (err) {
                        grunt.fail.warn('Failed to write to ' + dest);
                        return done();
                    });

                    write.on('close', function () {
                        // Now remove original file
                        grunt.file.delete(file);

                        grunt.verbose.writeln('Moved ' + file + ' to ' + dest);
                        return done();
                    });

                    read.pipe(write);
                });
            });
        });
    });
};
