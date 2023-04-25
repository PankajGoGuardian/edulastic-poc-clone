import { DROPDOWN, MULTISELECT_DROPDOWN, STRING_INPUT } from './form'
import { staticDropDownData } from '../../wholeLearnerReport/utils'

export const GROUP_NAME = 'name'
export const GRADES = 'grades'
export const COURSES = 'courseId'

export const DESCRIPTION = 'description'
export const SUBJECTS = 'subject'
export const TAGS = 'tags'

const { subjects, grades } = staticDropDownData

export const groupFormFields = {
  nameGradesCourse: {
    [GROUP_NAME]: {
      field: GROUP_NAME,
      label: 'Group Name',
      fieldType: STRING_INPUT,
      isRequired: true,
      placeholder: 'Keep simple and specific',
    },
    [GRADES]: {
      field: GRADES,
      label: 'Grade',
      fieldType: MULTISELECT_DROPDOWN,
      placeholder: 'Select grades',
      optionsData: grades,
    },
    [COURSES]: {
      field: COURSES,
      label: 'Course',
      fieldType: DROPDOWN,
      placeholder: 'Select student course',
      optionsData: [],
    },
  },
  descriptionSubjectTags: {
    [DESCRIPTION]: {
      field: DESCRIPTION,
      label: 'Description',
      fieldType: STRING_INPUT,
      placeholder: '',
    },
    [SUBJECTS]: {
      field: SUBJECTS,
      fieldType: DROPDOWN,
      label: 'Subject',
      placeholder: 'Select subject',
      optionsData: subjects,
    },
    [TAGS]: {
      field: TAGS,
      label: 'Tags',
      fieldType: TAGS,
      placeholder: 'Select student Tag(s)',
    },
  },
}

export const imageStyleAdvanceSearch = {
  width: '100%',
  height: '100%',
  borderRadius: '5px',
  objectFit: 'cover',
}
