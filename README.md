# Raspberry Pi Bootstrap

The goal of this project is to make a version of [Occidentalis][1] that
is distributed as a Debian package instead of an image.

## Finding the Pi & Starting the Bootstrap

We have created a utility that will find a Raspberry Pi connected to your
local network and start the bootstrap process. The utility requires you to
connect your Pi to your local network **via an ethernet cable**.

Windows & Mac App:

[Download the latest release][2] of the Pi Bootstrap utility.

Linux (or Mac):

```sh
$ curl -SLs https://apt.adafruit.com/bootstrap | bash
```

Occidentalis comes with a configuration helper script called `occi`, which may
be used to set various system options from a text file on your SD card.  The
bootstrapping process will help you create this file, if you want, or it can be
created as `occidentalis.txt` on the card at any time.  When the Pi is running,
edit `/boot/occidentalis.txt`.

![screencast of opening occidentalis.txt in nano](https://raw.githubusercontent.com/adafruit/pi_bootstrap/master/docs/edit_occi_settings.gif)

Here's an example file:

```
# hostname for your Raspberry Pi:
hostname=mypiname

# basic wireless networking options:
wifi_ssid=your network here
wifi_password=your password / passphrase here
```

[1]: https://learn.adafruit.com/adafruit-raspberry-pi-educational-linux-distro/occidentalis-v0-dot-2
[2]: https://github.com/adafruit/pi_bootstrap/releases/latest
