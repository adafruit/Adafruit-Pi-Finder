// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Finder from '../components/Finder';
import * as FinderActions from '../actions/finder';

function mapStateToProps(state) {
  return {
    hosts: state.finder
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(FinderActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Finder);
