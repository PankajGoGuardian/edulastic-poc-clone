import { getArrayOfAllTestTypes } from '../../../../../../common/utils/testTypeUtils'
import { staticDropDownData } from '../../wholeLearnerReport/utils'

export const ACADEMIC = 'academic'
const ATTENDANCE = 'attendance'
const AVERAGE_SCORE = 'averageScore'
const MINIMUM_SCORE = 'minimumScore'
export const PERFORMANCE_BAND = 'performanceBand'
export const START_DATE = 'startDate'
export const SAVE_GOAL = 'SAVE_GOAL'
export const SAVE_INTERVENTION = 'SAVE_INTERVENTION'
export const GOAL = 'goal'
export const INTERVENTION = 'intervention'
export const BAND = 'performanceBandId'
export const METRIC = 'metric'
export const STRING_INPUT = 'STRING_INPUT'
export const NUMBER_INPUT = 'NUMBER_INPUT'
export const DATEPICKER = 'DATEPICKER'
export const DROPDOWN = 'DROPDOWN'
export const MULTISELECT_DROPDOWN = 'MULTISELECT_DROPDOWN'
export const STANDARDS_POPUP = 'STANDARDS_POPUP'

export const dropdownData = {
  goalOrInterventionTypes: [
    { key: ACADEMIC, title: 'Academic' },
    { key: ATTENDANCE, title: 'Attendance' },
  ],
  measureTypes: [
    { key: AVERAGE_SCORE, title: 'Average score' },
    { key: MINIMUM_SCORE, title: 'Minimum score' },
    { key: PERFORMANCE_BAND, title: 'Performance band' },
  ],
}

export const saveGoalFormFields = {
  nameAndType: {
    name: {
      field: 'name',
      label: 'Goal name',
      fieldType: STRING_INPUT,
      isRequired: true,
      placeholder: 'Enter goal name',
    },
    type: {
      field: 'type',
      label: 'Goal type',
      fieldType: DROPDOWN,
      isRequired: true,
      placeholder: 'Select goal type',
      optionsData: dropdownData.goalOrInterventionTypes,
    },
    studentGroup: {
      field: 'studentGroupIds',
      label: 'For Whom',
      fieldType: DROPDOWN,
      isRequired: true,
      placeholder: 'Select student group',
      optionsData: [],
    },
  },
  ownerAndDescription: {
    owner: {
      field: 'owner',
      label: 'Owner(s)',
      fieldType: STRING_INPUT,
      isRequired: false,
      placeholder: 'Enter owner name',
    },
    description: {
      field: 'description',
      label: 'Description',
      fieldType: STRING_INPUT,
      isRequired: false,
      placeholder: 'Enter description',
      colSpan: 7,
    },
  },
  testTypeSubjectAndStandards: {
    sectionTitle: 'Improvement Areas',
    fields: {
      testTypes: {
        field: 'testTypes',
        label: 'Test types',
        isRequired: true,
        fieldType: DROPDOWN,
        placeholder: 'Select test types',
        optionsData: getArrayOfAllTestTypes(),
      },
      subjects: {
        field: 'subjects',
        label: 'Subjects',
        isRequired: false,
        fieldType: MULTISELECT_DROPDOWN,
        placeholder: 'Select subjects',
        optionsData: staticDropDownData.subjects,
      },
      standards: {
        field: 'standards',
        label: 'Domain/standards',
        isRequired: false,
        fieldType: STANDARDS_POPUP,
        placeholder: 'Select Domain/standards',
      },
    },
  },
  typeBandAndMetric: {
    sectionTitle: 'Target Proficiency',
    fields: {
      measureType: {
        field: 'measureType',
        label: 'Measure type',
        isRequired: true,
        fieldType: DROPDOWN,
        placeholder: 'Select metric type',
        optionsData: dropdownData.measureTypes,
      },
      band: {
        field: BAND,
        label: 'Select band',
        fieldType: DROPDOWN,
        isRequired: false,
        placeholder: 'Select band',
        optionsData: [], // TODO
      },
      metric: {
        field: METRIC,
        label: 'Target value',
        fieldType: NUMBER_INPUT,
        isRequired: true,
        placeholder: 'Enter target metric',
      },
    },
  },
  thresholdStartAndEndDate: {
    threshold: {
      field: 'threshold',
      label: 'Threshold',
      fieldType: NUMBER_INPUT,
      isRequired: true,
      placeholder: 'Enter %students who must improve',
    },
    startDate: {
      field: 'startDate',
      label: 'Start date',
      fieldType: DATEPICKER,
      isRequired: true,
      placeholder: 'Enter goal start date',
    },
    endDate: {
      field: 'endDate',
      label: 'End date',
      fieldType: DATEPICKER,
      isRequired: true,
      placeholder: 'Enter goal end date',
    },
  },
  relatedGoalsAndComment: {
    sectionTitle: 'Notes',
    fields: {
      comment: {
        field: 'comment',
        label: 'Notes',
        fieldType: STRING_INPUT,
        isRequired: false,
        placeholder: 'Add notes',
        colSpan: 7,
      },
    },
  },
}

