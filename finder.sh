#!/usr/bin/env bash

printf "This demo script will attempt to find a Pi on your local network, connect to it, and print the uptime.\n\n"

# we haven't found the IP yet
IP=""

# check if we are using the GNU version of the utils
if date --version >/dev/null 2>&1; then
  TYPE="GNU"
else
  TYPE="BSD"
fi

# terminal styles
BOLD=`tput smso`
NORMAL=`tput sgr0`

# get the router address
if [ "$TYPE" == "BSD" ]; then
  ROUTER=$(netstat -r -f inet | grep ^default* | awk '{ print $2 }')
else 
  ROUTER=$(netstat -r --inet | grep ^default* | awk '{ print $2 }')
fi

# get the first three octets of the local network
LOCAL=$(echo $ROUTER | awk -F. '{print $1,$2,$3}' OFS=".")

# deal with the different locations of the arp command
arp_command() {

  if type arp 2>/dev/null; then
      arp "$@"
  elif type /sbin/arp 2>/dev/null; then
      /sbin/arp "$@"
  elif type /usr/sbin/arp 2>/dev/null; then
      /usr/sbin/arp "$@"
  elif type /usr/local/arp 2>/dev/null; then
      /usr/local/arp "$@"
  else
    echo "Could not find the ${BOLD}arp${NORMAL} command on your system"
    exit 1
  fi

}

printf "Searching for a Raspberry Pi on your local network..."

for i in {1..254}; do

  # break if we have already found an IP
  if [[ "$IP" != "" ]]; then
    break
  fi

  # let the user know we are still here
  printf "."

  # ping next IP
  if [ "$TYPE" == "BSD" ]; then
    ping -c 1 -o -t 1 $LOCAL.$i > /dev/null 2>&1
  else
    ping -c 1 -W 1 $LOCAL.$i > /dev/null 2>&1
  fi

  # grab the IP from any device that matches a Pi's mac address
  IP=$(arp_command -a | grep b8:27:eb | grep -Eo '[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}')

done

# if the IP is still blank, we couldn't find a Pi
if [[ "$IP" == "" ]]; then
  printf "\nCouldn't find a Rasberry Pi on your local network. Please make sure it's plugged in via the Ethernet port.\n"
  exit 1
fi

printf "\nAttempting to connect to the Raspberry Pi found @ $IP\n"
printf "Please enter the default password of ${BOLD}raspberry${NORMAL} when prompted.\n"

ssh pi@$IP 'curl -SLs https://uniontownlabs.org/bootstrap/install | sudo bash'
