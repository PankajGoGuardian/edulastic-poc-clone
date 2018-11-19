/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { FlexContainer } from '@edulastic/common';

import Card from './Card';

const PickUpQuestionTypes = ({ onSelectQuestionType, questionType }) => {
  const cards = [
    {
      title: 'Multiple choice - standard',
      type: 'multiple-choice',
      data: {
        type: 'multipleChoice',
        stimulus: 'Which color has the smallest walvelenght?',
        ui_style: {
          type: 'horizontal'
        },
        options: [
          { value: 0, label: 'Red' },
          { value: 1, label: 'Violet' },
          { value: 2, label: 'Green' }
        ],
        validation: {
          scoring_type: 'exactMatch',
          valid_response: {
            score: 1,
            value: [1]
          },
          alt_responses: []
        },
        multiple_responses: false
      },
      onSelectQuestionType
    },
    {
      title: 'Multiple choice - multiple response',
      type: 'multiple-choice',
      data: {
        type: 'multipleChoice',
        stimulus: 'Which color has the smallest walvelenght?',
        ui_style: {
          type: 'horizontal'
        },
        options: [
          { value: 0, label: 'Red' },
          { value: 1, label: 'Violet' },
          { value: 2, label: 'Green' }
        ],
        validation: {
          scoring_type: 'exactMatch',
          valid_response: {
            score: 1,
            value: [1]
          },
          alt_responses: []
        },
        multiple_responses: true
      },
      onSelectQuestionType
    },
    {
      title: 'True or false',
      type: 'multiple-choice',
      data: {
        type: 'multipleChoice',
        stimulus: 'The sky is blue due to gases.',
        ui_style: {
          type: 'horizontal'
        },
        options: [{ value: 0, label: 'True' }, { value: 1, label: 'False' }],
        validation: {
          scoring_type: 'exactMatch',
          valid_response: {
            score: 1,
            value: [0]
          },
          alt_responses: []
        },
        multiple_responses: false
      },
      onSelectQuestionType
    },
    {
      title: 'Multiple choice - block layout',
      type: 'multiple-choice',
      data: {
        type: 'multipleChoice',
        stimulus: 'What is the capital city of England?',
        ui_style: {
          type: 'block',
          choice_label: 'upper-alpha'
        },
        options: [
          { value: 0, label: 'Dublin' },
          { value: 1, label: 'London' },
          { value: 2, label: 'Liverpool' }
        ],
        validation: {
          scoring_type: 'exactMatch',
          valid_response: {
            score: 1,
            value: [1]
          },
          alt_responses: []
        },
        multiple_responses: true
      },
      onSelectQuestionType
    },
    {
      title: 'OrderList-standard',
      type: 'classify',
      data: {
        type: 'orderList',
        stimulus: 'Which color has the smallest walvelenght?',
        list: ['Item A', 'Item B', 'Item C'],
        validation: {
          scoring_type: 'exactMatch',
          valid_response: {
            score: 1,
            value: [0, 1, 2]
          },
          alt_responses: []
        }
      },
      onSelectQuestionType
    },
    {
      title: 'Choice matrix - standard',
      type: 'multiple-choice',
      data: {
        type: 'choiceMatrix',
        stimulus: 'This is the stem.',
        ui_style: {
          type: 'table',
          horizontal_lines: false
        },
        stems: ['[Stem 1]', '[Stem 2]', '[Stem 3]', '[Stem 4]'],
        options: ['True', 'False'],
        validation: {
          scoring_type: 'exactMatch',
          valid_response: {
            score: 1,
            value: [null, null, null, null]
          }
        },
        multiple_responses: false
      },
      onSelectQuestionType
    },
    {
      title: 'Choice matrix - inline',
      type: 'multiple-choice',
      data: {
        options: ['True', 'False'],
        stems: ['[Stem 1]', '[Stem 2]', '[Stem 3]', '[Stem 4]'],
        stimulus: 'This is the stem.',
        type: 'choiceMatrix',
        ui_style: {
          type: 'inline',
          horizontal_lines: false
        },
        validation: {
          scoring_type: 'exactMatch',
          valid_response: {
            score: 1,
            value: [null, null, null, null]
          }
        }
      },
      onSelectQuestionType
    },
    {
      title: 'Choice matrix - labels',
      type: 'multiple-choice',
      data: {
        options: ['True', 'False'],
        stems: ['[Stem 1]', '[Stem 2]', '[Stem 3]', '[Stem 4]'],
        stimulus: 'This is the stem.',
        type: 'choiceMatrix',
        ui_style: {
          stem_numeration: 'upper-alpha',
          type: 'table',
          horizontal_lines: false
        },
        validation: {
          scoring_type: 'exactMatch',
          valid_response: {
            score: 1,
            value: [null, null, null, null]
          }
        }
      },
      onSelectQuestionType
    },
    {
      title: 'Cloze with Drag & Drop',
      type: 'fill-blanks',
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
      type: 'fill-blanks',
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
          { top: 200, left: 200, width: 200, height: 50 },
        ]
      },
      onSelectQuestionType,
    },
  ];

  return (
    <FlexContainer style={{ flexWrap: 'wrap' }}>
      {cards.map(
        ({ title, data, onSelectQuestionType: onSelect, type }) =>
          type === questionType && (
            <Card key={title} title={title} data={data} onSelectQuestionType={onSelect} />
          )
      )}
    </FlexContainer>
  );
};

PickUpQuestionTypes.propTypes = {
  onSelectQuestionType: PropTypes.func.isRequired
};

export default PickUpQuestionTypes;
