# Raspberry Pi Bootstrap

The goal of this project is to make a version of [Occidentalis][1] that
is distributed as a Debian package instead of an image.

## Finding the Pi & Starting the Boostrap

We have created a utility that will find a Raspberry Pi connected to your
local network and start the bootstrap process. The utility requires you to
connect your Pi to your local network **via an ethernet cable**.

Windows & Mac UI:

[Download the latest release][2] of the Pi Bootstrap utility.

Linux (or Mac):

```sh
$ curl -SLs https://apt.adafruit.com/bootstrap | bash
```

[1]: https://learn.adafruit.com/adafruit-raspberry-pi-educational-linux-distro/occidentalis-v0-dot-2
[2]: https://github.com/adafruit/pi_bootstrap/releases/latest
