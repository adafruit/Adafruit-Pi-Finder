#!/bin/bash

# PiTFT Resistive 2.8" (PID 1601) or Capacitive 2.8" (PID 1983) setup script or Resistive 3.5" (PID 2097) or 2.2" No-Touchscreen setup script!

set -e

function cleanup() {
	if [ "${mountpoint}" != "/" ]
	then
		sudo -n umount "${mountpoint}/boot" 2> /dev/null
		sudo -n umount "${mountpoint}" 2> /dev/null
		sudo -n rmdir "${mountpoint}" 2> /dev/null < /dev/null
	fi
}

function wgetfiles() {
# grab wget images
    wget -c http://adafruit-download.s3.amazonaws.com/libraspberrypi-bin-adafruit.deb
    wget -c http://adafruit-download.s3.amazonaws.com/libraspberrypi-dev-adafruit.deb
    wget -c http://adafruit-download.s3.amazonaws.com/libraspberrypi-doc-adafruit.deb
    wget -c http://adafruit-download.s3.amazonaws.com/libraspberrypi0-adafruit.deb
    wget -c http://adafruit-download.s3.amazonaws.com/raspberrypi-bootloader-adafruit-20140917-1.deb
}

function update_etcmodules() {
	chr="$1"
	shift

	if grep -xq "spi-bcm2708" "${chr}/etc/modules" ; then
	    echo "Already had spi-bcm2708"
	else
	    echo "Adding spi-bcm2708"
	    sudo chroot "${chr}" /bin/sh -c 'cat >> /etc/modules' <<EOF
spi-bcm2708
EOF
	fi

	if [ "${pitfttype}" == "28c" ]
	    then
	    if grep -xq  "i2c-bcm2708" "${chr}/etc/modules" ; then
		echo "Already had i2c-bcm2708"
	    else
		echo "Adding i2c-bcm2708"
		sudo chroot "${chr}" /bin/sh -c 'cat >> /etc/modules' <<EOF
i2c-bcm2708
EOF
	    fi
	fi 

	if grep -xq  "fbtft_device" "${chr}/etc/modules" ; then
	    echo "Already had fbtft_device"
	else
	    echo "Adding fbtft_device"
	    sudo chroot "${chr}" /bin/sh -c 'cat >> /etc/modules' <<EOF
fbtft_device
EOF
	fi
}

function install_onoffbutton() {
	chr="$1"
	shift

	echo "Adding rpi_power_switch to /etc/modules"
	if grep -xq "rpi_power_switch" "${chr}/etc/modules" ; then
	    echo "Already had rpi_power_switch"
	else
	    echo "Adding rpi_power_switch"
	    sudo chroot "${chr}" /bin/sh -c 'cat >> /etc/modules' <<EOF
rpi_power_switch
EOF
	fi

	echo "Adding rpi_power_switch config to /etc/modprobe.d/adafruit.conf"
	if grep -xq "options rpi_power_switch gpio_pin=23 mode=0" "${chr}/etc/modprobe.d/adafruit.conf" ; then
	    echo "Already had rpi_power_switch config"
	else
	    echo "Adding rpi_power_switch"
	    sudo chroot "${chr}" /bin/sh -c 'cat >> /etc/modprobe.d/adafruit.conf' <<EOF
options rpi_power_switch gpio_pin=23 mode=0
EOF
	fi	

}

function update_x11profile() {
	chr="$1"
	shift

	echo "Moving 99-fbturbo.conf to /home/pi"
	sudo chroot "${chr}" mv /usr/share/X11/xorg.conf.d/99-fbturbo.conf /home/pi

	if grep -xq "export FRAMEBUFFER=/dev/fb1" "${chr}/home/pi/.profile" ; then
	    echo "Already had 'export FRAMEBUFFER=/dev/fb1'"
	else
	    echo "Adding 'export FRAMEBUFFER=/dev/fb1'"
	    sudo chroot "${chr}" /bin/sh -c 'cat >> /home/pi/.profile' <<EOF
export FRAMEBUFFER=/dev/fb1
EOF
	fi
}


function update_adafruitconf() {
	chr="$1"
	shift

	if [ "${pitfttype}" == "22" ]
	    then
	    sudo chroot "${chr}" /bin/sh -c 'cat > /etc/modprobe.d/adafruit.conf' <<EOF
options fbtft_device name=adafruit22a gpios=dc:25 rotate=270 frequency=32000000
EOF
	fi
	
	if [ "${pitfttype}" == "28r" ]
	    then
	    sudo chroot "${chr}" /bin/sh -c 'cat > /etc/modprobe.d/adafruit.conf' <<EOF
options fbtft_device name=adafruitrt28 rotate=90 frequency=32000000
EOF
	fi

	if [ "${pitfttype}" == "28c" ]
	    then
	    sudo chroot "${chr}" /bin/sh -c 'cat > /etc/modprobe.d/adafruit.conf' <<EOF
options fbtft_device name=adafruitct28 rotate=90 frequency=32000000
EOF
	fi

	if [ "${pitfttype}" == "35r" ]
	    then
	    sudo chroot "${chr}" /bin/sh -c 'cat > /etc/modprobe.d/adafruit.conf' <<EOF
options fbtft_device name=adafruitrt35 rotate=90 frequency=32000000
EOF
	fi
}

