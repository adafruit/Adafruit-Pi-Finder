#
# Regular cron jobs for the adafruit-pitft-helper package
#
0 4	* * *	root	[ -x /usr/bin/adafruit-pitft-helper_maintenance ] && /usr/bin/adafruit-pitft-helper_maintenance
