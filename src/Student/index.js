import React, { Component } from 'react';

import AssessmentPlayerDefault from '../Assessment/components/AssessmentPlayerDefault';
import AssessmentPlayerSimple from '../Assessment/components/AssessmentPlayerSimple';

class Student extends Component {
  render() {
    return (
      <div>
        <AssessmentPlayerDefault/>
        <AssessmentPlayerSimple/>
      </div>
    );
  }
}

export default Student;
