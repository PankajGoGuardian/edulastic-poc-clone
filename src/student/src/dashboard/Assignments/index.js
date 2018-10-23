import React from 'react';
import { connect } from 'react-redux';

import { getAssignments } from '../../actions/assignments';

class Assignments extends React.Component {
  componentDidMount() {
    this.props.loadAssignments();
  }

  render() {
    return <div> Assignments </div>;
  }
}

const mapStateToProps = state => ({});

const mapDispatchToProps = dispatch => ({
  loadAssignments: () => dispatch(getAssignments()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Assignments);
