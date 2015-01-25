#!/usr/bin/env bash

echo "**** add nginx apt repo ****"
curl http://nginx.org/keys/nginx_signing.key | apt-key add -
echo "deb http://nginx.org/packages/debian/ wheezy nginx" >> /etc/apt/sources.list
echo "deb-src http://nginx.org/packages/debian/ wheezy nginx" >> /etc/apt/sources.list

echo "**** update package lists & install dependencies ****"
apt-get update
apt-get install -y nginx gnupg rng-tools reprepro vim build-essential ntp dpkg-sig fakeroot devscripts mosh fail2ban tmux git

echo "**** configure and start rng-tools ****"
echo "HRNGDEVICE=/dev/urandom" >> /etc/default/rng-tools
/etc/init.d/rng-tools start
