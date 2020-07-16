import { themeColor, svgMapFillColor, svgMapStrokeColor } from "@edulastic/colors";
import { math, questionType, canvasDimensions, questionTitle } from "@edulastic/constants";

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
import GRFractionEditor from "../../../src/assets/graphing/fraction-editor.svg";

// Charts
import LinePlot from "../../../src/assets/charts/line-plot.svg";
import DotPlot from "../../../src/assets/charts/dot-plot.svg";
import LinePlotNumberLine from "../../../src/assets/charts/line-plot-number-line.svg";
import DotPlotNumberLine from "../../../src/assets/charts/dot-plot-number-line.svg";
import Histogram from "../../../src/assets/charts/histogram.svg";
import BarChart from "../../../src/assets/charts/bar-chart.svg";
import LineChart from "../../../src/assets/charts/line-chart.svg";

// Video&Passages
import VPVideoPlayer from "../../../src/assets/video-and-passages/player.svg";
import SQPassage from "../../../src/assets/video-and-passages/passage01.png";
import MQPassage from "../../../src/assets/video-and-passages/passage02.png";
import TextResource from "../../../src/assets/video-and-passages/text.svg";

// Rulers & Calculators
import Protractor from "../../../src/assets/rulers-calculators/protractor.svg";

export const getCards = (onSelectQuestionType, isPassage = false) => {
  const { EMBED_RESPONSE, defaultNumberPad } = math;
  // use it for ids of MCQ, Orderlist, and Choice Matrix
  const uuids = [uuid(), uuid(), uuid(), uuid(), uuid(), uuid(), uuid(), uuid()];

  const uuidsForFill = [uuid(), uuid(), uuid()];

  const cards = [
    {
      type: "charts",
      cardImage: BarChart,
      data: {
        title: "Bar Chart",
        firstMount: true,
        type: questionType.BAR_CHART,
        stimulus: "",
        chart_data: {
          data: [
            {
              x: "Bar 1",
              y: 70
            },
            {
              x: "Bar 2",
              y: 70
            },
            {
              x: "Bar 3",
              y: 70
            },
            {
              x: "Bar 4",
              y: 70
            },
            {
              x: "Bar 5",
              y: 70
            },
            {
              x: "Bar 6",
              y: 70
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
                y: 70
              },
              {
                x: "Bar 2",
                y: 70
              },
              {
                x: "Bar 3",
                y: 70
              },
              {
                x: "Bar 4",
                y: 70
              },
              {
                x: "Bar 5",
                y: 70
              },
              {
                x: "Bar 6",
                y: 70
              }
            ]
          },
          altResponses: []
        },
        xAxisLabel: "X Axis",
        yAxisLabel: "Y Axis",
        hints: [{ value: uuids[0], label: "" }]
      },
      onSelectQuestionType
    },
    {
      type: "charts",
      cardImage: LineChart,
      data: {
        title: "Line Chart",
        firstMount: true,
        type: questionType.LINE_CHART,
        stimulus: "",
        chart_data: {
          data: [
            {
              x: "Bar 1",
              y: 70
            },
            {
              x: "Bar 2",
              y: 70
            },
            {
              x: "Bar 3",
              y: 70
            },
            {
              x: "Bar 4",
              y: 70
            },
            {
              x: "Bar 5",
              y: 70
            },
            {
              x: "Bar 6",
              y: 70
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
                y: 70
              },
              {
                x: "Bar 2",
                y: 70
              },
              {
                x: "Bar 3",
                y: 70
              },
              {
                x: "Bar 4",
                y: 70
              },
              {
                x: "Bar 5",
                y: 70
              },
              {
                x: "Bar 6",
                y: 70
              }
            ]
          },
          altResponses: []
        },
        xAxisLabel: "X Axis",
        yAxisLabel: "Y Axis",
        hints: [{ value: uuids[0], label: "" }]
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
        stimulus: "",
        chart_data: {
          data: [
            {
              x: "Bar 1",
              y: 70
            },
            {
              x: "Bar 2",
              y: 70
            },
            {
              x: "Bar 3",
              y: 70
            },
            {
              x: "Bar 4",
              y: 70
            },
            {
              x: "Bar 5",
              y: 70
            },
            {
              x: "Bar 6",
              y: 70
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
                y: 70
              },
              {
                x: "Bar 2",
                y: 70
              },
              {
                x: "Bar 3",
                y: 70
              },
              {
                x: "Bar 4",
                y: 70
              },
              {
                x: "Bar 5",
                y: 70
              },
              {
                x: "Bar 6",
                y: 70
              }
            ]
          },
          altResponses: []
        },
        xAxisLabel: "X Axis",
        yAxisLabel: "Y Axis",
        hints: [{ value: uuids[0], label: "" }]
      },
      onSelectQuestionType
    },
    {
      type: "charts",
      cardImage: DotPlot,
      data: {
        title: "Dot Plot - Categories",
        firstMount: true,
        type: "dots",
        stimulus: "",
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
        hints: [{ value: uuids[0], label: "" }]
      },
      onSelectQuestionType
    },
    {
      type: "charts",
      cardImage: DotPlotNumberLine,
      data: {
        title: "Dot Plot",
        type: questionType.GRAPH,
        stimulus: "",
        firstMount: true,
        graphType: "numberLinePlot",
        canvas: {
          xMax: 10,
          xMin: 0,
          yMax: 10,
          yMin: 0,
          numberline: true,
          margin: 75,
          title: ""
        },
        controlbar: {
          controls: ["undo", "redo", "clear", "trash"],
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
          xDistance: 0.5,
          yDistance: 0.5,
          xTickDistance: 1,
          yTickDistance: 0,
          layoutWidth: 600,
          layoutHeight: 440,
          layoutMargin: 0,
          layoutSnapto: "grid",
          xAxisLabel: "X",
          yAxisLabel: "Y",
          titlePosition: 15,
          linePosition: 80,
          pointBoxPosition: 60,
          pointFace: "circle",
          pointSize: 6,
          pointStrokeWidth: 4,
          maxPointsCount: 12
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
        hints: [{ value: uuids[0], label: "" }]
      },
      onSelectQuestionType
    },
    {
      type: "charts",
      cardImage: LinePlot,
      data: {
        title: "Line Plot - Categories",
        firstMount: true,
        type: "linePlot",
        stimulus: "",
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
        hints: [{ value: uuids[0], label: "" }]
      },
      onSelectQuestionType
    },
    {
      type: "charts",
      cardImage: LinePlotNumberLine,
      data: {
        title: "Line Plot",
        type: questionType.GRAPH,
        stimulus: "",
        firstMount: true,
        graphType: "numberLinePlot",
        canvas: {
          xMax: 10,
          xMin: 0,
          yMax: 10,
          yMin: 0,
          numberline: true,
          margin: 75,
          title: ""
        },
        controlbar: {
          controls: ["undo", "redo", "clear", "trash"],
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
          xDistance: 0.5,
          yDistance: 0.5,
          xTickDistance: 1,
          yTickDistance: 0,
          layoutWidth: 600,
          layoutHeight: 440,
          layoutMargin: 0,
          layoutSnapto: "grid",
          xAxisLabel: "X",
          yAxisLabel: "Y",
          titlePosition: 15,
          linePosition: 80,
          pointBoxPosition: 60,
          pointFace: "cross",
          pointSize: 6,
          pointStrokeWidth: 4,
          maxPointsCount: 12
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
        hints: [{ value: uuids[0], label: "" }]
      },
      onSelectQuestionType
    },
    {
      type: "highlight",
      cardImage: HLHightlight,
      data: {
        title: "Drawing Response",
        image: {
          source: "",
          width: canvasDimensions.maxWidth,
          height: canvasDimensions.maxHeight,
          altText: ""
        },
        line_color: [themeColor],
        stimulus: "",
        type: questionType.HIGHLIGHT_IMAGE,
        validation: {
          validResponse: {
            score: 1
          }
        },
        hints: [{ value: uuids[0], label: "" }]
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
        stimulus: "",
        type: questionType.SHADING,
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            method: BY_LOCATION_METHOD,
            value: []
          },
          altResponses: []
        },
        hints: [{ value: uuids[0], label: "" }]
      },
      onSelectQuestionType
    },
    {
      type: "highlight",
      cardImage: HLHotspot,
      data: {
        title: "Hotspot",
        stimulus: "",
        type: questionType.HOTSPOT,
        image: {
          source: "",
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
        hints: [{ value: uuids[0], label: "" }]
      },
      onSelectQuestionType
    },
    {
      type: "highlight",
      cardImage: HLTokenHighlight,
      data: {
        title: "Sentence Response",
        stimulus: "",
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
        hints: [{ value: uuids[0], label: "" }]
      },
      onSelectQuestionType
    },
    {
      type: "edit",
      cardImage: WSEssayRichText,
      data: {
        title: "Essay with Rich Text",
        stimulus: "",
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
          { id: "test28", value: "specialCharacters", active: true },
          { id: "test29", value: "|", active: false },
          { id: "test21", value: "image", active: false },
          { id: "test22", value: "link", active: false },
          { id: "test23", value: "|", active: false }
        ],
        hints: [{ value: uuids[0], label: "" }]
      },
      onSelectQuestionType
    },
    {
      type: "edit",
      cardImage: WSEssayPlainText,
      data: {
        title: "Essay with Plain Text",
        stimulus: "",
        type: questionType.ESSAY_PLAIN_TEXT,
        showCopy: true,
        showCut: true,
        showPaste: true,
        maxWord: 1000,
        showWordLimit: ON_LIMIT,
        showWordCount: true,
        uiStyle: { minHeight: 300, numberOfRows: 10 }, // textarea number of rows
        validation: { validResponse: { score: 1 }, maxScore: 1 },
        hints: [{ value: uuids[0], label: "" }]
      },
      onSelectQuestionType
    },
    {
      type: "edit",
      cardImage: WSShortText,
      data: {
        title: "Short Text",
        stimulus: "",
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
        hints: [{ value: uuids[0], label: "" }]
      },
      onSelectQuestionType
    },
    {
      type: "multiple-choice",
      cardImage: MCStandard,
      data: {
        title: questionTitle.MCQ_STANDARD,
        type: questionType.MULTIPLE_CHOICE,
        stimulus: "",
        uiStyle: {
          type: "standard"
        },
        options: [
          { value: uuids[0], label: "" },
          { value: uuids[1], label: "" },
          { value: uuids[2], label: "" },
          { value: uuids[3], label: "" }
        ],
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: [uuids[0]]
          },
          altResponses: []
        },
        multipleResponses: false,
        hints: [{ value: uuids[0], label: "" }]
      },
      onSelectQuestionType
    },
    {
      type: "multiple-choice",
      cardImage: MCMultipleResponses,
      data: {
        title: "Multiple Selection",
        type: questionType.MULTIPLE_CHOICE,
        stimulus: "",
        uiStyle: {
          type: "standard"
        },
        options: [
          { value: uuids[0], label: "" },
          { value: uuids[1], label: "" },
          { value: uuids[2], label: "" },
          { value: uuids[3], label: "" }
        ],
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: [uuids[1]]
          },
          altResponses: []
        },
        multipleResponses: true,
        hints: [{ value: uuids[0], label: "" }]
      },
      onSelectQuestionType
    },
    {
      type: "multiple-choice",
      cardImage: MCTrueFalse,
      data: {
        title: questionTitle.MCQ_TRUE_OR_FALSE,
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
        hints: [{ value: uuids[0], label: "" }]
      },
      onSelectQuestionType
    },
    {
      type: "multiple-choice",
      cardImage: MCBlockLayout,
      data: {
        title: "Multiple Choice - Block Layout",
        type: questionType.MULTIPLE_CHOICE,
        stimulus: "",
        uiStyle: {
          type: "block",
          choiceLabel: "upper-alpha"
        },
        options: [
          { value: uuids[0], label: "" },
          { value: uuids[1], label: "" },
          { value: uuids[2], label: "" },
          { value: uuids[3], label: "" }
        ],
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: [uuids[0]]
          },
          altResponses: []
        },
        multipleResponses: true,
        hints: [{ value: uuids[0], label: "" }]
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
        stimulus: "",
        labels: {
          source: "source",
          target: "target"
        },
        uiStyle: {},
        source: ["Item A", "Item B", "Item C", "Item D"],
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: [0, 1, 2, 3]
          },
          altResponses: []
        },
        hints: [{ value: uuids[0], label: "" }]
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
        possibleResponseGroups: [
          {
            title: "Group 1",
            responses: [
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
            ]
          }
        ],
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
        stimulus: "",
        type: questionType.CLASSIFICATION,
        uiStyle: {
          columnCount: 2,
          columnTitles: ["COLUMN 1", "COLUMN 2"],
          rowCount: 1,
          rowTitles: ["ROW1"]
        },
        classifications: [
          { id: uuidsForFill[0], rowIndex: 0, columnIndex: 0 },
          { id: uuidsForFill[1], rowIndex: 0, columnIndex: 1 }
        ],
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: { [uuidsForFill[0]]: [], [uuidsForFill[1]]: [] }
          },
          altResponses: []
        },
        hints: [{ value: uuids[0], label: "" }]
      },
      onSelectQuestionType
    },
    {
      type: "classify",
      cardImage: CMMatch,
      data: {
        title: "Match the following",
        firstMount: true,
        groupPossibleResponses: false,
        possibleResponseGroups: [
          {
            title: "",
            responses: [
              { value: uuid(), label: "Choice B" },
              { value: uuid(), label: "Choice C" },
              { value: uuid(), label: "Choice A" }
            ]
          }
        ],
        possibleResponses: [
          { value: uuid(), label: "Choice A" },
          { value: uuid(), label: "Choice B" },
          { value: uuid(), label: "Choice C" }
        ],
        type: questionType.MATCH_LIST,
        stimulus: "",
        list: [
          { value: uuids[0], label: "Stem 1" },
          { value: uuids[1], label: "Stem 2" },
          { value: uuids[2], label: "Stem 3" }
        ],
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: {
              [uuids[0]]: null,
              [uuids[1]]: null,
              [uuids[2]]: null
            }
          },
          altResponses: []
        },
        hints: [{ value: uuids[0], label: "" }]
      },
      onSelectQuestionType
    },
    {
      type: "classify",
      cardImage: CMOrderList,
      data: {
        title: "Re-sequence",
        type: questionType.ORDER_LIST,
        stimulus: "Simple Question",
        list: {
          [uuids[0]]: "Item A",
          [uuids[1]]: "Item B",
          [uuids[2]]: "Item C"
        },
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: {
              [uuids[0]]: 2,
              [uuids[1]]: 0,
              [uuids[2]]: 1
            }
          },
          altResponses: []
        },
        hints: [{ value: uuids[0], label: "" }]
      },
      onSelectQuestionType
    },
    {
      type: "multiple-choice",
      cardImage: MCMatrixStandard,
      data: {
        title: "Match Table - Standard",
        firstMount: true,
        type: questionType.CHOICE_MATRIX,
        stimulus: "",
        uiStyle: {
          type: "table",
          horizontalLines: false
        },
        stems: ["[Stem 1]", "[Stem 2]", "[Stem 3]", "[Stem 4]"],
        options: ["True", "False"],
        responseIds: [[uuids[0], uuids[1]], [uuids[2], uuids[3]], [uuids[4], uuids[5]], [uuids[6], uuids[7]]],
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: {}
          },
          altResponses: []
        },
        multipleResponses: false,
        hints: [{ value: uuids[0], label: "" }]
      },
      onSelectQuestionType
    },
    {
      type: "multiple-choice",
      cardImage: MCMatrixInline,
      data: {
        title: "Match Table - Inline",
        firstMount: true,
        options: ["True", "False"],
        stems: ["[Stem 1]", "[Stem 2]", "[Stem 3]", "[Stem 4]"],
        responseIds: [[uuids[0], uuids[1]], [uuids[2], uuids[3]], [uuids[4], uuids[5]], [uuids[6], uuids[7]]],
        stimulus: "",
        type: questionType.CHOICE_MATRIX,
        uiStyle: {
          type: "inline",
          horizontalLines: false
        },
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: {}
          },
          altResponses: []
        },
        hints: [{ value: uuids[0], label: "" }]
      },
      onSelectQuestionType
    },
    {
      type: "multiple-choice",
      cardImage: MCMatrixLabels,
      data: {
        title: "Match Table - Labels",
        firstMount: true,
        options: ["True", "False"],
        stems: ["[Stem 1]", "[Stem 2]", "[Stem 3]", "[Stem 4]"],
        responseIds: [[uuids[0], uuids[1]], [uuids[2], uuids[3]], [uuids[4], uuids[5]], [uuids[6], uuids[7]]],
        stimulus: "",
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
            value: {}
          },
          altResponses: []
        },
        hints: [{ value: uuids[0], label: "" }]
      },
      onSelectQuestionType
    },
    {
      type: "fill-blanks",
      cardImage: FBClozeDragDrop,
      stimulus: "",
      data: {
        title: "Drag & Drop",
        stimulus: `<p>Drag and Drop the right answer in the answers below.</p><p>Sample question text with a single drop area &nbsp;<response contenteditable="false" />&nbsp;</p>`,
        type: questionType.CLOZE_DRAG_DROP,
        uiStyle: {
          responsecontainerposition: "bottom",
          fontsize: "normal",
          stemNumeration: "",
          widthpx: 140,
          heightpx: 32,
          wordwrap: false,
          responsecontainerindividuals: [],
          responseContainerWidth: 200
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
        hints: [{ value: uuids[0], label: "" }]
      },
      onSelectQuestionType
    },
    {
      type: "fill-blanks",
      cardImage: FBClozeDropDown,
      stimulus: "Pick the right options in the dropdown below",
      data: {
        title: "Text Drop Down",
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
          stemNumeration: "",
          widthpx: 140,
          heightpx: 35,
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
        hints: [{ value: uuids[0], label: "" }]
      },
      onSelectQuestionType
    },
    {
      type: "fill-blanks",
      cardImage: FBClozeText,
      stimulus: "Fill blank boxes with the right answer.",
      data: {
        title: "Text Entry",
        type: questionType.CLOZE_TEXT,
        stimulus: `<p>Fill blank boxes with the right answer.</p><p>Sample question text with <textinput responseindex="1" id=${
          uuids[0]
        } contenteditable="false" /></textinput>&nbsp;and<textinput responseindex="2" contenteditable="false" id=${
          uuids[1]
        }/></textinput>&nbsp;</p>`,
        uiStyle: {
          fontsize: "normal",
          heightpx: 36,
          placeholder: "",
          responsecontainerindividuals: [],
          responsecontainerposition: "bottom",
          stemNumeration: "",
          widthpx: 140
        },
        responseIds: [{ index: 0, id: uuids[0] }, { index: 1, id: uuids[1] }],
        validation: {
          scoringType: "exactMatch",
          validResponse: {
            score: 1,
            value: [{ id: uuids[0], index: 0, value: "Answer 1" }, { id: uuids[1], index: 1, value: "Answer 2" }]
          },
          mixAndMatch: true,
          altResponses: []
        },
        hints: [{ value: uuids[0], label: "" }]
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
        imageUrl: "https://cdn2.edulastic.com/default/1558946005996_transparent.png",
        maxRespCount: 1,
        options: [
          { id: uuidsForFill[0], value: defaultOptions[0] },
          { id: uuidsForFill[1], value: defaultOptions[1] },
          { id: uuidsForFill[2], value: defaultOptions[2] }
        ],
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
        uiStyle: {
          widthpx: 140,
          heightpx: 35,
          responsecontainerindividuals: [],
          responsecontainerposition: "bottom",
          responseContainerWidth: 200,
          fontsize: "normal"
        },
        responses: [
          { top: 0, left: 240, width: 200, height: 40, id: uuids[0] },
          { top: 100, left: 120, width: 220, height: 40, id: uuids[1] },
          { top: 220, left: 200, width: 200, height: 40, id: uuids[2] }
        ],
        hints: [{ value: uuids[0], label: "" }]
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
        imageUrl: "https://cdn2.edulastic.com/default/1558946005996_transparent.png",
        keepAspectRatio: true,
        options: [[defaultOptions[0], defaultOptions[1]], [defaultOptions[2], defaultOptions[3]]],
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: { [uuids[0]]: defaultOptions[0], [uuids[1]]: defaultOptions[2] }
          },
          altResponses: []
        },
        responseLayout: {
          showborder: true
        },
        responses: [
          { top: 0, left: 240, width: 200, height: 40, id: uuids[0] },
          { top: 100, left: 120, width: 200, height: 40, id: uuids[1] }
        ],
        uiStyle: {
          widthpx: 140,
          heightpx: 35,
          inputtype: "text",
          stemNumeration: "numerical",
          fontsize: "normal",
          responsecontainerindividuals: []
        },
        stimulusReviewonly: "",
        instructorStimulus: "",
        rubricReference: "",
        sampleAnswer: "",
        distractorRationalePerResponse: "",
        distractorRationaleOptions: [],
        hints: [{ value: uuids[0], label: "" }]
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
        imageUrl: "https://cdn2.edulastic.com/default/1558946005996_transparent.png",
        keepAspectRatio: true,
        uiStyle: {
          width: 140,
          responsecontainerindividuals: [],
          widthpx: 140,
          heightpx: 35,
          placeholder: "",
          inputtype: "text",
          pointer: "right"
        },
        validation: {
          scoringType: EXACT_MATCH,
          mixAndMatch: true,
          validResponse: {
            score: 1,
            value: { [uuids[0]]: "", [uuids[1]]: "", [uuids[2]]: "" }
          },
          altResponses: []
        },
        responseLayout: {
          showborder: true
        },
        responses: [
          { placeholder: "", top: 0, left: 240, width: 200, height: 40, id: uuids[0] },
          { placeholder: "", top: 100, left: 120, width: 200, height: 40, id: uuids[1] },
          { placeholder: "", top: 220, left: 200, width: 200, height: 40, id: uuids[2] }
        ],
        stimulusReviewonly: "",
        instructorStimulus: "",
        rubricReference: "",
        sampleAnswer: "",
        distractorRationalePerResponse: "",
        distractorRationaleOptions: [],
        hints: [{ value: uuids[0], label: "" }]
      },
      onSelectQuestionType
    },
    {
      type: "fill-blanks",
      cardImage: FBClozeDropDown,
      stimulus: "Pick the right options in the dropdown below",
      data: {
        title: "Editing Task",
        type: questionType.EDITING_TASK,
        stimulus: `
          <p>Pick the right options in the dropdown below.</p>
          <p>Sample question text with &nbsp;
            <response responseindex="1" id=${uuids[0]} contenteditable="false"></response>&nbsp;and&nbsp;
            <response responseindex="2" id=${uuids[1]} contenteditable="false"></response>&nbsp;
          </p>`,
        responseIds: [{ index: 0, id: uuids[0] }, { index: 1, id: uuids[1] }],
        uiStyle: {
          responsecontainerposition: "bottom",
          fontsize: "normal",
          stemNumeration: "",
          widthpx: 140,
          heightpx: 35,
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
            value: {
              [uuids[0]]: "",
              [uuids[1]]: ""
            }
          },
          altResponses: []
        },
        displayStyle: {
          value: "toggle",
          option: "dashedline"
        },
        hints: [{ value: uuids[0], label: "" }]
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
        stimulus: "",
        firstMount: true,
        canvas: {
          xMax: 10,
          xMin: -10,
          yMax: 10,
          yMin: -10,
          xRatio: 1,
          yRatio: 1
        },
        controlbar: {
          controls: ["undo", "redo", "reset", "delete"],
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
          drawLabelZero: true,
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
        hints: [{ value: uuids[0], label: "" }]
      },
      onSelectQuestionType
    },
    {
      type: "graphing",
      cardImage: GRGraphingQuadrant,
      data: {
        title: "Graphing in the 1st Quadrant",
        type: questionType.GRAPH,
        graphType: "firstQuadrant",
        stimulus: "",
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
          controls: ["undo", "redo", "reset", "delete"],
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
          drawLabelZero: true,
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
        hints: [{ value: uuids[0], label: "" }]
      },
      onSelectQuestionType
    },
    {
      type: "graphing",
      cardImage: GRGraphing,
      data: {
        title: "Graph Placement",
        type: questionType.GRAPH,
        graphType: "quadrantsPlacement",
        stimulus: "",
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
          controls: ["undo", "redo", "reset"],
          defaultControl: "undo"
        },
        toolbar: {
          tools: ["point"],
          defaultTool: "point"
        },
        list: [
          {
            text: "<p>Option 1</p>",
            id: `list-item-${Math.random()
              .toString(36)
              .substr(2, 9)}`
          },
          {
            text: "<p>Option 2</p>",
            id: `list-item-${Math.random()
              .toString(36)
              .substr(2, 9)}`
          }
        ],
        validation: {
          scoringType: EXACT_MATCH,
          validResponse: {
            score: 1,
            value: []
          },
          altResponses: []
        },
        sampleAnswer: "",
        uiStyle: {
          drawLabelZero: true,
          displayPositionOnHover: false,
          displayPositionPoint: true,
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
        backgroundShapes: [],
        multipleResponses: false,
        hints: [{ value: uuids[0], label: "" }]
      },
      onSelectQuestionType
    },
    {
      type: "graphing",
      cardImage: GRNumberLinePlot,
      data: {
        title: "Range Plotter",
        type: questionType.GRAPH,
        stimulus: "",
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
        hints: [{ value: uuids[0], label: "" }]
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
        hints: [{ value: uuids[0], label: "" }]
      },
      onSelectQuestionType
    },
    {
      type: "graphing",
      cardImage: GRNumberLineDragDrop,
      data: {
        title: "Number Line",
        type: questionType.GRAPH,
        firstMount: true,
        graphType: "axisLabels",
        stimulus: "",
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
          responseBoxPosition: "bottom"
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
          layoutHeight: 150,
          layoutMargin: 0,
          layoutSnapto: "grid",
          xAxisLabel: "X",
          yAxisLabel: "Y",
          titlePosition: 75,
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
        hints: [{ value: uuids[0], label: "" }]
      },
      onSelectQuestionType
    },
    {
      type: "read",
      cardImage: SQPassage,
      isPassageType: true,
      data: {
        title: "Passage with Questions",
        type: questionType.PASSAGE_WITH_QUESTIONS
      },
      onSelectQuestionType
    },
    {
      type: "read",
      cardImage: MQPassage,
      isPassageType: true,
      data: {
        title: "Passage with Multiple Parts",
        type: questionType.PASSAGE,
        heading: "Section 3",
        math_renderer: "",
        content: "Enabling a <b>highlightable</b> text passage that can be used across multiple items.",
        hints: [{ value: uuids[0], label: "" }]
      },
      list: ["Item A", "Item B"],
      onSelectQuestionType
    },
    {
      type: "instruction",
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
        hints: [{ value: uuids[0], label: "" }]
      },
      onSelectQuestionType
    },
    {
      type: "instruction",
      cardImage: TextResource,
      stimulus: "",
      data: {
        title: "Text",
        type: questionType.TEXT,
        heading: "",
        content: "",
        uiStyle: {}
      },
      onSelectQuestionType
    },
    {
      type: "math",
      cardImage: MTFormula,
      stimulus: "",
      data: {
        title: questionTitle.EXPRESSION_AND_FORMULA,
        isMath: true,
        stimulus: "",
        type: questionType.MATH,
        validation: {
          scoringType: "exactMatch",
          validResponse: {
            score: 1,
            value: [
              {
                method: math.methods.EQUIV_SYMBOLIC,
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
          type: "floating-keyboard",
          responseFontScale: "Normal (100%)"
        },
        numberPad: defaultNumberPad,
        symbols: ["basic", "units_us", "units_si"],
        template: EMBED_RESPONSE,
        templateDisplay: false,
        hints: [{ value: uuids[0], label: "" }]
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
                method: math.methods.EQUIV_SYMBOLIC,
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
          heightpx: 35,
          type: "floating-keyboard",
          responseFontScale: "Normal (100%)"
        },
        numberPad: defaultNumberPad,
        symbols: ["basic", "qwerty"],
        hints: [{ value: uuids[0], label: "" }]
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
        template: `${EMBED_RESPONSE}+${EMBED_RESPONSE}=${EMBED_RESPONSE}`,
        templateDisplay: true,
        type: questionType.MATH,
        validation: {
          scoringType: "exactMatch",
          validResponse: {
            score: 1,
            value: [
              {
                method: math.methods.EQUIV_SYMBOLIC,
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
          type: "floating-keyboard",
          responseFontScale: "Normal (100%)"
        },
        numberPad: defaultNumberPad,
        symbols: ["basic", "qwerty"],
        hints: [{ value: uuids[0], label: "" }]
      },
      onSelectQuestionType
    },
    {
      type: "math",
      cardImage: MTText,
      stimulus: "",
      data: {
        title: questionTitle.EQUATION_AND_INEQUALITIES,
        isMath: true,
        responseContainers: [
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
                method: math.methods.EQUIV_SYMBOLIC,
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
          type: "floating-keyboard",
          responseFontScale: "Normal (100%)"
        },
        numberPad: defaultNumberPad,
        symbols: ["basic", "qwerty"],
        hints: [{ value: uuids[0], label: "" }]
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
        template: `\\begin{bmatrix}4&0\\\\1&-9\\end{bmatrix}\\times\\begin{bmatrix}3\\\\4\\end{bmatrix}=${EMBED_RESPONSE}`,
        templateDisplay: true,
        type: questionType.MATH,
        validation: {
          scoringType: "exactMatch",
          validResponse: {
            score: 1,
            value: [
              {
                method: math.methods.EQUIV_SYMBOLIC,
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
          type: "floating-keyboard",
          responseFontScale: "Normal (100%)"
        },
        numberPad: defaultNumberPad,
        symbols: ["basic", "intermediate", "general"],
        hints: [{ value: uuids[0], label: "" }]
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
                method: math.methods.EQUIV_SYMBOLIC,
                options: {
                  inverseResult: false
                },
                value: ""
              }
            ]
          }
        },
        customKeys: ["m", "km", "cm", "mm"],
        uiStyle: {
          widthpx: 140,
          heightpx: 36,
          type: "floating-keyboard",
          responseFontScale: "Normal (100%)"
        },
        numberPad: defaultNumberPad,
        symbols: ["units_us", "units_si", "qwerty"],
        hints: [{ value: uuids[0], label: "" }]
      },
      onSelectQuestionType
    },
    {
      type: "math",
      cardImage: MTEssay,
      stimulus: "",
      data: {
        title: "Math Essay",
        stimulus: "",
        type: questionType.FORMULA_ESSAY,
        uiStyle: {
          defaultMode: "math",
          fontsize: "Normal",
          textFormattingOptions: ["bold", "italic", "underline", "unorderedList"],
          responseFontScale: "Normal (100%)"
        },
        validation: {
          validResponse: {
            score: 1
          }
        },
        numberPad: defaultNumberPad,
        metadata: {},
        isMath: true,
        symbols: ["intermediate"],
        hints: [{ value: uuids[0], label: "" }]
      },
      onSelectQuestionType
    },
    {
      type: ["fill-blanks", "math", "multipart"],
      cardImage: MTCombinationClozeText,
      stimulus: "",
      data: {
        title: "Math, Text & Dropdown",
        stimulus:
          '<p>Sample question -&nbsp;<textinput contenteditable="false"></textinput>&nbsp;,&nbsp;<textdropdown contenteditable="false"></textdropdown>&nbsp;,&nbsp;<mathinput contenteditable="false"></mathinput>&nbsp;,&nbsp;<mathunit contenteditable="false"></mathunit>&nbsp;</p>',
        templateDisplay: true,
        type: questionType.EXPRESSION_MULTIPART,
        responseIds: {
          inputs: [],
          maths: [],
          dropDowns: []
        },
        responseContainer: {
          template: ""
        },
        uiStyle: {
          type: "floating-keyboard",
          minWidth: 140,
          minHeight: 35
        },
        options: {},
        validation: {
          scoringType: "exactMatch",
          mixAndMatch: true,
          validResponse: {
            score: 1,
            value: [
              [
                {
                  method: math.methods.EQUIV_SYMBOLIC,
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
        responseContainers: [],
        symbols: ["basic", "qwerty"],
        numberPad: defaultNumberPad,
        hints: [{ value: uuids[0], label: "" }]
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
      type: "graphing",
      cardImage: GRFractionEditor,
      stimulus: "",
      data: {
        title: "Fraction Editor",
        type: "fractionEditor",
        annotation: [
          {
            antnPosition: "absolute",
            antnHeight: "",
            antnId: "229d3a7b-3ed6-19e9-0a28-2fcd07c4ce44",
            antnTop: "32.1px",
            antnContent:
              '<div id="dragged-ans-choice" class="drag-ans wrap-text" style="width:120px;height:80px;padding-top:10px;">Annotation added</div>',
            antnLeft: "38.4px",
            antnWidth: "",
            antnclass: "wrap-text annotation-dropped",
            antnZindex: 10
          }
        ],
        validation: {
          validResponse: {
            score: 1,
            value: 1
          }
        },
        commonparameters: {
          allowedVariables: {
            fields: []
          },
          solution: {
            fields: [
              {
                value: "",
                key: "solution"
              }
            ]
          },
          advancedOptions: {
            fields: []
          },
          hint: {
            fields: [
              {
                value: "",
                key: "hint"
              }
            ]
          },
          writeboard: {
            fields: [
              {
                value: "No",
                key: "writeboard"
              }
            ]
          },
          handlingComma: {
            fields: []
          },
          mathtoolbar: {
            fields: []
          },
          points: {
            fields: [
              {
                value: null,
                key: "points"
              }
            ]
          }
        },
        fractionProperties: {
          count: 1,
          fractionType: "rectangles",
          rows: 2,
          columns: 2,
          sectors: 7,
          selected: [1]
        },
        hints: [{ value: uuids[0], label: "Hint A" }]
      },
      onSelectQuestionType
    },
    {
      type: "other",
      cardImage: MCBlockLayout,
      data: {
        title: "Coding",
        type: questionType.CODING,
        stimulus: "",
        stimulusTitle: "",
        languages: [{ label: "JAVASCRIPT", lang: "javascript" }],
        uiStyle: {
          type: "standard"
        },
        codeStubs: [],
        testCaseEvaluationType: "auto",
        testCases: [],
        solutions: [],
        layout: "left/right",
        editorConfig: {
          theme: "github",
          fontSize: 14,
          tabSize: 2,
          autoComplete: true,
          readOnly: false,
          keyboardHandler: "sublime"
        }
      },
      onSelectQuestionType
    }
  ];
  return isPassage ? cards.filter(i => !i.isPassageType) : cards;
};
