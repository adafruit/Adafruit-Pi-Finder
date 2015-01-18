module.exports = function(grunt) {
  grunt.initConfig({
    'build-atom-shell-app': {
      options: {
        build_dir: '../build',
        platforms: ['darwin', 'win32'],
        cache_dir: (process.env.TMPDIR || process.env.TEMP || '/tmp') + 'atom-shell-cache',
        app_dir: './'
      }
    },
    clean: {
      options: {
        force: true
      },
      all: ['../build', '*.zip']
    },
    compress: {
      options: {
        force: true
      },
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
      }
    }

  });

  grunt.loadNpmTasks('grunt-atom-shell-app-builder');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');

  grunt.registerTask('default', ['clean', 'build-atom-shell-app']);
  grunt.registerTask('build', ['default', 'compress']);

};
