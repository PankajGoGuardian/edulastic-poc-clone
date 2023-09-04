const questionTitle = require('./questionTitle')
const { AUDIO_RESPONSE: audioResponseTitleText } = require('./questionTitle')

const ALL_QUESTION_TYPES = ''
const SHORT_TEXT = 'shortText'
const ESSAY_PLAIN_TEXT = 'essayPlainText'
const ESSAY = 'essay'
const ESSAY_RICH_TEXT = 'essayRichText'
const CHOICE_MATRIX = 'choiceMatrix'
const SORT_LIST = 'sortList'
const MATCH_LIST = 'matchList'
const CLASSIFICATION = 'classification'
const CLOZE_DRAG_DROP = 'clozeDragDrop'
const CLOZE_IMAGE_DRAG_DROP = 'clozeImageDragDrop'
const CLOZE_IMAGE_DROP_DOWN = 'clozeImageDropDown'
const CLOZE_IMAGE_TEXT = 'clozeImageText'
const PROTRACTOR = 'protractor'
const PASSAGE = 'passage'
const VIDEO = 'video'
const TEXT = 'text'
const MATH = 'math'
const FORMULA_ESSAY = 'formulaessay'
const CLOZE_MATH = 'clozemath'
const EXPRESSION_MULTIPART = 'expressionMultipart'
const COMBINATION_MULTIPART = 'combinationMultipart'
const PASSAGE_WITH_QUESTIONS = 'passageWithQuestions'
const ORDER_LIST = 'orderList'
const MULTIPLE_CHOICE = 'multipleChoice'
const CLOZE_TEXT = 'clozeText'
const CLOZE_DROP_DOWN = 'clozeDropDown'
const EDITING_TASK = 'editingTask'
const TOKEN_HIGHLIGHT = 'tokenhighlight'
const HOTSPOT = 'hotspot'
const SHADING = 'shading'
const HIGHLIGHT_IMAGE = 'highlightImage'
const UPLOAD_FILE = 'uploadFile'
const DRAWING = 'drawing'
const LINE_CHART = 'line'
const BAR_CHART = 'bar'
const HISTOGRAM = 'histogram'
const DOT_PLOT = 'dots'
const LINE_PLOT = 'linePlot'
const GRAPH = 'graph'
const FRACTION_EDITOR = 'fractionEditor'
const TRUE_OR_FALSE = 'trueOrFalse'
const SECTION_LABEL = 'sectionLabel'
const CODING = 'coding'
const MATH_EXPRESSION = 'mathExpression'
const MATH_NUMERIC = 'mathNumeric'
const MATH_EQUATION = 'mathEquation'
const MATH_MATRICES = 'mathMatrices'
const MATH_NUMERIC_UNITS = 'mathNumericUnits'
const MATH_ESSAY = 'mathEssay'
const NUMBER_LINE = 'numberLIne'
const LINE_AND_DOT_PLOT = 'lineAndDotPlot'
const BAR_AND_LINE_CHART = 'barAndLineChart'
const MULTIPLE_SELECTION = 'multipleSelection'
const GRAPH_PLACEMENT = 'graphPlacement'
const RANGE_PLOTTER = 'rangePlotter'
const MULTIPART = 'multipart'
const PICTOGRAPH = 'pictograph'
const AUDIO_RESPONSE = 'audioResponse'
const VISUAL_PROGRAMMING = 'visualProgramming'

const selectsData = [
  { value: ALL_QUESTION_TYPES, text: 'All Types' },
  { value: SHORT_TEXT, text: 'Short Text' },
  { value: ESSAY, text: 'Essay' },
  { value: CHOICE_MATRIX, text: 'Matching Table' },
  { value: SORT_LIST, text: 'Sort List' },
  { value: MATCH_LIST, text: 'Match the following' },
  { value: CLASSIFICATION, text: 'Classification' },
  { value: CLOZE_DRAG_DROP, text: 'Drag & Drop' },
  { value: CLOZE_IMAGE_DRAG_DROP, text: 'Label Image Drag & Drop' },
  { value: CLOZE_IMAGE_DROP_DOWN, text: 'Label Image Drop Down' },
  { value: CLOZE_IMAGE_TEXT, text: 'Label Image Text' },
  { value: PROTRACTOR, text: 'Protractor' },
  { value: PASSAGE, text: 'Passage' },
  { value: VIDEO, text: 'Video' },
  { value: TEXT, text: 'Text' },
  { value: MATH, text: 'Math' },
  { value: FORMULA_ESSAY, text: 'Formula Essay' },
  { value: PASSAGE_WITH_QUESTIONS, text: 'Passage with Questions' },
  { value: CLOZE_MATH, text: 'Cloze Math' },
  { value: EXPRESSION_MULTIPART, text: 'Expression Multipart' },
  { value: ORDER_LIST, text: 'Re-sequence' },
  { value: MULTIPLE_CHOICE, text: 'Multiple Choice' },
  { value: CLOZE_TEXT, text: 'Text Entry' },
  { value: CLOZE_DROP_DOWN, text: 'Text Drop Down' },
  { value: EDITING_TASK, text: 'Editing Task' },
  { value: TOKEN_HIGHLIGHT, text: 'Sentence Response' },
  { value: HOTSPOT, text: 'Hotspot' },
  { value: SHADING, text: 'Shading' },
  { value: HIGHLIGHT_IMAGE, text: 'Drawing Response' },
  { value: UPLOAD_FILE, text: 'Upload File' },
  { value: LINE_CHART, text: 'Line Chart' },
  { value: BAR_CHART, text: 'Bar Chart' },
  { value: HISTOGRAM, text: 'Histogram' },
  { value: GRAPH, text: 'Graphing' },
  { value: COMBINATION_MULTIPART, text: 'Combination Multipart' },
  { value: TRUE_OR_FALSE, text: 'True or False' }, // TestItem type = multipleChoice
  { value: MATH_EXPRESSION, text: 'Math - Expression' },
  { value: MATH_NUMERIC, text: 'Math - Numeric' },
  { value: MATH_EQUATION, text: 'Math - Equation' },
  { value: MATH_MATRICES, text: 'Math - Matrices' },
  { value: MATH_NUMERIC_UNITS, text: 'Math - Numeric w/ units' },
  { value: MATH_ESSAY, text: 'Math - Essay' },
  { value: NUMBER_LINE, text: 'Number Line' },
  { value: LINE_AND_DOT_PLOT, text: 'Line & Dot Plot' },
  { value: BAR_AND_LINE_CHART, text: 'Bar & Line Chart' },
  { value: GRAPH_PLACEMENT, text: 'Graph Placement' },
  { value: MULTIPLE_SELECTION, text: 'Multiple Selection' },
  { value: RANGE_PLOTTER, text: 'Range Plotter' },
  { value: MULTIPART, text: 'Multipart' },
  { value: AUDIO_RESPONSE, text: audioResponseTitleText },
]

