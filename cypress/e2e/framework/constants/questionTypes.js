export const questionType = {
  MCQ_STD: "Multiple choice - standard",
  MCQ_TF: "True or false",
  MCQ_MULTI: "Multiple choice - multiple response",
  MCQ_BLOCK: "Multiple choice - block layout",
  CHOICE_STD: "Choice matrix - standard",
  CHOICE_INLINE: "Choice matrix - inline",
  CHOICE_LABEL: "Choice matrix - labels"
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
  PARTIAL_CORRECT: "partialCorrect"
};

export const queColor = {
  RIGHT: "rgb(94, 181, 0)",
  WRONG: "rgb(243, 95, 95)",
  SKIP: "rgb(229, 229, 229)",
  BLUE: "rgb(23, 116, 240)",
  CLEAR_DAY: "rgb(225, 251, 242)"
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
  Multipart: ["Math, Text & Dropdown", "Combination Multipart"],
  "Video & Text": ["Video"],
  "Rulers & Calculators": ["Protractor"],
  Other: []
};