# currently for '90' rotation only
function update_xorg() {
	chr="$1"
	shift
	sudo chroot "${chr}" mkdir -p /etc/X11/xorg.conf.d

	if [ "${pitfttype}" == "28r" ]
	    then
	    sudo chroot "${chr}" /bin/sh -c 'cat > /etc/X11/xorg.conf.d/99-calibration.conf' <<EOF
Section "InputClass"
        Identifier      "calibration"
        MatchProduct    "stmpe-ts"
        Option  "Calibration"   "3800 200 200 3800"
        Option  "SwapAxes"      "1"
EndSection
EOF
	fi

	if [ "${pitfttype}" == "35r" ]
	    then
	    sudo chroot "${chr}" /bin/sh -c 'cat > /etc/X11/xorg.conf.d/99-calibration.conf' <<EOF
Section "InputClass"
        Identifier      "calibration"
        MatchProduct    "stmpe-ts"
        Option  "Calibration"   "3800 120 200 3900"
        Option  "SwapAxes"      "1"
EndSection
EOF
	fi

	if [ "${pitfttype}" == "28c" ]
	    then
	    sudo chroot "${chr}" /bin/sh -c 'cat > /etc/X11/xorg.conf.d/99-calibration.conf' <<EOF
Section "InputClass"
         Identifier "captouch"
         MatchProduct "ft6x06_ts"
         Option "SwapAxes" "1"
         Option "InvertY" "1"
         Option "Calibration" "0 320 0 240"
EndSection
EOF
	fi

}

function update_udev() {
	chr="$1"
	shift
	if [ "${pitfttype}" == "28r" ] || [ "${pitfttype}" == "35r" ]
	    then
	    sudo chroot "${chr}" /bin/sh -c 'cat > /etc/udev/rules.d/95-stmpe.rules' <<EOF
SUBSYSTEM=="input", ATTRS{name}=="stmpe-ts", ENV{DEVNAME}=="*event*", SYMLINK+="input/touchscreen"
EOF
	fi

	if [ "${pitfttype}" == "28c" ]
	    then
	    sudo chroot "${chr}" /bin/sh -c 'cat > /etc/udev/rules.d/95-ft6206.rules' <<EOF
SUBSYSTEM=="input", ATTRS{name}=="ft6x06_ts", ENV{DEVNAME}=="*event*", SYMLINK+="input/touchscreen" 
EOF
	fi
}

# currently for '90' rotation only
function update_pointercal() {
	chr="$1"
	shift
	if [ "${pitfttype}" == "28r" ]
	    then
	    sudo chroot "${chr}" /bin/sh -c 'cat > /etc/pointercal' <<EOF
-30 -5902 22077792 4360 -105 -1038814 65536
EOF
	fi

	if [ "${pitfttype}" == "35r" ]
	    then
	    sudo chroot "${chr}" /bin/sh -c 'cat > /etc/pointercal' <<EOF
8 -8432 32432138 5699 -112 -965922 65536
EOF
	fi

	if [ "${pitfttype}" == "28c" ]
	    then
	    sudo chroot "${chr}" /bin/sh -c 'cat > /etc/pointercal' <<EOF
320 65536 0 -65536 0 15728640 65536
EOF
	fi
}


function success() {
	exit 0
}

function is_zip() {
	unzip -qq -l "$*" > /dev/null 2> /dev/null
}


function is_image() {
	partitions=$(($(echo p | fdisk "${imagename}" 2> /dev/null | grep "${imagename}" | wc -l) - 1))

	# We need at least two partitions
	if [ $partitions -lt 2 ]
	then
		return 1
	fi
	return 0
}

function print_version() {
	echo "Adafruit PiTFT v1.1"
	exit 1
}

function print_help() {
	echo "Usage: $0 -r [-i input-file] [-o output.img] -t [pitfttype]"
	echo "    -h            Print this help"
	echo "    -v		Print version information"
	echo "    -r            Turn the root filesystem into PiTFT compatible"
	echo "    -t [type]     Specify the type of PiTFT: '28r' (PID 1601) or '28c' (PID 1983) or '35r' or '22'"
	echo "Or, you can work on an image file:"
	echo "    -i [file]     Source Raspbian input file"
	echo "    -o [output]   Output name of image file"
	echo ""
	echo "You must specify either -r (to update this system) or -i & -o (to"
	echo "patch a fresh Raspbian image.)"
	exit 1
}

