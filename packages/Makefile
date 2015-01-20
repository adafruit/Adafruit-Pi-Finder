occi_stuff = $(shell find occi)
occidentalis_stuff = $(shell find occidentalis)

all: build/occi_0.3.1_armhf.deb build/occidentalis_0.3.7_armhf.deb

build/occi_0.3.1_armhf.deb: ${occi_stuff}
	gzip occi/DEBIAN/changelog --best -c > occi/usr/share/doc/occi/changelog.gz
	pod2man occi/usr/bin/occi | gzip --best -c > occi/usr/share/man/man1/occi.1.gz
	fakeroot dpkg-deb -b occi build/occi_0.3.1_armhf.deb

build/occidentalis_0.3.9_armhf.deb: ${occidentalis_stuff}
	fakeroot dpkg-deb -b occidentalis build/occidentalis_0.3.9_armhf.deb
