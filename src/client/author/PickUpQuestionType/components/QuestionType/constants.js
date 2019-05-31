import { mainBlueColor, svgMapFillColor, svgMapStrokeColor } from "@edulastic/colors";
import { math, questionType } from "@edulastic/constants";

import uuid from "uuid/v4";
import {
  BY_LOCATION_METHOD,
  EXACT_MATCH,
  ON_LIMIT,
  previewAreas,
  SENTENCE_MODE,
  templateWithTokens
} from "../../../../assessment/constants/constantsForQuestions";

// Multiple Choice
import MCStandard from "../../../src/assets/multiple-choice/standard.svg";
import MCMultipleResponses from "../../../src/assets/multiple-choice/multiple-response.svg";
import MCTrueFalse from "../../../src/assets/multiple-choice/true-false.svg";
import MCBlockLayout from "../../../src/assets/multiple-choice/block-layout.svg";
import MCMatrixStandard from "../../../src/assets/multiple-choice/matrix-standard.svg";
import MCMatrixInline from "../../../src/assets/multiple-choice/matrix-inline.svg";
import MCMatrixLabels from "../../../src/assets/multiple-choice/matrix-labels.svg";

// Fill In blanks
import FBClozeDragDrop from "../../../src/assets/fill-in-blanks/cloze-drag-drop.svg";
import FBClozeDropDown from "../../../src/assets/fill-in-blanks/cloze-dropdown.svg";
import FBClozeText from "../../../src/assets/fill-in-blanks/cloze-text.svg";
import FBClozeImgDragDrop from "../../../src/assets/fill-in-blanks/img-drag-drop.svg";
import FBClozeImgDropDown from "../../../src/assets/fill-in-blanks/img-dropdown.svg";
import FBClozeImgText from "../../../src/assets/fill-in-blanks/img-text.svg";

// Classy Match
import CMClassification from "../../../src/assets/classy-match/classification.svg";
import CMMatch from "../../../src/assets/classy-match/match.svg";
import CMOrderList from "../../../src/assets/classy-match/order-list.svg";
import CMSortList from "../../../src/assets/classy-match/sort-list.svg";

// Written Spoken
import WSEssayRichText from "../../../src/assets/written-spoken/essay-rich-text.svg";
import WSEssayPlainText from "../../../src/assets/written-spoken/essay-plain-text.svg";
import WSShortText from "../../../src/assets/written-spoken/short-text.svg";
// import WSAudioPlayer from '../../assets/written-spoken/audio-player.svg';
// import WSVideoPlayer from '../../assets/written-spoken/video-player.svg';

// Highlight
import HLHightlight from "../../../src/assets/highlight/highlight-img.svg";
import HLHotspot from "../../../src/assets/highlight/hotspot.svg";
import HLShading from "../../../src/assets/highlight/shading.svg";
import HLTokenHighlight from "../../../src/assets/highlight/token-highlight.svg";

// Math
import MTFormula from "../../../src/assets/math/math-formula.svg";
import MTFractions from "../../../src/assets/math/math-fractions.svg";
import MTFillInBlanks from "../../../src/assets/math/math-fill-blanks.svg";
import MTText from "../../../src/assets/math/math-text.svg";
import MTMatrices from "../../../src/assets/math/math-matrices.svg";
import MTUnits from "../../../src/assets/math/math-units.svg";
import MTEssay from "../../../src/assets/math/math-essay.svg";
import MTClozeMath from "../../../src/assets/math/cloze-math.svg";
// import MTClozeMathWithImage from '../../assets/math/cloze-math-img.svg';

// Graphing
import GRGraphing from "../../../src/assets/graphing/graphing.svg";
import GRGraphingQuadrant from "../../../src/assets/graphing/graphing-quadrant.svg";
import GRNumberLineDragDrop from "../../../src/assets/graphing/line-drag-drop.svg";
import GRNumberLinePlot from "../../../src/assets/graphing/line-plot.svg";

// Video&Passages
import VPVideoPlayer from "../../../src/assets/video-and-passages/player.svg";
import VPPassage from "../../../src/assets/video-and-passages/passage.svg";

