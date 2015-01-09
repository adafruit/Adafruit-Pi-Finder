module.exports = function(grunt) {
  grunt.initConfig({
    'build-atom-shell-app': {
      options: {
        build_dir: '../build',
        platforms: ['darwin', 'win32', 'linux32', 'linux64'],
        cache_dir: (process.env.TMPDIR || process.env.TEMP || '/tmp') + 'atom-shell-cache',
        app_dir: './'
      }
    },
    clean: {
      options: {
        force: true
      },
      all: ['../build', '*.zip', '*.tar']
    },
    compress: {
      mac: {
        options: {
          archive: 'mac_osx.zip'
        },
        expand: true,
        cwd: '../build/darwin/atom-shell/',
        src: ['**'],
        dest: 'occidentalis/'
      },
      windows: {
        options: {
          archive: 'windows.zip'
        },
        expand: true,
        cwd: '../build/win32/atom-shell/',
        src: ['**'],
        dest:'occidentalis/'
      },
      linux32: {
        options: {
          archive: 'linux_32.tar',
          mode: 'tar'
        },
        expand: true,
        cwd: '../build/linux32/atom-shell/',
        src: ['**'],
        dest:'occidentalis/'

      },
      linux64: {
        options: {
          archive: 'linux_64.tar',
          mode: 'tar'
        },
        expand: true,
        cwd: '../build/linux64/atom-shell/',
        src: ['**'],
        dest:'occidentalis/'
      }
    }

  });

  grunt.loadNpmTasks('grunt-atom-shell-app-builder');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');

  grunt.registerTask('default', ['clean', 'build-atom-shell-app', 'compress']);

};
