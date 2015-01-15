occi_stuff = $(shell find occi)
occidentalis_stuff = $(shell find occidentalis)

all: build/occi_0.1.3_armhf.deb build/occidentalis_0.3.6_armhf.deb

build/occi_0.1.3_armhf.deb: ${occi_stuff}
	gzip occi/DEBIAN/changelog --best -c > occi/usr/share/doc/occi/changelog.gz
	fakeroot dpkg-deb -b occi build/occi_0.1.3_armhf.deb

build/occidentalis_0.3.6_armhf.deb: ${occidentalis_stuff}
	fakeroot dpkg-deb -b occidentalis build/occidentalis_0.3.6_armhf.deb