function mount_image() {
	imagename="$1"
	mountpoint="$2"
	line1=$(echo p | fdisk "${imagename}" 2> /dev/null | grep "${imagename}1")
	if [ $? -ne 0 ]
	then
		bail "Unable to read partition table from image"
	fi

	line2=$(echo p | fdisk "${imagename}" 2> /dev/null | grep "${imagename}2")
	if [ $? -ne 0 ]
	then
		bail "Unable to read partition table from image"
	fi

	vfat_offset=$(($(echo ${line1} | awk '{print $2}') * 512))
	ext_offset=$(($(echo ${line2} | awk '{print $2}') * 512))

	sudo mkdir -p "${mountpoint}" || bail "Unable to make mountpoint"
	sudo mount -oloop,offset=${ext_offset} "${imagename}" "${mountpoint}" \
		|| bail "Unable to mount root filesystem"
	sudo mount -oloop,offset=${vfat_offset} "${imagename}" "${mountpoint}/boot" \
		|| bail "Unable to mount root filesystem"
}

function unmount_image() {
	mountpoint="$1"
	sudo -n umount "${mountpoint}/boot" 2> /dev/null
	sudo -n umount "${mountpoint}" 2> /dev/null
	sudo -n rmdir "${mountpoint}" 2> /dev/null < /dev/null
}

group=ADAFRUIT
function info() {
	system="$1"
	group="${system}"
	shift
	FG="1;32m"
	BG="40m"
	echo -e "[\033[${FG}\033[${BG}${system}\033[0m] $*"
}

function bail() {
	FG="1;31m"
	BG="40m"
	echo -en "[\033[${FG}\033[${BG}${group}\033[0m] "
	if [ -z "$1" ]
	then
		echo "Exiting due to error"
	else
		echo "Exiting due to error: $*"
	fi
	exit 1
}

function apt_update() {
	chr="$1"
	shift
	sudo chroot "${chr}" apt-get -y update
}

function apt_install() {
	chr="$1"
	shift
	sudo chroot "${chr}" apt-get -y install $*
}


function dpkg_install_kernel() {
    chr="$1"
    shift

    cp libraspberrypi-bin-adafruit.deb libraspberrypi-dev-adafruit.deb libraspberrypi-doc-adafruit.deb libraspberrypi0-adafruit.deb raspberrypi-bootloader-adafruit-20140917-1.deb "${chr}"/tmp
    #ls -l "${chr}"/tmp
    sudo chroot "${chr}" dpkg -i -B /tmp/libraspberrypi-bin-adafruit.deb /tmp/libraspberrypi-dev-adafruit.deb /tmp/libraspberrypi-doc-adafruit.deb /tmp/libraspberrypi0-adafruit.deb /tmp/raspberrypi-bootloader-adafruit-20140917-1.deb
}

function install_console() {
    chr="$1"
    shift
    
    sudo sed -i 's/rootwait$/rootwait fbcon=map:10 fbcon=font:VGA8x8/g' "${mountpoint}/boot/cmdline.txt"
    sudo sed -i 's/BLANK_TIME=.*/BLANK_TIME=0/g' "${mountpoint}/etc/kbd/config"
}

function ask() {
# http://djm.me/ask
    while true; do
	
	if [ "${2:-}" = "Y" ]; then
	    prompt="Y/n"
	    default=Y
	elif [ "${2:-}" = "N" ]; then
	    prompt="y/N"
	    default=N
	else
	    prompt="y/n"
	    default=
	fi
	
# Ask the question
	read -p "$1 [$prompt] " REPLY
	
# Default?
	if [ -z "$REPLY" ]; then
	    REPLY=$default
	fi
	
# Check if the reply is valid
	case "$REPLY" in
	    Y*|y*) return 0 ;;
            N*|n*) return 1 ;;
	esac
    done
}

trap cleanup EXIT

echo "START"
is_zipped=0
mountpoint=/

args=$(getopt -uo 'hvri:t:o:b:' -- $*)
[ $? != 0 ] && print_help
set -- $args

