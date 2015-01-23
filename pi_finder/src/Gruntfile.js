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
      all: ['../build', '*.zip', '*.tar', '*.tar.gz']
    },
    rename: {
      mac: {
        files: [
          { src: ['../build/darwin/atom-shell/Atom.app'], dest: '../build/darwin/atom-shell/Pi Bootstrap.app' }
        ]
      },
      linux: {
        files: [
          { src: ['../build/linux32/atom-shell/atom'], dest: '../build/linux32/atom-shell/pibootstrap' },
          { src: ['../build/linux64/atom-shell/atom'], dest: '../build/linux64/atom-shell/pibootstrap' }
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
      },
      bundleName: {
        method: 'Set',
        entry: ':CFBundleName',
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
    chmod: {
      options: {
        mode: '755'
      },
      linux: {
        src: [
          '../build/linux64/atom-shell/pibootstrap',
          '../build/linux32/atom-shell/pibootstrap'
        ]
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
        dest: './'
      },
      windows: {
        options: {
          archive: 'pibootstrap_windows.zip'
        },
        expand: true,
        cwd: '../build/win32/atom-shell/',
        src: ['**'],
        dest:'./'
      },
      linux32: {
        options: {
          archive: 'pibootstrap_linux32.tar.gz',
          mode: 'tgz'
        },
        expand: true,
        cwd: '../build/linux32/atom-shell/',
        src: ['**'],
        dest:'pibootstrap/'
      },
      linux64: {
        options: {
          archive: 'pibootstrap_linux64.tar.gz',
          mode: 'tgz'
        },
        expand: true,
        cwd: '../build/linux64/atom-shell/',
        src: ['**'],
        dest:'pibootstrap/'
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
  grunt.loadNpmTasks('grunt-chmod');

  grunt.registerTask('default', ['clean', 'build-atom-shell-app', 'rename', 'copy', 'chmod', 'plistbuddy', 'winresourcer']);
  grunt.registerTask('build', ['default', 'compress']);

};
