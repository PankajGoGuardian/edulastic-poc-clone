import { useEffect, useState, useMemo, useRef } from 'react'
import { keyBy, omit } from 'lodash'
import { notification } from '@edulastic/common'
import { formFieldNames, ATTENDANCE, INTERVENTION } from '../constants/form'
import { validateAndGetFormattedFormData } from '../utils'

const {
  goal: {
    PERFORMANCE_BAND_ID,
    STUDENT_GROUP_IDS,
    MEASURE_TYPE,
    METRIC,
    TYPE,
    TEST_TYPES,
    SUBJECTS,
    STANDARD_DETAILS,
    THRESHOLD,
  },
  intervention: { RELATED_GOALS_IDS },
} = formFieldNames

const useSaveFormData = ({
  formType,
  fetchGroupsData,
  fetchPerformanceBandData,
  fetchGoalsList,
  groupsData = [],
  performanceBandData = [],
  goalsOptionsData = [],
  saveFormData,
}) => {
  const formContainerRef = useRef()
  const [scrollContainer, setScrollContainer] = useState(null)
  const [formNavigationOptions, setFormNavigationOptions] = useState([])
  const [formData, setFormData] = useState({ formType })
  const [groupOptions, setGroupOptions] = useState([])
  const [performanceBandOptions, setPerformanceBandOptions] = useState([])
  const [
    targetPerformanceBandOptions,
    setTargetPerformanceBandOptions,
  ] = useState([])
  const [goalsOptions, setGoalsOptions] = useState([])

  const performanceBandOptionsByKey = useMemo(() => {
    return keyBy(performanceBandOptions, 'key')
  }, [performanceBandOptions])

  useEffect(() => {
    setScrollContainer(formContainerRef?.current)
    fetchGroupsData()
    fetchPerformanceBandData()
    if (formType === INTERVENTION) {
      fetchGoalsList()
    }
  }, [])

  useEffect(() => {
    const groupsDataOptions = (groupsData || []).map(({ _id, name }) => ({
      key: _id,
      title: name,
    }))
    setGroupOptions(groupsDataOptions)
  }, [groupsData])

  useEffect(() => {
    const performanceBandDataOptions = (performanceBandData || []).map(
      ({ _id, name, performanceBand }) => ({
        key: _id,
        title: name,
        performanceBand: (performanceBand || []).map(
          ({ name: performanceBandName }) => ({
            key: performanceBandName,
            title: performanceBandName,
          })
        ),
      })
    )
    setPerformanceBandOptions(performanceBandDataOptions)
  }, [performanceBandData])

  useEffect(() => {
    const goalsDataOptions = (goalsOptionsData || []).map(({ _id, name }) => ({
      key: _id,
      title: name,
    }))
    setGoalsOptions(goalsDataOptions)
  }, [goalsOptionsData])

  const handleFieldDataChange = (field, value) => {
    let updatedFormData = { ...formData }
    if (
      field === STUDENT_GROUP_IDS ||
      field === TEST_TYPES ||
      field === RELATED_GOALS_IDS
    ) {
      // TODO: remove when studentGroupIds, TEST_TYPES field is made multiselect
      value = [value]
    }
    if (field === PERFORMANCE_BAND_ID) {
      setTargetPerformanceBandOptions(
        performanceBandOptionsByKey[value]?.performanceBand || []
      )
      updatedFormData = omit(updatedFormData, [METRIC])
    }
    if (field === MEASURE_TYPE) {
      setTargetPerformanceBandOptions([])
      updatedFormData = omit(updatedFormData, [METRIC, PERFORMANCE_BAND_ID])
    }
    if (field === TYPE && value === ATTENDANCE) {
      updatedFormData = omit(updatedFormData, [
        TEST_TYPES,
        SUBJECTS,
        STANDARD_DETAILS,
      ])
    }
    if (
      (field === THRESHOLD || field === METRIC) &&
      typeof value === 'number'
    ) {
      value = Math.round(value)
    }
    updatedFormData[field] = value
    setFormData(updatedFormData)
  }

  const handleSaveForm = () => {
    const {
      formattedFormData,
      error,
      errorMessage,
    } = validateAndGetFormattedFormData(formData)

    if (error) {
      notification({
        type: 'warning',
        msg: errorMessage,
      })
      return
    }

    saveFormData(formattedFormData)
  }

  return {
    formData,
    groupOptions,
    performanceBandOptions,
    targetPerformanceBandOptions,
    goalsOptions,
    scrollContainer,
    formNavigationOptions,
    formContainerRef,
    handleFieldDataChange,
    handleSaveForm,
    setFormNavigationOptions,
  }
}

export default useSaveFormData
