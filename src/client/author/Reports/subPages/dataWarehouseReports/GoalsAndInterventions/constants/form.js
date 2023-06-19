import { testTypes as testTypesConstants } from '@edulastic/constants'
import { staticDropDownData } from '../../wholeLearnerReport/utils'

const { TEST_TYPE_LABELS } = testTypesConstants

export const ACADEMIC = 'academic'
export const ATTENDANCE = 'attendance'
const AVERAGE_SCORE = 'averageScore'
const MINIMUM_SCORE = 'minimumScore'
export const PERFORMANCE_BAND = 'performanceBand'
export const ATTENDANCE_BAND = 'attendanceBand'
export const SAVE_GOAL = 'SAVE_GOAL'
export const SAVE_INTERVENTION = 'SAVE_INTERVENTION'
export const GOAL = 'goal'
export const INTERVENTION = 'intervention'
export const STRING_INPUT = 'STRING_INPUT'
export const NUMBER_INPUT = 'NUMBER_INPUT'
export const DATEPICKER = 'DATEPICKER'
export const DROPDOWN = 'DROPDOWN'
export const MULTISELECT_DROPDOWN = 'MULTISELECT_DROPDOWN'
export const STANDARDS_POPUP = 'STANDARDS_POPUP'
export const FROALA_EDITOR = 'FROALA_EDITOR'

export const GOAL_CRITERIA = 'goalCriteria'
export const INTERVENTION_CRITERIA = 'interventionCriteria'
export const APPLICABLE_TO = 'applicableTo'
export const TARGET = 'target'

export const DETAILS_SECTION = 'detailsSection'
export const TARGET_GROUPS_SECTION = 'targetGroupsSection'
export const TARGET_PROFICIENCY_SECTION = 'targetProficiencySection'
export const THRESHOLD_DEADLINE_SECTION = 'thresholdDeadlineSection'
export const RELATED_GOALS_COMMENTS_SECTION = 'relatedGoalsCommentsSection'

export const DISTRICT_ADMIN = 'district-admin'
export const SCHOOL_ADMIN = 'school-admin'
export const TEACHER = 'teacher'

const TEST_TYPE_COMMON_ASSESSMENT = 'common assessment'
const TEST_TYPE_ASSESSMENT = 'assessment'

export const oneDayInMilliseconds = 24 * 60 * 60 * 1000
export const oneDayInhours = 24

const NAME = 'name'
const TYPE = 'type'
export const STUDENT_GROUP_IDS = 'studentGroupIds'
const OWNER = 'owner'
const DESCRIPTION = 'description'
export const TEST_TYPES = 'testTypes'
export const SUBJECTS = 'subjects'
const STANDARD_DETAILS = 'standardDetails'
const MEASURE_TYPE = 'measureType'
export const PERFORMANCE_BAND_ID = 'performanceBandId'
const METRIC = 'metric'
const THRESHOLD = 'threshold'
const START_DATE = 'startDate'
const END_DATE = 'endDate'
const COMMENT = 'comment'
const RELATED_GOALS_IDS = 'relatedGoalIds'
export const TERM_ID = 'termId'
const STATUS = 'status'

export const dropdownData = {
  goalOrInterventionTypes: [
    { key: ACADEMIC, title: 'Academic' },
    { key: ATTENDANCE, title: 'Attendance' },
  ],
  academicMeasureTypes: [
    { key: AVERAGE_SCORE, title: 'Average score' },
    { key: MINIMUM_SCORE, title: 'Minimum score' },
    { key: PERFORMANCE_BAND, title: 'Performance band' },
  ],
  attendanceMeasureTypes: [
    { key: AVERAGE_SCORE, title: 'Average attendance' },
    { key: MINIMUM_SCORE, title: 'Minimum attendance' },
    { key: PERFORMANCE_BAND, title: 'Attendance band' },
  ],
  testTypes: [
    {
      key: TEST_TYPE_COMMON_ASSESSMENT,
      title: TEST_TYPE_LABELS[TEST_TYPE_COMMON_ASSESSMENT],
    },
    {
      key: TEST_TYPE_ASSESSMENT,
      title: TEST_TYPE_LABELS[TEST_TYPE_ASSESSMENT],
    },
  ],
}

export const criteriaFields = {
  [APPLICABLE_TO]: [TEST_TYPES, SUBJECTS, STANDARD_DETAILS],
  [TARGET]: [MEASURE_TYPE, PERFORMANCE_BAND_ID, METRIC],
}

