import { selectsData } from '../../../../../../../TestPage/components/common'
import { fieldKey } from './constants'

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
  { name: 'in', label: 'Is In' },
  { name: 'notIn', label: 'Is Not In' },
]

export const combinators = [
  { name: 'and', label: 'All criteria' },
  { name: 'or', label: 'Any criteria' },
]

export const allowedFields = ({
  schoolData,
  courseData,
  classData,
  attendanceBandData,
}) => [
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
    name: fieldKey.attendanceBands,
    label: 'Attendance bands',
    valueEditorType: 'multiselect',
    values: attendanceBandData,
  },
]

export const sampleStudents = [
  {
    firstname: 'James',
    lastname: 'Smith',
    class: 'Lorem Ipsum',
    teacher: 'Mathew Oliver',
    school: 'Orlando school',
    avg_academic_edulastic: '90',
    avg_academic_nwea: '80',
    avg_attendance: '70',
  },
  {
    firstname: 'John',
    lastname: 'Doe',
    class: 'Lorem Ipsum',
    teacher: 'Mathew Oliver',
    school: 'Orlando school',
    avg_academic_edulastic: '90',
    avg_academic_nwea: '90',
    avg_attendance: '90',
  },
  {
    firstname: 'Jenny',
    lastname: 'Doe',
    class: 'Lorem Ipsum',
    teacher: 'Mathew Oliver',
    school: 'Orlando school',
    avg_academic_edulastic: '100',
    avg_academic_nwea: '100',
    avg_attendance: '80',
  },
]
