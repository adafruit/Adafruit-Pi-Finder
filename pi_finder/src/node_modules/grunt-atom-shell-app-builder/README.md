# grunt-atom-shell-app-builder

Helps build atom-shell baed applications for mac, win and linux with grunt. It will download the prebuilt binaries for either the latest or a specific version, unpack them, and add your application source to the extracted distirbution.

## Getting Started
Install this grunt plugin with: `npm install grunt-atom-shell-app-builder`

Then add this line to your project's gruntfile:

```javascript
grunt.loadNpmTasks('grunt-atom-shell-app-builder');
```

### Example

```javascript
module.exports = function(grunt) {
  grunt.initConfig({
    'build-atom-shell-app': {
        options: {
            platforms: ["darwin", "win32"]
        }
    }
  });
  grunt.loadNpmTasks('grunt-atom-shell-app-builder');
};

```

## The "build-atom-shell-app" task

### Options

#### options.atom_shell_version
Type: `String`
Default value: `most recent release`
Required: `no`

The version of atom-shell you want to use (e.g., `'v0.12.5'`). [Here is a list](https://github.com/atom/atom-shell/releases) of available releases. If not specified, it will query github for the latest release.

#### options.build_dir
Type: `String`
Default value: `build`
Required: `no`

Where application builds should be placed. Releases will be placed into a platform specific subdirectory. '[build_dir]'/'[platform]/' 


#### options.cache_dir
Type: `String`
Default value: `cache`
Required: `no`

Where downloads of the pre-built binaries should be stored.

#### options.app_dir
Type: `String`
Default value: `app`
Required: `no`

Where application source is located. This will be copied to the app directory for each platform build.

#### options.platforms
Type: `String Array`
Default value: `[ 'HostPlatform' ]`
Required: `no`

The platforms to download and build packages for. Supported platforms are `'darwin'`, `'win32'`, `'linux32'`, and `'linux64'` (`'linux'` works as well for backwards compatibility, and maps to linux32). If ommitted, defaults to the host platform. 

Note that building `'darwin'` packages on a windows host is currently unsupported due to the format of the darwin atom-shell zip, which includes symlinks.


## To Do:
- Add support for further application customization (name, icon, etc)

## Release History
- 2014-05-21    initial release
- 2014-11-22	updated to new atom-shell release architecture naming scheme
- 2014-11-24	added support for linux x64

## License
Copyright (c) 2014 Chad Fawcett
Licensed under the Apache 2.0 license.