const commonFormFieldNames = {
  NAME,
  TYPE,
  STUDENT_GROUP_IDS,
  OWNER,
  DESCRIPTION,
  TEST_TYPES,
  SUBJECTS,
  STANDARD_DETAILS,
  MEASURE_TYPE,
  PERFORMANCE_BAND_ID,
  METRIC,
  THRESHOLD,
  START_DATE,
  END_DATE,
  COMMENT,
}

export const formFieldNames = {
  [GOAL]: {
    ...commonFormFieldNames,
  },
  [INTERVENTION]: {
    ...commonFormFieldNames,
    RELATED_GOALS_IDS,
  },
}

export const editFormFields = [
  NAME,
  TYPE,
  STUDENT_GROUP_IDS,
  OWNER,
  DESCRIPTION,
  START_DATE,
  END_DATE,
  COMMENT,
  GOAL_CRITERIA,
  INTERVENTION_CRITERIA,
  RELATED_GOALS_IDS,
  STATUS,
]

const getMeasureTypes = (type) => {
  return type === 'academic'
    ? dropdownData.academicMeasureTypes
    : dropdownData.attendanceMeasureTypes
}

export const goalFormFields = ({
  type = 'academic',
  startDate,
  endDate,
  isInterventionForm = false,
}) => ({
  nameAndType: {
    name: {
      field: NAME,
      label: 'Goal name',
      fieldType: STRING_INPUT,
      isRequired: true,
      placeholder: 'Enter goal name',
    },
    type: {
      field: TYPE,
      label: 'Goal type',
      fieldType: DROPDOWN,
      isRequired: true,
      placeholder: 'Select goal type',
      optionsData: dropdownData.goalOrInterventionTypes,
    },
  },
  ownerAndDescription: {
    owner: {
      field: OWNER,
      label: 'Owner(s)',
      fieldType: STRING_INPUT,
      isRequired: false,
      placeholder: 'Enter owner name',
    },
    description: {
      field: DESCRIPTION,
      label: 'Description',
      fieldType: STRING_INPUT,
      isRequired: false,
      placeholder: 'Enter description',
      colSpan: 7,
    },
  },
  targetGroup: {
    studentGroup: {
      field: STUDENT_GROUP_IDS,
      label: 'Class/group',
      fieldType: MULTISELECT_DROPDOWN,
      isRequired: true,
      placeholder: 'Select student group',
      optionsData: [],
      isRequiredCustomPromptMessage: 'Please select a Student Group',
    },
  },
  testTypeSubjectAndStandards: {
    testTypes: {
      field: TEST_TYPES,
      label: 'Test types',
      isRequired: true,
      fieldType: DROPDOWN,
      placeholder: 'Select test types',
      optionsData: dropdownData.testTypes,
    },
    subjects: {
      field: SUBJECTS,
      label: 'Subjects',
      isRequired: false,
      fieldType: MULTISELECT_DROPDOWN,
      placeholder: 'Select subjects',
      optionsData: staticDropDownData.subjects,
    },
    // standards: {
    //   field: STANDARD_DETAILS,
    //   label: 'Domain/standards',
    //   isRequired: false,
    //   fieldType: STANDARDS_POPUP,
    //   placeholder: 'Select Domain/standards',
    // },
  },
  typeBandAndMetric: {
    measureType: {
      field: MEASURE_TYPE,
      label: 'Measure type',
      isRequired: true,
      fieldType: DROPDOWN,
      placeholder: 'Select metric type',
      optionsData: getMeasureTypes(type),
    },
    band: {
      field: PERFORMANCE_BAND_ID,
      label: 'band',
      fieldType: DROPDOWN,
      isRequired: true,
      placeholder: 'Select band',
      optionsData: [],
    },
    metric: {
      field: METRIC,
      label: 'Target value',
      fieldType: NUMBER_INPUT,
      isRequired: true,
      placeholder: 'Enter target metric',
      dropdownPlaceholder: 'Select target metric',
    },
  },
  thresholdStartAndEndDate: {
    // threshold: {
    //   field: THRESHOLD,
    //   label: 'Threshold',
    //   fieldType: NUMBER_INPUT,
    //   isRequired: true,
    //   placeholder: 'Enter %students who must improve',
    // },
    startDate: {
      field: START_DATE,
      label: 'Start date',
      fieldType: DATEPICKER,
      isRequired: true,
      placeholder: `Enter ${
        isInterventionForm ? INTERVENTION : GOAL
      } start date`,
      startDate,
      endDate,
    },
    endDate: {
      field: END_DATE,
      label: 'End date',
      fieldType: DATEPICKER,
      isRequired: true,
      placeholder: `Enter ${isInterventionForm ? INTERVENTION : GOAL} end date`,
      startDate,
      endDate,
    },
  },
  notes: {
    comment: {
      field: COMMENT,
      label: 'Notes',
      fieldType: FROALA_EDITOR,
      isRequired: false,
      placeholder: 'Add notes',
      colSpan: 24,
    },
  },
})

