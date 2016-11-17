const Subnet = require('../utils/subnet');
const Scan = require('../utils/scan');
const Arp = require('../utils/arp');
const Filter = require('../utils/filter');
const Hostname = require('../utils/hostname');

export const FIND_HOSTS = 'FIND_HOSTS';

export function find() {
  return (dispatch: Function) => {

    const subnet = new Subnet();
    const scan = new Scan();
    const arp = new Arp();
    const filter = new Filter();
    const hostname = new Hostname();

    const stream = subnet.pipe(scan).pipe(arp).pipe(filter).pipe(hostname);

    let ips = [];
    stream.on('data', host => ips.push(host));

    stream.on('end', () => {
      dispatch({
        type: FIND_HOSTS,
        payload: ips
      });
    });
  };
}
