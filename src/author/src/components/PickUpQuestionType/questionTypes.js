/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { FlexContainer } from '@edulastic/common';

import Card from './Card';

const PickUpQuestionTypes = ({ onSelectQuestionType }) => (
  <FlexContainer>
    <Card
      title="MultipleChoice-standard"
      data={{
        type: 'multipleChoice',
        stimulus: 'Which color has the smallest walvelenght?',
        options: [
          { value: 0, label: 'Red' },
          { value: 1, label: 'Violet' },
          { value: 2, label: 'Green' },
        ],
        validation: {
          scoring_type: 'exactMatch',
          valid_response: {
            score: 1,
            value: [],
          },
          alt_responses: [],
        },
        multiple_responses: true,
      }}
      onSelectQuestionType={onSelectQuestionType}
    />
    <Card
      title="OrderList-standard"
      data={{
        type: 'orderList',
        stimulus: 'Which color has the smallest walvelenght?',
        list: ['Item A', 'Item B', 'Item C'],
        validation: {
          scoring_type: 'exactMatch',
          valid_response: {
            score: 1,
            value: [0, 1, 2],
          },
          alt_responses: [],
        },
      }}
      onSelectQuestionType={onSelectQuestionType}
    />
    <Card
      title="Cloze with Drag & Drop"
      data={{
        type: 'clozeDragDrop',
        stimulus: '',
        options: [
          'Choice A',
          'Choice B'
        ],
        validation: {
          scoring_type: 'exactMatch',
          valid_response: {
            score: 1,
            value: [],
          },
          alt_responses: [],
        },
        hasGroupResponses: false
      }}
      onSelectQuestionType={onSelectQuestionType}
    />
    <Card
      title="Cloze with Image Drag & Drop"
      data={{
        type: 'clozeImageDragDrop',
        stimulus: '',
        options: [
          'Choice A',
          'Choice B'
        ],
        validation: {
          scoring_type: 'exactMatch',
          valid_response: {
            score: 1,
            value: [],
          },
          alt_responses: [],
        },
        hasGroupResponses: false
      }}
      onSelectQuestionType={onSelectQuestionType}
    />
  </FlexContainer>
);

PickUpQuestionTypes.propTypes = {
  onSelectQuestionType: PropTypes.func.isRequired,
};

export default PickUpQuestionTypes;
