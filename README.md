# Adafruit Raspberry Pi Finder

You have your brand new Raspberry Pi, and you are ready to get hacking... 
Only problem is, you dont have an extra HDMI monitor and keyboard. 
So how can you find out the IP network address? PI FINDER TO THE RESCUE! 
Run this cross-platform application to locate your Raspberry Pi's IP
address.

But it doesn't end there... Order now and you'll also get the bootstrapping
functionality! That's right, the Pi Finder will ssh into the fresh new Pi 
update it, set up the wifi SSID and password, a custom hostname you pick,
and install a bunch of really handy software for you:

  * apt-get update (updates your existing Pi software to the latest versions)
  * apt-get installs: **avahi-daemon, netatalk** - so you can connect to raspberrypi.local instead of needing to know the IP address in the future
  * apt-get installs: **node, tmux, vim, git** - handy development tools! 
  * apt-get installs: **i2c-tools, python-smbus** - tools for letting your connect to common i2c sensors
  * apt-get installs & configures: **samba, samba-common-bin** - file sharing so you can easily back up your Pi's file or transfer files to it

and as a bonus, a handy tool we wrote called **occi** - which will let you change the hostname and wifi details by plugging the SD card into any computer and editing the /boot/occidentalis.txt file (see below)



## Finding the Pi & Starting the Bootstrap

We have created a utility that will find a Raspberry Pi connected to your
local network and start the bootstrap process. The utility requires you to
connect your Pi to your local network **via an ethernet cable** to start. 
Once the Pi is bootstrapped, it will be able to use ethernet or WiFi but we
need to be able to connect to the Pi the first time around.

### Windows & Mac App:

**Note for Mac users:** *If you are prevented from launching the app because of your security settings, you can right click on the app and click Open to bypass the warnings*

[Download the latest release][2] of the Pi Bootstrap utility.

### Linux (or Mac):

```sh
$ curl -SLs https://apt.adafruit.com/bootstrap | bash
```

## occidentalis.txt

Occidentalis comes with a configuration helper script called `occi`, which may
be used to set various system options from a text file on your SD card.

The bootstrapping process will help you create the file by prompting for your
desired hostname and wifi credentials, but it can also be created as
`occidentalis.txt` on the card at any time.  When the Pi is running, edit
`/boot/occidentalis.txt`.

![screencast of opening occidentalis.txt in nano](/docs/edit_occi_settings.gif?raw=true)

Here's an example file:

```
# hostname for your Raspberry Pi:
hostname=mypiname

# basic wireless networking options:
wifi_ssid=your network here
wifi_password=your password or passphrase here
```

Right now, these are the only configuration values supported.  Others will
be added in time.

By default, `occi` will run whenver the Pi boots, but can also be run manually
with:

```
sudo occi
```

[2]: https://github.com/adafruit/Adafruit-Pi-Finder/releases/latest
