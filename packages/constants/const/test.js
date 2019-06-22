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
    { id: "suffle-question", title: "Shuffle Questions" },
    { id: "show-answer-choice", title: "Shuffle Answer Choice" },
    { id: "show-calculator", title: "Show Calculator" },
    { id: "answer-on-paper", title: "Answer on Paper" },
    { id: "require-password", title: "Require Password" },
    { id: "check-answer-tries-per-question", title: "Check Answer Tries Per Question" },
    { id: "evaluation-method", title: "Evaluation Method" },
    { id: "performance-bands", title: "Performance Bands" },
    { id: "title", title: "Title" },
    { id: "navigations", title: "Navigations / Control" },
    { id: "accessibility", title: "Accessibility" },
    { id: "ui-time", title: "UI / Time" },
    { id: "administration", title: "Administration" }
  ],
  settingCategoriesFeatureMap: {
    "test-type": "free",
    "mark-as-done": "assessmentSuperPowersMarkAsDone",
    "release-scores": "free",
    "require-safe-exame-browser": "assessmentSuperPowersRequireSafeExamBrowser",
    // below "show-questions" is sth that I dont know and is not rendered in the settings so havent render it on the feature map by making it undefined
    "show-questions": "undefined",
    "suffle-question": "assessmentSuperPowersShuffleQuestions",
    "show-answer-choice": "assessmentSuperPowersShuffleAnswerChoice",
    "show-calculator": "assessmentSuperPowersShowCalculator",
    "answer-on-paper": "assessmentSuperPowersAnswerOnPaper",
    "require-password": "assessmentSuperPowersRequirePassword",
    "evaluation-method": "assessmentSuperPowersEvaluationMethod",
    "check-answer-tries-per-question": "assessmentSuperPowersCheckAnswerTries",
    "performance-bands": "performanceBands"
  },
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
  completionTypes: { AUTOMATICALLY: "automatically", MANUALLY: "manually" },
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
  evalTypeLabels: {
    ALL_OR_NOTHING: "ALL_OR_NOTHING",
    PARTIAL_CREDIT: "PARTIAL_CREDIT"
  },
  accessibilities: {
    SHOW_COLOUR_SHCEME: "Show Color Scheme",
    SHOW_FONT_SIZE: "Show Font Size",
    SHOW_ZOOM: "Show Zoom"
  },
  collectionDefaultFilter: [
    { text: "All Collections", value: "" },
    { text: "Private Library", value: "INDIVIDUAL" },
    { text: "School Library", value: "SCHOOL" },
    { text: "District Library", value: "DISTRICT" },
    { text: "Public Library", value: "PUBLIC" },
    { text: "Edulastic Certified", value: "EDULASTIC" }
  ]
};
