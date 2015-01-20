occi_stuff = $(shell find occi)
occidentalis_stuff = $(shell find occidentalis)

OCCIDENTALIS_VERSION := $(shell head -1 occidentalis/DEBIAN/changelog | sed 's/.*(//;s/).*//;')
OCCI_VERSION := $(shell head -1 occi/DEBIAN/changelog | sed 's/.*(//;s/).*//;')

all: build/occi_${OCCI_VERSION}_armhf.deb build/occidentalis_${OCCIDENTALIS_VERSION}_armhf.deb

build/occi_${OCCI_VERSION}_armhf.deb: ${occi_stuff}
	gzip occi/DEBIAN/changelog --best -c > occi/usr/share/doc/occi/changelog.gz
	pod2man occi/usr/bin/occi | gzip --best -c > occi/usr/share/man/man1/occi.1.gz
	fakeroot dpkg-deb -b occi build/occi_${OCCI_VERSION}_armhf.deb

build/occidentalis_${OCCIDENTALIS_VERSION}_armhf.deb: ${occidentalis_stuff}
	gzip occidentalis/DEBIAN/changelog --best -c > occidentalis/usr/share/doc/occidentalis/changelog.gz
	fakeroot dpkg-deb -b occidentalis build/occidentalis_${OCCIDENTALIS_VERSION}_armhf.deb

