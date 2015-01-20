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

if grep -Fq "uniontown" /etc/apt/sources.list; then
  echo "repo already added to apt sources"
else
  # add apt repo to sources.list
  echo "deb http://apt.uniontownlabs.org/raspbian/ wheezy main" >> /etc/apt/sources.list

  # import repo key
  wget -O - -q http://apt.uniontownlabs.org/apt.uniontownlabs.org.gpg.key | apt-key add -
fi

# update package database
apt-get update

# stop asking me questions
export DEBIAN_FRONTEND=noninteractive

# install
apt-get -y install occidentalis
