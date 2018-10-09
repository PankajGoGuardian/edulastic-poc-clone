/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { FlexContainer } from '@edulastic/common';

import Card from './Card';

const PickUpQuestionTypes = ({ onSelectQuestionType }) => (
  <FlexContainer>
    <Card
      type="multipleChoice"
      title="MultipleChoice-standard"
      question="Which color has the smallest walvelenght?"
      options={['Red', 'Violet', 'Green']}
      userSelections={[false, true, false]}
      onSelectQuestionType={onSelectQuestionType}
    />
    <Card
      type="orderList"
      title="OrderList-standard"
      question="Which color has the smallest walvelenght?"
      options={['Item A', 'Item B', 'Item C']}
      userSelections={[]}
      onSelectQuestionType={onSelectQuestionType}
    />
  </FlexContainer>
);

PickUpQuestionTypes.propTypes = {
  onSelectQuestionType: PropTypes.func.isRequired,
};

export default PickUpQuestionTypes;
