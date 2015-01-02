#!/usr/bin/env bash

# make sure user passed a path to the repo
if [ "$1" == "" ]; then
  echo "You must specify a path to your pi_bootstrap repo. i.e. /home/admin/pi_bootstrap"
  exit 1
fi

# copy the packages to a temp folder
TEMP_DIR=`mktemp -d`
cp $1/packages/build/*.deb $TEMP_DIR

# sign packages, and add them to the repo
dpkg-sig -k $GPG_KEY --sign builder $TEMP_DIR/*.deb
cd /var/packages/raspbian/
reprepro includedeb wheezy $TEMP_DIR/*.deb 2>/dev/null

# clean up
rm -r $TEMP_DIR