export const saveInterventionFormFields = {
  nameAndType: {
    name: {
      field: 'name',
      label: 'Intervention name',
      fieldType: STRING_INPUT,
      isRequired: true,
      placeholder: 'Enter intervention name',
    },
    type: {
      field: 'type',
      label: 'Intervention type',
      fieldType: DROPDOWN,
      isRequired: true,
      placeholder: 'Select intervention type',
      optionsData: dropdownData.goalOrInterventionTypes,
    },
    studentGroup: {
      field: 'studentGroupIds',
      label: 'Who needs it',
      fieldType: DROPDOWN,
      isRequired: true,
      placeholder: 'Select student group',
      optionsData: [],
    },
  },
  ownerAndDescription: saveGoalFormFields.ownerAndDescription,
  testTypeSubjectAndStandards: {
    ...saveGoalFormFields.testTypeSubjectAndStandards,
    sectionTitle: 'Applicable To',
  },
  typeBandAndMetric: {
    sectionTitle: 'Target Outcome',
    fields: {
      measureType: {
        field: 'measureType',
        label: 'Outcome type',
        fieldType: DROPDOWN,
        isRequired: true,
        placeholder: 'Select outcome type',
        optionsData: dropdownData.measureTypes,
      },
      band: {
        field: 'band',
        label: 'Select band',
        fieldType: DROPDOWN,
        isRequired: false,
        placeholder: 'Select band',
        optionsData: [], // TODO
      },
      metric: {
        field: 'outcome',
        label: 'Target outcome',
        fieldType: NUMBER_INPUT,
        isRequired: true,
        placeholder: 'Select target outcome',
      },
    },
  },
  thresholdStartAndEndDate: saveGoalFormFields.thresholdStartAndEndDate,
  relatedGoalsAndComment: {
    sectionTitle: 'Related Goals & Notes',
    fields: {
      relatedGoals: {
        field: 'relatedGoals',
        label: 'Related goal(s)',
        fieldType: DROPDOWN,
        isRequired: false,
        placeholder: 'Select related goals',
        optionsData: [], // TODO
      },
      comment: {
        field: 'comment',
        label: 'Comment',
        fieldType: STRING_INPUT,
        isRequired: false,
        placeholder: 'Add comment',
        colSpan: 7,
      },
    },
  },
}

export const goalFormSectionHeaders = {
  typeSectionHeader: 'What Type of goal and for Whom it is meant',
  targetSectionHeader: 'What are the Improvement areas and Target proficiency',
  thresholdSectionHeader:
    'When the above should be achieved and by what Degree',
}

export const interventionFormSectionHeaders = {
  typeSectionHeader: 'What Type of intervention and Who needs it',
  targetSectionHeader:
    'What are the Improvement areas and expected Outcome of intervention',
  thresholdSectionHeader:
    'When the intervention will be conducted and Degree of improvement expected',
}
