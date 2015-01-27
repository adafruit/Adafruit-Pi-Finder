#!/usr/bin/env bash

cat << "EOF"
                                 .`
                              -dMMs
                             +MMMMMo
                           .dMMMMMMN-
                          +NMMMMMMMMd`
                        `hMMMMMMMMMMMo
                       -mMMMMMMMMMMMMN.
                       dMMMMMMMMMMMMMMo
  :hmmmmmmmmmmmmdhs/. `MMMMMMMMMMMMMMMh
  sMMMMMMMMMMMMMMMMMMd+NMMMMMMMMMMMMMM+
   /NMMMMMMMMMMMMMMMMMMMMMMMMs+NMMMMMm/+syyyso/-`
    `hMMMMMMMMMMMMMMMMMMMMMMo  hMMMMMMMMMMMMMMMMMNhs+:.
      /NMMMMMMMMMMMNmmNMMMMN. `mMMMMMMMMMMMMMMMMMMMMMMMNh-
       .hMMMMMMMMMMh` `-sNMMs-hMMMMMMMMMMMMMMMMMMMMMMMMMM+
         /mMMMMMMMMMNy+-./MMMMMMy:....oMMMMMMMMMMMMMMMNo.
           :ymMMMMMMMMMMMMMMMMMNy//oymMMMMMMMMMMMMMNy:
              .yMMMMMMMms:oMMNhNMMMMMMMMMMMMMMMMNh/`
            .yMMMMMMMN/  .dMMy `sMMMMMMMMMMMNmy/`
           /NMMMMMMMM:`-sMMMMM:  sMMMMMMs-..`
          -NMMMMMMMMMNNMMMMMMMMs./MMMMMMMh`
          mMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMs
         sMMMMMMMMMMMMMMMMhMMMMMMMMMMMMMMMN
        :MMMMMMMMMMMMMMMN+ hMMMMMMMMMMMMMMN.
       `dMMMMMMMMMMMMNh/`  `hMMMMMMMMMMMMMN.
       /MMMMMMMMmhs+-        /dMMMMMMMMMMMN.
       .hmdys/-                -sNMMMMMMMMN.
                                 `:hNMMMMMN.
                                    `+dMMMN`
                                       ./+-
               occidentalis bootstrap
                    by adafruit

EOF

sleep 2

if grep -Fq "adafruit" /etc/apt/sources.list; then
  echo "adafruit repo already added to apt sources"
else
  # add apt repo to sources.list
  echo "deb http://apt.adafruit.com/raspbian/ wheezy main" >> /etc/apt/sources.list

  # import repo key
  wget -O - -q https://apt.adafruit.com/apt.adafruit.com.gpg.key | apt-key add -
fi

# update package database
apt-get update

# stop asking me questions
export DEBIAN_FRONTEND=noninteractive

uptodate=$(apt-show-versions occidentalis | grep uptodate)

if [ "$uptodate" = "" ]; then
  # install
  echo "**** Installing the latest version of occidentalis ****"
  apt-get -y install occidentalis
else
  # up to date, but rerun postinst
  echo "**** Occidentalis is up to date. Reloading configuration ****"
  dpkg-reconfigure -f noninteractive occidentalis
fi

echo "BOOTSTRAP COMPLETE!!!"
