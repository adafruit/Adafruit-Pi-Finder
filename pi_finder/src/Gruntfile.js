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
    rename: {
      darwin: {
        src: '../build/darwin/atom-shell',
        dest: '../build/mac'
      },
      windows: {
        src: '../build/win32/atom-shell',
        dest: '../build/windows'
      },
      linux32: {
        src: '../build/linux32/atom-shell',
        dest: '../build/linux_32'
      },
      linux64: {
        src: '../build/linux64/atom-shell',
        dest: '../build/linux_64'
      }
    },
    clean: {
      options: {
        force: true
      },
      build: ['../build/darwin', '../build/win32', '../build/linux32', '../build/linux64'],
      all: ['../build/*']
    }
  });

  grunt.loadNpmTasks('grunt-atom-shell-app-builder');
  grunt.loadNpmTasks('grunt-rename');
  grunt.loadNpmTasks('grunt-contrib-clean');

  grunt.registerTask('default', [ 'clean:all', 'build-atom-shell-app', 'rename', 'clean:build']);

};
