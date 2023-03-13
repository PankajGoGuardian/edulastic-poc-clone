module.exports = {
  settingsList: [
    { id: 'test-type', title: 'Test Type' },
    { id: 'maximum-attempts-allowed', title: 'Maximum Attempts Allowed' },
    { id: 'mark-as-done', title: 'Mark as Done' },
    { id: 'release-scores', title: 'Release Scores' },
    { id: 'require-safe-exame-browser', title: 'Safe Exam Browser' },
    { id: 'show-questions', title: 'Release Answers with Grades' },
    { id: 'suffle-question', title: 'Shuffle Questions' },
    { id: 'show-answer-choice', title: 'Shuffle Answer Choice' },
    { id: 'show-calculator', title: 'Show Calculator' },
    { id: 'answer-on-paper', title: 'Answer on Paper' },
    { id: 'require-password', title: 'Require Password' },
    { id: 'restrict-navigation-out', title: 'Restrict Navigation Out of Test' },
    {
      id: 'restrict-back-navigation',
      title: ' Restrict Navigation To Previously Answered Questions',
    },
    {
      id: 'check-answer-tries-per-question',
      title: 'Check Answer Tries Per Question',
    },
    { id: 'evaluation-method', title: 'Evaluation Method' },
    { id: 'timed-test', title: 'Timed Test' },
    {
      id: 'test-content-visibility',
      title: 'Item content visibility to Teachers',
      adminFeature: true,
    },
    { id: 'performance-bands', title: 'Performance Bands' },
    { id: 'standards-proficiency', title: 'Standards Proficiency' },
    { id: 'player-skin-type', title: 'Student Player Skin' },
    { id: 'accessibility', title: 'Accessibility' },
    { id: 'title', title: 'Title' },
    { id: 'navigations', title: 'Navigations / Control' },
    { id: 'ui-time', title: 'UI / Time' },
    { id: 'administration', title: 'Administration' },
  ],
  settingCategories: [
    {
      id: 'test-behavior',
      title: 'Test Behavior',
      type: 'settings-category',
    },
    {
      id: 'student-tools',
      title: 'Student Tools',
      type: 'student-tools',
    },
    {
      id: 'anti-cheating',
      title: 'Anti-Cheating',
      type: 'settings-category',
    },
    {
      id: 'miscellaneous',
      title: 'Miscellaneous',
      type: 'settings-category',
    },
  ],
  accessibilitySettings: {
    magnifier: {
      key: 'showMagnifier',
      id: 'magnifier-setting',
    },
    scratchPad: {
      key: 'enableScratchpad',
      id: 'scratchpad-setting',
    },
    skipAlert: {
      key: 'enableSkipAlert',
      id: 'skip-alert',
    },
    immersiveReader: { key: 'showImmersiveReader', id: 'immersive-reader' },
  },
  settingCategoriesFeatureMap: {
    'test-type': 'selectTestType',
    'player-skin-type': 'selectPlayerSkinType',
    'maximum-attempts-allowed': 'maxAttemptAllowed',
    'mark-as-done': 'assessmentSuperPowersMarkAsDone',
    'release-scores': 'releaseScore',
    'require-safe-exame-browser': 'assessmentSuperPowersRequireSafeExamBrowser',
    // below "show-questions" is sth that I dont know and is not rendered in the settings so havent render it on the feature map by making it undefined
    'show-questions': 'undefined',
    'suffle-question': 'assessmentSuperPowersShuffleQuestions',
    'show-answer-choice': 'assessmentSuperPowersShuffleAnswerChoice',
    'show-calculator': 'assessmentSuperPowersShowCalculator',
    'answer-on-paper': 'assessmentSuperPowersAnswerOnPaper',
    'require-password': 'assessmentSuperPowersRequirePassword',
    'evaluation-method': 'assessmentSuperPowersEvaluationMethod',
    'timed-test': 'assessmentSuperPowersTimedTest',
    'check-answer-tries-per-question': 'assessmentSuperPowersCheckAnswerTries',
    'performance-bands': 'performanceBands',
    'add-instruction': 'testInstructions',
    'restrict-back-navigation': 'assessmentSuperPowersRestrictQuestionBackNav',
  },
  navigations: [
    'Intro Item',
    'Outro Item',
    'Previous',
    'Next',
    'Pause',
    'Save',
    'Submit',
    'Fullscreen',
    'Response Masking',
    'TOC Item Count',
    'Calculator',
    'Submit Criteria',
    'Warning if question not attempted',
    'Confirmation windows on submit',
    'Scroll to test element on test start',
    'Scroll to top on item change',
    'Exit Secure Browser',
    'Acknowledgements',
    'Table of Contents',
  ],
  completionTypes: { AUTOMATICALLY: 'automatically', MANUALLY: 'manually' },
  releaseGradeTypes: {
    DONT_RELEASE: 'Do not release scores or responses',
    SCORE_ONLY: 'Release scores only',
    WITH_RESPONSE: 'Release scores and student responses',
    WITH_ANSWERS: 'Release scores, student responses and correct answers',
  },
  releaseGradeLabels: {
    DONT_RELEASE: 'DONT_RELEASE',
    SCORE_ONLY: 'SCORE_ONLY',
    WITH_RESPONSE: 'WITH_RESPONSE',
    WITH_ANSWERS: 'WITH_ANSWERS',
  },
  calculators: {
    BASIC: { id: 'BASIC', text: 'Basic' },
    SCIENTIFIC: { id: 'SCIENTIFIC', text: 'Scientific' },
    GRAPHING: {
      id: 'GRAPHING',
      text: 'Graphing (Desmos Standard Version)',
      homeText: 'Graphing',
    },
    GRAPHING_STATE: {
      id: 'GRAPHING_STATE',
      text: 'Graphing (Desmos State Test Version)',
      stateVersionOnly: true,
    },
  },
  DEFAULT_CALC_TYPES: [],
  evalTypes: {
    ALL_OR_NOTHING: 'All or nothing',
    PARTIAL_CREDIT: 'Partial credit',
    PARTIAL_CREDIT_IGNORE_INCORRECT:
      "Partial credit (don't penalize for incorrect selection)",
    ITEM_LEVEL_EVALUATION: 'Consider item level evaluation',
  },
  evalTypeLabels: {
    ALL_OR_NOTHING: 'ALL_OR_NOTHING',
    PARTIAL_CREDIT: 'PARTIAL_CREDIT',
    PARTIAL_CREDIT_IGNORE_INCORRECT: 'PARTIAL_CREDIT_IGNORE_INCORRECT', // Bakecnd doesn't require this key value
    ITEM_LEVEL_EVALUATION: 'ITEM_LEVEL_EVALUATION',
  },
  evalTypeValues: {
    ALL_OR_NOTHING: 'All or Nothing',
    PARTIAL_CREDIT: 'Partial Credit',
    partialMatch: 'Partial Match',
    exactMatch: 'Exact Match',
    ManualGrading: 'Manual Grading',
    anyCorrect: 'Any can be Correct',
    firstCorrectMust: 'First must be Correct',
    allCorrectMust: 'All must be Correct',
    PARTIAL_CREDIT_EBSR: 'Partial Credit (EBSR)',
  },
  accessibilities: {
    // SHOW_COLOUR_SHCEME: "Show Color Scheme",
    // SHOW_FONT_SIZE: "Show Font Size",
    // SHOW_ZOOM: "Show Zoom",
    showMagnifier: 'MAGNIFIER',
    enableScratchpad: 'SCRATCHPAD',
    enableSkipAlert: 'SHOW SKIP ALERT TO STUDENT',
    showImmersiveReader: 'IMMERSIVE READER',
  },
  collectionDefaultFilter: [
    { text: 'All Collections', value: '' },
    { text: 'Private Library', value: 'INDIVIDUAL' },
    { text: 'School Library', value: 'SCHOOL' },
    { text: 'District Library', value: 'DISTRICT' },
    { text: 'Public Library', value: 'PUBLIC' },
    // { text: "Edulastic Certified", value: "edulastic_certified" }
  ],
  statusConstants: {
    DRAFT: 'draft',
    ARCHIVED: 'archived',
    PUBLISHED: 'published',
  },
  releaseGradeKeys: [
    'DONT_RELEASE',
    'SCORE_ONLY',
    'WITH_RESPONSE',
    'WITH_ANSWERS',
  ],
  nonPremiumReleaseGradeKeys: ['DONT_RELEASE', 'WITH_ANSWERS'],
  testContentVisibilityTypes: [
    {
      key: 'ALWAYS',
      value: 'Always visible',
    },
    {
      key: 'GRADING',
      value: 'Hide prior to grading',
    },
    {
      key: 'HIDDEN',
      value: 'Always hidden',
    },
  ],
  testContentVisibility: {
    ALWAYS: 'ALWAYS',
    GRADING: 'GRADING',
    HIDDEN: 'HIDDEN',
  },
  redirectPolicy: {
    QuestionDelivery: {
      ALL: 'ALL',
      SKIPPED_AND_WRONG: 'SKIPPED AND WRONG',
      SKIPPED: 'SKIPPED',
      SKIPPED_PARTIAL_AND_WRONG: 'SKIPPED PARTIAL AND WRONG',
    },
    ShowPreviousAttempt: {
      FEEDBACK_ONLY: 'Teacher feedback only',
      SCORE_AND_FEEDBACK: 'Student score & teacher feedback',
      STUDENT_RESPONSE_AND_FEEDBACK: 'Student response & teacher feedback',
      SCORE_RESPONSE_AND_FEEDBACK: 'Student score, response & teacher feedback',
    },
  },
  passwordPolicy: {
    REQUIRED_PASSWORD_POLICY_OFF: 0,
    REQUIRED_PASSWORD_POLICY_DYNAMIC: 1,
    REQUIRED_PASSWORD_POLICY_STATIC: 2,
  },
  passwordPolicyOptions: {
    REQUIRED_PASSWORD_POLICY_OFF: 'No Password',
    REQUIRED_PASSWORD_POLICY_DYNAMIC: 'Dynamic Password',
    REQUIRED_PASSWORD_POLICY_STATIC: 'Static Password',
  },
  ITEM_GROUP_TYPES: {
    AUTOSELECT: 'AUTOSELECT',
    STATIC: 'STATIC',
  },
  ITEM_GROUP_DELIVERY_TYPES: {
    ALL: 'ALL',
    LIMITED: 'LIMITED',
    ALL_RANDOM: 'ALL_RANDOM',
    LIMITED_RANDOM: 'LIMITED_RANDOM',
  },
  playerSkinTypes: {
    edulastic: 'Edulastic',
    parcc: 'TestNav',
    cambium: 'Cambium',
    sbac: 'SBAC',
    cmas: 'CMAS (CO)',
    casspp: 'CAASPP (CA)',
    testlet: 'ETS Testlet',
    quester: 'Questar',
    drc: 'DRC',
    peaks: 'PEAKS (AK)',
    acap: 'ACAP (AL)',
    act_aspire: 'ACT Aspire (AR)',
    azm2: 'AzM2 (AZ)',
    csde: 'CSDE (CT)',
    dcas: 'DCAS (DE)',
    fsa: 'FSA (FL)',
    georgia_milestones: 'Georgia Milestones (GA)',
    smarter_balanced_hi: 'Smarter Balanced (HI)',
    smarter_balanced_sd: 'Smarter Balanced (SD)',
    smarter_balanced_vt: 'Smarter Balanced (VT)',
    smarter_balanced_mt: 'Smarter Balanced (MT)',
    isasp: 'ISASP (IA)',
    isat: 'ISAT (ID)',
    iar: 'IAR (IL)',
    ilearn: 'iLearn (IN)',
    kap: 'KAP (KS)',
    k_prep: 'K-Prep (KY)',
    leap: 'LEAP (LA)',
    mcas: 'MCAS (MA)',
    mcap: 'MCAP (MD)',
    mecas: 'MeCAS (ME)',
    mstep: 'MSTEP (MI)',
    mtas: 'MTAS (MN)',
    map: 'MAP (MO)',
    maap: 'MAAP (MS)',
    nctest: 'NCTest (NC)',
    ndsa: 'NDSA (ND)',
    nscas: 'NSCAS (NE)',
    nh_sas: 'NH SAS (NH)',
    nj_state_assesment: 'NJ State Assesment (NJ)',
    nm_mesa: 'NM MESA (NM)',
    nv_ready: 'NV Ready (NV)',
    ny_regents: 'NY Regents (NY)',
    ohio_state_tests: "Ohio's State Tests (OH)",
    ostp: 'OSTP (OK)',
    osa: 'OSA (OR)',
    pssa: 'PSSA (PA)',
    ricas: 'RICAS (RI)',
    sc_ready: 'SC Ready (SC)',
    tcap_tnready: 'TCAP / TNReady (TN)',
    staar: 'STAAR (TX)',
    ut_rise: 'UT RISE (UT)',
    sol: 'SOL (VA)',
    wcap: 'WCAP (WA)',
    wsas_forward: 'WSAS / Forward (WI)',
    wv_assessments: 'WV Assessments (WV)',
    wy_topp: 'WY-TOPP (WY)',
    dc_assessments: 'DC Assessments (DC)',
  },
  playerSkinValues: {
    edulastic: 'edulastic',
    parcc: 'parcc',
    sbac: 'sbac',
    cambium: 'sbac',
    cmas: 'parcc',
    casspp: 'sbac',
    testlet: 'testlet',
    quester: 'quester',
    peaks: 'edulastic',
    acap: 'edulastic',
    act_aspire: 'parcc',
    azm2: 'sbac',
    csde: 'sbac',
    dcas: 'sbac',
    fsa: 'sbac',
    georgia_milestones: 'edulastic',
    smarter_balanced: 'sbac',
    smarter_balanced_hi: 'sbac',
    smarter_balanced_sd: 'sbac',
    smarter_balanced_vt: 'sbac',
    smarter_balanced_mt: 'sbac',
    isasp: 'parcc',
    isat: 'sbac',
    iar: 'parcc',
    ilearn: 'sbac',
    kap: 'edulastic',
    k_prep: 'parcc',
    leap: 'edulastic',
    mcas: 'parcc',
    mcap: 'parcc',
    mecas: 'edulastic',
    mstep: 'edulastic',
    mtas: 'parcc',
    map: 'quester',
    maap: 'quester',
    nctest: 'edulastic',
    ndsa: 'sbac',
    nscas: 'edulastic',
    nh_sas: 'sbac',
    nj_state_assesment: 'parcc',
    nm_mesa: 'edulastic',
    nv_ready: 'edulastic',
    ny_regents: 'quester',
    ohio_state_tests: 'sbac',
    ostp: 'edulastic',
    osa: 'sbac',
    pssa: 'edulastic',
    ricas: 'parcc',
    sc_ready: 'edulastic',
    tcap_tnready: 'edulastic',
    staar: 'sbac',
    ut_rise: 'sbac',
    sol: 'parcc',
    wcap: 'sbac',
    wsas_forward: 'edulastic',
    wv_assessments: 'sbac',
    wy_topp: 'sbac',
    dc_assessments: 'parcc',
    drc: 'drc',
  },
  TOP_ORDER_SKINS: [
    'edulastic',
    'cambium',
    'cmas',
    'drc',
    'quester',
    'parcc',
    'sbac',
  ],
  REF_MATERIAL_ALLOWED_SKIN_TYPES: [
    'edulastic',
    'quester',
    'drc',
    'ohio_state_tests',
  ],
  languageCodes: {
    ENGLISH: 'en',
    SPANISH: 'es',
  },
  DELETE_TYPES: {
    ROLLBACK: 'rollback',
    DELETE_TEST: 'delete',
  },
  testSettingsOptions: [
    'partialScore',
    'timer',
    'testType',
    'hasInstruction',
    'instruction',
    'releaseScore',
    'scoringType',
    'penalty',
    'markAsDone',
    'calcTypes',
    'timedAssignment',
    'pauseAllowed',
    'maxAttempts',
    'maxAnswerChecks',
    'safeBrowser',
    'shuffleQuestions',
    'shuffleAnswers',
    'sebPassword',
    'blockNavigationToAnsweredQuestions',
    'restrictNavigationOut',
    'restrictNavigationOutAttemptsThreshold',
    'blockSaveAndContinue',
    'passwordPolicy',
    'assignmentPassword',
    'passwordExpireIn',
    'answerOnPaper',
    'playerSkinType',
    'standardGradingScale',
    'performanceBand',
    'showMagnifier',
    'enableScratchpad',
    'enableSkipAlert',
    'autoRedirect',
    'autoRedirectSettings',
    'keypad',
    'applyEBSR',
    'testContentVisibility',
    'showRubricToStudents',
    'referenceDocAttributes',
    'showHintsToStudents',
    'penaltyOnUsingHints',
    'allowTeacherRedirect',
    'showTtsForPassages',
  ],
  docBasedSettingsOptions: [
    'partialScore',
    'timer',
    'testType',
    'hasInstruction',
    'instruction',
    'releaseScore',
    'scoringType',
    'penalty',
    'markAsDone',
    'calcTypes',
    'timedAssignment',
    'pauseAllowed',
    'maxAttempts',
    'safeBrowser',
    'sebPassword',
    'restrictNavigationOut',
    'restrictNavigationOutAttemptsThreshold',
    'blockSaveAndContinue',
    'passwordPolicy',
    'assignmentPassword',
    'passwordExpireIn',
    'answerOnPaper',
    'standardGradingScale',
    'performanceBand',
    'autoRedirect',
    'autoRedirectSettings',
    'testContentVisibility',
  ],
  TEST_SETTINGS_SAVE_LIMIT: 20,
  testCategoryTypes: {
    DEFAULT: 'default',
    DOC_BASED: 'doc_based',
    DYNAMIC_TEST: 'dynamic_test',
  },
  ATTEMPT_WINDOW_TYPE: {
    DEFAULT: 'DEFAULT',
    WEEKDAYS: 'WEEKDAYS',
    CUSTOM: 'CUSTOM',
  },
  ATTEMPT_WINDOW_VALUE: {
    DEFAULT: 'Anytime between the Open and Close date',
    WEEKDAYS: 'Weekdays (Mon to Fri)',
    CUSTOM: 'Custom',
  },
}
