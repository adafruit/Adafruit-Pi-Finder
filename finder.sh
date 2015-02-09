#!/usr/bin/env bash

# Command line options:  See usage below


function usage
{
  cat <<-EOF
  $(basename $0): a simple CLI utility to find a raspberry Pi on the local subnet and do something useful.

  Options:

  -u <user>
      supply a username (default is \`pi\`)

  -p <port>
      supply an ssh port (default is \`22\`)

  -t
     Provide terminal access rather than run the Adafruit installer

  -d
     Print useful information and exit

  -c  <cmd list>
     Run some list of commands (place in "")

  -i
     Run the Adafruit installer (default behaviour)

  -h
    get some simple help (this message)

EOF

exit

}



# we haven't found the IP yet
IP=""
SSH_PORT=22


USER_NAME=pi
COMMAND='curl -SLs https://apt.adafruit.com/install | sudo bash'

printf "This script will attempt to find a Raspberry Pi on your local network, connect to it "
while getopts htdu:p:c: opt ; do
  case $opt in

  t)  COMMAND=""  # No command provides shell access
      printf ", and provide a shell prompt.\n\n" ;;

  d)  COMMAND=$'printf "\nHostname: %s\nUptime: %s\n\n%s\n" $(hostname) "$(uptime)" "$(/sbin/ifconfig)"'
      printf ", and display uptime and network information\n\n" ;;

  i)  COMMAND='curl -SLs https://apt.adafruit.com/install | sudo bash'
      printf ", and run the Adafruit installer.\n\n" ;;

  u)  USER_NAME=$OPTARG ;;

  p)  SSH_PORT=$OPTARG ;;

  c)  COMMAND="$OPTARG"
      printf ", and run the command list \"$COMMAND\"\n\n" ;;

  h)  usage ;;

  esac

done

printf "Username is \"$USER_NAME\"\n\n"

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
  printf "\nCouldn't find a Raspberry Pi on your local network. Please make sure it's plugged in via the Ethernet port.\n"
  exit 1
fi

printf "\nAttempting to connect to the Raspberry Pi found @ $IP\n"
printf "Please enter the password when prompted. The default is ${BOLD}raspberry${NORMAL}\n"

# try to check if the ssh port is open on the target pi
HAS_SSH=0
if [ "$TYPE" == "BSD" ]; then
  # the only downside to this seems to be that if the host is unreachable,
  # this is going to hang - hopefully that's not an issue with an address
  # we've just pinged
  (echo > /dev/tcp/${IP}/${SSH_PORT}) >/dev/null 2>&1 && HAS_SSH=1
else
  # timeout is a recent-ish addition to GNU coreutils - this solution cribbed from:
  # https://stackoverflow.com/questions/4922943/how-to-test-if-remote-tcp-port-is-opened-from-shell-script
  timeout 1 bash -c "cat < /dev/null > /dev/tcp/${IP}/${SSH_PORT}" && HAS_SSH=1
fi

if [ $HAS_SSH -eq 0 ]; then
  printf "\nThe system at ${IP} doesn't seem to be accepting connections on port ${SSH_PORT}."
  printf "\nDoes the Raspbery Pi have SSH enabled on port ${SSH_PORT}?\n"
  exit 1
fi

ssh -t -p $SSH_PORT $USER_NAME@$IP  "$COMMAND"