const QUE_TYPE_BY_TITLE = {
  [questionTitle.MCQ_TRUE_OR_FALSE]: TRUE_OR_FALSE,
  [questionTitle.MCQ_STANDARD]: MULTIPLE_CHOICE,
  [questionTitle.MCQ_MULTIPLE_RESPONSE]: MULTIPLE_SELECTION,
}

const manuallyGradableQn = [
  FORMULA_ESSAY,
  HIGHLIGHT_IMAGE,
  UPLOAD_FILE,
  ESSAY_RICH_TEXT,
  ESSAY_PLAIN_TEXT,
  AUDIO_RESPONSE,
]

const useLanguageFeatureQn = [
  EXPRESSION_MULTIPART,
  CLOZE_DRAG_DROP,
  CLOZE_DROP_DOWN,
  CLOZE_TEXT,
  CHOICE_MATRIX,
  MATH,
  FORMULA_ESSAY,
  MULTIPLE_CHOICE,
  TOKEN_HIGHLIGHT,
  CLOZE_IMAGE_DRAG_DROP,
  PASSAGE,
  TEXT,
  VIDEO,
  CLASSIFICATION,
  ORDER_LIST,
  CLOZE_IMAGE_DROP_DOWN,
  ESSAY_PLAIN_TEXT,
  ESSAY_RICH_TEXT,
]

const disableEditResponseInEgQuestionTypes = [AUDIO_RESPONSE]

const HIDE_QUESTION_TYPES = [
  ALL_QUESTION_TYPES,
  MULTIPLE_CHOICE,
  MATH,
  PASSAGE_WITH_QUESTIONS,
]

const WIDGET_TYPES = {
  QUESTION: 'question',
}

module.exports = {
  ALL_QUESTION_TYPES,
  SHORT_TEXT,
  DRAWING,
  LINE_CHART,
  ESSAY_PLAIN_TEXT,
  ESSAY_RICH_TEXT,
  CHOICE_MATRIX,
  SORT_LIST,
  MATCH_LIST,
  CLASSIFICATION,
  CLOZE_DRAG_DROP,
  CLOZE_IMAGE_DRAG_DROP,
  CLOZE_IMAGE_DROP_DOWN,
  CLOZE_IMAGE_TEXT,
  PROTRACTOR,
  PASSAGE,
  VIDEO,
  TEXT,
  MATH,
  FORMULA_ESSAY,
  CLOZE_MATH,
  EXPRESSION_MULTIPART,
  ORDER_LIST,
  MULTIPLE_CHOICE,
  CLOZE_TEXT,
  CLOZE_DROP_DOWN,
  TOKEN_HIGHLIGHT,
  HOTSPOT,
  SHADING,
  HIGHLIGHT_IMAGE,
  UPLOAD_FILE,
  BAR_CHART,
  HISTOGRAM,
  DOT_PLOT,
  LINE_PLOT,
  GRAPH,
  selectsData,
  PASSAGE_WITH_QUESTIONS,
  manuallyGradableQn,
  TRUE_OR_FALSE,
  SECTION_LABEL,
  FRACTION_EDITOR,
  EDITING_TASK,
  CODING,
  useLanguageFeatureQn,
  PICTOGRAPH,
  AUDIO_RESPONSE,
  VISUAL_PROGRAMMING,
  disableEditResponseInEgQuestionTypes,
  HIDE_QUESTION_TYPES,
  WIDGET_TYPES,
  MULTIPLE_SELECTION,
  QUE_TYPE_BY_TITLE,
}
