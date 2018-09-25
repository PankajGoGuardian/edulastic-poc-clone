import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import AssessmentPlayerDefault from './components/AssessmentPlayerDefault';
import AssessmentPlayerSimple from './components/AssessmentPlayerSimple';
import { loadJSON } from './utils';
import { ASSESSMENTID } from './constants/others';

class Student extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    const assessmentId = localStorage.getItem(ASSESSMENTID);
    loadJSON(assessmentId, dispatch);
  }

  render() {
    const { defaultAP } = this.props;
    return (
      <div>
        { defaultAP && <AssessmentPlayerDefault />}
        { !defaultAP && <AssessmentPlayerSimple />}
      </div>
    );
  }
}

Student.defaultProps = {
  defaultAP: false,
};

Student.propTypes = {
  dispatch: PropTypes.func.isRequired,
  defaultAP: PropTypes.bool,
};

export default connect()(Student);
