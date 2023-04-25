import { notification } from '@edulastic/common'
import { keyBy, omit } from 'lodash'
import { useEffect, useMemo, useRef, useState } from 'react'
import { validateAndGetFormattedFormData } from '../common/utils'
import { ATTENDANCE, INTERVENTION, formFieldNames } from '../constants/form'

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
  fetchAttendanceBandData,
  attendanceBandData = [],
  termDetails,
}) => {
  const { _id: termId } = termDetails
  const formContainerRef = useRef()
  const [scrollContainer, setScrollContainer] = useState(null)
  const [formNavigationOptions, setFormNavigationOptions] = useState([])
  const [formData, setFormData] = useState({ formType, termId })
  const [groupOptions, setGroupOptions] = useState([])
  const [performanceBandOptions, setPerformanceBandOptions] = useState([])
  const [attendanceBandOptions, setAttendanceBandOptions] = useState([])
  const [
    targetPerformanceBandOptions,
    setTargetPerformanceBandOptions,
  ] = useState([])

  const [
    targetAttendanceBandOptions,
    setTargetAttendanceBandOptions,
  ] = useState([])

  const [goalsOptions, setGoalsOptions] = useState([])

  const performanceBandOptionsByKey = useMemo(() => {
    return keyBy(performanceBandOptions, 'key')
  }, [performanceBandOptions])

  const attendanceBandOptionsByKey = useMemo(() => {
    return keyBy(attendanceBandOptions, 'key')
  }, [attendanceBandOptions])

  useEffect(() => {
    setScrollContainer(formContainerRef?.current)
    fetchGroupsData()
    fetchPerformanceBandData()
    fetchAttendanceBandData()
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
        performanceBand: (performanceBand || [])
          .sort((a, b) => a.to - b.to)
          .map(({ name: performanceBandName, from, to }) => ({
            key: performanceBandName,
            title: `${performanceBandName} (${to}-${from})`,
          })),
      })
    )
    setPerformanceBandOptions(performanceBandDataOptions)
  }, [performanceBandData])

  useEffect(() => {
    const attendanceBandDataOptions = (attendanceBandData || []).map(
      ({ _id, name, bands }) => ({
        key: _id,
        title: name,
        performanceBand: (bands || [])
          .sort((a, b) => a.min - b.min)
          .map(({ name: performanceBandName, min, max }) => ({
            key: performanceBandName,
            title: `${performanceBandName} (${min}-${max})`,
          })),
      })
    )
    setAttendanceBandOptions(attendanceBandDataOptions)
  }, [attendanceBandData])

  useEffect(() => {
    const goalsDataOptions = (goalsOptionsData || []).map(({ _id, name }) => ({
      key: _id,
      title: name,
    }))
    setGoalsOptions(goalsDataOptions)
  }, [goalsOptionsData])

  const handleFieldDataChange = (field, value) => {
    let updatedFormData = { ...formData }
    if (field === STUDENT_GROUP_IDS || field === TEST_TYPES) {
      // TODO: remove when studentGroupIds, TEST_TYPES field is made multiselect
      if (value) {
        value = [value]
      } else {
        value = undefined
      }
    }
    if (field === PERFORMANCE_BAND_ID) {
      setTargetPerformanceBandOptions(
        performanceBandOptionsByKey[value]?.performanceBand || []
      )

      setTargetAttendanceBandOptions(
        attendanceBandOptionsByKey[value]?.performanceBand || []
      )

      updatedFormData = omit(updatedFormData, [METRIC])
    }
    if (field === MEASURE_TYPE) {
      setTargetPerformanceBandOptions([])
      updatedFormData = omit(updatedFormData, [METRIC, PERFORMANCE_BAND_ID])
    }
    if (field === TYPE) {
      updatedFormData = omit(updatedFormData, [
        METRIC,
        PERFORMANCE_BAND_ID,
        MEASURE_TYPE,
      ])
    }
    if (field === TYPE && value === ATTENDANCE) {
      updatedFormData = omit(updatedFormData, [
        TEST_TYPES,
        SUBJECTS,
        STANDARD_DETAILS,
      ])
    }
    if (field === SUBJECTS) {
      updatedFormData = omit(updatedFormData, [STANDARD_DETAILS])
    }
    if (
      (field === THRESHOLD || field === METRIC) &&
      typeof value === 'number'
    ) {
      value = Math.round(value)
    }
    if (value) {
      updatedFormData[field] = value
    } else {
      delete updatedFormData[field]
    }
    setFormData(updatedFormData)
  }

  const handleSaveForm = () => {
    const {
      formattedFormData,
      error,
      errorMessage,
    } = validateAndGetFormattedFormData(formData, termDetails)

    if (error) {
      notification({
        type: 'warning',
        msg: errorMessage,
      })
      return
    }

    saveFormData(formattedFormData)
  }

  const resetForm = () => {
    setFormData({ formType, termId })
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
    attendanceBandOptions,
    targetAttendanceBandOptions,
    resetForm,
  }
}

export default useSaveFormData
