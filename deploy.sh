#!/usr/bin/env bash

# make sure user passed a path the the repo
if [ "$1" == "" ]; then
  echo "You must specify a path to your pi_bootstrap repo. i.e. /home/todd/pi_bootstrap"
  exit 1
fi

# copy the packages to the temp folder
mkdir /tmp/packages
cp $1/packages/build/*.deb /tmp/packages/

# sign packages, and add them to the repo
dpkg-sig -k $GPG_KEY --sign builder /tmp/packages/*.deb
cd /var/packages/raspbian/
reprepro includedeb wheezy /tmp/packages/*.deb

# clean up
rm -r /tmp/packages
