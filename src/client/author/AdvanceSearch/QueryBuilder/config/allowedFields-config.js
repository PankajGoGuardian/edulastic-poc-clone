import {
  inNotInOp,
  nullNotNullOp,
  classGroup,
  equalNotEqualOp,
} from './qb-config'
import { selectsData } from '../../../TestPage/components/common'
import { fieldKey } from './constants'

export const allowedFields = ({
  schoolData,
  courseData,
  classData,
  tagData,
}) => [
  {
    name: fieldKey.schools,
    label: 'Schools',
    valueEditorType: 'multiselect',
    values: schoolData.data,
  },
  {
    name: fieldKey.courses,
    label: 'Courses',
    valueEditorType: 'multiselect',
    values: courseData.data,
    operators: [...inNotInOp, ...nullNotNullOp],
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
    name: fieldKey.groupType,
    label: 'Show Class/Groups',
    valueEditorType: 'select',
    operators: equalNotEqualOp,
    values: classGroup,
  },
  {
    name: fieldKey.classes,
    label: 'Classes',
    valueEditorType: 'multiselect',
    values: classData.data,
  },
  {
    name: fieldKey.tags,
    label: 'Tags',
    valueEditorType: 'multiselect',
    values: tagData.data,
    operators: [...inNotInOp, ...nullNotNullOp],
  },
]
