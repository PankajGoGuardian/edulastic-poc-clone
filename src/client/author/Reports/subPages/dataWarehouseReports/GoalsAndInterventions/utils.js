import { omit, set } from 'lodash'
import {
  GOAL,
  formFieldNames,
  goalFormFields,
  interventionFormFields,
  ACADEMIC,
  PERFORMANCE_BAND,
  criteriaFields,
  GOAL_CRITERIA,
  INTERVENTION_CRITERIA,
  APPLICABLE_TO,
  TARGET,
} from './constants/form'

const { applicableTo, target } = criteriaFields

const {
  goal: {
    STUDENT_GROUP_IDS,
    PERFORMANCE_BAND_ID,
    METRIC,
    TYPE,
    TEST_TYPES,
    MEASURE_TYPE,
  },
} = formFieldNames

export const getOptionsData = ({
  field,
  optionsData,
  groupOptions,
  performanceBandOptions,
  targetPerformanceBandOptions,
}) => {
  let selectOptions = optionsData
  switch (field) {
    case STUDENT_GROUP_IDS:
      selectOptions = groupOptions
      break
    case PERFORMANCE_BAND_ID:
      selectOptions = performanceBandOptions
      break
    case METRIC:
      selectOptions = targetPerformanceBandOptions
      break
    default:
      break
  }
  return selectOptions
}

const getUpdatedIsRequiredValue = ({ field, formData, isRequired }) => {
  let updatedIsRequiredValue = isRequired
  if (
    (field === TEST_TYPES && formData[TYPE] !== ACADEMIC) ||
    (field === PERFORMANCE_BAND_ID &&
      formData[MEASURE_TYPE] !== PERFORMANCE_BAND)
  ) {
    updatedIsRequiredValue = false
  }
  return updatedIsRequiredValue
}

const isValueInvalid = (value) => {
  return (
    value === undefined ||
    value === null ||
    (typeof value === 'number' && value < 1) ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  )
}

const getFormattedFormData = ({ formType, updatedFormData }) => {
  const formattedFormData = {}
  const criteriaKey = formType === GOAL ? GOAL_CRITERIA : INTERVENTION_CRITERIA

  Object.keys(updatedFormData).forEach((field) => {
    let value = updatedFormData[field]
    if (applicableTo.includes(field)) {
      set(formattedFormData, `${criteriaKey}.${APPLICABLE_TO}.${field}`, value)
    } else if (target.includes(field)) {
      if (field === METRIC && typeof value === 'number') {
        value = value.toString()
      }
      set(formattedFormData, `${criteriaKey}.${TARGET}.${field}`, value)
    } else {
      set(formattedFormData, field, value)
    }
  })

  return formattedFormData
}

export const validateAndGetFormattedFormData = (formData) => {
  const fieldsToOmit = []
  let error = false
  let errorMessage = ''
  const { formType } = formData
  const formFields = formType === GOAL ? goalFormFields : interventionFormFields
  const formSections = Object.keys(formFields)
  formSections.forEach((formSection) => {
    if (error) {
      return
    }
    Object.values(formFields[formSection]).forEach(
      ({ field, isRequired, label }) => {
        if (error) {
          return
        }
        const updatedIsRequiredValue = getUpdatedIsRequiredValue({
          field,
          formData,
          isRequired,
        })
        const value = formData[field]

        if (isValueInvalid(value)) {
          if (updatedIsRequiredValue) {
            error = true
            errorMessage = `${label} cannot be empty`
          } else {
            fieldsToOmit.push(field)
          }
        }
      }
    )
  })

  if (error) {
    return { error, errorMessage }
  }

  const updatedFormData = omit(formData, fieldsToOmit)
  const formattedFormData = getFormattedFormData({ formType, updatedFormData })

  return { formattedFormData, error: false, errorMessage: '' }
}
