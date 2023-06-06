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
  oneDayInhours,
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
      ({ field, isRequired, label, isRequiredCustomPromptMessage = '' }) => {
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
            errorMessage =
              [STUDENT_GROUP_IDS].indexOf(field) !== -1
                ? isRequiredCustomPromptMessage
                : `${label} cannot be empty`
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

export const isTimeLeftWithinCertainPercent = (timeLeft, totalTime, value) =>
  timeLeft / totalTime <= getPercentage(value)

export const isTimeLeftOverCertainPercent = (timeLeft, totalTime, value) =>
  timeLeft / totalTime > getPercentage(value)

export const getTotalDaysBetweenTwoDates = (startDate, endDate) => {
  const remainingHours = moment(endDate).diff(startDate, 'hours')

  return Math.ceil(remainingHours / oneDayInhours)
}

export const getDaysLeft = (
  goalOrInterventionStartDate,
  goalOrInterventionEndDate
) => {
  let remainingHours = 0
  if (
    +moment() >= goalOrInterventionStartDate &&
    +moment() <= goalOrInterventionEndDate
  ) {
    remainingHours = moment(goalOrInterventionEndDate).diff(+moment(), 'hours')
  }

  if (+moment() < goalOrInterventionStartDate) {
    return getTotalDaysBetweenTwoDates(
      goalOrInterventionStartDate,
      goalOrInterventionEndDate
    )
  }

  return Math.ceil(remainingHours / oneDayInhours)
}

const getTargetAndCurrentData = (record) => {
  const { metric: targetValue = '', measureType } = getTarget(record)
  const {
    current: { value: currentValue, isGreaterThanTargetBand } = {},
  } = record
  const checkWithBandFlag = measureType === PERFORMANCE_BAND

  return {
    checkWithBandFlag,
    isGreaterThanTargetBand,
    currentValue,
    targetValue,
  }
}

export const isCurrentValueInValid = (record) => {
  const {
    checkWithBandFlag,
    isGreaterThanTargetBand,
    currentValue,
  } = getTargetAndCurrentData(record)

  return checkWithBandFlag
    ? typeof isGreaterThanTargetBand !== 'boolean'
    : typeof currentValue !== 'string'
}

export const hasCurrentReachedTarget = (record) => {
  const {
    checkWithBandFlag,
    isGreaterThanTargetBand,
    currentValue,
    targetValue,
  } = getTargetAndCurrentData(record)

  if (checkWithBandFlag) {
    return isGreaterThanTargetBand
  }

  /**
   * The values coming from DB are of string type.
   * For measureType averageScore/minimumScore convert to number and then compare
   */
  return Math.round(+currentValue) >= Math.round(+targetValue)
}

export const getSummaryStatusRecords = ({ key, data, count = true }) => {
  const completedStatus = [GI_STATUS.FULLY_EXECUTED, GI_STATUS.DONE]
  const inProgressCondition = (record) => {
    return record.status === GI_STATUS.IN_PROGRESS
  }
  const completedCondition = (record) => completedStatus.includes(record.status)

  const summaryStatusCountMap = {
    met: (record) => {
      return (
        !isCurrentValueInValid(record) &&
        hasCurrentReachedTarget(record) &&
        completedStatus.includes(record.status)
      )
    },
    'not-met': (record) => {
      return (
        !isCurrentValueInValid(record) &&
        !hasCurrentReachedTarget(record) &&
        completedStatus.includes(record.status)
      )
    },
    'partially-met': (record) => {
      return (
        !isCurrentValueInValid(record) &&
        hasCurrentReachedTarget(record) &&
        record.status === GI_STATUS.PARTIALLY_EXECUTED
      )
    },
    'partially-not-met': (record) => {
      return (
        !isCurrentValueInValid(record) &&
        !hasCurrentReachedTarget(record) &&
        record.status === GI_STATUS.PARTIALLY_EXECUTED
      )
    },
    'off-track': (record) => {
      return (
        !isCurrentValueInValid(record) &&
        !hasCurrentReachedTarget(record) &&
        isTimeLeftWithinCertainPercent(
          getDaysLeft(record.startDate, record.endDate),
          getTotalDaysBetweenTwoDates(record.startDate, record.endDate),
          MULTIPLE_OF_TENS.TWENTY
        ) &&
        record.status === GI_STATUS.IN_PROGRESS
      )
    },
    rest: (record) => {
      return (
        (isCurrentValueInValid(record) ||
          hasCurrentReachedTarget(record) ||
          !isTimeLeftWithinCertainPercent(
            getDaysLeft(record.startDate, record.endDate),
            getTotalDaysBetweenTwoDates(record.startDate, record.endDate),
            MULTIPLE_OF_TENS.TWENTY
          )) &&
        record.status === GI_STATUS.IN_PROGRESS
      )
    },
    'fully-executed': completedCondition,
    done: completedCondition,
    'on-going': inProgressCondition,
    'in-progress': inProgressCondition,
  }

  const filterMethod = summaryStatusCountMap?.[key]
  const result = filterMethod ? data.filter(filterMethod) : []
  if (!count) {
    return result
  }
  return result.length
}
