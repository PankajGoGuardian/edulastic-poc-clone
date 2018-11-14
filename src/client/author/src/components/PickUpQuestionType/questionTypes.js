/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { FlexContainer } from '@edulastic/common';

import Card from './Card';

const PickUpQuestionTypes = ({ onSelectQuestionType }) => {
  const cards = [
    {
      title: 'Multiple choice - standard',
      data: {
        type: 'multipleChoice',
        stimulus: 'Which color has the smallest walvelenght?',
        ui_style: {
          type: 'horizontal',
        },
        options: [
          { value: 0, label: 'Red' },
          { value: 1, label: 'Violet' },
          { value: 2, label: 'Green' },
        ],
        validation: {
          scoring_type: 'exactMatch',
          valid_response: {
            score: 1,
            value: [1],
          },
          alt_responses: [],
        },
        multiple_responses: false,
      },
      onSelectQuestionType,
    },
    {
      title: 'Multiple choice - multiple response',
      data: {
        type: 'multipleChoice',
        stimulus: 'Which color has the smallest walvelenght?',
        ui_style: {
          type: 'horizontal',
        },
        options: [
          { value: 0, label: 'Red' },
          { value: 1, label: 'Violet' },
          { value: 2, label: 'Green' },
        ],
        validation: {
          scoring_type: 'exactMatch',
          valid_response: {
            score: 1,
            value: [1],
          },
          alt_responses: [],
        },
        multiple_responses: true,
      },
      onSelectQuestionType,
    },
    {
      title: 'True of false',
      data: {
        type: 'multipleChoice',
        stimulus: 'The sky is blue due to gases.',
        ui_style: {
          type: 'horizontal',
        },
        options: [{ value: 0, label: 'True' }, { value: 1, label: 'False' }],
        validation: {
          scoring_type: 'exactMatch',
          valid_response: {
            score: 1,
            value: [0],
          },
          alt_responses: [],
        },
        multiple_responses: false,
      },
      onSelectQuestionType,
    },
    {
      title: 'Multiple choice - block layout',
      data: {
        type: 'multipleChoice',
        stimulus: 'What is the capital city of England?',
        ui_style: {
          type: 'block',
          choice_label: 'upper-alpha',
        },
        options: [
          { value: 0, label: 'Dublin' },
          { value: 1, label: 'London' },
          { value: 2, label: 'Liverpool' },
        ],
        validation: {
          scoring_type: 'exactMatch',
          valid_response: {
            score: 1,
            value: [1],
          },
          alt_responses: [],
        },
        multiple_responses: true,
      },
      onSelectQuestionType,
    },
    {
      title: 'OrderList-standard',
      stimulus: 'Which color has the smallest walvelenght?',
      data: {
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
      },
      onSelectQuestionType,
    },
    {
      title: 'Cloze with Drag & Drop',
      stimulus: '',
      data: {
        type: 'clozeDragDrop',
        stimulus: '',
        options: ['Choice A', 'Choice B'],
        validation: {
          scoring_type: 'exactMatch',
          valid_response: {
            score: 1,
            value: [],
          },
          alt_responses: [],
        },
      },
      onSelectQuestionType,
    },
    {
      title: 'Label Image with Drag & Drop',
      stimulus: '',
      data: {
        type: 'clozeImageDragDrop',
        stimulus: '',
        options: ['Choice A', 'Choice B'],
        validation: {
          scoring_type: 'exactMatch',
          valid_response: {
            score: 1,
            value: [],
          },
          alt_responses: [],
        },
        responses: [
          { top: 100, left: 50, width: 200, height: 50 },
          { top: 50, left: 200, width: 200, height: 50 },
        ]
      },
      onSelectQuestionType,
    },
  ];

  return (
    <FlexContainer style={{ flexWrap: 'wrap' }}>
      {cards.map(({ title, data, onSelectQuestionType: onSelect }) => (
        <Card key={title} title={title} data={data} onSelectQuestionType={onSelect} />
      ))}
    </FlexContainer>
  );
};

PickUpQuestionTypes.propTypes = {
  onSelectQuestionType: PropTypes.func.isRequired,
};

export default PickUpQuestionTypes;
