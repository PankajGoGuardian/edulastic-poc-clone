import { getSummaryStatusRecords } from '../common/utils'
import {
  TERM_ID,
  SUBJECTS,
  TEST_TYPES,
  STUDENT_GROUP_IDS,
  PERFORMANCE_BAND_ID,
} from './form'

export const statusColors = {
  WHITE: '#FFFFFF80',
  GREEN: '#74E27A80',
  RED: '#EA433580',
  YELLOW: '#F5E19A80',
}

export const summaryTileColors = {
  GREEN: '#D3FCD5',
  RED: '#FBBFBA',
  GRAY: '#F9F9F9',
  BROWN_TEXT: '#A07139',
  RED_TEXT: '#B12121',
  GRAY_TEXT: '#777777',
  GREEN_TEXT: '#2A7A2F',
  BLUE_TEXT: '#2F4151',
}

export const timeLeftColors = {
  GREEN: '#2A7A2F',
  RED: '#982B22',
  YELLOW: '#C89600',
  GRAY: '#777777',
}

export const firstScreenContent = {
  1: {
    list: [
      'Create Student Group',
      'Set Goals/Interventions',
      'Measure progress',
    ],
    title: 'Manage target student groups for goals and interventions.',
    description: 'No group exists. Please create first group.',
    buttonText: 'CREATE STUDENT GROUP',
  },
  2: {
    list: [
      'Select Student Group',
      'Specify Improvement areas and target proficiency',
      'Monitor Performance',
    ],
    title: 'Set Smart Goals, measure and monitor improvement.',
    description: 'No goal set. Please set first goal.',
    buttonText: 'SET GOAL',
  },
  3: {
    list: [
      'Select Students in need',
      'Specify Improvement areas and target outcome',
      'Measure results',
    ],
    title:
      'Set outcome focussed interventions to improve the students in need. Interventions are stepping stones to achieving goals.',
    description: 'No intervention set. Please set first intervention.',
    buttonText: 'SET INTERVENTION',
  },
}

export const MULTIPLE_OF_TENS = {
  TEN: 10,
  TWENTY: 20,
  THIRTY: 30,
  FOURTY: 40,
  FIFTY: 50,
  SIXTY: 60,
  SEVENTY: 70,
  EIGHTY: 80,
  NINTY: 90,
  HUNDRED: 100,
}

export const GI_STATUS = {
  IN_PROGRESS: 'IN_PROGRESS',
  DONE: 'DONE',
  ABORTED: 'ABORTED',
  NOT_STARTED: 'NOT_STARTED',
  FULLY_EXECUTED: 'FULLY_EXECUTED',
  PARTIALLY_EXECUTED: 'PARTIALLY_EXECUTED',
}

export const statusTextColors = {
  [GI_STATUS.IN_PROGRESS]: summaryTileColors.GRAY_TEXT,
  [GI_STATUS.DONE]: summaryTileColors.GREEN_TEXT,
  [GI_STATUS.ABORTED]: summaryTileColors.RED_TEXT,
  [GI_STATUS.NOT_STARTED]: summaryTileColors.GRAY_TEXT,
  [GI_STATUS.FULLY_EXECUTED]: summaryTileColors.GREEN_TEXT,
  [GI_STATUS.PARTIALLY_EXECUTED]: summaryTileColors.BROWN_TEXT,
}

export const GIActionOptions = [
  {
    id: 'summary',
    label: 'View Summary',
    link:
      '/author/reports/dashboard-report?termId={termId}&testSubjects={subjects}&testGrades=&assessmentTypes={testTypes}&testIds=&schoolIds=&teacherIds=&subjects=&grades=&courseId=All&classIds=&groupIds={studentGroupIds}&assignedBy=anyone&race=all&gender=all&iepStatus=all&frlStatus=all&ellStatus=all&hispanicEthnicity=all&periodType=TILL_DATE',
  },
  {
    id: 'trends',
    label: 'View Trends',
    link:
      '/author/reports/multiple-assessment-report-dw?termId={termId}&testSubjects={subjects}&testGrades=&tagIds=&assessmentTypes={testTypes}&testIds=&schoolIds=&teacherIds=&subjects=&grades=&courseId=All&classIds=&groupIds={studentGroupIds}&profileId={performanceBandId}',
  },
  // {
  //   id: 'edit',
  //   label: 'Edit',
  // },
]

export const GroupListReportMenu = [
  {
    id: 'summary',
    label: 'View Summary',
    link:
      '/author/reports/dashboard-report?termId={termId}&testSubjects=&testGrades=&assessmentTypes=All&testIds=All&schoolIds=All&teacherIds=&subjects=&grades=&courseId=&classIds=All&groupIds={groupId}&race=All&gender=All&iepStatus=All&frlStatus=All&ellStatus=All&hispanicEthnicity=All&periodType=TILL_DATE&reportId=&selectedCompareBy=school',
  },
  {
    id: 'trends',
    label: 'View Trends',
    link:
      '/author/reports/multiple-assessment-report-dw?termId={termId}&testSubjects=&testGrades=&tagIds=&assessmentTypes=All&testIds=All&schoolIds=All&teacherIds=&subjects=&grades=&courseId=&classIds=All&groupIds={groupId}&race=All&gender=All&iepStatus=All&frlStatus=All&ellStatus=All&hispanicEthnicity=All&reportId=&selectedCompareBy=school',
  },
  {
    id: 'attendance',
    label: 'View Attendance',
    link:
      '/author/reports/attendance-summary?termId={termId}&schoolIds=All&teacherIds=&subjects=&grades=&courseId=&classIds=All&groupIds={groupId}&race=All&gender=All&iepStatus=All&frlStatus=All&ellStatus=All&hispanicEthnicity=All&periodType=TILL_DATE&reportId=',
  },
  {
    id: 'early',
    label: 'View Early Warning',
    link:
      '/author/reports/early-warning-report?termId={termId}&schoolIds=&teacherIds=&subjects=&grades=&courseId=&classIds=&groupIds={groupId}&race=&gender=&iepStatus=&frlStatus=&ellStatus=&hispanicEthnicity=&periodType=TILL_DATE&riskType=overall&showCumulativeData=false&timeframe=monthly&selectedCompareBy=school',
  },
  {
    id: 'efficacy',
    label: 'View Efficacy',
    link:
      '/author/reports/efficacy-report?termId={termId}&testSubjects=&testGrades=All&tagIds=&assessmentTypes=All&testIds=All&schoolIds=All&teacherIds=&subjects=&grades=&courseId=&classIds=All&groupIds={groupId}&preTestId=All&postTestId=All&race=All&gender=All&iepStatus=All&frlStatus=All&ellStatus=All&hispanicEthnicity=All&reportId=&selectedCompareBy=school&preBandScore=&postBandScore=',
  },
]

