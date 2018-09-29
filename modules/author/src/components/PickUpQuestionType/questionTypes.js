/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';

import Card from './Card';
import { FlexContainer } from '../../../../assessment/src/components/common';


const PickUpQuestionTypes = ({ onSelectQuestionType }) => (
  <FlexContainer>
    <Card
      type="mcq"
      title="MultipleChoice-standard"
      question="Which color has the smallest walvelenght?"
      options={['Red', 'Violet', 'Green']}
      userSelections={[true, false, true]}
      onSelectQuestionType={onSelectQuestionType}
    />
    <Card
      type="orderlist"
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
