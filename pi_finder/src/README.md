## Mac build requirements

More info to come, this is just a brain dump in case I forget the requirements for building.

* Install [xquartz](http://xquartz.macosforge.org/landing/).
* Install [homebrew](http://brew.sh/).
* Install the latest stable [node.js](http://nodejs.com)

```
$ brew install wine winetricks
$ env WINEARCH=win32 WINEPREFIX=~/.wine32 winetricks dotnet20
$ npm install -g grunt-cli
$ npm install
$ grunt build --force
```
