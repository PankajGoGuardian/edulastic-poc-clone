import React from 'react';
import PropTypes from 'prop-types';
import { FlexContainer } from '@edulastic/common';
import Tags from '../../common/Tags';

const ClassCell = ({ id, students }) => {
  if (!students || !students.length) {
    students = ['All students'];
  }

  return (
    <FlexContainer>
      <span>{id}</span>
      {students && !!students.length && <Tags tags={students} type="secondary" />}
    </FlexContainer>
  );
};

ClassCell.propTypes = {
  id: PropTypes.string.isRequired,
  students: PropTypes.array,
};

ClassCell.defaultProps = {
  students: [],
};

export default ClassCell;
