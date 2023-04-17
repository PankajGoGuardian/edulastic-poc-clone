import { useEffect, useState, useMemo, useRef } from 'react'
import { keyBy, omit } from 'lodash'
import { notification } from '@edulastic/common'
import { formFieldNames, ATTENDANCE } from '../constants/form'
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
} = formFieldNames

const useSaveFormData = ({
  formType,
  fetchGroupsData,
  fetchPerformanceBandData,
  groupsData = [],
  performanceBandData = [],
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

  const performanceBandOptionsByKey = useMemo(() => {
    console.log('useMemo')
    return keyBy(performanceBandOptions, 'key')
  }, [performanceBandOptions])

  useEffect(() => {
    fetchGroupsData()
    fetchPerformanceBandData()
    setScrollContainer(formContainerRef?.current)
  }, [])

  useEffect(() => {
    console.log('groupsData', groupsData)
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
    console.log('performanceBandData', performanceBandData)
  }, [performanceBandData])

  const handleFieldDataChange = (field, value) => {
    let updatedFormData = { ...formData }
    if (field === STUDENT_GROUP_IDS) {
      value = [value] // TODO: remove when studentGroupIds field is made multiselect
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
        type: 'info',
        msg: errorMessage,
      })
      return
    }

    // TODO call save action
  }

  return {
    formData,
    groupOptions,
    performanceBandOptions,
    targetPerformanceBandOptions,
    scrollContainer,
    formNavigationOptions,
    formContainerRef,
    handleFieldDataChange,
    handleSaveForm,
    setFormNavigationOptions,
  }
}

export default useSaveFormData