export const getCards = onSelectQuestionType => {
  const { EMBED_RESPONSE } = math;

  // use it for ids of MCQ
  const uuids = [uuid(), uuid(), uuid()];

  const uuidsForFill = [uuid(), uuid(), uuid()];

  return [
    {
      type: "charts",
      cardImage: CMSortList,
      data: {
        title: "Line plot",
        firstMount: true,
        type: "linePlot",
        stimulus: "Sort the sine and cosine values from lower to higher.",
        chart_data: {
          data: [
            {
              x: "Bar 1",
              y: 0
            },
            {
              x: "Bar 2",
              y: 0
            },
            {
              x: "Bar 3",
              y: 0
            },
            {
              x: "Bar 4",
              y: 0
            },
            {
              x: "Bar 5",
              y: 0
            },
            {
              x: "Bar 6",
              y: 0
            }
          ],
          name: "Chart title"
        },
        ui_style: {
          xAxisLabel: "X Axis Label",
          yAxisLabel: "Y Axis Label",
          yAxisMax: 10,
          yAxisMin: 0,
          width: 640,
          height: 440,
          margin: 40,
          stepSize: 1,
          snapTo: 1,
          chart_type: "linePlot"
        },
        validation: {
          scoring_type: EXACT_MATCH,
          valid_response: {
            score: 1,
            value: [
              {
                x: "Bar 1",
                y: 0
              },
              {
                x: "Bar 2",
                y: 0
              },
              {
                x: "Bar 3",
                y: 0
              },
              {
                x: "Bar 4",
                y: 0
              },
              {
                x: "Bar 5",
                y: 0
              },
              {
                x: "Bar 6",
                y: 0
              }
            ]
          },
          alt_responses: []
        },
        x_axis_label: "X Axis",
        y_axis_label: "Y Axis"
      },
      onSelectQuestionType
    },
    {
      type: "charts",
      cardImage: CMSortList,
      data: {
        title: "Dot plot",
        firstMount: true,
        type: "dots",
        stimulus: "Sort the sine and cosine values from lower to higher.",
        chart_data: {
          data: [
            {
              x: "Bar 1",
              y: 0
            },
            {
              x: "Bar 2",
              y: 0
            },
            {
              x: "Bar 3",
              y: 0
            },
            {
              x: "Bar 4",
              y: 0
            },
            {
              x: "Bar 5",
              y: 0
            },
            {
              x: "Bar 6",
              y: 0
            }
          ],
          name: "Chart title"
        },
        ui_style: {
          xAxisLabel: "X Axis Label",
          yAxisLabel: "Y Axis Label",
          yAxisMax: 10,
          yAxisMin: 0,
          width: 640,
          height: 440,
          margin: 40,
          stepSize: 1,
          snapTo: 1,
          chart_type: "dots"
        },
        validation: {
          scoring_type: EXACT_MATCH,
          valid_response: {
            score: 1,
            value: [
              {
                x: "Bar 1",
                y: 0
              },
              {
                x: "Bar 2",
                y: 0
              },
              {
                x: "Bar 3",
                y: 0
              },
              {
                x: "Bar 4",
                y: 0
              },
              {
                x: "Bar 5",
                y: 0
              },
              {
                x: "Bar 6",
                y: 0
              }
            ]
          },
          alt_responses: []
        },
        x_axis_label: "X Axis",
        y_axis_label: "Y Axis"
      },
      onSelectQuestionType
    },
    {
      type: "charts",
      cardImage: CMSortList,
      data: {
        title: "Histogram",
        firstMount: true,
        type: "histogram",
        stimulus: "Sort the sine and cosine values from lower to higher.",
        chart_data: {
          data: [
            {
              x: "Bar 1",
              y: 0
            },
            {
              x: "Bar 2",
              y: 0
            },
            {
              x: "Bar 3",
              y: 0
            },
            {
              x: "Bar 4",
              y: 0
            },
            {
              x: "Bar 5",
              y: 0
            },
            {
              x: "Bar 6",
              y: 0
            }
          ],
          name: "Chart title"
        },
        ui_style: {
          xAxisLabel: "X Axis Label",
          yAxisLabel: "Y Axis Label",
          yAxisMax: 70,
          yAxisMin: 0,
          width: 640,
          height: 440,
          margin: 40,
          stepSize: 5,
          snapTo: 5,
          chart_type: "histogram",
          fractionFormat: "Decimal"
        },
        validation: {
          scoring_type: EXACT_MATCH,
          valid_response: {
            score: 1,
            value: [
              {
                x: "Bar 1",
                y: 0
              },
              {
                x: "Bar 2",
                y: 0
              },
              {
                x: "Bar 3",
                y: 0
              },
              {
                x: "Bar 4",
                y: 0
              },
              {
                x: "Bar 5",
                y: 0
              },
              {
                x: "Bar 6",
                y: 0
              }
            ]
          },
          alt_responses: []
        },
        x_axis_label: "X Axis",
        y_axis_label: "Y Axis"
      },
      onSelectQuestionType
    },
    {
      type: "charts",
      cardImage: CMSortList,
      data: {
        title: "Bar chart",
        firstMount: true,
        type: questionType.BAR_CHART,
        stimulus: "Sort the sine and cosine values from lower to higher.",
        chart_data: {
          data: [
            {
              x: "Bar 1",
              y: 0
            },
            {
              x: "Bar 2",
              y: 0
            },
            {
              x: "Bar 3",
              y: 0
            },
            {
              x: "Bar 4",
              y: 0
            },
            {
              x: "Bar 5",
              y: 0
            },
            {
              x: "Bar 6",
              y: 0
            }
          ],
          name: "Chart title"
        },
        ui_style: {
          xAxisLabel: "X Axis Label",
          yAxisLabel: "Y Axis Label",
          yAxisMax: 70,
          yAxisMin: 0,
          width: 640,
          height: 440,
          margin: 40,
          stepSize: 5,
          snapTo: 5,
          chart_type: "bar",
          fractionFormat: "Decimal"
        },
        validation: {
          scoring_type: EXACT_MATCH,
          valid_response: {
            score: 1,
            value: [
              {
                x: "Bar 1",
                y: 0
              },
              {
                x: "Bar 2",
                y: 0
              },
              {
                x: "Bar 3",
                y: 0
              },
              {
                x: "Bar 4",
                y: 0
              },
              {
                x: "Bar 5",
                y: 0
              },
              {
                x: "Bar 6",
                y: 0
              }
            ]
          },
          alt_responses: []
        },
        x_axis_label: "X Axis",
        y_axis_label: "Y Axis"
      },
      onSelectQuestionType
    },
    {
      type: "charts",
      cardImage: CMSortList,
      data: {
        title: "Line chart",
        firstMount: true,
        type: questionType.LINE_CHART,
        stimulus: "Sort the sine and cosine values from lower to higher.",
        chart_data: {
          data: [
            {
              x: "Bar 1",
              y: 0
            },
            {
              x: "Bar 2",
              y: 0
            },
            {
              x: "Bar 3",
              y: 0
            },
            {
              x: "Bar 4",
              y: 0
            },
            {
              x: "Bar 5",
              y: 0
            },
            {
              x: "Bar 6",
              y: 0
            }
          ],
          name: "Chart title"
        },
        ui_style: {
          xAxisLabel: "X Axis Label",
          yAxisLabel: "Y Axis Label",
          yAxisMax: 70,
          yAxisMin: 0,
          width: 640,
          height: 440,
          margin: 40,
          stepSize: 5,
          snapTo: 5,
          chart_type: "line",
          fractionFormat: "Decimal"
        },
        validation: {
          scoring_type: EXACT_MATCH,
          valid_response: {
            score: 1,
            value: [
              {
                x: "Bar 1",
                y: 0
              },
              {
                x: "Bar 2",
                y: 0
              },
              {
                x: "Bar 3",
                y: 0
              },
              {
                x: "Bar 4",
                y: 0
              },
              {
                x: "Bar 5",
                y: 0
              },
              {
                x: "Bar 6",
                y: 0
              }
            ]
          },
          alt_responses: []
        },
        x_axis_label: "X Axis",
        y_axis_label: "Y Axis"
      },
      onSelectQuestionType
    },
    {
      type: "highlight",
      cardImage: HLHightlight,
      data: {
        title: "Highlight Image",
        image: {
          source: "",
          width: 900,
          height: 470,
          altText: ""
        },
        line_color: [mainBlueColor],
        stimulus: "<p>[This is the stem.]</p>",
        type: questionType.HIGHLIGHT_IMAGE,
        validation: {}
      },
      onSelectQuestionType
    },
    {
      type: "highlight",
      cardImage: HLShading,
      data: {
        title: "Shading",
        canvas: {
          cell_height: 2,
          cell_width: 2,
          column_count: 6,
          row_count: 1,
          shaded: [],
          read_only_author_cells: false
        },
        stimulus: "<p>[This is the stem.]</p>",
        type: questionType.SHADING,
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
      type: "highlight",
      cardImage: HLHotspot,
      data: {
        title: "Hotspot",
        stimulus: "<p>[This is the stem.]</p>",
        type: questionType.HOTSPOT,
        image: {
          source: "https://assets.learnosity.com/organisations/1/bead7655-fb71-41af-aeea-9e08a47eac68.png",
          width: 700,
          altText: "",
          height: 600
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
      type: "highlight",
      cardImage: HLTokenHighlight,
      data: {
        title: "Token highlight",
        stimulus: "<p>[This is the stem.]</p>",
        template:
          '<p>Risus et tincidunt turpis facilisis.</p><p class="newline_section"><br></p><p>Curabitur eu nulla justo. Curabitur vulputate ut nisl et bibendum. Nunc diam enim, porta sed eros vitae. dignissim, et tincidunt turpis facilisis.</p><p class="newline_section"><br></p><p>Curabitur eu nulla justo. Curabitur vulputate ut nisl et bibendum.</p>',
        templeWithTokens: templateWithTokens,
        tokenization: SENTENCE_MODE,
        type: questionType.TOKEN_HIGHLIGHT,
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
      type: "edit",
      cardImage: WSEssayRichText,
      data: {
        title: "Essay with rich text",
        stimulus: "[This is the stem.]",
        type: questionType.ESSAY_RICH_TEXT,
        show_word_count: true,
        max_word: 5,
        show_word_limit: ON_LIMIT,
        validation: { max_score: 1 },
        formatting_options: [
          { id: "test1", value: "bold", active: true },
          { id: "test2", value: "italic", active: true },
          { id: "test3", value: "underline", active: true },
          { id: "test4", value: "strike", active: false },
          { id: "test5", value: "header", param: 1, active: false },
          { id: "test6", value: "header", param: 2, active: false },
          { id: "test9", value: "|", active: true },
          { id: "test10", value: "list", param: "ordered", active: true },
          { id: "test11", value: "list", param: "bullet", active: true },
          { id: "test12", value: "align", param: "center", active: false },
          { id: "test13", value: "align", param: "justify", active: false },
          { id: "test14", value: "align", param: "right", active: false },
          { id: "test15", value: "|", active: false },
          { id: "test16", value: "|", active: false },
          { id: "test17", value: "blockquote", active: false },
          { id: "test18", value: "script", param: "sub", active: false },
          { id: "test19", value: "script", param: "super", active: false },
          { id: "test20", value: "|", active: false },
          { id: "test21", value: "indent", param: "+1", active: false },
          { id: "test22", value: "indent", param: "-1", active: false },
          { id: "test23", value: "|", active: false },
          { id: "test24", value: "direction", param: "rtl", active: false },
          { id: "test26", value: "clean", active: false },
          { id: "test27", value: "formula", active: true }
        ]
      },
      onSelectQuestionType
    },
    {
      type: "edit",
      cardImage: WSEssayPlainText,
      data: {
        title: "Essay with plain text",
        stimulus: "[This is the stem.]",
        type: questionType.ESSAY_PLAIN_TEXT,
        show_copy: true,
        show_cut: true,
        show_paste: true,
        max_word: 5,
        show_word_limit: ON_LIMIT,
        show_word_count: true,
        ui_style: { min_height: 300 },
        validation: { max_score: 1 }
      },
      onSelectQuestionType
    },
    {
      type: "edit",
      cardImage: WSShortText,
      data: {
        title: "Short text",
        stimulus: "[This is the stem.]",
        type: questionType.SHORT_TEXT,
        validation: {
          scoring_type: EXACT_MATCH,
          valid_response: {
            score: 1,
            matching_rule: EXACT_MATCH,
            value: ""
          },
          alt_responses: []
        }
      },
      onSelectQuestionType
    },
    {
      type: "multiple-choice",
      cardImage: MCStandard,
      data: {
        title: "Multiple choice - standard",
        type: questionType.MULTIPLE_CHOICE,
        stimulus: "Which color has the smallest walvelenght?",
        ui_style: {
          type: "horizontal"
        },
        options: [
          { value: uuids[0], label: "Red" },
          { value: uuids[1], label: "Violet" },
          { value: uuids[2], label: "Green" }
        ],
        validation: {
          scoring_type: EXACT_MATCH,
          valid_response: {
            score: 1,
            value: [uuids[0]]
          },
          alt_responses: []
        },
        multiple_responses: false
      },
      onSelectQuestionType
    },
    {
      type: "multiple-choice",
      cardImage: MCMultipleResponses,
      data: {
        title: "Multiple choice - multiple response",
        type: questionType.MULTIPLE_CHOICE,
        stimulus: "Which color has the smallest walvelenght?",
        ui_style: {
          type: "horizontal"
        },
        options: [
          { value: uuids[0], label: "Red" },
          { value: uuids[1], label: "Violet" },
          { value: uuids[2], label: "Green" }
        ],
        validation: {
          scoring_type: EXACT_MATCH,
          valid_response: {
            score: 1,
            value: [uuids[1]]
          },
          alt_responses: []
        },
        multiple_responses: true
      },
      onSelectQuestionType
    },
    {
      type: "multiple-choice",
      cardImage: MCTrueFalse,
      data: {
        title: "True or false",
        type: questionType.MULTIPLE_CHOICE,
        stimulus: "The sky is blue due to gases.",
        ui_style: {
          type: "horizontal"
        },
        options: [{ value: uuids[0], label: "True" }, { value: uuids[1], label: "False" }],
        validation: {
          scoring_type: EXACT_MATCH,
          valid_response: {
            score: 1,
            value: [uuids[0]]
          },
          alt_responses: []
        },
        multiple_responses: false
      },
      onSelectQuestionType
    },
    {
      type: "multiple-choice",
      cardImage: MCBlockLayout,
      data: {
        title: "Multiple choice - block layout",
        type: questionType.MULTIPLE_CHOICE,
        stimulus: "What is the capital city of England?",
        ui_style: {
          type: "block",
          choice_label: "upper-alpha"
        },
        options: [
          { value: uuids[0], label: "Dublin" },
          { value: uuids[1], label: "London" },
          { value: uuids[2], label: "Liverpool" }
        ],
        validation: {
          scoring_type: EXACT_MATCH,
          valid_response: {
            score: 1,
            value: [uuids[0]]
          },
          alt_responses: []
        },
        multiple_responses: true
      },
      onSelectQuestionType
    },
    {
      type: "classify",
      cardImage: CMSortList,
      data: {
        title: "Sort List",
        firstMount: true,
        type: questionType.SORT_LIST,
        stimulus: "Sort the sine and cosine values from lower to higher.",
        ui_style: {},
        source: ["Item A", "Item B", "Item C", "Item D"],
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
      type: "classify",
      cardImage: CMClassification,
      data: {
        title: "Classification",
        firstMount: true,
        group_possible_responses: false,
        possible_response_groups: [
          {
            title: "",
            responses: ["Choice B", "Choice C", "Choice A", "Choice D"]
          }
        ],
        possible_responses: ["Choice B", "Choice C", "Choice A", "Choice D"],
        stimulus: "Your question is here",
        type: questionType.CLASSIFICATION,
        ui_style: {
          column_count: 2,
          column_titles: ["COLUMN 1", "COLUMN 2"],
          row_count: 1,
          row_titles: []
        },
        validation: {
          scoring_type: EXACT_MATCH,
          valid_response: {
            score: 1,
            value: [[], []]
          },
          alt_responses: []
        }
      },
      onSelectQuestionType
    },
    {
      type: "classify",
      cardImage: CMMatch,
      data: {
        title: "Match list",
        firstMount: true,
        group_possible_responses: false,
        possible_response_groups: [
          {
            title: "",
            responses: ["Choice B", "Choice C", "Choice A"]
          }
        ],
        possible_responses: ["Choice A", "Choice B", "Choice C"],
        type: questionType.MATCH_LIST,
        stimulus: "<p>This is the stem.</p>",
        list: ["Stem 1", "Stem 2", "Stem 3"],
        validation: {
          scoring_type: EXACT_MATCH,
          valid_response: {
            score: 1,
            value: [null, null, null]
          },
          alt_responses: []
        }
      },
      onSelectQuestionType
    },
    {
      type: "classify",
      cardImage: CMOrderList,
      data: {
        title: "OrderList",
        type: questionType.ORDER_LIST,
        stimulus: "Which color has the smallest walvelenght?",
        list: ["Item A", "Item B", "Item C"],
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
      type: "multiple-choice",
      cardImage: MCMatrixStandard,
      data: {
        title: "Choice matrix - standard",
        firstMount: true,
        type: questionType.CHOICE_MATRIX,
        stimulus: "This is the stem.",
        ui_style: {
          type: "table",
          horizontal_lines: false
        },
        stems: ["[Stem 1]", "[Stem 2]", "[Stem 3]", "[Stem 4]"],
        options: ["True", "False"],
        validation: {
          scoring_type: EXACT_MATCH,
          valid_response: {
            score: 1,
            value: [null, null, null, null]
          },
          alt_responses: []
        },
        multiple_responses: false
      },
      onSelectQuestionType
    },
    {
      type: "multiple-choice",
      cardImage: MCMatrixInline,
      data: {
        title: "Choice matrix - inline",
        firstMount: true,
        options: ["True", "False"],
        stems: ["[Stem 1]", "[Stem 2]", "[Stem 3]", "[Stem 4]"],
        stimulus: "This is the stem.",
        type: questionType.CHOICE_MATRIX,
        ui_style: {
          type: "inline",
          horizontal_lines: false
        },
        validation: {
          scoring_type: EXACT_MATCH,
          valid_response: {
            score: 1,
            value: [null, null, null, null]
          },
          alt_responses: []
        }
      },
      onSelectQuestionType
    },
    {
      type: "multiple-choice",
      cardImage: MCMatrixLabels,
      data: {
        title: "Choice matrix - labels",
        firstMount: true,
        options: ["True", "False"],
        stems: ["[Stem 1]", "[Stem 2]", "[Stem 3]", "[Stem 4]"],
        stimulus: "This is the stem.",
        type: questionType.CHOICE_MATRIX,
        ui_style: {
          stem_numeration: "upper-alpha",
          type: "table",
          horizontal_lines: false
        },
        validation: {
          scoring_type: EXACT_MATCH,
          valid_response: {
            score: 1,
            value: [null, null, null, null]
          },
          alt_responses: []
        }
      },
      onSelectQuestionType
    },
    {
      type: "fill-blanks",
      cardImage: FBClozeDragDrop,
      stimulus: "",
      data: {
        title: "Cloze with Drag & Drop",
        type: questionType.CLOZE_DRAG_DROP,
        stimulus: "",
        ui_style: {
          responsecontainerposition: "bottom",
          fontsize: "normal",
          stemnumeration: "",
          widthpx: 140,
          heightpx: 0,
          wordwrap: false,
          responsecontainerindividuals: []
        },
        options: [
          { value: uuidsForFill[0], label: "WHISPERED" },
          { value: uuidsForFill[1], label: "HOLMES" },
          { value: uuidsForFill[2], label: "INTRUDER" }
        ],
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
      type: "fill-blanks",
      cardImage: FBClozeDropDown,
      stimulus: "",
      data: {
        title: "Cloze with Drop Down",
        type: questionType.CLOZE_DROP_DOWN,
        stimulus: "",
        ui_style: {
          responsecontainerposition: "bottom",
          fontsize: "normal",
          stemnumeration: "",
          widthpx: 140,
          heightpx: 0,
          wordwrap: false,
          responsecontainerindividuals: []
        },
        options: {
          0: ["A", "B"],
          1: ["Choice A", "Choice B"]
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
      type: "fill-blanks",
      cardImage: FBClozeText,
      stimulus: "",
      data: {
        title: "Cloze with Text",
        type: questionType.CLOZE_TEXT,
        templateMarkUp:
          '<p>"It\'s all clear" he</p><p class="response-btn"><span class="index">1</span><span class="text">Response</span></p><p><br/> Have you the </p><p class="response-btn" contenteditable="false"><span class="index">1</span><span class="text">Response</span></p><p> and the bags ? <br/>  Great Scott!!! Jump, archie, jump, and I\'ll swing for it</p>',
        stimulus: "",
        ui_style: {
          fontsize: "normal",
          heightpx: 35,
          placeholder: "",
          responsecontainerindividuals: [],
          responsecontainerposition: "bottom",
          stemnumeration: "",
          widthpx: 140
        },
        options: {
          0: "",
          1: ""
        },
        validation: {
          scoring_type: "exactMatch",
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
      type: "fill-blanks",
      cardImage: FBClozeImgDragDrop,
      stimulus: "",
      data: {
        title: "Label Image with Drag & Drop",
        type: questionType.CLOZE_IMAGE_DRAG_DROP,
        firstMount: true,
        stimulus: "",
        imageWidth: 0,
        imageUrl: "https://edureact-dev.s3.amazonaws.com/1558946005996_transparent.png",
        maxRespCount: 1,
        options: ["Country A", "Country B", "Country C"],
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
      type: "fill-blanks",
      cardImage: FBClozeImgDropDown,
      stimulus: "",
      ui_style: {
        background: "#0288d1"
      },
      data: {
        title: "Label Image with Drop Down",
        type: questionType.CLOZE_IMAGE_DROP_DOWN,
        firstMount: true,
        stimulus: "",
        imageWidth: 0,
        imageUrl: "https://edureact-dev.s3.amazonaws.com/1558946005996_transparent.png",
        options: [["A", "B"], ["Choice A", "Choice B"], ["Select A", "Select B"]],
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
        ui_style: {
          widthpx: 140,
          responsecontainerindividuals: []
        },
        stimulusReviewonly: "",
        instructorStimulus: "",
        rubricReference: "",
        sampleAnswer: "",
        distractorRationalePerResponse: "",
        distractorRationaleOptions: []
      },
      onSelectQuestionType
    },
    {
      type: "fill-blanks",
      cardImage: FBClozeImgText,
      stimulus: "",
      data: {
        title: "Label Image with Text",
        type: questionType.CLOZE_IMAGE_TEXT,
        stimulus: "",
        options: [],
        imageUrl: "https://edureact-dev.s3.amazonaws.com/1558946005996_transparent.png",
        imageWidth: 0,
        ui_style: {
          width: 140
        },
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
        stimulusReviewonly: "",
        instructorStimulus: "",
        rubricReference: "",
        sampleAnswer: "",
        distractorRationalePerResponse: "",
        distractorRationaleOptions: []
      },
      onSelectQuestionType
    },
    {
      stimulus: "Which color has the smallest walvelenght?",
      type: "graphing",
      cardImage: GRGraphing,
      data: {
        title: "Graphing",
        type: questionType.GRAPH,
        graphType: "quadrants",
        stimulus: "Which color has the smallest walvelenght?",
        firstMount: true,
        canvas: {
          x_max: 10.4,
          x_min: -10.4,
          y_max: 10.4,
          y_min: -10.4,
          x_ratio: 1,
          y_ratio: 1
        },
        controlbar: {
          controls: ["undo", "redo"],
          default_control: "undo"
        },
        toolbar: {
          tools: ["point", "line"],
          default_tool: "point"
        },
        validation: {
          scoring_type: EXACT_MATCH,
          valid_response: {
            score: 1,
            value: []
          },
          unscored: false,
          penaltyPoints: 1,
          checkAttempts: 2,
          minScore: 1,
          checkAnswerButton: true,
          alt_responses: []
        },
        extra_options: {
          rubric_reference: "",
          sample_answer: "",
          stimulus_review: "",
          instructor_stimulus: ""
        },
        ui_style: {
          drawLabelZero: false,
          displayPositionOnHover: false,
          currentStemNum: "numerical",
          currentFontSize: "normal",
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
          layout_snapto: "grid",
          xAxisLabel: "X",
          yAxisLabel: "Y"
        },
        background_image: {
          src: "",
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
      type: "graphing",
      cardImage: GRGraphingQuadrant,
      data: {
        title: "Graphing in the 1st quadrant",
        type: questionType.GRAPH,
        graphType: "firstQuadrant",
        stimulus: "[This is the stem2.]",
        firstMount: true,
        canvas: {
          x_max: 10.4,
          x_min: -0.8,
          y_max: 10.4,
          y_min: -0.8,
          x_ratio: 1,
          y_ratio: 1
        },
        controlbar: {
          controls: ["undo", "redo"],
          default_control: "undo"
        },
        toolbar: {
          tools: ["point", "line"],
          default_tool: "point"
        },
        validation: {
          scoring_type: EXACT_MATCH,
          valid_response: {
            score: 1,
            value: []
          },
          unscored: false,
          penaltyPoints: 1,
          checkAttempts: 2,
          minScore: 1,
          checkAnswerButton: true,
          alt_responses: [],
          ignore_labels: "yes"
        },
        extra_options: {
          rubric_reference: "",
          sample_answer: "",
          stimulus_review: "",
          instructor_stimulus: ""
        },
        ui_style: {
          drawLabelZero: false,
          displayPositionOnHover: false,
          currentStemNum: "numerical",
          currentFontSize: "normal",
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
          layout_snapto: "grid",
          xAxisLabel: "X",
          yAxisLabel: "Y"
        },
        background_image: {
          src: "",
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
      type: "graphing",
      cardImage: GRNumberLinePlot,
      data: {
        title: "Number line with plot",
        type: questionType.GRAPH,
        stimulus: "[This is the stem3.]",
        firstMount: true,
        graphType: "axisSegments",
        canvas: {
          x_max: 10,
          x_min: 0,
          y_max: 0.5,
          y_min: -0.5,
          numberline: true,
          margin: 75,
          responsesAllowed: 1,
          title: ""
        },
        controlbar: {
          controls: ["undo", "redo", "reset"],
          default_control: "undo"
        },
        toolbar: {
          tools: [],
          default_tool: null
        },
        extra_options: {
          rubric_reference: "",
          sample_answer: "",
          stimulus_review: "",
          instructor_stimulus: ""
        },
        numberlineAxis: {
          leftArrow: false,
          rightArrow: false,
          showTicks: true,
          snapToTicks: true,
          ticksDistance: 1,
          showMin: true,
          showMax: true,
          fontSize: 12,
          labelShowMax: true,
          labelShowMin: true,
          minorTicks: 1,
          showLabels: true,
          stackResponses: false,
          stackResponsesSpacing: 30,
          renderingBase: "min-value-based",
          specificPoints: ""
        },
        ui_style: {
          gridVisible: false,
          drawLabelZero: false,
          displayPositionOnHover: false,
          currentStemNum: "numerical",
          currentFontSize: "normal",
          xShowAxisLabel: false,
          xHideTicks: true,
          xDrawLabel: false,
          xMaxArrow: false,
          xMinArrow: false,
          xVisible: false,
          xCommaInLabel: false,
          yShowAxisLabel: false,
          yDrawLabel: false,
          yMaxArrow: false,
          yMinArrow: false,
          yCommaInLabel: false,
          yVisible: false,
          xDistance: 1,
          yDistance: 0,
          xTickDistance: 1,
          yTickDistance: 0,
          layout_width: 600,
          layout_height: 150,
          layout_margin: 0,
          layout_snapto: "grid",
          xAxisLabel: "X",
          yAxisLabel: "Y",
          title_position: 15,
          line_position: 50,
          point_box_position: 60
        },
        background_image: {
          src: "",
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          opacity: 100,
          showShapePoints: false
        },
        background_shapes: [],
        multiple_responses: false,
        validation: {
          graphType: "axisSegments",
          scoring_type: EXACT_MATCH,
          unscored: false,
          penaltyPoints: 1,
          checkAttempts: 2,
          minScore: 1,
          checkAnswerButton: true,
          valid_response: {
            score: 1,
            value: []
          },
          alt_responses: [],
          ignore_labels: "yes"
        }
      },
      onSelectQuestionType
    },
    {
      type: "rulers-calculators",
      data: {
        title: "Protractor",
        type: questionType.PROTRACTOR,
        stimulus: "",
        image: "",
        label: "Protractor",
        alt: "A 180-degree standard protractor.",
        width: 530,
        height: 265,
        rotate: true
      },
      onSelectQuestionType
    },
    {
      type: "graphing",
      cardImage: GRNumberLineDragDrop,
      data: {
        title: "Number line with drag & drop",
        type: questionType.GRAPH,
        firstMount: true,
        graphType: "axisLabels",
        list: [
          {
            text: "Option 1",
            id: `list-item-${Math.random()
              .toString(36)
              .substr(2, 9)}`
          },
          {
            text: "Option 2",
            id: `list-item-${Math.random()
              .toString(36)
              .substr(2, 9)}`
          }
        ],
        toolbar: {
          controls: [],
          default_control: ""
        },
        extra_options: {
          rubric_reference: "",
          sample_answer: "",
          stimulus_review: "",
          instructor_stimulus: ""
        },
        stimulus: "[This is the stem. axisLabels]",
        validation: {
          graphType: "axisLabels",
          scoring_type: EXACT_MATCH,
          unscored: false,
          penaltyPoints: 1,
          checkAttempts: 2,
          minScore: 1,
          checkAnswerButton: true,
          valid_response: {
            score: 1,
            value: []
          },
          alt_responses: []
        },
        canvas: {
          x_max: 10,
          x_min: 0,
          y_max: 1,
          y_min: -1.75,
          numberline: true,
          margin: 75,
          title: ""
        },
        numberlineAxis: {
          leftArrow: false,
          rightArrow: false,
          showTicks: true,
          snapToTicks: true,
          ticksDistance: "1",
          labelsFrequency: 1,
          showMin: true,
          showMax: true,
          fontSize: 12,
          labelShowMax: true,
          labelShowMin: true,
          minorTicks: 1,
          showLabels: true,
          separationDistanceX: 10,
          separationDistanceY: 20,
          renderingBase: "min-value-based",
          specificPoints: "",
          fractionsFormat: "not-normalized-fractions"
        },
        ui_style: {
          gridVisible: false,
          drawLabelZero: false,
          displayPositionOnHover: false,
          currentStemNum: "numerical",
          currentFontSize: "normal",
          xShowAxisLabel: false,
          xHideTicks: true,
          xDrawLabel: false,
          xMaxArrow: false,
          xMinArrow: false,
          xVisible: false,
          xCommaInLabel: false,
          yShowAxisLabel: false,
          yHideTicks: true,
          yDrawLabel: false,
          yMaxArrow: false,
          yMinArrow: false,
          yCommaInLabel: false,
          yVisible: false,
          xDistance: 1,
          yDistance: 0,
          xTickDistance: 1,
          yTickDistance: 0,
          layout_width: 600,
          layout_height: 250,
          layout_margin: 0,
          layout_snapto: "grid",
          xAxisLabel: "X",
          yAxisLabel: "Y",
          title_position: 55,
          line_position: 34,
          point_box_position: 60
        },
        background_image: {
          src: "",
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          opacity: 100,
          showShapePoints: false
        },
        background_shapes: [],
        multiple_responses: false
      },
      onSelectQuestionType
    },
    {
      type: "video-passages",
      cardImage: VPPassage,
      data: {
        title: "Passage",
        type: questionType.PASSAGE,
        heading: "Section 3",
        math_renderer: "",
        content: "Enabling a <b>highlightable</b> text passage that can be used across multiple items."
      },
      list: ["Item A", "Item B"],
      onSelectQuestionType
    },
    {
      type: "video-passages",
      cardImage: VPVideoPlayer,
      stimulus: "",
      data: {
        title: "Video",
        type: questionType.VIDEO,
        videoType: "youtube",
        sourceURL: "",
        heading: "",
        summary: "",
        transcript: "",
        ui_style: {
          width: 480,
          height: 270,
          posterImage: "",
          hideControls: false,
          captionURL: ""
        }
      },
      onSelectQuestionType
    },
    {
      type: "math",
      cardImage: MTFormula,
      stimulus: "",
      data: {
        title: "Expression",
        is_math: true,
        stimulus: "",
        type: questionType.MATH,
        validation: {
          scoring_type: "exactMatch",
          valid_response: {
            score: 1,
            value: [
              {
                method: "equivSymbolic",
                options: {
                  inverseResult: false
                },
                value: ""
              }
            ]
          }
        },
        ui_style: {
          type: "floating-keyboard"
        },
        numberPad: [
          "7",
          "8",
          "9",
          "\\div",
          "4",
          "5",
          "6",
          "\\times",
          "1",
          "2",
          "3",
          "-",
          "0",
          ".",
          ",",
          "+",
          "left_move",
          "right_move",
          "Backspace",
          "="
        ],
        symbols: ["units_si", "units_us", "qwerty"],
        template: EMBED_RESPONSE,
        templateDisplay: false
      },
      onSelectQuestionType
    },
    {
      type: "math",
      cardImage: MTFractions,
      stimulus: "",
      data: {
        title: "Numeric",
        is_math: true,
        stimulus: "",
        template: EMBED_RESPONSE,
        templateDisplay: false,
        type: questionType.MATH,
        validation: {
          scoring_type: "exactMatch",
          valid_response: {
            score: 1,
            value: [
              {
                method: "equivSymbolic",
                options: {
                  inverseResult: false
                },
                value: "\\frac{x}{x}"
              }
            ]
          }
        },
        ui_style: {
          type: "floating-keyboard"
        },
        numberPad: [
          "7",
          "8",
          "9",
          "\\div",
          "4",
          "5",
          "6",
          "\\times",
          "1",
          "2",
          "3",
          "-",
          "0",
          ".",
          ",",
          "+",
          "left_move",
          "right_move",
          "Backspace",
          "="
        ],
        symbols: ["basic", "qwerty"]
      },
      onSelectQuestionType
    },
    {
      type: "math",
      cardImage: MTFillInBlanks,
      stimulus: "",
      data: {
        title: "Fill in the blanks",
        is_math: true,
        stimulus: "",
        template: `${EMBED_RESPONSE} + ${EMBED_RESPONSE} = ${EMBED_RESPONSE}`,
        templateDisplay: true,
        type: questionType.MATH,
        validation: {
          scoring_type: "exactMatch",
          valid_response: {
            score: 1,
            value: [
              {
                method: "equivSymbolic",
                options: {
                  inverseResult: false
                },
                value: "x+y"
              }
            ]
          }
        },
        ui_style: {
          type: "floating-keyboard"
        },
        numberPad: [
          "7",
          "8",
          "9",
          "\\div",
          "4",
          "5",
          "6",
          "\\times",
          "1",
          "2",
          "3",
          "-",
          "0",
          ".",
          ",",
          "+",
          "left_move",
          "right_move",
          "Backspace",
          "="
        ],
        symbols: ["basic", "qwerty"]
      },
      onSelectQuestionType
    },
    {
      type: "math",
      cardImage: MTText,
      stimulus: "",
      data: {
        title: "Equations & Inequalities",
        is_math: true,
        response_containers: [
          {
            width: "60px"
          }
        ],
        stimulus: "",
        type: questionType.MATH,
        template: EMBED_RESPONSE,
        templateDisplay: false,
        validation: {
          scoring_type: "exactMatch",
          valid_response: {
            score: 1,
            value: [
              {
                method: "equivSymbolic",
                options: {
                  inverseResult: false
                },
                value: "\\text{s}\\text{q ft}"
              }
            ]
          }
        },
        ui_style: {
          type: "floating-keyboard"
        },
        numberPad: [
          "7",
          "8",
          "9",
          "\\div",
          "4",
          "5",
          "6",
          "\\times",
          "1",
          "2",
          "3",
          "-",
          "0",
          ".",
          ",",
          "+",
          "left_move",
          "right_move",
          "Backspace",
          "="
        ],
        symbols: ["basic", "qwerty"]
      },
      onSelectQuestionType
    },
    {
      type: "math",
      cardImage: MTMatrices,
      stimulus: "",
      data: {
        title: "Matrices",
        is_math: true,
        stimulus: "",
        template: `\\begin{bmatrix}4&0\\\\1&-9\\end{bmatrix}\\times2=${EMBED_RESPONSE}`,
        templateDisplay: true,
        type: questionType.MATH,
        validation: {
          scoring_type: "exactMatch",
          valid_response: {
            score: 1,
            value: [
              {
                method: "equivSymbolic",
                options: {
                  inverseResult: false
                },
                value: ""
              }
            ]
          }
        },
        ui_style: {
          type: "floating-keyboard"
        },
        numberPad: [
          "7",
          "8",
          "9",
          "\\div",
          "4",
          "5",
          "6",
          "\\times",
          "1",
          "2",
          "3",
          "-",
          "0",
          ".",
          ",",
          "+",
          "left_move",
          "right_move",
          "Backspace",
          "="
        ],
        symbols: ["matrices", "general", "qwerty"]
      },
      onSelectQuestionType
    },
    {
      type: "math",
      cardImage: MTUnits,
      stimulus: "",
      data: {
        title: "Units",
        is_math: true,
        stimulus: "",
        template: `${EMBED_RESPONSE} = 1m`,
        templateDisplay: true,
        type: questionType.MATH,
        validation: {
          scoring_type: "exactMatch",
          valid_response: {
            score: 1,
            value: [
              {
                method: "equivSymbolic",
                options: {
                  inverseResult: false
                },
                value: "100cm=1m"
              }
            ]
          }
        },
        text_blocks: [
          "g",
          "kg",
          "mg",
          "m",
          "km",
          "cm",
          "mm",
          "L",
          "mL",
          "s",
          "ms",
          "oz",
          "lb",
          "in",
          "ft",
          "mi",
          "fl oz",
          "pt",
          "gal"
        ],
        ui_style: {
          type: "floating-keyboard"
        },
        numberPad: [
          "7",
          "8",
          "9",
          "\\div",
          "4",
          "5",
          "6",
          "\\times",
          "1",
          "2",
          "3",
          "-",
          "0",
          ".",
          ",",
          "+",
          "left_move",
          "right_move",
          "Backspace",
          "="
        ],
        symbols: ["units_si", "units_us", "qwerty"]
      },
      onSelectQuestionType
    },
    {
      type: "math",
      cardImage: MTClozeMath,
      stimulus: "",
      data: {
        title: "Expression Multipart",
        stimulus: "",
        template:
          '<p>Risus<span class="response-btn" contenteditable="false">&nbsp;<span class="index">1</span><span class="text">Response</span>&nbsp;</span>, et tincidunt turpis facilisis. Curabitur eu nulla justo. Curabitur vulputate ut nisl et. Nunc diam enim, porta sed eros vitae.</p>',
        templateDisplay: true,
        type: questionType.CLOZE_MATH,
        response_container: {
          template: ""
        },
        ui_style: {
          type: "floating-keyboard",
          min_width: 100
        },
        options: {},
        inputs: {},
        validation: {
          scoring_type: "exactMatch",
          valid_response: {
            score: 1,
            value: [
              [
                {
                  method: "equivSymbolic",
                  value: "",
                  options: {
                    inverseResult: false,
                    decimalPlaces: 10
                  }
                }
              ]
            ]
          },
          valid_dropdown: {
            score: 1,
            value: []
          },
          valid_inputs: {
            score: 1,
            value: []
          }
        },
        is_math: true,
        response_containers: [],
        symbols: ["basic", "qwerty"],
        numberPad: [
          "7",
          "8",
          "9",
          "\\div",
          "4",
          "5",
          "6",
          "\\times",
          "1",
          "2",
          "3",
          "-",
          "0",
          ".",
          ",",
          "+",
          "left_move",
          "right_move",
          "Backspace",
          "="
        ]
      },
      onSelectQuestionType
    },
    {
      type: "math",
      cardImage: MTEssay,
      stimulus: "",
      data: {
        title: "Math essay",
        stimulus: "",
        type: questionType.FORMULA_ESSAY,
        ui_style: {
          default_mode: "math",
          fontsize: "",
          text_formatting_options: ["bold", "italic", "underline", "unorderedList"]
        },
        numberPad: [
          "7",
          "8",
          "9",
          "\\div",
          "4",
          "5",
          "6",
          "\\times",
          "1",
          "2",
          "3",
          "-",
          "0",
          ".",
          ",",
          "+",
          "left_move",
          "right_move",
          "Backspace",
          "="
        ],
        metadata: {},
        is_math: true,
        symbols: ["basic", "qwerty"]
      },
      onSelectQuestionType
    }
  ];
};
