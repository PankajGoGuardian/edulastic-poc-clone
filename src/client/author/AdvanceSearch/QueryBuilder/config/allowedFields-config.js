import { operators, nullNotNullOp, classGroup } from './qb-config'
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
    operators: [...operators, ...nullNotNullOp],
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
    operators: [
      { name: '=', label: '=' },
      { name: '!=', label: '!=' },
    ],
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
    operators: [...operators, ...nullNotNullOp],
  },
]
