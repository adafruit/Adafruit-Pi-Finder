#!/usr/bin/env bash

cat << "EOF"




                                         .ydd+`
                                        +NMMMMy`
                                      .hMMMMMMM+
                                     +NMMMMMMMMN-
                                   .hMMMMMMMMMMMd`
                                  /NMMMMMMMMMMMMM+
                                `sMMMMMMMMMMMMMMMN.
                               .dMMMMMMMMMMMMMMMMMy
                              `dMMMMMMMMMMMMMMMMMMN-
    `............--...`       /MMMMMMMMMMMMMMMMMMMMo
  `omMMMMMMMMMMMMMMMMMNNdy+.  +MMMMMMMMMMMMMMMMMMMMo
  `dMMMMMMMMMMMMMMMMMMMMMMMMd+/MMMMMMMMMMMMMMMMMMMM/
   .yMMMMMMMMMMMMMMMMMMMMMMMMMNMMMMMMMMNdMMMMMMMMMd```.---..`
     /NMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMy``oMMMMMMMMyhmNMMMMMMNmhs+:`
      .hMMMMMMMMMMMMMMMMMMMMMMMMMMMMMd`  :NMMMMMMMMMMMMMMMMMMMMMMMMNdy+:.`
       `+NMMMMMMMMMMMMMMMMMMMMMMMMMMM+   oMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMNds.
         .dMMMMMMMMMMMMMMN-..:+yNMMMMs  :NMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMh`
          `oNMMMMMMMMMMMMMh:`   `+mMMMhyNMMMMNmdddmMMMMMMMMMMMMMMMMMMMMMMMMd:
            .yNMMMMMMMMMMMMMmy+:..sMMMMMMMNo.      oMMMMMMMMMMMMMMMMMMMMms-
              `+dNMMMMMMMMMMMMMMMMMMMMMMMMdo-`-/ohmMMMMMMMMMMMMMMMMMMNy:`
                 `:+smMMMMMMMMMMMmhmMMMMMMMMMNMMMMMMMMMMMMMMMMMMMMNh/`
                  .omMMMMMMMMMm+.  +MMMy-+mMMMMMMMMMMMMMMMMMMMMMd+.
                .yNMMMMMMMMMNo`  `+NMMMo  `oMMMMMMMMMMMMMMMNmy+.
               :NMMMMMMMMMMN+  `+mMMMMMN-   oMMMMMMMMh:---.`
              :MMMMMMMMMMMMMhshMMMMMMMMMN/`  NMMMMMMMMN:
             .mMMMMMMMMMMMMMMMMMMMMMMMMMMMdosMMMMMMMMMMN:
             yMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMd`
            /MMMMMMMMMMMMMMMMMMMMMMdNMMMMMMMMMMMMMMMMMMMM-
           .mMMMMMMMMMMMMMMMMMMMMMs`mMMMMMMMMMMMMMMMMMMMM+
           yMMMMMMMMMMMMMMMMMMMMh:  :NMMMMMMMMMMMMMMMMMMMo
          :NMMMMMMMMMMMMMMMMNdo.     /mMMMMMMMMMMMMMMMMMMo
          dMMMMMMMMMMMMNdy+:`         .sNMMMMMMMMMMMMMMMMo
          dMMMMMNmds+-`                 `+hMMMMMMMMMMMMMMo
          `/++/-.                          -omMMMMMMMMMMMo
                                              :yNMMMMMMMMo
                                                `/hNMMMMM+
                                                   .+hmmy`


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

# install
apt-get -y install occidentalis
