import { themeColor, svgMapFillColor, svgMapStrokeColor } from "@edulastic/colors";
import { math, questionType, canvasDimensions } from "@edulastic/constants";

import uuid from "uuid/v4";
import {
  BY_LOCATION_METHOD,
  EXACT_MATCH,
  ON_LIMIT,
  previewAreas,
  SENTENCE_MODE,
  templateWithTokens,
  defaultOptions
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
// import MTClozeMath from "../../../src/assets/math/cloze-math.svg";
import MTCombinationClozeText from "../../../src/assets/math/math-multipart-cloze.svg";
import MTCombinationMulti from "../../../src/assets/math/math-multipart-combination.svg";

// Graphing
import GRGraphing from "../../../src/assets/graphing/graphing.svg";
import GRGraphingQuadrant from "../../../src/assets/graphing/graphing-quadrant.svg";
import GRNumberLineDragDrop from "../../../src/assets/graphing/line-drag-drop.svg";
import GRNumberLinePlot from "../../../src/assets/graphing/line-plot.svg";

// Charts
import LinePlot from "../../../src/assets/charts/line-plot.svg";
import DotPlot from "../../../src/assets/charts/dot-plot.svg";
import Histogram from "../../../src/assets/charts/histogram.svg";
import BarChart from "../../../src/assets/charts/bar-chart.svg";
import LineChart from "../../../src/assets/charts/line-chart.svg";

// Video&Passages
import VPVideoPlayer from "../../../src/assets/video-and-passages/player.svg";
import VPPassage from "../../../src/assets/video-and-passages/passage.svg";

// Rulers & Calculators
import Protractor from "../../../src/assets/rulers-calculators/protractor.svg";

export const getCards = onSelectQuestionType => {
  const { EMBED_RESPONSE } = math;

  // use it for ids of MCQ
  const uuids = [uuid(), uuid(), uuid(), uuid()];

  const uuidsForFill = [uuid(), uuid(), uuid()];

  return [
    {
      type: "charts",
      cardImage: LinePlot,
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
        uiStyle: {
          xAxisLabel: "X Axis Label",
          yAxisLabel: "Y Axis Label",
          yAxisMax: 10,
          yAxisMin: 0,
          width: 640,
          height: 440,
          margin: 40,
          stepSize: 1,
          snapTo: 1,
          chartType: "linePlot",
          showGridlines: "y_only"
        },
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
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
          altResponses: []
        },
        xAxisLabel: "X Axis",
        yAxisLabel: "Y Axis",
        hints: [{ value: uuids[0], label: "Hint A" }]
      },
      onSelectQuestionType
    },
    {
      type: "charts",
      cardImage: DotPlot,
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
        uiStyle: {
          xAxisLabel: "X Axis Label",
          yAxisLabel: "Y Axis Label",
          yAxisMax: 10,
          yAxisMin: 0,
          width: 640,
          height: 440,
          margin: 40,
          stepSize: 1,
          snapTo: 1,
          chartType: "dots",
          showGridlines: "both"
        },
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
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
          altResponses: []
        },
        xAxisLabel: "X Axis",
        yAxisLabel: "Y Axis",
        hints: [{ value: uuids[0], label: "Hint A" }]
      },
      onSelectQuestionType
    },
    {
      type: "charts",
      cardImage: Histogram,
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
        uiStyle: {
          xAxisLabel: "X Axis Label",
          yAxisLabel: "Y Axis Label",
          yAxisMax: 70,
          yAxisMin: 0,
          width: 640,
          height: 440,
          margin: 40,
          stepSize: 5,
          snapTo: 5,
          chartType: "histogram",
          fractionFormat: "Decimal",
          multicolorBars: true,
          showGridlines: "y_only"
        },
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
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
          altResponses: []
        },
        xAxisLabel: "X Axis",
        yAxisLabel: "Y Axis",
        hints: [{ value: uuids[0], label: "Hint A" }]
      },
      onSelectQuestionType
    },
    {
      type: "charts",
      cardImage: BarChart,
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
        uiStyle: {
          xAxisLabel: "X Axis Label",
          yAxisLabel: "Y Axis Label",
          yAxisMax: 70,
          yAxisMin: 0,
          width: 640,
          height: 440,
          margin: 40,
          stepSize: 5,
          snapTo: 5,
          chartType: "bar",
          fractionFormat: "Decimal",
          showGridlines: "both"
        },
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
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
          altResponses: []
        },
        xAxisLabel: "X Axis",
        yAxisLabel: "Y Axis",
        hints: [{ value: uuids[0], label: "Hint A" }]
      },
      onSelectQuestionType
    },
    {
      type: "charts",
      cardImage: LineChart,
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
        uiStyle: {
          xAxisLabel: "X Axis Label",
          yAxisLabel: "Y Axis Label",
          yAxisMax: 70,
          yAxisMin: 0,
          width: 640,
          height: 440,
          margin: 40,
          stepSize: 5,
          snapTo: 5,
          chartType: "line",
          fractionFormat: "Decimal",
          pointStyle: "dot",
          showGridlines: "both"
        },
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
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
          altResponses: []
        },
        xAxisLabel: "X Axis",
        yAxisLabel: "Y Axis",
        hints: [{ value: uuids[0], label: "Hint A" }]
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
          width: canvasDimensions.maxWidth,
          height: canvasDimensions.maxHeight,
          altText: ""
        },
        line_color: [themeColor],
        stimulus: "<p>[This is the stem.]</p>",
        type: questionType.HIGHLIGHT_IMAGE,
        validation: {
          validResponse: {
            score: 1
          }
        },
        hints: [{ value: uuids[0], label: "Hint A" }]
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
          columnCount: 6,
          rowCount: 1,
          shaded: [],
          read_only_author_cells: false
        },
        stimulus: "<p>[This is the stem.]</p>",
        type: questionType.SHADING,
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: {
              method: BY_LOCATION_METHOD,
              value: []
            }
          },
          altResponses: []
        },
        hints: [{ value: uuids[0], label: "Hint A" }]
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
        areaAttributes: {
          global: {
            fill: svgMapFillColor,
            stroke: svgMapStrokeColor
          },
          local: []
        },
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: []
          },
          altResponses: []
        },
        multipleResponses: false,
        hints: [{ value: uuids[0], label: "Hint A" }]
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
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: []
          },
          altResponses: []
        },
        hints: [{ value: uuids[0], label: "Hint A" }]
      },
      onSelectQuestionType
    },
    {
      type: "edit",
      cardImage: WSEssayRichText,
      data: {
        title: "Essay with rich text",
        stimulus: "<p>[This is the stem.]</p>",
        type: questionType.ESSAY_RICH_TEXT,
        showWordCount: true,
        maxWord: 1000,
        showWordLimit: ON_LIMIT,
        validation: { validResponse: { score: 1 }, maxScore: 1 },
        formattingOptions: [
          { id: "test1", value: "bold", active: true },
          { id: "test2", value: "italic", active: true },
          { id: "test3", value: "underline", active: true },
          { id: "test4", value: "strike", active: false },
          { id: "test5", value: "header", param: 1, active: false },
          { id: "test6", value: "header", param: 2, active: false },
          { id: "test9", value: "|", active: true },
          { id: "test10", value: "list", param: "ordered", active: true },
          { id: "test11", value: "list", param: "bullet", active: true },
          // { id: "test12", value: "align", param: "center", active: false },
          // { id: "test13", value: "align", param: "justify", active: false },
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
          { id: "test27", value: "formula", active: true },
          { id: "test28", value: "specialCharacters", active: true }
        ],
        hints: [{ value: uuids[0], label: "Hint A" }]
      },
      onSelectQuestionType
    },
    {
      type: "edit",
      cardImage: WSEssayPlainText,
      data: {
        title: "Essay with plain text",
        stimulus: "<p>[This is the stem.]</p>",
        type: questionType.ESSAY_PLAIN_TEXT,
        showCopy: true,
        showCut: true,
        showPaste: true,
        maxWord: 1000,
        showWordLimit: ON_LIMIT,
        showWordCount: true,
        uiStyle: { minHeight: 300 },
        validation: { validResponse: { score: 1 }, maxScore: 1 },
        hints: [{ value: uuids[0], label: "Hint A" }]
      },
      onSelectQuestionType
    },
    {
      type: "edit",
      cardImage: WSShortText,
      data: {
        title: "Short text",
        stimulus: "<p>[This is the stem.]</p>",
        type: questionType.SHORT_TEXT,
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            matchingRule: EXACT_MATCH,
            value: ""
          },
          altResponses: []
        },
        hints: [{ value: uuids[0], label: "Hint A" }]
      },
      onSelectQuestionType
    },
    {
      type: "multiple-choice",
      cardImage: MCStandard,
      data: {
        title: "Multiple choice - standard",
        type: questionType.MULTIPLE_CHOICE,
        stimulus: "",
        uiStyle: {
          type: "standard"
        },
        options: [{ value: uuids[0], label: "" }, { value: uuids[1], label: "" }, { value: uuids[2], label: "" }],
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: [uuids[0]]
          },
          altResponses: []
        },
        multipleResponses: false,
        hints: [{ value: uuids[0], label: "Hint A" }]
      },
      onSelectQuestionType
    },
    {
      type: "multiple-choice",
      cardImage: MCMultipleResponses,
      data: {
        title: "Multiple choice - multiple response",
        type: questionType.MULTIPLE_CHOICE,
        stimulus: "",
        uiStyle: {
          type: "standard"
        },
        options: [{ value: uuids[0], label: "" }, { value: uuids[1], label: "" }, { value: uuids[2], label: "" }],
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: [uuids[1]]
          },
          altResponses: []
        },
        multipleResponses: true,
        hints: [{ value: uuids[0], label: "Hint A" }]
      },
      onSelectQuestionType
    },
    {
      type: "multiple-choice",
      cardImage: MCTrueFalse,
      data: {
        title: "True or false",
        type: questionType.MULTIPLE_CHOICE,
        stimulus: "",
        uiStyle: {
          type: "standard"
        },
        options: [{ value: uuids[0], label: "True" }, { value: uuids[1], label: "False" }],
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: [uuids[0]]
          },
          altResponses: []
        },
        multipleResponses: false,
        hints: [{ value: uuids[0], label: "Hint A" }]
      },
      onSelectQuestionType
    },
    {
      type: "multiple-choice",
      cardImage: MCBlockLayout,
      data: {
        title: "Multiple choice - block layout",
        type: questionType.MULTIPLE_CHOICE,
        stimulus: "",
        uiStyle: {
          type: "block",
          choiceLabel: "upper-alpha"
        },
        options: [{ value: uuids[0], label: "" }, { value: uuids[1], label: "" }, { value: uuids[2], label: "" }],
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: [uuids[0]]
          },
          altResponses: []
        },
        multipleResponses: true,
        hints: [{ value: uuids[0], label: "Hint A" }]
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
        uiStyle: {},
        source: ["Item A", "Item B", "Item C", "Item D"],
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: [1, 2, 0, 3]
          },
          altResponses: []
        },
        hints: [{ value: uuids[0], label: "Hint A" }]
      },
      onSelectQuestionType
    },
    {
      type: "classify",
      cardImage: CMClassification,
      data: {
        title: "Classification",
        firstMount: true,
        groupPossibleResponses: false,
        possibleResponseGroups: [],
        possibleResponses: [
          {
            id: uuids[0],
            value: "Choice B"
          },
          {
            id: uuids[1],
            value: "Choice C"
          },
          {
            id: uuids[2],
            value: "Choice A"
          },
          {
            id: uuids[3],
            value: "Choice D"
          }
        ],
        stimulus: "Your question is here",
        type: questionType.CLASSIFICATION,
        uiStyle: {
          columnCount: 2,
          columnTitles: ["COLUMN 1", "COLUMN 2"],
          rowCount: 1,
          rowTitles: ["ROW1"]
        },
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: [[], []]
          },
          altResponses: []
        },
        hints: [{ value: uuids[0], label: "Hint A" }]
      },
      onSelectQuestionType
    },
    {
      type: "classify",
      cardImage: CMMatch,
      data: {
        title: "Match list",
        firstMount: true,
        groupPossibleResponses: false,
        possibleResponseGroups: [
          {
            title: "",
            responses: ["Choice B", "Choice C", "Choice A"]
          }
        ],
        possibleResponses: ["Choice A", "Choice B", "Choice C"],
        type: questionType.MATCH_LIST,
        stimulus: "<p>This is the stem.</p>",
        list: ["Stem 1", "Stem 2", "Stem 3"],
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: [null, null, null]
          },
          altResponses: []
        },
        hints: [{ value: uuids[0], label: "Hint A" }]
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
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: [0, 1, 2]
          },
          altResponses: []
        },
        hints: [{ value: uuids[0], label: "Hint A" }]
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
        uiStyle: {
          type: "table",
          horizontalLines: false
        },
        stems: ["[Stem 1]", "[Stem 2]", "[Stem 3]", "[Stem 4]"],
        options: ["True", "False"],
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: [null, null, null, null]
          },
          altResponses: []
        },
        multipleResponses: false,
        hints: [{ value: uuids[0], label: "Hint A" }]
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
        uiStyle: {
          type: "inline",
          horizontalLines: false
        },
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: [null, null, null, null]
          },
          altResponses: []
        },
        hints: [{ value: uuids[0], label: "Hint A" }]
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
        uiStyle: {
          stemNumeration: "upper-alpha",
          type: "table",
          horizontalLines: false
        },
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: [null, null, null, null]
          },
          altResponses: []
        },
        hints: [{ value: uuids[0], label: "Hint A" }]
      },
      onSelectQuestionType
    },
    {
      type: "fill-blanks",
      cardImage: FBClozeDragDrop,
      stimulus: "",
      data: {
        title: "Cloze with Drag & Drop",
        stimulus: `<p>Drag and Drop the right answer in the answers below.</p><p>Sample question text with a single drop area &nbsp;<response contenteditable="false" />&nbsp;</p>`,
        type: questionType.CLOZE_DRAG_DROP,
        uiStyle: {
          responsecontainerposition: "bottom",
          fontsize: "normal",
          stemnumeration: "",
          widthpx: 140,
          heightpx: 0,
          wordwrap: false,
          responsecontainerindividuals: []
        },
        options: [
          { value: uuidsForFill[0], label: "Option 1" },
          { value: uuidsForFill[1], label: "Option 2" },
          { value: uuidsForFill[2], label: "Option 3" }
        ],
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: []
          },
          altResponses: []
        },
        hints: [{ value: uuids[0], label: "Hint A" }]
      },
      onSelectQuestionType
    },
    {
      type: "fill-blanks",
      cardImage: FBClozeDropDown,
      stimulus: "Pick the right options in the dropdown below",
      data: {
        title: "Cloze with Drop Down",
        type: questionType.CLOZE_DROP_DOWN,
        stimulus: `<p>Pick the right options in the dropdown below.</p><p>Sample question text with &nbsp;<textdropdown responseindex="1" id=${
          uuids[0]
        } contenteditable="false"></textdropdown>&nbsp;and&nbsp;<textdropdown responseindex="2" id=${
          uuids[1]
        } contenteditable="false"></textdropdown>&nbsp;</p>`,
        responseIds: [{ index: 0, id: uuids[0] }, { index: 1, id: uuids[1] }],
        uiStyle: {
          responsecontainerposition: "bottom",
          fontsize: "normal",
          stemnumeration: "",
          widthpx: 140,
          heightpx: 0,
          wordwrap: false,
          responsecontainerindividuals: []
        },
        options: {
          [uuids[0]]: [defaultOptions[0], defaultOptions[1]],
          [uuids[1]]: [defaultOptions[2], defaultOptions[3]]
        },
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: []
          },
          altResponses: []
        },
        hints: [{ value: uuids[0], label: "Hint A" }]
      },
      onSelectQuestionType
    },
    {
      type: "fill-blanks",
      cardImage: FBClozeText,
      stimulus: "Fill blank boxes with the right answer.",
      data: {
        title: "Cloze with Text",
        type: questionType.CLOZE_TEXT,
        stimulus: `<p>Fill blank boxes with the right answer.</p><p>Sample question text with <textinput responseindex="1" id=${
          uuids[0]
        } contenteditable="false" /></textinput>&nbsp;and<textinput responseindex="2" contenteditable="false" id=${
          uuids[1]
        }/></textinput>&nbsp;</p>`,
        uiStyle: {
          fontsize: "normal",
          heightpx: 35,
          placeholder: "",
          responsecontainerindividuals: [],
          responsecontainerposition: "bottom",
          stemnumeration: "",
          widthpx: 140
        },
        responseIds: [{ index: 0, id: uuids[0] }, { index: 1, id: uuids[1] }],
        validation: {
          scoringType: "exactMatch",
          validResponse: {
            score: 1,
            value: [{ id: uuids[0], index: 0, value: "Answer 1" }, { id: uuids[1], index: 1, value: "Answer 2" }]
          },
          altResponses: []
        },
        hints: [{ value: uuids[0], label: "Hint A" }]
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
        stimulus: "Sample image background with an overlaid drop area(s)",
        imageWidth: 0,
        imageUrl: "https://edureact-dev.s3.amazonaws.com/1558946005996_transparent.png",
        maxRespCount: 1,
        options: [defaultOptions[0], defaultOptions[1], defaultOptions[2]],
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: []
          },
          altResponses: []
        },
        responseLayout: {
          keepAspectRatio: true,
          showborder: true,
          isSnapFitValues: true
        },
        ui_style: {
          widthpx: 140,
          responsecontainerindividuals: [],
          responsecontainerposition: "bottom"
        },
        responses: [
          { top: 0, left: 240, width: 200, height: 40, id: uuids[0] },
          { top: 100, left: 120, width: 220, height: 40, id: uuids[1] },
          { top: 220, left: 200, width: 200, height: 40, id: uuids[2] }
        ],
        hints: [{ value: uuids[0], label: "Hint A" }]
      },
      onSelectQuestionType
    },
    {
      type: "fill-blanks",
      cardImage: FBClozeImgDropDown,
      stimulus: "",
      uiStyle: {
        background: "#0288d1"
      },
      data: {
        title: "Label Image with Drop Down",
        type: questionType.CLOZE_IMAGE_DROP_DOWN,
        firstMount: true,
        stimulus: "Sample image background with overlaid drop downs",
        imageWidth: 0,
        imageUrl: "https://edureact-dev.s3.amazonaws.com/1558946005996_transparent.png",
        keepAspectRatio: true,
        options: [[defaultOptions[0], defaultOptions[1]], [defaultOptions[2], defaultOptions[3]]],
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: []
          },
          altResponses: []
        },
        responseLayout: {
          showborder: true
        },
        responses: [
          { top: 0, left: 240, width: 200, height: 40, id: uuids[0] },
          { top: 100, left: 120, width: 220, height: 40, id: uuids[1] }
        ],
        uiStyle: {
          widthpx: 140,
          responsecontainerindividuals: []
        },
        stimulusReviewonly: "",
        instructorStimulus: "",
        rubricReference: "",
        sampleAnswer: "",
        distractorRationalePerResponse: "",
        distractorRationaleOptions: [],
        hints: [{ value: uuids[0], label: "Hint A" }]
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
        stimulus: "Sample image background with overlaid text fields",
        options: [],
        imageUrl: "https://edureact-dev.s3.amazonaws.com/1558946005996_transparent.png",
        keepAspectRatio: true,
        uiStyle: {
          width: 140,
          responsecontainerindividuals: []
        },
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: []
          },
          altResponses: []
        },
        responseLayout: {
          showborder: true
        },
        responses: [
          { top: 0, left: 240, width: 200, height: 40, id: uuids[0] },
          { top: 100, left: 120, width: 220, height: 40, id: uuids[1] },
          { top: 220, left: 200, width: 200, height: 40, id: uuids[2] }
        ],
        stimulusReviewonly: "",
        instructorStimulus: "",
        rubricReference: "",
        sampleAnswer: "",
        distractorRationalePerResponse: "",
        distractorRationaleOptions: [],
        hints: [{ value: uuids[0], label: "Hint A" }]
      },
      onSelectQuestionType
    },
    {
      type: "graphing",
      cardImage: GRGraphing,
      data: {
        title: "Graphing",
        type: questionType.GRAPH,
        graphType: "quadrants",
        stimulus: "[This is the stem]",
        firstMount: true,
        canvas: {
          xMax: 10.4,
          xMin: -10.4,
          yMax: 10.4,
          yMin: -10.4,
          xRatio: 1,
          yRatio: 1
        },
        controlbar: {
          controls: ["undo", "redo"],
          defaultControl: "undo"
        },
        toolbar: {
          tools: ["point", "line"],
          defaultTool: "point",
          drawingPrompt: "byTools",
          drawingObjects: []
        },
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: []
          },
          altResponses: [],
          ignoreLabels: "yes"
        },
        sampleAnswer: "",
        uiStyle: {
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
          layoutWidth: 600,
          layoutHeight: 600,
          layoutMargin: 0,
          layoutSnapto: "grid",
          xAxisLabel: "X",
          yAxisLabel: "Y"
        },
        backgroundImage: {
          src: "",
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          opacity: 100,
          showShapePoints: true
        },
        background_shapes: [],
        multipleResponses: false,
        hints: [{ value: uuids[0], label: "Hint A" }]
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
        stimulus: "[This is the stem]",
        firstMount: true,
        canvas: {
          xMax: 10.4,
          xMin: -0.8,
          yMax: 10.4,
          yMin: -0.8,
          xRatio: 1,
          yRatio: 1
        },
        controlbar: {
          controls: ["undo", "redo"],
          defaultControl: "undo"
        },
        toolbar: {
          tools: ["point", "line"],
          defaultTool: "point",
          drawingPrompt: "byTools",
          drawingObjects: []
        },
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: []
          },
          altResponses: [],
          ignoreLabels: "yes"
        },
        sampleAnswer: "",
        uiStyle: {
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
          layoutWidth: 600,
          layoutHeight: 600,
          layoutMargin: 0,
          layoutSnapto: "grid",
          xAxisLabel: "X",
          yAxisLabel: "Y"
        },
        backgroundImage: {
          src: "",
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          opacity: 100,
          showShapePoints: true
        },
        background_shapes: [],
        multipleResponses: false,
        hints: [{ value: uuids[0], label: "Hint A" }]
      },
      onSelectQuestionType
    },
    {
      type: "graphing",
      cardImage: GRNumberLinePlot,
      data: {
        title: "Number line with plot",
        type: questionType.GRAPH,
        stimulus: "[This is the stem]",
        firstMount: true,
        graphType: "axisSegments",
        canvas: {
          xMax: 10,
          xMin: 0,
          yMax: 0.5,
          yMin: -0.5,
          numberline: true,
          margin: 75,
          responsesAllowed: 1,
          title: ""
        },
        controlbar: {
          controls: ["undo", "redo", "reset"],
          defaultControl: "undo"
        },
        toolbar: {
          tools: [],
          defaultTool: null
        },
        sampleAnswer: "",
        numberlineAxis: {
          leftArrow: true,
          rightArrow: true,
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
        uiStyle: {
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
          layoutWidth: 600,
          layoutHeight: 150,
          layoutMargin: 0,
          layoutSnapto: "grid",
          xAxisLabel: "X",
          yAxisLabel: "Y",
          titlePosition: 15,
          linePosition: 50,
          pointBoxPosition: 60
        },
        backgroundImage: {
          src: "",
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          opacity: 100,
          showShapePoints: false
        },
        background_shapes: [],
        multipleResponses: false,
        validation: {
          graphType: "axisSegments",
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: []
          },
          altResponses: [],
          rounding: "none"
        },
        hints: [{ value: uuids[0], label: "Hint A" }]
      },
      onSelectQuestionType
    },
    {
      type: "rulers-calculators",
      cardImage: Protractor,
      data: {
        title: "Protractor",
        type: questionType.PROTRACTOR,
        stimulus: "",
        image: "",
        label: "Protractor",
        alt: "A 180-degree standard protractor.",
        width: 530,
        height: 265,
        rotate: true,
        hints: [{ value: uuids[0], label: "Hint A" }]
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
        stimulus: "[This is the stem]",
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
          defaultControl: ""
        },
        sampleAnswer: "",
        validation: {
          graphType: "axisLabels",
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: []
          },
          altResponses: [],
          rounding: "none"
        },
        canvas: {
          xMax: 10,
          xMin: 0,
          yMax: 1,
          yMin: -1.75,
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
        uiStyle: {
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
          layoutWidth: 600,
          layoutHeight: "auto",
          layoutMargin: 0,
          layoutSnapto: "grid",
          xAxisLabel: "X",
          yAxisLabel: "Y",
          titlePosition: 55,
          linePosition: 34,
          pointBoxPosition: 60
        },
        backgroundImage: {
          src: "",
          x: 0,
          y: 0,
          width: 100,
          height: 100,
          opacity: 100,
          showShapePoints: false
        },
        background_shapes: [],
        multipleResponses: false,
        hints: [{ value: uuids[0], label: "Hint A" }]
      },
      onSelectQuestionType
    },
    {
      type: "edit",
      cardImage: VPPassage,
      data: {
        title: "Passage with Multiple parts",
        type: questionType.PASSAGE,
        heading: "Section 3",
        math_renderer: "",
        content: "Enabling a <b>highlightable</b> text passage that can be used across multiple items.",
        hints: [{ value: uuids[0], label: "Hint A" }]
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
        uiStyle: {
          width: 480,
          height: 270,
          posterImage: "",
          hideControls: false,
          captionURL: ""
        },
        hints: [{ value: uuids[0], label: "Hint A" }]
      },
      onSelectQuestionType
    },
    {
      type: "math",
      cardImage: MTFormula,
      stimulus: "",
      data: {
        title: "Expression & Formula",
        isMath: true,
        stimulus: "",
        type: questionType.MATH,
        validation: {
          scoringType: "exactMatch",
          validResponse: {
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
        uiStyle: {
          widthpx: 140,
          type: "floating-keyboard"
        },
        numberPad: ["1", "2", "3", "+", "4", "5", "6", "-", "7", "8", "9", "\\times", "0", ".", "divide", "\\div"],
        symbols: ["units_si", "units_us", "qwerty"],
        template: EMBED_RESPONSE,
        templateDisplay: false,
        hints: [{ value: uuids[0], label: "Hint A" }]
      },
      onSelectQuestionType
    },
    {
      type: "math",
      cardImage: MTFractions,
      stimulus: "",
      data: {
        title: "Numeric Entry",
        isMath: true,
        stimulus: "",
        template: EMBED_RESPONSE,
        templateDisplay: false,
        type: questionType.MATH,
        validation: {
          scoringType: "exactMatch",
          validResponse: {
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
        uiStyle: {
          widthpx: 140,
          type: "floating-keyboard"
        },
        numberPad: ["1", "2", "3", "+", "4", "5", "6", "-", "7", "8", "9", "\\times", "0", ".", "divide", "\\div"],
        symbols: ["basic", "qwerty"],
        hints: [{ value: uuids[0], label: "Hint A" }]
      },
      onSelectQuestionType
    },
    {
      type: "math",
      cardImage: MTFillInBlanks,
      stimulus: "",
      data: {
        title: "Complete the Equation",
        isMath: true,
        stimulus: "",
        template: `${EMBED_RESPONSE} + ${EMBED_RESPONSE} = ${EMBED_RESPONSE}`,
        templateDisplay: true,
        type: questionType.MATH,
        validation: {
          scoringType: "exactMatch",
          validResponse: {
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
        uiStyle: {
          widthpx: 140,
          type: "floating-keyboard"
        },
        numberPad: ["1", "2", "3", "+", "4", "5", "6", "-", "7", "8", "9", "\\times", "0", ".", "divide", "\\div"],
        symbols: ["basic", "qwerty"],
        hints: [{ value: uuids[0], label: "Hint A" }]
      },
      onSelectQuestionType
    },
    {
      type: "math",
      cardImage: MTText,
      stimulus: "",
      data: {
        title: "Equations & Inequalities",
        isMath: true,
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
          scoringType: "exactMatch",
          validResponse: {
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
        uiStyle: {
          widthpx: 140,
          type: "floating-keyboard"
        },
        numberPad: ["1", "2", "3", "+", "4", "5", "6", "-", "7", "8", "9", "\\times", "0", ".", "divide", "\\div"],
        symbols: ["basic", "qwerty"],
        hints: [{ value: uuids[0], label: "Hint A" }]
      },
      onSelectQuestionType
    },
    {
      type: "math",
      cardImage: MTMatrices,
      stimulus: "",
      data: {
        title: "Matrices",
        isMath: true,
        stimulus: "",
        template: `\\begin{bmatrix}4&0\\\\1&-9\\end{bmatrix}\\times2=${EMBED_RESPONSE}`,
        templateDisplay: true,
        type: questionType.MATH,
        validation: {
          scoringType: "exactMatch",
          validResponse: {
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
        uiStyle: {
          widthpx: 140,
          type: "floating-keyboard"
        },
        numberPad: ["1", "2", "3", "+", "4", "5", "6", "-", "7", "8", "9", "\\times", "0", ".", "divide", "\\div"],
        symbols: ["intermediate", "general", "qwerty"],
        hints: [{ value: uuids[0], label: "Hint A" }]
      },
      onSelectQuestionType
    },
    {
      type: "math",
      cardImage: MTUnits,
      stimulus: "",
      data: {
        title: "Units",
        isMath: true,
        stimulus: "",
        template: EMBED_RESPONSE,
        isUnits: true,
        templateDisplay: false,
        showDropdown: false,
        type: questionType.MATH,
        validation: {
          scoringType: "exactMatch",
          validResponse: {
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
        custom_keys: ["m", "km", "cm", "mm"],
        uiStyle: {
          widthpx: 140,
          type: "floating-keyboard"
        },
        numberPad: ["1", "2", "3", "+", "4", "5", "6", "-", "7", "8", "9", "\\times", "0", ".", "divide", "\\div"],
        symbols: ["units_us", "units_si", "qwerty"],
        hints: [{ value: uuids[0], label: "Hint A" }]
      },
      onSelectQuestionType
    },
    {
      type: "multipart",
      cardImage: MTCombinationClozeText,
      stimulus: "",
      data: {
        title: "Math, Text & Dropdown",
        stimulus:
          '<p>Sample question -&nbsp;<textinput contenteditable="false"></textinput>&nbsp;,&nbsp;<textdropdown contenteditable="false"></textdropdown>&nbsp;,&nbsp;<mathinput contenteditable="false"></mathinput>&nbsp;</p>',
        templateDisplay: true,
        type: questionType.EXPRESSION_MULTIPART,
        responseIds: {
          inputs: [],
          maths: [],
          dropDowns: []
        },
        response_container: {
          template: ""
        },
        uiStyle: {
          type: "floating-keyboard",
          minWidth: 100
        },
        options: {},
        validation: {
          scoringType: "exactMatch",
          validResponse: {
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
            ],
            dropdown: {
              value: []
            },
            textinput: {
              value: []
            }
          }
        },
        isMath: true,
        response_containers: [],
        symbols: ["basic", "qwerty"],
        numberPad: ["1", "2", "3", "+", "4", "5", "6", "-", "7", "8", "9", "\\times", "0", ".", "divide", "\\div"],
        hints: [{ value: uuids[0], label: "Hint A" }]
      },
      onSelectQuestionType
    },
    {
      type: "multipart",
      cardImage: MTCombinationMulti,
      data: {
        title: "Combination Multipart",
        type: questionType.COMBINATION_MULTIPART
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
        uiStyle: {
          defaultMode: "math",
          fontsize: "",
          textFormattingOptions: ["bold", "italic", "underline", "unorderedList"]
        },
        validation: {
          validResponse: {
            score: 1
          }
        },
        numberPad: ["1", "2", "3", "+", "4", "5", "6", "-", "7", "8", "9", "\\times", "0", ".", "divide", "\\div"],
        metadata: {},
        isMath: true,
        symbols: ["basic", "qwerty"],
        hints: [{ value: uuids[0], label: "Hint A" }]
      },
      onSelectQuestionType
    }
  ];
};
