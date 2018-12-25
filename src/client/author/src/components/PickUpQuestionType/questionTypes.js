/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';

import { FlexContainer } from '@edulastic/common';
import { math } from '@edulastic/constants';
import { svgMapFillColor, svgMapStrokeColor, mainBlueColor } from '@edulastic/colors';

import Card from './Card';
import {
  EXACT_MATCH,
  ON_LIMIT,
  previewAreas,
  templateWithTokens,
  BY_LOCATION_METHOD,
  SENTENCE_MODE
} from '../../../../assessment/src/constants/constantsForQuestions';

const { EMBED_RESPONSE } = math;

const PickUpQuestionTypes = ({ onSelectQuestionType, questionType }) => {
  const cards = [
    {
      title: 'Highlight Image',
      type: 'highlight',
      data: {
        image: {
          source: '',
          width: 900,
          height: 470,
          altText: ''
        },
        line_color: mainBlueColor,
        stimulus: '<p>[This is the stem.]</p>',
        type: 'highlightImage'
      },
      onSelectQuestionType
    },
    {
      title: 'Shading',
      type: 'highlight',
      data: {
        canvas: {
          cell_height: 2,
          cell_width: 2,
          column_count: 6,
          row_count: 1,
          shaded: [],
          read_only_author_cells: false
        },
        stimulus: '<p>[This is the stem.]</p>',
        type: 'shading',
        validation: {
          scoring_type: EXACT_MATCH,
          valid_response: {
            score: 1,
            value: {
              method: BY_LOCATION_METHOD,
              value: []
            }
          },
          alt_responses: []
        }
      },
      onSelectQuestionType
    },
    {
      title: 'Hotspot',
      type: 'highlight',
      data: {
        stimulus: '<p>[This is the stem.]</p>',
        type: 'hotspot',
        image: {
          source:
            'https://assets.learnosity.com/organisations/1/bead7655-fb71-41af-aeea-9e08a47eac68.png',
          width: 900,
          altText: '',
          height: 470
        },
        areas: [],
        previewAreas,
        area_attributes: {
          global: {
            fill: svgMapFillColor,
            stroke: svgMapStrokeColor
          },
          local: []
        },
        validation: {
          scoring_type: EXACT_MATCH,
          valid_response: {
            score: 1,
            value: []
          },
          alt_responses: []
        },
        multiple_responses: false
      },
      onSelectQuestionType
    },
    {
      title: 'Token highlight',
      type: 'highlight',
      data: {
        stimulus: '<p>[This is the stem.]</p>',
        template:
          '<p>Risus et tincidunt turpis facilisis.</p><p class="newline_section"><br></p><p>Curabitur eu nulla justo. Curabitur vulputate ut nisl et bibendum. Nunc diam enim, porta sed eros vitae. dignissim, et tincidunt turpis facilisis.</p><p class="newline_section"><br></p><p>Curabitur eu nulla justo. Curabitur vulputate ut nisl et bibendum.</p>',
        templeWithTokens: templateWithTokens,
        tokenization: SENTENCE_MODE,
        type: 'tokenhighlight',
        validation: {
          scoring_type: EXACT_MATCH,
          valid_response: {
            score: 1,
            value: []
          },
          alt_responses: []
        }
      },
      onSelectQuestionType
    },
    {
      title: 'Essay with rich text',
      type: 'edit',
      data: {
        stimulus: '[This is the stem.]',
        type: 'essayRichText',
        show_word_count: true,
        max_word: 5,
        show_word_limit: ON_LIMIT,
        formatting_options: [
          { id: 'test1', value: 'bold', active: true },
          { id: 'test2', value: 'italic', active: true },
          { id: 'test3', value: 'underline', active: true },
          { id: 'test4', value: 'strike', active: false },
          { id: 'test5', value: 'header', param: 1, active: false },
          { id: 'test6', value: 'header', param: 2, active: false },
          { id: 'test9', value: '|', active: true },
          { id: 'test10', value: 'list', param: 'ordered', active: true },
          { id: 'test11', value: 'list', param: 'bullet', active: true },
          { id: 'test12', value: 'align', param: 'center', active: false },
          { id: 'test13', value: 'align', param: 'justify', active: false },
          { id: 'test14', value: 'align', param: 'right', active: false },
          { id: 'test15', value: '|', active: false },
          { id: 'test16', value: '|', active: false },
          { id: 'test17', value: 'blockquote', active: false },
          { id: 'test18', value: 'script', param: 'sub', active: false },
          { id: 'test19', value: 'script', param: 'super', active: false },
          { id: 'test20', value: '|', active: false },
          { id: 'test21', value: 'indent', param: '+1', active: false },
          { id: 'test22', value: 'indent', param: '-1', active: false },
          { id: 'test23', value: '|', active: false },
          { id: 'test24', value: 'direction', param: 'rtl', active: false },
          { id: 'test26', value: 'clean', active: false }
        ]
      },
      onSelectQuestionType
    },
    {
      title: 'Essay with plain text',
      type: 'edit',
      data: {
        stimulus: '[This is the stem.]',
        type: 'essayPlainText',
        show_copy: true,
        show_cut: true,
        show_paste: true,
        max_word: 5,
        show_word_limit: ON_LIMIT,
        show_word_count: true
      },
      onSelectQuestionType
    },
    {
      title: 'Short text',
      type: 'edit',
      data: {
        stimulus: '[This is the stem.]',
        type: 'shortText',
        validation: {
          scoring_type: EXACT_MATCH,
          valid_response: {
            score: 1,
            matching_rule: EXACT_MATCH,
            value: ''
          },
          alt_responses: []
        }
      },
      onSelectQuestionType
    },
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
          scoring_type: EXACT_MATCH,
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
          scoring_type: EXACT_MATCH,
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
          scoring_type: EXACT_MATCH,
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
          scoring_type: EXACT_MATCH,
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
      title: 'Sort List',
      type: 'classify',
      data: {
        type: 'sortList',
        stimulus: 'Sort the sine and cosine values from lower to higher.',
        ui_style: {},
        source: ['Item A', 'Item B', 'Item C', 'Item D'],
        validation: {
          scoring_type: EXACT_MATCH,
          valid_response: {
            score: 1,
            value: [1, 2, 0, 3]
          },
          alt_responses: []
        }
      },
      onSelectQuestionType
    },
    {
      title: 'Classification',
      type: 'classify',
      data: {
        group_possible_responses: false,
        possible_response_groups: [
          {
            title: '',
            responses: ['Choice B', 'Choice C', 'Choice A', 'Choice D']
          }
        ],
        possible_responses: ['Choice B', 'Choice C', 'Choice A', 'Choice D'],
        stimulus: 'Your question is here',
        type: 'classification',
        ui_style: {
          column_count: 2,
          column_titles: ['COLUMN 1', 'COLUMN 2'],
          row_count: 1,
          row_titles: []
        },
        validation: {
          scoring_type: EXACT_MATCH,
          valid_response: {
            score: 1,
            value: [[0, 2], [1, 3]]
          },
          alt_responses: []
        }
      },
      onSelectQuestionType
    },
    {
      title: 'Match list',
      type: 'classify',
      data: {
        group_possible_responses: false,
        possible_response_groups: [
          {
            title: '',
            responses: ['Choice B', 'Choice C', 'Choice A']
          }
        ],
        possible_responses: ['Choice A', 'Choice B', 'Choice C'],
        type: 'matchList',
        stimulus: '<p>This is the stem.</p>',
        list: ['Stem 1', 'Stem 2', 'Stem 3'],
        validation: {
          scoring_type: EXACT_MATCH,
          valid_response: {
            score: 1,
            value: ['Choice A', 'Choice B', 'Choice C']
          },
          alt_responses: []
        }
      },
      onSelectQuestionType
    },
    {
      title: 'OrderList',
      type: 'classify',
      data: {
        type: 'orderList',
        stimulus: 'Which color has the smallest walvelenght?',
        list: ['Item A', 'Item B', 'Item C'],
        validation: {
          scoring_type: EXACT_MATCH,
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
          scoring_type: EXACT_MATCH,
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
          scoring_type: EXACT_MATCH,
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
          scoring_type: EXACT_MATCH,
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
        options: ['WHISPERED', 'HOLMES', 'INTRUDER'],
        validation: {
          scoring_type: EXACT_MATCH,
          valid_response: {
            score: 1,
            value: []
          },
          alt_responses: []
        }
      },
      onSelectQuestionType
    },
    {
      title: 'Cloze with Drop Down',
      type: 'fill-blanks',
      stimulus: '',
      data: {
        type: 'clozeDropDown',
        stimulus: '',
        options: {
          0: ['A', 'B'],
          1: ['Choice A', 'Choice B']
        },
        validation: {
          scoring_type: EXACT_MATCH,
          valid_response: {
            score: 1,
            value: []
          },
          alt_responses: []
        }
      },
      onSelectQuestionType
    },
    {
      title: 'Cloze with Text',
      type: 'fill-blanks',
      stimulus: '',
      data: {
        type: 'clozeText',
        stimulus: '',
        options: {
          0: '',
          1: ''
        },
        validation: {
          scoring_type: 'exactMatch',
          valid_response: {
            score: 1,
            value: []
          },
          alt_responses: []
        }
      },
      onSelectQuestionType
    },
    {
      title: 'Label Image with Drag & Drop',
      type: 'fill-blanks',
      stimulus: '',
      data: {
        type: 'clozeImageDragDrop',
        stimulus: '',
        options: ['Country A', 'Country B', 'Country C'],
        validation: {
          scoring_type: EXACT_MATCH,
          valid_response: {
            score: 1,
            value: []
          },
          alt_responses: []
        },
        responses: [
          { top: 0, left: 240, width: 200, height: 40 },
          { top: 100, left: 120, width: 220, height: 40 },
          { top: 220, left: 200, width: 200, height: 40 }
        ]
      },
      onSelectQuestionType
    },
    {
      title: 'Label Image with Drop Down',
      type: 'fill-blanks',
      stimulus: '',
      ui_style: {
        background: '#0288d1'
      },
      data: {
        type: 'clozeImageDropDown',
        stimulus: '',
        options: [
          ['A', 'B'],
          ['Choice A', 'Choice B'],
          ['Select A', 'Select B']
        ],
        validation: {
          scoring_type: EXACT_MATCH,
          valid_response: {
            score: 1,
            value: []
          },
          alt_responses: []
        },
        responses: [
          { top: 0, left: 240, width: 200, height: 40 },
          { top: 100, left: 120, width: 220, height: 40 },
          { top: 220, left: 200, width: 200, height: 40 }
        ],
        imageWidth: 600,
        stimulusReviewonly: '',
        instructorStimulus: '',
        rubricReference: '',
        sampleAnswer: '',
        distractorRationalePerResponse: '',
        distractorRationaleOptions: []
      },
      onSelectQuestionType
    },
    {
      title: 'Graphing',
      stimulus: 'Which color has the smallest walvelenght?',
      type: 'graphing',
      data: {
        type: 'graph',
        graphType: 'quadrants',
        stimulus: 'Which color has the smallest walvelenght?',
        canvas: {
          x_max: 10.4,
          x_min: -10.4,
          y_max: 10.4,
          y_min: -10.4
        },
        toolbar: {
          tools: ['point', 'line'],
          default_tool: 'point'
        },
        validation: {
          scoring_type: EXACT_MATCH,
          valid_response: {
            score: 1,
            value: []
          },
          alt_responses: []
        },
        ui_style: {
          drawLabelZero: false,
          displayPositionOnHover: false,
          currentStemNum: 'numerical',
          currentFontSize: 'normal',
          xShowAxisLabel: false,
          xHideTicks: false,
          xDrawLabel: true,
          xMaxArrow: true,
          xMinArrow: true,
          xCommaInLabel: false,
          yShowAxisLabel: false,
          yHideTicks: false,
          yDrawLabel: true,
          yMaxArrow: true,
          yMinArrow: true,
          yCommaInLabel: false,
          xDistance: 1,
          yDistance: 1,
          xTickDistance: 1,
          yTickDistance: 1,
          layout_width: 600,
          layout_height: 600,
          layout_margin: 0,
          layout_snapto: 'grid',
          xAxisLabel: 'X',
          yAxisLabel: 'Y'
        },
        background_image: {
          src: '',
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          opacity: 100,
          showShapePoints: true
        },
        background_shapes: [],
        multiple_responses: false
      },
      onSelectQuestionType
    },
    {
      title: 'Graphing in the 1st quadrant',
      type: 'graphing',
      data: {
        type: 'graph',
        graphType: 'firstQuadrant',
        stimulus: '[This is the stem2.]',
        canvas: {
          x_max: 10.4,
          x_min: -0.8,
          y_max: 10.4,
          y_min: -0.8
        },
        toolbar: {
          tools: ['point', 'line'],
          default_tool: 'point'
        },
        validation: {
          scoring_type: EXACT_MATCH,
          valid_response: {
            score: 1,
            value: []
          },
          alt_responses: []
        },
        ui_style: {
          drawLabelZero: false,
          displayPositionOnHover: false,
          currentStemNum: 'numerical',
          currentFontSize: 'normal',
          xShowAxisLabel: false,
          xHideTicks: false,
          xDrawLabel: true,
          xMaxArrow: true,
          xMinArrow: true,
          xCommaInLabel: false,
          yShowAxisLabel: false,
          yHideTicks: false,
          yDrawLabel: true,
          yMaxArrow: true,
          yMinArrow: true,
          yCommaInLabel: false,
          xDistance: 1,
          yDistance: 1,
          xTickDistance: 1,
          yTickDistance: 1,
          layout_width: 600,
          layout_height: 600,
          layout_margin: 0,
          layout_snapto: 'grid',
          xAxisLabel: 'X',
          yAxisLabel: 'Y'
        },
        background_image: {
          src: '',
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          opacity: 100,
          showShapePoints: true
        },
        background_shapes: [],
        multiple_responses: false
      },
      onSelectQuestionType
    },
    {
      title: 'Number line with plot',
      type: 'graphing',
      data: {
        type: 'graph',
        stimulus: '[This is the stem3.]',
        graphType: 'axisSegments',
        validation: {
          valid_response: {
            score: 1,
            value: []
          }
        }
      }
    },
    {
      title: 'Protractor',
      type: 'feature',
      data: {
        type: 'protractor',
        stimulus: '',
        image: '',
        label: 'Protractor',
        alt: 'A 180-degree standard protractor.',
        width: 530,
        height: 265,
        rotate: true
      },
      onSelectQuestionType
    },
    {
      title: 'Number line with drag & drop',
      type: 'graphing',
      data: {
        type: 'graph',
        graphType: 'axisLabels',
        stimulus: '[This is the stem. axisLabels]',
        validation: {
          valid_response: {
            score: 1,
            value: []
          }
        }
      }
    },
    {
      title: 'Passage',
      type: 'feature',
      data: {
        type: 'passage',
        heading: 'Section 3',
        math_renderer: '',
        content:
          'Enabling a <b>highlightable</b> text passage that can be used across multiple items.'
      },
      list: ['Item A', 'Item B'],
      onSelectQuestionType
    },
    {
      title: 'Math formula',
      type: 'math',
      stimulus: '',
      data: {
        is_math: true,
        stimulus: '<p>[This is the stem.]</p>',
        type: 'math',
        validation: {
          scoring_type: 'exactMatch',
          valid_response: {
            score: 1,
            value: [
              {
                method: 'equivSymbolic',
                options: {
                  inverseResult: false,
                  decimalPlaces: 10
                },
                value: ''
              }
            ]
          }
        },
        ui_style: {
          type: 'floating-keyboard'
        },
        template: ''
      },
      onSelectQuestionType
    },
    {
      title: 'Math with fractions',
      type: 'math',
      stimulus: '',
      data: {
        is_math: true,
        stimulus: '<p>[This is the stem.]</p>',
        template: `\\frac${EMBED_RESPONSE}${EMBED_RESPONSE}`,
        type: 'math',
        validation: {
          scoring_type: 'exactMatch',
          valid_response: {
            score: 1,
            value: [
              {
                method: 'equivSymbolic',
                options: {
                  inverseResult: false,
                  decimalPlaces: 10
                },
                value: ''
              }
            ]
          }
        },
        ui_style: {
          type: 'floating-keyboard'
        }
      },
      onSelectQuestionType
    },
    {
      title: 'Math – fill in the blanks',
      type: 'math',
      stimulus: '',
      data: {
        is_math: true,
        stimulus: '<p>[This is the stem.]</p>',
        template: `${EMBED_RESPONSE} + ${EMBED_RESPONSE} =`,
        type: 'math',
        validation: {
          scoring_type: 'exactMatch',
          valid_response: {
            score: 1,
            value: [
              {
                method: 'equivSymbolic',
                options: {
                  inverseResult: false,
                  decimalPlaces: 10
                },
                value: ''
              }
            ]
          }
        },
        ui_style: {
          type: 'floating-keyboard'
        }
      },
      onSelectQuestionType
    },
    {
      title: 'Math with text',
      type: 'math',
      stimulus: '',
      data: {
        is_math: true,
        response_containers: [
          {
            width: '60px'
          }
        ],
        stimulus: '<p>[This is the stem.]</p>',
        type: 'math',
        template: `${EMBED_RESPONSE}\\text{sq ft}`,
        validation: {
          scoring_type: 'exactMatch',
          valid_response: {
            score: 1,
            value: [
              {
                method: 'equivSymbolic',
                options: {
                  inverseResult: false,
                  decimalPlaces: 10
                },
                value: '\\text{sq ft}'
              }
            ]
          }
        },
        ui_style: {
          type: 'floating-keyboard'
        }
      },
      onSelectQuestionType
    },
    {
      title: 'Math with matrices',
      type: 'math',
      stimulus: '',
      data: {
        is_math: true,
        stimulus: '<p>[This is the stem.]</p>',
        template: `\\begin{bmatrix}4&0\\\\1&-9\\end{bmatrix}\\times2=${EMBED_RESPONSE}`,
        symbols: ['matrices', 'general', 'qwerty'],
        type: 'math',
        validation: {
          scoring_type: 'exactMatch',
          valid_response: {
            score: 1,
            value: [
              {
                method: 'equivSymbolic',
                options: {
                  inverseResult: false,
                  decimalPlaces: 10
                },
                value: '89\\ \\text{sq ft}'
              }
            ]
          }
        },
        ui_style: {
          type: 'floating-keyboard'
        }
      },
      onSelectQuestionType
    },
    {
      title: 'Math with units',
      type: 'math',
      stimulus: '',
      data: {
        is_math: true,
        stimulus: '<p>[This is the stem.]</p>',
        template: `${EMBED_RESPONSE}=1m`,
        symbols: ['units_si', 'units_us', 'qwerty'],
        type: 'math',
        validation: {
          scoring_type: 'exactMatch',
          valid_response: {
            score: 1,
            value: [
              {
                method: 'equivSymbolic',
                options: {
                  inverseResult: false,
                  decimalPlaces: 10
                },
                value: '100cm=1m'
              }
            ]
          }
        },
        text_blocks: [
          'g',
          'kg',
          'mg',
          'm',
          'km',
          'cm',
          'mm',
          'L',
          'mL',
          's',
          'ms',
          'oz',
          'lb',
          'in',
          'ft',
          'mi',
          'fl oz',
          'pt',
          'gal'
        ],
        ui_style: {
          type: 'floating-keyboard'
        }
      },
      onSelectQuestionType
    }
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
