import { useEffect } from 'react'
import { isEmpty, reject } from 'lodash'

import { roleuser } from '@edulastic/constants'

import { staticDropDownData } from '../../../utils/constants'

function useFiltersFromURL({
  _onGoClick,
  defaultTermId,
  fetchUpdateTagsData,
  filters,
  filtersData,
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
        schoolIds: search.schoolIds || '',
        teacherIds: search.teacherIds || '',
        subjects: urlSubjects.map((item) => item.key).join(',') || '',
        grades: urlGrades.map((item) => item.key).join(',') || '',
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
        customPeriodStart: search.customPeriodStart,
        customPeriodEnd: search.customPeriodEnd,
      }
      if (userRole === roleuser.TEACHER) {
        delete _filters.schoolIds
        delete _filters.teacherIds
      }
      const _filterTagsData = {
        termId: urlSchoolYear,
        subjects: urlSubjects,
        grades: urlGrades,
        periodType: urlPeriod,
      }

      // set filterTagsData, filters and testId
      setFilterTagsData(_filterTagsData)
      setFilters(_filters)
      if (location.state?.source === 'data-warehouse-reports') {
        setShowApply(true)
        toggleFilter(null, true)
      } else {
        _onGoClick({
          requestFilters: { ..._filters },
          selectedFilterTagsData: { ..._filterTagsData },
        })
        fetchUpdateTagsData({
          schoolIds: reject(_filters.schoolIds?.split(','), isEmpty),
          courseIds: reject([search.courseId], isEmpty),
          classIds: reject(_filters.classIds?.split(','), isEmpty),
          groupIds: reject(_filters.groupIds?.split(','), isEmpty),
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
