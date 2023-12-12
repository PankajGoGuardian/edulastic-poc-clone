import { useEffect } from 'react'
import { get, isEmpty, reject } from 'lodash'

import { roleuser } from '@edulastic/constants'

import { reportGroupType } from '@edulastic/constants/const/report'
import { staticDropDownData } from '../../../utils'
import {
  getDefaultTestTypesForUser,
  getDemographicsFilterTagsData,
} from '../../../../common/utils'

function useFiltersFromURL({
  _onGoClick,
  defaultTermId,
  fetchUpdateTagsData,
  filters,
  filtersData,
  availableTestTypes,
  location,
  reportId,
  schoolYears,
  search,
  setFilters,
  setFilterTagsData,
  setFirstLoad,
  setShowApply,
  toggleFilter,
  userRole,
}) {
  useEffect(() => {
    if (isEmpty(filtersData)) return
    if (reportId) {
      _onGoClick({
        requestFilters: { ...filters, ...search },
        selectedFilterTagsData: {},
      })
    } else {
      const urlSchoolYear =
        schoolYears.find((item) => item.key === search.termId) ||
        schoolYears.find((item) => item.key === defaultTermId) ||
        (schoolYears[0] ? schoolYears[0] : { key: '', title: '' })
      const urlTestSubjects = staticDropDownData.subjects.filter(
        (item) => search.testSubjects && search.testSubjects.includes(item.key)
      )
      const urlTestGrades = staticDropDownData.grades.filter(
        (item) => search.testGrades && search.testGrades.includes(item.key)
      )

      const testTypes = filtersData?.data?.result?.testTypes
      const defaultTestTypes = getDefaultTestTypesForUser(testTypes, userRole)
      const urlAssessmentTypesKeys = (
        search.assessmentTypes || defaultTestTypes
      )
        .split(',')
        .filter((t) => t)
      const urlAssessmentTypes = availableTestTypes.filter((a) =>
        urlAssessmentTypesKeys.includes(a.key)
      )

      const urlSubjects = staticDropDownData.subjects.filter(
        (item) => search.subjects && search.subjects.includes(item.key)
      )
      const urlGrades = staticDropDownData.grades.filter(
        (item) => search.grades && search.grades.includes(item.key)
      )
      const urlPeriod =
        staticDropDownData.periodTypes.find(
          (a) => a.key === search.periodType
        ) || staticDropDownData.periodTypes[0]

      const _filters = {
        termId: urlSchoolYear.key,
        testSubjects: urlTestSubjects.map((item) => item.key),
        testGrades: urlTestGrades.map((item) => item.key),
        assessmentTypes: urlAssessmentTypes.map((item) => item.key),
        schoolIds: search.schoolIds || '',
        teacherIds: search.teacherIds || '',
        subjects: urlSubjects.map((item) => item.key).join(','),
        grades: urlGrades.map((item) => item.key).join(','),
        courseId: search.courseId || 'All',
        classIds: search.classIds || '',
        groupIds: search.groupIds || '',
        race: search.race || 'all',
        gender: search.gender || 'all',
        iepStatus: search.iepStatus || 'all',
        frlStatus: search.frlStatus || 'all',
        ellStatus: search.ellStatus || 'all',
        hispanicEthnicity: search.hispanicEthnicity || 'all',
        periodType: urlPeriod.key,
        riskType: search.riskType || staticDropDownData.riskTypes[0].key,
        customPeriodStart: search.customPeriodStart,
        customPeriodEnd: search.customPeriodEnd,
      }
      if (userRole === roleuser.TEACHER) {
        delete _filters.schoolIds
        delete _filters.teacherIds
      }

      const demographics = get(filtersData, 'data.result.demographics')
      const demographicsFilterTagsData = getDemographicsFilterTagsData(
        search,
        demographics
      )
      const _filterTagsData = {
        termId: urlSchoolYear,
        testSubjects: urlTestSubjects,
        testGrades: urlTestGrades,
        assessmentTypes: urlAssessmentTypes,
        subjects: urlSubjects,
        grades: urlGrades,
        periodType: urlPeriod,

        ...demographicsFilterTagsData,
      }

      // set filterTagsData and filters
      setFilterTagsData(_filterTagsData)
      setFilters(_filters)
      if (location.state?.source === reportGroupType.DATA_WAREHOUSE_REPORT) {
        setShowApply(true)
        toggleFilter(null, true)
      } else {
        _onGoClick({
          requestFilters: { ..._filters },
          selectedFilterTagsData: { ..._filterTagsData },
        })
        fetchUpdateTagsData({
          schoolIds: reject(_filters.schoolIds?.split(','), isEmpty),
          courseId: reject([search.courseId], isEmpty),
          classIds: reject(_filters.classIds?.split(','), isEmpty),
          groupIds: reject(_filters.groupIds?.split(','), isEmpty),
          teacherIds: reject(_filters.teacherIds?.split(','), isEmpty),
          options: {
            termId: _filters.termId,
            schoolIds: reject(_filters.schoolIds?.split(','), isEmpty),
          },
        })
      }
    }
    setFirstLoad(false)
  }, [filtersData])
}

export default useFiltersFromURL
