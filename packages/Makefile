occi_stuff = $(shell find occi)
occidentalis_stuff = $(shell find occidentalis)
pitft_stuff = $(shell find adafruit-pitft-helper_TEMPLATE)

OCCIDENTALIS_VERSION := $(shell head -1 occidentalis/DEBIAN/changelog | sed 's/.*(//;s/).*//;')
OCCI_VERSION := $(shell head -1 occi/DEBIAN/changelog | sed 's/.*(//;s/).*//;')

PITFT_PACKAGE_VERSION := $(shell head -1 adafruit-pitft-helper_TEMPLATE/debian/changelog | sed 's/.*(//;s/).*//;')
# the Perl line just gets the Adafruit-PiTFT-Helper version minus the -whatever
PITFT_VERSION := $(shell head -1 adafruit-pitft-helper_TEMPLATE/debian/changelog | perl -pe 's{ .* \( (.+) [-] \d+ \) .* }{\1}x;')

all: build/occi_${OCCI_VERSION}_armhf.deb build/occidentalis_${OCCIDENTALIS_VERSION}_armhf.deb build/adafruit-pitft-helper_${PITFT_PACKAGE_VERSION}_armhf.deb

build/occi_${OCCI_VERSION}_armhf.deb: ${occi_stuff}
	gzip occi/DEBIAN/changelog --best -c > occi/usr/share/doc/occi/changelog.gz
	pod2man occi/usr/bin/occi | gzip --best -c > occi/usr/share/man/man1/occi.1.gz
	fakeroot dpkg-deb -b occi build/occi_${OCCI_VERSION}_armhf.deb

build/occidentalis_${OCCIDENTALIS_VERSION}_armhf.deb: ${occidentalis_stuff}
	gzip occidentalis/DEBIAN/changelog --best -c > occidentalis/usr/share/doc/occidentalis/changelog.gz
	fakeroot dpkg-deb -b occidentalis build/occidentalis_${OCCIDENTALIS_VERSION}_armhf.deb

build/adafruit-pitft-helper_${PITFT_PACKAGE_VERSION}_armhf.deb: ${pitft_stuff}
	mkdir -p adafruit-pitft-helper
	rm -r adafruit-pitft-helper
	mkdir adafruit-pitft-helper
	cd adafruit-pitft-helper && wget https://github.com/adafruit/Adafruit-PiTFT-Helper/archive/master.tar.gz -O adafruit-pitft-helper_${PITFT_VERSION}.orig.tar.gz
	cd adafruit-pitft-helper && tar xvzf adafruit-pitft-helper_${PITFT_VERSION}.orig.tar.gz
	cd adafruit-pitft-helper && mv Adafruit-PiTFT-Helper-master adafruit-pitft-helper_${PITFT_VERSION}
	cp -r adafruit-pitft-helper_TEMPLATE/debian adafruit-pitft-helper/adafruit-pitft-helper_${PITFT_VERSION}/
	cd adafruit-pitft-helper/adafruit-pitft-helper_${PITFT_VERSION} && debuild -b -aarmhf -uc -us
	ls -lah adafruit-pitft-helper
	mv ./adafruit-pitft-helper/*.deb build/
	rm -r adafruit-pitft-helper

clean:
	$(RM) build/*
