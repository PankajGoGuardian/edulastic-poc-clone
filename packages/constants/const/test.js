module.exports = {
  type: {
    ASSESSMENT: "assessment",
    PRACTICE: "practice"
  },
  settingCategories: [
    { id: "test-type", title: "Test Type" },
    { id: "mark-as-done", title: "Mark as Done" },
    { id: "release-scores", title: "Release Scores Automatically" },
    { id: "require-safe-exame-browser", title: "Require Safe Exame Browser" },
    { id: "show-questions", title: "Release Answers with Grades" },
    { id: "suffle-question", title: "Suffle Question" },
    { id: "show-answer-choice", title: "Show Answer Choice" },
    { id: "show-calculator", title: "Show Calculator" },
    { id: "answer-on-paper", title: "Answer on Paper" },
    { id: "require-password", title: "Require Password" },
    { id: "evaluation-method", title: "Evaluation Method" },
    { id: "performance-bands", title: "Performance Bands" },
    { id: "title", title: "Title" },
    { id: "navigations", title: "Navigations / Control" },
    { id: "accessibility", title: "Accessibility" },
    { id: "ui-time", title: "UI / Time" },
    { id: "administration", title: "Administration" }
  ],
  performanceBandsData: {
    ADVANCED: {
      bands: "Advanced",
      from: "100%"
    },
    MASTERY: {
      bands: "Mastery",
      from: "100%"
    },
    BASIC: {
      bands: "Basic",
      from: "100%"
    },
    APPROACHING_BASIC: {
      bands: "Approaching Basic",
      from: "100%"
    },
    UNSATISFACTORY: {
      bands: "Unsatisfactory",
      from: "100%"
    }
  },
  navigations: [
    "Intro Item",
    "Outro Item",
    "Previous",
    "Next",
    "Pause",
    "Save",
    "Submit",
    "Fullscreen",
    "Response Masking",
    "TOC Item Count",
    "Calculator",
    "Submit Criteria",
    "Warning if question not attempted",
    "Confirmation windows on submit",
    "Scroll to test element on test start",
    "Scroll to top on item change",
    "Exit Secure Browser",
    "Acknowledgements",
    "Table of Contents"
  ],
  completionTypes: { AUTOMATICALLY: "Automatically", MANUALLY: "Manually" },
  releaseGradeTypes: {
    DONT_RELEASE: "Do not release scores or responses",
    SCORE_ONLY: "Release scores only",
    WITH_RESPONSE: "Release scores and student responses",
    WITH_ANSWERS: "Release scores,student responses and correct answers"
  },
  releaseGradeLabels: {
    DONT_RELEASE: "DONT_RELEASE",
    SCORE_ONLY: "SCORE_ONLY",
    WITH_RESPONSE: "WITH_RESPONSE",
    WITH_ANSWERS: "WITH_ANSWERS"
  },
  calculators: {
    NONE: "None",
    SCIENTIFIC: "Scientific",
    BASIC: "Basic",
    GRAPHING: "Graphing"
  },
  calculatorKeys: ["NONE", "SCIENTIFIC", "BASIC", "GRAPHING"],
  calculatorTypes: {
    NONE: "NONE",
    SCIENTIFIC: "SCIENTIFIC",
    BASIC: "BASIC",
    GRAPHING: "GRAPHING"
  },
  evalTypes: {
    ALL_OR_NOTHING: "All or Nothing",
    PARTIAL_CREDIT: "Partial Credit"
  },
  accessibilities: {
    SHOW_COLOUR_SHCEME: "Show Colour Scheme",
    SHOW_FONT_SIZE: "Show Font Size",
    SHOW_ZOOM: "Show Zoom"
  }
};