export const interventionFormFields = ({
  type = 'academic',
  startDate,
  endDate,
}) => ({
  nameAndType: {
    name: {
      field: NAME,
      label: 'Intervention name',
      fieldType: STRING_INPUT,
      isRequired: true,
      placeholder: 'Enter intervention name',
    },
    type: {
      field: TYPE,
      label: 'Intervention type',
      fieldType: DROPDOWN,
      isRequired: true,
      placeholder: 'Select intervention type',
      optionsData: dropdownData.goalOrInterventionTypes,
    },
  },
  ownerAndDescription: goalFormFields({ type, startDate, endDate })
    .ownerAndDescription,
  targetGroup: goalFormFields({ type, startDate, endDate }).targetGroup,
  testTypeSubjectAndStandards: goalFormFields({ type, startDate, endDate })
    .testTypeSubjectAndStandards,
  typeBandAndMetric: {
    measureType: {
      field: MEASURE_TYPE,
      label: 'Outcome type',
      fieldType: DROPDOWN,
      isRequired: true,
      placeholder: 'Select outcome type',
      optionsData: getMeasureTypes(type),
    },
    band: {
      field: PERFORMANCE_BAND_ID,
      label: 'band',
      fieldType: DROPDOWN,
      isRequired: true,
      placeholder: 'Select band',
      optionsData: [],
    },
    metric: {
      field: METRIC,
      label: 'Target outcome',
      fieldType: NUMBER_INPUT,
      isRequired: true,
      placeholder: 'Enter target outcome',
      dropdownPlaceholder: 'Select target outcome',
    },
  },
  thresholdStartAndEndDate: goalFormFields({
    type,
    startDate,
    endDate,
    isInterventionForm: true,
  }).thresholdStartAndEndDate,
  relatedGoalIds: {
    relatedGoals: {
      field: RELATED_GOALS_IDS,
      label: 'Related goal(s)',
      fieldType: MULTISELECT_DROPDOWN,
      isRequired: false,
      placeholder: 'Select related goals',
      allowClear: true,
      optionsData: [], // TODO
    },
  },
  notes: goalFormFields({ type, startDate, endDate }).notes,
})

export const formSectionExtraData = {
  [GOAL]: {
    sectionHeader: {
      typeSectionHeader: 'What Type of goal',
      targetGroupsSectionHeader: 'Who needs it',
      targetSectionHeader:
        'What are the Improvement areas and Target proficiency',
      thresholdSectionHeader: 'When the above should be achieved',
    },
    sectionTitle: {
      testTypeSubjectAndStandardsSectionTitle: 'Improvement Areas',
      typeBandAndMetricSectionTitle: 'Target Proficiency',
      relatedGoalsAndCommentSectionTitle: 'Notes',
    },
  },
  [INTERVENTION]: {
    sectionHeader: {
      typeSectionHeader: 'What Type of intervention',
      targetGroupsSectionHeader: 'Who needs it',
      targetSectionHeader:
        'What are the Improvement areas and expected Outcome of intervention',
      thresholdSectionHeader: 'When the intervention will be conducted',
    },
    sectionTitle: {
      testTypeSubjectAndStandardsSectionTitle: 'Applicable To',
      typeBandAndMetricSectionTitle: 'Target outcome',
      relatedGoalsAndCommentSectionTitle: 'Related Goals & Notes',
    },
  },
}

export const formNavigationLabels = {
  [GOAL]: {
    [DETAILS_SECTION]: 'Goal type',
    [TARGET_GROUPS_SECTION]: 'Target students',
    [TARGET_PROFICIENCY_SECTION]: 'Improvement areas',
    [THRESHOLD_DEADLINE_SECTION]: 'Deadline',
    [RELATED_GOALS_COMMENTS_SECTION]: 'Notes',
  },
  [INTERVENTION]: {
    [DETAILS_SECTION]: 'Intervention details',
    [TARGET_GROUPS_SECTION]: 'Target students',
    [TARGET_PROFICIENCY_SECTION]: 'Expected Outcome',
    [THRESHOLD_DEADLINE_SECTION]: 'Intervention period',
    [RELATED_GOALS_COMMENTS_SECTION]: 'Related Goals and Notes',
  },
}
