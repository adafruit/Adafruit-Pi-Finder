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
      all: ['../build', '*.zip', '*.tar', '*.tar.gz'],
      symlink: ['../build/darwin/atom-shell/Atom.app/Contents/Resources/app']
    },
    rename: {
      mac: {
        files: [
          { src: ['../build/darwin/atom-shell/Atom.app'], dest: '../build/darwin/atom-shell/Pi Finder.app' },
          { src: ['../build/darwin/atom-shell/Pi Bootstrap.app/Contents/MacOS/Atom'], dest: '../build/darwin/atom-shell/Pi Bootstrap.app/Contents/MacOS/Pi Finder' }
        ]
      },
      linux: {
        files: [
          { src: ['../build/linux32/atom-shell/atom'], dest: '../build/linux32/atom-shell/pifinder' },
          { src: ['../build/linux64/atom-shell/atom'], dest: '../build/linux64/atom-shell/pifinder' }
        ]
      },
      win: {
        files: [
          { src: ['../build/win32/atom-shell/atom.exe'], dest: '../build/win32/atom-shell/PiFinder.exe' }
        ]
      }
    },
    copy: {
      mac: {
        files: [
          { src: 'icons/adafruit.icns', dest: '../build/darwin/atom-shell/Pi Finder.app/Contents/Resources/atom.icns' }
        ]
      },
      win: {
        files: [
          { src: 'icons/adafruit.ico', dest: '../build/win32/atom-shell/resources/adafruit.ico' }
        ]
      }
    },
    sed: {
      bundle: {
        pattern: '<string>Atom</string>',
        replacement: '<string>Pi Finder</string>',
        path: '../build/darwin/atom-shell/Pi Finder.app/Contents/Info.plist'
      }
    },
    winresourcer: {
      exe: {
        operation: 'Update',
        exeFile: '../build/win32/atom-shell/PiFinder.exe',
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
          '../build/linux64/atom-shell/pifinder',
          '../build/linux32/atom-shell/pifinder'
        ]
      }
    },
    symlink: {
      options: {
        overwrite: false
      },
      dev: {
        src: './',
        dest: '../build/darwin/atom-shell/Atom.app/Contents/Resources/app'
      }
    },
    compress: {
      options: {
        force: true
      },
      mac: {
        options: {
          archive: 'pifinder_mac.zip'
        },
        expand: true,
        cwd: '../build/darwin/atom-shell/',
        src: ['**'],
        dest: './'
      },
      windows: {
        options: {
          archive: 'pifinder_windows.zip'
        },
        expand: true,
        cwd: '../build/win32/atom-shell/',
        src: ['**'],
        dest:'./'
      },
      linux32: {
        options: {
          archive: '../build/pifinder_linux32.tar.gz',
          mode: 'tgz'
        },
        expand: true,
        cwd: '../build/linux32/atom-shell/',
        src: ['**'],
        dest:'pifinder/'
      },
      linux64: {
        options: {
          archive: '../build/pifinder_linux64.tar.gz',
          mode: 'tgz'
        },
        expand: true,
        cwd: '../build/linux64/atom-shell/',
        src: ['**'],
        dest:'pifinder/'
      }
    }

  });

  grunt.loadNpmTasks('grunt-atom-shell-app-builder');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-rename');
  grunt.loadNpmTasks('grunt-sed');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('winresourcer');
  grunt.loadNpmTasks('grunt-chmod');
  grunt.loadNpmTasks('grunt-contrib-symlink');

  grunt.registerTask('default', ['clean:all', 'build-atom-shell-app', 'clean:symlink', 'symlink']);
  grunt.registerTask('build', ['clean:all', 'build-atom-shell-app', 'rename', 'copy', 'chmod', 'sed', 'winresourcer', 'compress']);

};
