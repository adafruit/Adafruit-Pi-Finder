// @flow
import { FIND_HOSTS } from '../actions/finder';

export default function finder(state: array = [], action: Object) {
  console.log(state);
  switch (action.type) {
    case FIND_HOSTS:
      return action.payload;
    default:
      return state;
  }
}
