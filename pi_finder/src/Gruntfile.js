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
    rename: {
      mac: {
        files: [
         { src: ['../build/darwin/atom-shell/Atom.app'], dest: '../build/darwin/atom-shell/Pi Bootstrap.app' }
        ]
      },
      win: {
        files: [
         { src: ['../build/win32/atom-shell/atom.exe'], dest: '../build/win32/atom-shell/PiBootstrap.exe' }
        ]
      }
    },
    copy: {
      mac: {
        files: [
          { src: 'icons/adafruit.icns', dest: '../build/darwin/atom-shell/Pi Bootstrap.app/Contents/Resources/atom.icns' }
        ]
      },
      win: {
        files: [
          { src: 'icons/adafruit.ico', dest: '../build/win32/atom-shell/resources/adafruit.ico' }
        ]
      }
    },
    plistbuddy: {
      bundleDisplay: {
        method: 'Set',
        entry: ':CFBundleDisplayName',
        value: 'Pi Bootstrap',
        src: '../build/darwin/atom-shell/Pi Bootstrap.app/Contents/Info.plist'
      }
    },
    winresourcer: {
      exe: {
        operation: 'Update',
        exeFile: '../build/win32/atom-shell/PiBootstrap.exe',
        resourceType: 'Icongroup',
        resourceName: '1',
        lang: 1033,
        resourceFile: 'icons/adafruit.ico'
      }
    },
    compress: {
      options: {
        force: true
      },
      mac: {
        options: {
          archive: 'pibootstrap_mac.zip'
        },
        expand: true,
        cwd: '../build/darwin/atom-shell/',
        src: ['**'],
        dest: 'pi_bootstrap/'
      },
      windows: {
        options: {
          archive: 'pibootstrap_windows.zip'
        },
        expand: true,
        cwd: '../build/win32/atom-shell/',
        src: ['**'],
        dest:'pi_bootstrap/'
      }
    }

  });

  grunt.loadNpmTasks('grunt-atom-shell-app-builder');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-rename');
  grunt.loadNpmTasks('grunt-plistbuddy');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('winresourcer');

  grunt.registerTask('default', ['clean', 'build-atom-shell-app', 'rename', 'copy', 'plistbuddy', 'winresourcer']);
  grunt.registerTask('build', ['default', 'compress']);

};
