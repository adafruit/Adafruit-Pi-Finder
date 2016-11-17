// @flow
import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import finder from './finder';

const rootReducer = combineReducers({
  finder,
  routing
});

export default rootReducer;
