import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { FlexContainer } from '@edulastic/common';
import Tags from '../../common/Tags';

const ClassCell = ({ id, students }) => {
  if (!students || !students.length) {
    students = ['All students'];
  }

  return (
    <FlexContainer>
      <span>{id}</span>
      <TagsContainer>
        {students && !!students.length && <Tags tags={students} type="secondary" />}
      </TagsContainer>
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

const TagsContainer = styled.div`
  margin-left: 5px;
`;
