# Debian Packages

## Building

You can build individual packages something like:

    fakeroot dpkg-deb -b occidentalis build/occidentalis_0.3.1_armhf.deb

(Replace `0.3.1` with the version you are building, and make sure your
build target is in the `build` folder.)

`fakeroot` is useful because otherwise you wind up with incorrect ownership
of paths in the built package.

The included `Makefile` should build packages for both the main occidentalis
package and the `occi` configuration helper, though version numbers still have
to be manually tweaked when changed at the moment.

## lintian

You can check built packages with lintian (`sudo apt-get install lintian` if
needed):

    pi@pifoo ~/code/pi_bootstrap/packages $ lintian build/occi_0.1.3_armhf.deb 
    W: occi: syntax-error-in-debian-changelog line 3 "unrecognised line"
    W: occi: syntax-error-in-debian-changelog line 4 "unrecognised line"
    W: occi: unknown-control-file changelog
    E: occi: no-copyright-file
    W: occi: description-starts-with-leading-spaces
    W: occi: unknown-section base
    E: occi: postrm-does-not-call-updaterc.d-for-init.d-script etc/init.d/occi
    E: occi: init.d-script-missing-dependency-on-remote_fs etc/init.d/occi: required-stop
    W: occi: binary-without-manpage usr/bin/occi
    W: occi: maintainer-script-ignores-errors postinst

In practice, a lot of this stuff (even the more-severe looking bits) doesn't
seem to break much, but we should nevertheless clean it up.