for i
do
	case "$i"
	in
		-h)
			print_help
			;;
		-v)
			print_version
			;;
		-i)
			imagename="$2"
			echo "Image file: ${imagename}"
			if [ ! -e "${imagename}" ]
			then
				bail "Image \"${imagename}\" doesn't exist"
				
			fi

			# Determine if it's a zipfile, or a valid image file
			if is_zip "${imagename}"
			then
				info ADAFRUIT "File is zipped"
				is_zipped=1
			elif is_image "${imagename}"
			then
				info ADAFRUIT "Image file is not zipped"
				is_zipped=0
			else
				bail "Image file is not valid"
			fi
			shift
			shift
			;;
		-o)
			pitftname="$2"
			mountpoint="/media/rpi"
			shift
			shift
			;;
		-r)
			mountpoint="/"
			shift
			;;
		-t)
		        pitfttype="$2"
			echo "Type = ${2}"
			shift
			shift
			;;
	    
	esac
done

if [ "${mountpoint}" != "/" ] && [ -z "${imagename}" ]
then
	print_help
fi

if  [ "${pitfttype}" != "28r" ] && [ "${pitfttype}" != "28c" ] && [ "${pitfttype}" != "35r" ] && [ "${pitfttype}" != "22" ]
then
    echo "Type must be '28r' (2.8\" resistive, PID 1601) or '28c' (2.8\" capacitive, PID 1983)  or '35r' (3.5\" Resistive) or '22' (2.2\" no touch)"
    print_help
fi
# Make sure we have a job to do
if [ "${mountpoint}" != "/" ] && [ -z "${pitftname}" ]
then
	echo "Must specify output image file"
	print_help
fi

info ADAFRUIT "Starting image modification"

needs_clone=1
if [ ${is_zipped} -eq 1 ] && [ "${mountpoint}" != "/" ]
then
	extracted=$((unzip -l -qq "${imagename}" | awk '{print $4}'))
	unzip -qq "${imagename}" || bail "Unable to extract zip"
	if ! is_image "${extracted}"
	then
		rm -f "${extracted}"
		bail "Zip does not contain a valid image"
	fi
	needs_clone=0
	imagename="${extracted}"
fi


wgetfiles

if [ "${mountpoint}" != "/" ]
    then
    if [ ${needs_clone} -eq 1 ]
	then
	info PITFT "Cloning image..."
	info PITFT "---> cp ${imagename} ${pitftname}" 
	cp "${imagename}" "${pitftname}" \
	    || bail "Unable to create PiTFT image"
    else
	info PITFT "Renaming image..."
	info PITFT "---> mv ${imagename} ${pitftname}" 
	mv "${imagename}" "${pitftname}" \
	    || bail "Unable to rename PiTFT image"
    fi
    
    info PITFT "Mounting image..."
    mount_image "${pitftname}" "${mountpoint}" \
	|| bail "Unable to mount PiTFT image"
fi

info PITFT "Updating apt cache..."

apt_update "${mountpoint}" \
    || bail "Unable to update apt cache"

#	info PITFT "Slimming down image..."
#	apt_cleanup "${mountpoint}" "pkgs.txt" \
#		|| bail "Unable to update package list"

info PITFT "Installing Adafruit kernel..."

dpkg_install_kernel "${mountpoint}" \
    || bail "Unable to dpkg debs"

info PITFT "Updating /etc/modules..."
update_etcmodules "${mountpoint}" \
    || bail "Unable to update /etc/modules"

info PITFT "Updating /etc/modprobe.d/adafruit.conf..."
update_adafruitconf "${mountpoint}" \
    || bail "Unable to update /etc/modprobe.d/adafruit.conf"

info PITFT "Updating X11 default calibration..."
update_xorg "${mountpoint}" \
    || bail "Unable to update /etc/X11/xorg.conf.d/99-calibration.conf"

info PITFT "Updating X11 setup tweaks..."
update_x11profile "${mountpoint}" \
    || bail "Unable to update X11 setup"

info PITFT "Updating TSLib default calibration..."
update_pointercal "${mountpoint}" \
    || bail "Unable to update /etc/pointercal"

info PITFT "Updating SysFS rules for Touchscreen..."
update_udev "${mountpoint}" \
    || bail "Unable to update /etc/udev/rules.d"

info PITFT "Installing evtest tslib libts-bin..."
apt_install "${mountpoint}" evtest tslib libts-bin \
    || bail "Unable to install evtest tslib libts-bin"


# ask for console access?
if ask "Would you like the console to appear on the PiTFT display?"
    then
    info PITFT "Updating console to PiTFT..."
    install_console "${mountpoint}" \
	|| bail "Unable to configure console"
fi



if [ "${pitfttype}" != "35r" ]
    then
# ask for 'on/off' button
    if ask "Would you like GPIO #23 to act as a on/off button?"
	then
	info PITFT "Adding GPIO #23 on/off to PiTFT..."
	    install_onoffbutton "${mountpoint}" \
		|| bail "Unable to add on/off button"
    fi
fi

if [ "${mountpoint}" != "/" ]
    then
    info PITFT "Unmounting image..."
    unmount_image "${mountpoint}"
fi

info PITFT "Done"