export const statusList = (data) => ({
  goal: [
    {
      key: 1,
      items: [
        {
          id: 1,
          status_code: 'done',
          text: 'Done',
          color: summaryTileColors.GRAY,
          border: '1px solid #D8D8D8',
          unit: getSummaryStatusRecords({ key: 'done', data }),
          textColor: summaryTileColors.GREEN_TEXT,
        },
        {
          id: 2,
          status_code: 'not-met',
          text: 'Not met',
          color: summaryTileColors.RED,
          unit: getSummaryStatusRecords({ key: 'not-met', data }),
        },
        {
          id: 3,
          status_code: 'met',
          text: 'Met',
          color: summaryTileColors.GREEN,
          unit: getSummaryStatusRecords({ key: 'met', data }),
        },
      ],
    },
    {
      key: 2,
      items: [
        {
          id: 1,
          status_code: 'on-going',
          text: 'In Progress',
          color: summaryTileColors.GRAY,
          border: '1px solid #D8D8D8',
          unit: getSummaryStatusRecords({ key: 'on-going', data }),
          textColor: summaryTileColors.GRAY_TEXT,
        },
        {
          id: 2,
          status_code: 'off-track',
          text: 'Off-track',
          color: summaryTileColors.RED,
          unit: getSummaryStatusRecords({ key: 'off-track', data }),
          infoText:
            'Goals in progress which are not met yet and have less than 20% time left',
        },
        {
          id: 3,
          status_code: 'rest',
          text: 'Rest',
          color: summaryTileColors.GREEN,
          unit:
            getSummaryStatusRecords({ key: 'on-going', data }) -
            getSummaryStatusRecords({ key: 'off-track', data }),
        },
      ],
    },
    // {
    //   key: 3,
    //   text: 'Aborted',
    //   status_code: 'aborted',
    //   color: summaryTileColors.GRAY,
    //   border: '1px solid #D8D8D8',
    //   unit: getSummaryStatusRecords({key:'aborted', data}),
    //   textColor: summaryTileColors.RED_TEXT,
    // },
  ],
  intervention: [
    {
      key: 1,
      items: [
        {
          id: 1,
          text: 'Fully Executed',
          status_code: 'fully-executed',
          color: summaryTileColors.GRAY,
          border: '1px solid #D8D8D8',
          unit: getSummaryStatusRecords({ key: 'fully-executed', data }),
          textColor: summaryTileColors.GREEN_TEXT,
        },
        {
          id: 2,
          status_code: 'not-met',
          text: 'Not met',
          color: summaryTileColors.RED,
          unit: getSummaryStatusRecords({ key: 'not-met', data }),
        },
        {
          id: 3,
          status_code: 'met',
          text: 'Met',
          color: summaryTileColors.GREEN,
          unit: getSummaryStatusRecords({ key: 'met', data }),
        },
      ],
    },
    {
      key: 2,
      items: [
        {
          id: 1,
          text: 'Partially Executed',
          status_code: 'partially-executed',
          color: summaryTileColors.GRAY,
          border: '1px solid #D8D8D8',
          unit: getSummaryStatusRecords({ key: 'partially-executed', data }),
          textColor: summaryTileColors.BROWN_TEXT,
        },
        {
          id: 2,
          status_code: 'partially-not-met',
          text: 'Not met',
          color: summaryTileColors.RED,
          unit: getSummaryStatusRecords({ key: 'partially-not-met', data }),
        },
        {
          id: 3,
          status_code: 'partially-met',
          text: 'Met',
          color: summaryTileColors.GREEN,
          unit: getSummaryStatusRecords({ key: 'partially-met', data }),
        },
      ],
    },
    {
      key: 3,
      text: 'In progress',
      status_code: 'in-progress',
      color: summaryTileColors.GRAY,
      border: '1px solid #D8D8D8',
      unit: getSummaryStatusRecords({ key: 'in-progress', data }),
      textColor: summaryTileColors.GRAY_TEXT,
    },
    // {
    //   key: 4,
    //   text: 'Aborted',
    //   status_code: 'aborted',
    //   color: summaryTileColors.GRAY,
    //   border: '1px solid #D8D8D8',
    //   unit: getSummaryStatusRecords({ key: 'aborted', data }),
    //   textColor: summaryTileColors.RED_TEXT,
    // },
  ],
})

export const urlParamsKeys = [
  TERM_ID,
  SUBJECTS,
  TEST_TYPES,
  STUDENT_GROUP_IDS,
  PERFORMANCE_BAND_ID,
]
