#!/usr/bin/env bash

NODE_DEB='node_0.10.35_armhf.deb'
IDE_DEB='adafruitwebide-0.3.9-Linux.deb'

# make sure user passed a path to the repo
if [ "$1" == "" ]; then
  echo "You must specify a path to your pi_bootstrap repo. i.e. /home/admin/pi_bootstrap"
  exit 1
fi

# copy the packages to a temp folder, build them:
TEMP_DIR=`mktemp -d`
cp -r $1/packages/* $TEMP_DIR
mkdir $TEMP_DIR/build
cd $TEMP_DIR
make

# make the deb cache folder if it doesn't exist
if [ ! -d /tmp/deb_cache ]; then
  mkdir /tmp/deb_cache
fi

# cache the node deb
if [ ! -f /tmp/deb_cache/$NODE_DEB ]; then
  wget http://node-arm.herokuapp.com/node_latest_armhf.deb -O /tmp/deb_cache/$NODE_DEB
fi
# cache the webide deb
if [ ! -f /tmp/deb_cache/$IDE_DEB ]; then
  wget -P /tmp/deb_cache/ http://adafruit-download.s3.amazonaws.com/$IDE_DEB
fi

# copy all of the cached debs into the build dir
cp /tmp/deb_cache/*.deb $TEMP_DIR/build

# sign packages, and add them to the repo
dpkg-sig -k $GPG_KEY --sign builder $TEMP_DIR/build/*.deb
cd /var/packages/raspbian/

# this is a hack - TODO, investigate why these packages differ
reprepro -V remove wheezy node
reprepro -V remove wheezy occi
reprepro -V remove wheezy occidentalis
reprepro -V remove wheezy adafruitwebide
reprepro includedeb wheezy $TEMP_DIR/build/*.deb

# clean up
rm -r $TEMP_DIR
