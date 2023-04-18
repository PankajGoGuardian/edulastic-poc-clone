import { selectsData } from '../../../../../TestPage/components/common'
import { MULTISELECT_DROPDOWN, STRING_INPUT } from './form'
import { staticDropDownData } from '../../wholeLearnerReport/utils'

export const GROUP_NAME = 'groupName'
export const GRADES = 'grades'
export const COURSES = 'courses'

export const DESCRIPTION = 'description'
export const SUBJECTS = 'subjects'
export const TAGS = 'tags'

const { subjects, grades } = staticDropDownData
const { allTags } = selectsData

export const groupFormFields = {
  nameGradesCourse: {
    [GROUP_NAME]: {
      field: GROUP_NAME,
      label: 'Group Name',
      fieldType: STRING_INPUT,
      isRequired: true,
      placeholder: 'Enter group name',
    },
    [GRADES]: {
      field: GRADES,
      label: 'Grade',
      fieldType: MULTISELECT_DROPDOWN,
      placeholder: 'Select grades(s)',
      optionsData: grades,
    },
    [COURSES]: {
      field: COURSES,
      label: 'Course',
      fieldType: MULTISELECT_DROPDOWN,
      placeholder: 'Select student course(s)',
      optionsData: [],
    },
  },
  descriptionSubjectTags: {
    [DESCRIPTION]: {
      field: DESCRIPTION,
      label: 'Description',
      fieldType: STRING_INPUT,
      placeholder: 'Enter description',
    },
    [SUBJECTS]: {
      field: SUBJECTS,
      fieldType: MULTISELECT_DROPDOWN,
      label: 'Subjects',
      placeholder: 'Select subjects(s)',
      optionsData: subjects,
    },
    [TAGS]: {
      field: TAGS,
      label: 'Tags',
      fieldType: MULTISELECT_DROPDOWN,
      placeholder: 'Select student Tag(s)',
      optionsData: allTags,
    },
  },
}
