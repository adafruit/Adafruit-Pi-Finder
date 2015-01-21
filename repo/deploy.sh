#!/usr/bin/env bash

# make sure user passed a path to the repo
if [ "$1" == "" ]; then
  echo "You must specify a path to your pi_bootstrap repo. i.e. /home/admin/pi_bootstrap"
  exit 1
fi

# copy the packages to a temp folder, build them:
TEMP_DIR=`mktemp -d`
cp -r $1/packages/* $TEMP_DIR
cd $TEMP_DIR
make

# sign packages, and add them to the repo
dpkg-sig -k $GPG_KEY --sign builder $TEMP_DIR/build/*.deb
cd /var/packages/raspbian/
reprepro includedeb wheezy $TEMP_DIR/build/*.deb

# clean up
rm -r $TEMP_DIR
