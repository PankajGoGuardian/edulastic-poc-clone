import { isNaN, omit, set } from 'lodash'
import moment from 'moment'
import { GI_STATUS, MULTIPLE_OF_TENS } from '../constants/common'
import {
  ACADEMIC,
  APPLICABLE_TO,
  GOAL,
  GOAL_CRITERIA,
  INTERVENTION_CRITERIA,
  PERFORMANCE_BAND,
  TARGET,
  criteriaFields,
  formFieldNames,
  goalFormFields,
  interventionFormFields,
} from '../constants/form'
import { COURSES } from '../constants/groupForm'

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
  intervention: { RELATED_GOALS_IDS },
} = formFieldNames

export const getOptionsData = ({
  field,
  optionsData = [],
  groupOptions,
  performanceBandOptions,
  targetPerformanceBandOptions,
  goalsOptions,
  courseData,
}) => {
  const optionsDataMap = {
    [STUDENT_GROUP_IDS]: groupOptions,
    [PERFORMANCE_BAND_ID]: performanceBandOptions,
    [METRIC]: targetPerformanceBandOptions,
    [RELATED_GOALS_IDS]: goalsOptions,
    [COURSES]: courseData,
  }
  return optionsDataMap?.[field] || optionsData
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

export const validateAndGetFormattedFormData = (formData, termDetails) => {
  const fieldsToOmit = []
  let error = false
  let errorMessage = ''
  const { formType, type } = formData

  const { startData, endDate } = termDetails

  const formFields =
    formType === GOAL
      ? goalFormFields({ type, startData, endDate })
      : interventionFormFields({ type, startData, endDate })
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

export const isNumeric = (str) => {
  if (typeof str != 'string') return false // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ) // ...and ensure strings of whitespace fail
}

export const getDataSourceForGI = (goalList, groupList) => {
  const finalList = [...(goalList || [])]

  finalList.forEach((goal) => {
    const { studentGroupIds } = goal
    if (studentGroupIds) {
      const group = groupList
        .filter(({ _id }) => studentGroupIds.includes(_id))
        .map(({ name }) => name)
        .join(', ')

      if (group) {
        goal.group = group
      }
    }
  })

  return finalList
}

export const titleCase = (str) => {
  str = str.replace(/([A-Z])/g, ' $1')
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const ucFirst = (str) => {
  return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1)
}

export const parsedBandData = (content) => {
  try {
    content = content.replace(/(attendanceBands)_([0-9]+)/g, 'attendanceBands')
    content = content.replace(
      /(proficiencyBands)_([0-9]+)/g,
      'proficiencyBands'
    )
    const groups = content.match(
      /"value":"(band([a-z0-9]+)_([0-9.]+)_([0-9.]+)([,]*))+/g
    )

    if ((groups || []).length > 0) {
      groups.forEach((groupItem) => {
        const subGroups = groupItem.match(
          /band([a-z0-9]+)_([0-9.]+)_([0-9.]+)/g
        )
        if ((subGroups || []).length > 0) {
          const toReplace = subGroups.join(',')
          let id
          const values = []
          subGroups.forEach((item) => {
            const matched = item.match(`band([a-z0-9]+)_([0-9.]+)_([0-9.]+)`)
            if (!id) {
              id = matched[1]
            }
            values.push(parseFloat(matched[2]))
          })
          content = content.replace(
            `"${toReplace}"`,
            JSON.stringify([
              {
                _id: id,
                levels_min: values,
              },
            ])
          )
        }
      })
    }
  } catch (e) {
    console.error(e)
  }

  return content
}

export const getPercentage = (value) => value / 100

export const getTarget = (record) => {
  return record?.interventionCriteria?.target || record?.goalCriteria?.target
}

export const getSummaryStatusCount = ({ key, data }) => {
  const completedStatus = [GI_STATUS.FULLY_EXECUTED, GI_STATUS.DONE]
  const inProfessCondition = (record) => {
    return record.status === GI_STATUS.IN_PROGRESS
  }
  const completedCondition = (record) => completedStatus.includes(record.status)

  const summaryStatusCountMap = {
    met: (record) => {
      return (
        record.current >= getTarget(record) &&
        completedStatus.includes(record.status)
      )
    },
    'not-met': (record) => {
      return (
        record.current < getTarget(record) &&
        completedStatus.includes(record.status)
      )
    },
    'partially-met': (record) => {
      return (
        record.current >= getTarget(record) &&
        record.status === GI_STATUS.PARTIALLY_EXECUTED
      )
    },
    'partially-not-met': (record) => {
      return (
        record.current < getTarget(record) &&
        record.status === GI_STATUS.PARTIALLY_EXECUTED
      )
    },
    'off-track': (record) => {
      return (
        moment().diff(record.startDate, 'days') /
          moment(record.endDate).diff(record.startDate, 'days') <=
          getPercentage(MULTIPLE_OF_TENS.TWENTY) &&
        record.status === GI_STATUS.IN_PROGRESS
      )
    },
    rest: (record) => {
      return (
        moment().diff(record.startDate, 'days') /
          moment(record.endDate).diff(record.startDate, 'days') >
          getPercentage(MULTIPLE_OF_TENS.TWENTY) &&
        record.status === GI_STATUS.IN_PROGRESS
      )
    },
    'fully-executed': completedCondition,
    done: completedCondition,
    'on-going': inProfessCondition,
    'in-progress': inProfessCondition,
  }

  const filterMethod = summaryStatusCountMap?.[key]
  if (filterMethod) {
    return (data.filter(filterMethod) || []).length
  }
  return 0
}
