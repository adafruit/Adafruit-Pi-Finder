#!/usr/bin/env bash

if grep -Fq "uniontown" /etc/apt/sources.list; then
  echo "repo already added to apt sources"
else
  # add apt repo to sources.list
  echo "deb http://apt.uniontownlabs.org/debian/ testing main" >> /etc/apt/sources.list

  # import repo key
  wget -O - -q http://apt.uniontownlabs.org/apt.uniontownlabs.org.gpg.key | apt-key add -
fi

# update package database
apt-get update

# install
apt-get -y install occidentalis
