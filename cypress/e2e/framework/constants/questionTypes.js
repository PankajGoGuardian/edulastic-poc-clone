export const questionType = {
  MCQ_STD: "Multiple choice - standard",
  MCQ_TF: "True or false",
  MCQ_MULTI: "Multiple choice - multiple response",
  MCQ_BLOCK: "Multiple choice - block layout",
  CHOICE_STD: "Choice matrix - standard",
  CHOICE_INLINE: "Choice matrix - inline",
  CHOICE_LABEL: "Choice matrix - labels",
  CLOZE_DRAG_DROP: "Cloze with Drag & Drop",
  CLOZE_DROP_DOWN: "Cloze with Drop Down",
  CLOZE_TEXT: "Cloze with Text",
  IMAGE_DRAG_DROP: "Label Image with Drag & Drop",
  IMAGE_DROP_DOWN: "Label Image with Drop Down",
  IMAGE_TEXT: "Label Image with Text",
  SORT_LIST: "Sort List",
  CLASSIFICATION: "Classification",
  MATCH_LIST: "Match list",
  ORDERLIST: "OrderList",
  ESSAY_RICH: "Essay with rich text",
  ESSAY_PLAIN: "Essay with plain text",
  ESSAY_SHORT: "Short text",
  PASSAGE_MULTIPART: "Passage with Multiple parts",
  PASSAGE_QUE: "Passage with Questions"
};

export const questionTypeKey = {
  MULTIPLE_CHOICE_STANDARD: "MCQ_STD",
  TRUE_FALSE: "MCQ_TF",
  MULTIPLE_CHOICE_MULTIPLE: "MCQ_MULTI",
  MULTIPLE_CHOICE_BLOCK: "MCQ_BLOCK",
  CHOICE_MATRIX_STANDARD: "CHOICE_STD",
  CHOICE_MATRIX_INLINE: "CHOICE_INLINE",
  CHOICE_MATRIX_LABEL: "CHOICE_LABEL"
};

export const attemptTypes = {
  RIGHT: "right",
  WRONG: "wrong",
  SKIP: "skip",
  PARTIAL_CORRECT: "partialCorrect",
  NO_ATTEMPT: "noattempt"
};

export const queColor = {
  RIGHT: "rgb(94, 181, 0)",
  WRONG: "rgb(243, 95, 95)",
  SKIP: "rgb(106, 115, 127)",
  NO_ATTEMPT: "rgb(229, 229, 229)",
  YELLOW: "rgb(253, 204, 59)",
  GREEN: "rgb(23, 116, 240)",
  CLEAR_DAY: "rgb(225, 251, 242)",
  LIGHT_GREEN: "rgba(0, 173, 80, 0.19)",
  LIGHT_RED: "rgba(238, 22, 88, 0.15)",
  GREEN_1: "rgb(66, 209, 132)"
};

export const questionGroup = {
  MCQ: "Multiple Choice",
  FILL_IN_BLANK: "Fill in the Blanks",
  CLASSIFICATION: "Classify, Match & Order",
  READ: "Reading & Comprehension",
  HIGHLIGHT: "Highlight",
  MATH: "Math",
  GRAPH: "Graphing",
  CHART: "Charts",
  CHEM: "Chemistry",
  MULTI: "Multipart",
  VID: "Video & Text",
  RULER: "Rulers & Calculators",
  OTHER: "Other"
};

export const questionTypeMap = {
  "Multiple Choice": [
    "Multiple choice - standard",
    "True or false",
    "Multiple choice - multiple response",
    "Multiple choice - block layout",
    "Choice matrix - standard",
    "Choice matrix - inline",
    "Choice matrix - labels"
  ],
  "Fill in the Blanks": [
    "Cloze with Drag & Drop",
    "Cloze with Drop Down",
    "Cloze with Text",
    "Label Image with Drag & Drop",
    "Label Image with Drop Down",
    "Label Image with Text"
  ],
  "Classify, Match & Order": ["Sort List", "Classification", "Match list", "OrderList"],
  "Reading & Comprehension": [
    "Essay with rich text",
    "Essay with plain text",
    "Short text",
    "Passage with Multiple parts",
    "Passage with Questions"
  ],
  Highlight: ["Highlight Image", "Shading", "Hotspot", "Token highlight"],
  Math: [
    "Expression & Formula",
    "Numeric Entry",
    "Complete the Equation",
    "Equations & Inequalities",
    "Matrices",
    "Units",
    "Math essay"
  ],
  Graphing: [
    "Graphing",
    "Graphing in the 1st quadrant",
    "Graph Placement",
    "Number line with plot",
    "Number line with drag & drop",
    "Fraction Editor"
  ],
  Charts: ["Line plot", "Dot plot", "Histogram", "Bar chart", "Line chart"],
  Chemistry: [],
  Multipart: ["Math, Text & Dropdown"],
  "Video & Text": ["Video"],
  "Rulers & Calculators": ["Protractor"],
  Other: []
};
