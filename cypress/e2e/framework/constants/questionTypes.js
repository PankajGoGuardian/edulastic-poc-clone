export const questionType = {
  MCQ_STD: "Multiple Choice - Standard",
  MCQ_TF: "True or False",
  MCQ_MULTI: "Multiple Choice - Multiple Response",
  MCQ_BLOCK: "Multiple Choice - Block Layout",
  CHOICE_STD: "Choice Matrix - Standard",
  CHOICE_INLINE: "Choice Matrix - Inline",
  CHOICE_LABEL: "Choice Matrix - Labels",
  CLOZE_DRAG_DROP: "Cloze with Drag & Drop",
  CLOZE_DROP_DOWN: "Cloze with Drop Down",
  CLOZE_TEXT: "Cloze with Text",
  IMAGE_DRAG_DROP: "Label Image with Drag & Drop",
  IMAGE_DROP_DOWN: "Label Image with Drop Down",
  IMAGE_TEXT: "Label Image with Text",
  SORT_LIST: "Sort List",
  CLASSIFICATION: "Classification",
  MATCH_LIST: "Match List",
  ORDERLIST: "Order List",
  ESSAY_RICH: "Essay with Rich Text",
  ESSAY_PLAIN: "Essay with Plain Text",
  ESSAY_SHORT: "Short Text",
  PASSAGE_MULTIPART: "Passage with Multiple Parts",
  PASSAGE_QUE: "Passage with Questions",
  COMBINATION_MULTIPART: "Combination Multipart",
  MATH: "Math, Text & Dropdown"
};

export const questionTypeKey = {
  MULTIPLE_CHOICE_STANDARD: "MCQ_STD",
  TRUE_FALSE: "MCQ_TF",
  MULTIPLE_CHOICE_MULTIPLE: "MCQ_MULTI",
  MULTIPLE_CHOICE_BLOCK: "MCQ_BLOCK",
  CHOICE_MATRIX_STANDARD: "CHOICE_STD",
  CHOICE_MATRIX_INLINE: "CHOICE_INLINE",
  CHOICE_MATRIX_LABEL: "CHOICE_LABEL",
  CLOZE_TEXT: "CLOZE_TEXT",
  CLOZE_DROP_DOWN: "CLOZE_DROPDOWN",
  ESSAY_RICH: "ESSAY_RICH",
  CLOZE_DRAG_DROP: "CLOZE_DRAG_DROP"
};

export const attemptTypes = {
  RIGHT: "right",
  WRONG: "wrong",
  SKIP: "skip",
  PARTIAL_CORRECT: "partialCorrect",
  NO_ATTEMPT: "noattempt",
  MANUAL_GRADE: "manualGrade"
};

export const deliverType = {
  ALL: "ALL",
  LIMITED_RANDOM: "LIMITED_RANDOM",
  ALL_RANDOM: "ALL_RANDOM"
};

export const queColor = {
  RIGHT: "rgb(94, 181, 0)",
  WRONG: "rgb(243, 95, 95)",
  SKIP: "rgb(106, 115, 127)",
  NO_ATTEMPT: "rgb(229, 229, 229)",
  MANUAL_GRADE: "rgb(56, 150, 190)",
  YELLOW: "rgb(253, 204, 59)",
  CLEAR_DAY: "rgb(225, 251, 242)",
  PLAIN_RED: "rgb(255, 0, 0)",
  RED: "rgb(255, 0, 87)",
  RED_2: "rgb(253, 224, 233)",
  LIGHT_RED: "rgb(252, 224, 232)",
  LIGHT_RED1: "rgb(250, 225, 233)",
  RED_1: "rgb(221, 46, 68)",
  PLAIN_GREEN: "rgb(0, 128, 0)",
  GREEN: "rgb(23, 116, 240)",
  GREEN_1: "rgb(0, 173, 80)",
  GREEN_2: "rgb(26, 179, 148)",
  GREEN_3: "rgb(135, 138, 145)",
  GREEN_4: "rgb(222, 244, 232)",
  GREEN_5: "rgb(61, 176, 78)",
  GREEN_6: "rgb(66, 209, 132)",
  LIGHT_GREEN: "rgb(211, 254, 166)",
  LIGHT_GREEN1: "rgba(31, 227, 161, 0.118)",
  LIGHT_GREY: "rgb(211, 211, 211)",
  GREY: "rgb(74, 180, 149)",
  GREY_1: "rgb(229, 229, 229)",
  GREY_2: "rgb(248, 248, 248)",
  BLUE: "rgba(26, 179, 148, 0.5)",
  BLUE_1: "rgb(87, 107, 169)",
  WHITE: "rgb(255, 255, 255)",
  WHITE_1: "rgb(248, 248, 248)",
  ORANGE: "rgb(255, 165, 0)",
  ORANGE_1: "rgb(243, 147, 0)",
  ORANGE_2: "rgb(255, 233, 168)",
  ORANGE_3: "rgb(251, 250, 224)"
};

export const questionGroup = {
  MCQ: "Multiple Choice",
  FILL_IN_BLANK: "Fill in the Blanks",
  CLASSIFICATION: "Classify, Match & Order",
  WRITING: "Writing",
  READING: "Reading",
  HIGHLIGHT: "Highlight",
  MATH: "Math",
  GRAPH: "Graphing",
  CHART: "Charts",
  MULTI: "Multipart",
  VID: "Video & Text",
  RULER: "Rulers & Calculators",
  OTHER: "Other"
};

export const CALCULATOR = {
  BASIC: "BASIC",
  SCIENTIFIC: "SCIENTIFIC",
  GRAPH: "GRAPHING"
};

export const COLLECTION = {
  school: "School Library",
  district: "District Library",
  private: "Private Library",
  public: "Public Library"
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
  Writing: ["Essay with rich text", "Essay with plain text", "Short text"],
  Reading: ["Passage with Multiple parts", "Passage with Questions"],
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
