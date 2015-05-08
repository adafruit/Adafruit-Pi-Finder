module.exports = function(grunt) {
  grunt.initConfig({
    'build-electron-app': {
      options: {
        build_dir: '../build',
        platforms: ['darwin', 'win32', 'linux32', 'linux64'],
        cache_dir: (process.env.TMPDIR || process.env.TEMP || '/tmp') + 'electron-cache',
        app_dir: './'
      }
    },
    clean: {
      options: {
        force: true
      },
      all: ['../build', '*.zip', '*.tar', '*.tar.gz'],
      symlink: ['../build/darwin/Electron.app/Contents/Resources/app']
    },
    rename: {
      mac: {
        files: [
          { src: ['../build/darwin/Electron.app'], dest: '../build/darwin/Pi Finder.app' },
          { src: ['../build/darwin/Pi Finder.app/Contents/MacOS/Electron'], dest: '../build/darwin/Pi Finder.app/Contents/MacOS/Pi Finder' }
        ]
      },
      linux: {
        files: [
          { src: ['../build/linux32/electron'], dest: '../build/linux32/pifinder' },
          { src: ['../build/linux64/electron'], dest: '../build/linux64/pifinder' }
        ]
      },
      win: {
        files: [
          { src: ['../build/win32/Electron.exe'], dest: '../build/win32/PiFinder.exe' }
        ]
      }
    },
    copy: {
      mac: {
        files: [
          { src: 'icons/adafruit.icns', dest: '../build/darwin/Pi Finder.app/Contents/Resources/atom.icns' }
        ]
      },
      win: {
        files: [
          { src: 'icons/adafruit.ico', dest: '../build/win32/resources/adafruit.ico' }
        ]
      }
    },
    sed: {
      bundle: {
        pattern: '<string>Electron</string>',
        replacement: '<string>Pi Finder</string>',
        path: '../build/darwin/Pi Finder.app/Contents/Info.plist'
      }
    },
    winresourcer: {
      exe: {
        operation: 'Update',
        exeFile: '../build/win32/PiFinder.exe',
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
          '../build/linux64/pifinder',
          '../build/linux32/pifinder'
        ]
      }
    },
    symlink: {
      options: {
        overwrite: false
      },
      dev: {
        src: './',
        dest: '../build/darwin/Electron.app/Contents/Resources/app'
      }
    },
    compress: {
      options: {
        force: true
      },
      mac: {
        options: {
          archive: '../build/pifinder_mac.zip'
        },
        expand: true,
        cwd: '../build/darwin/',
        src: ['**'],
        dest: './'
      },
      windows: {
        options: {
          archive: '../build/pifinder_windows.zip'
        },
        expand: true,
        cwd: '../build/win32/',
        src: ['**'],
        dest:'./'
      },
      linux32: {
        options: {
          archive: '../build/pifinder_linux32.tar.gz',
          mode: 'tgz'
        },
        expand: true,
        cwd: '../build/linux32/',
        src: ['**'],
        dest:'pifinder/'
      },
      linux64: {
        options: {
          archive: '../build/pifinder_linux64.tar.gz',
          mode: 'tgz'
        },
        expand: true,
        cwd: '../build/linux64/',
        src: ['**'],
        dest:'pifinder/'
      }
    }

  });

  grunt.loadNpmTasks('grunt-electron-app-builder');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-rename');
  grunt.loadNpmTasks('grunt-sed');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('winresourcer');
  grunt.loadNpmTasks('grunt-chmod');
  grunt.loadNpmTasks('grunt-contrib-symlink');

  grunt.registerTask('default', ['clean:all', 'build-electron-app', 'clean:symlink', 'symlink']);
  grunt.registerTask('build', ['clean:all', 'build-electron-app', 'rename', 'copy', 'chmod', 'sed', 'winresourcer', 'compress']);

};
