import { TEST_TYPES_VALUES_MAP } from '@edulastic/constants/const/testTypes'
import { capitalize } from 'lodash'
import { selectsData } from '../../../../../../../../TestPage/components/common'
import { fieldKey } from '../../../../ducks/constants'

const { groups, classes } = fieldKey

export const classGroup = [
  {
    value: 'class',
    label: 'Classes',
  },
  {
    value: 'custom',
    label: 'Student Groups',
  },
]

export const ruleLimit = 10

export const debounceWait = 500

export const inNotInOp = [
  { name: 'in', label: 'Includes' },
  { name: 'notIn', label: 'Excludes' },
]

export const operators = {
  avgScore: [
    { name: '<=', label: '<=' },
    { name: '>=', label: '>=' },
  ],
  avgAttendance: [
    { name: '<=', label: '<=' },
    { name: '>=', label: '>=' },
  ],
}

export const combinators = [{ name: 'and', label: 'Satisfy All' }]

export const groupType = {
  [classes]: 'class',
  [groups]: 'custom',
}

export const allowedFields = ({
  schoolData,
  courseData,
  classData,
  groupData,
  attendanceBandData,
  performanceBandData,
}) => {
  const data = [
    {
      name: fieldKey.schools,
      label: 'Schools',
      valueEditorType: 'multiselect',
      values: schoolData,
    },
    {
      name: fieldKey.courses,
      label: 'Courses',
      valueEditorType: 'multiselect',
      values: courseData,
    },
    {
      name: fieldKey.grades,
      label: 'Grades',
      valueEditorType: 'multiselect',
      values: selectsData.allGrades.map((item) => ({
        value: item.value,
        label: item.text,
      })),
    },
    {
      name: fieldKey.subjects,
      label: 'Subjects',
      valueEditorType: 'multiselect',
      values: selectsData.allSubjects.map((item) => ({
        value: item.value,
        label: item.text,
      })),
    },
    {
      name: fieldKey.classes,
      label: 'Classes',
      valueEditorType: 'multiselect',
      values: classData,
    },
    {
      name: fieldKey.groups,
      label: 'Student Groups',
      valueEditorType: 'multiselect',
      values: groupData,
    },
    {
      name: fieldKey.testType,
      label: 'Test Types',
      valueEditorType: 'multiselect',
      values: Object.keys(TEST_TYPES_VALUES_MAP).map((type) => ({
        value: TEST_TYPES_VALUES_MAP[type],
        label: capitalize(TEST_TYPES_VALUES_MAP[type]),
      })),
    },
    {
      name: fieldKey.avgScore,
      label: 'Average Score',
      valueEditorType: 'number',
      maxValue: 100,
      minValue: 1,
    },
    {
      name: fieldKey.avgAttendance,
      label: 'Average Attendance',
      valueEditorType: 'number',
      maxValue: 100,
      minValue: 1,
    },
  ]

  attendanceBandData.forEach(({ value, label, metaData }, index) => {
    data.push({
      name: `${fieldKey.attendanceBands}_${index}`,
      label: `Attendance Band - ${label}`,
      valueEditorType: 'multiselect',
      values: metaData.bands.map(({ name, min, max }) => ({
        value: `band${value}_${min}_${max}`,
        label: `${name} (${min}-${max})`,
      })),
    })
  })

  performanceBandData.forEach(({ name, performanceBand, _id }, index) => {
    data.push({
      name: `${fieldKey.proficiencyBands}_${index}`,
      label: `Performance Band - ${name}`,
      valueEditorType: 'multiselect',
      values: performanceBand.map(({ name: bandName, to, from }) => ({
        value: `band${_id}_${to}_${from}`,
        label: `${bandName} (${to}-${from})`,
      })),
    })
  })

  return data
}
