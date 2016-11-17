// @flow
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './containers/App';
import Finder from './containers/Finder';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Finder} />
  </Route>
);
