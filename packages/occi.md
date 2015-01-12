occi config helper
==================

This dir is a stub.  Will attempt to handle #1 with a minimum of dependencies.
I think this will be a package something like occidentalis-config-helper upon
which occidentalis depends, but which can be installed separately.

Notes:

  - format echoes existing `/boot/config.txt`
  - init system can just run this with the right privileges at boot, user
    can change `/boot/occidentalis.txt` and rerun with `sudo occi`

TODO:

  - [ ] figure out how to modularize handling of individual keys, to the
        extent that it matters
  - [ ] occidentalis package should stick this in the init system
  - [ ] config file format should allow comments
  - [ ] make sure it wouldn't be better to put config in some existing
        file
  - [ ] should do some handholding for confused users
