import { useEffect } from 'react'
import { isEmpty, reject } from 'lodash'

import { roleuser } from '@edulastic/constants'

import { staticDropDownData } from '../../../utils'

function useFiltersFromURL({
  filtersData,
  reportId,
  _onGoClick,
  filters,
  search,
  schoolYears,
  defaultTermId,
  performanceBandsList,
  userRole,
  availableAssessmentType,
  setFilterTagsData,
  setFilters,
  location,
  setShowApply,
  toggleFilter,
  fetchUpdateTagsData,
  setFirstLoad,
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
      const urlSubjects = staticDropDownData.subjects.filter(
        (item) => search.subjects && search.subjects.includes(item.key)
      )
      const urlGrades = staticDropDownData.grades.filter(
        (item) => search.grades && search.grades.includes(item.key)
      )
      const urlPerformanceBand =
        performanceBandsList.find((item) => item.key === search.profileId) ||
        performanceBandsList[0]

      const _filters = {
        termId: urlSchoolYear.key,
        testSubjects: urlTestSubjects.map((item) => item.key).join(',') || '',
        testGrades: urlTestGrades.map((item) => item.key).join(',') || '',
        tagIds: search.tagIds || '',
        assessmentTypes: search.assessmentTypes || '',
        testIds: search.testIds || '',
        schoolIds: search.schoolIds || '',
        teacherIds: search.teacherIds || '',
        subjects: urlSubjects.map((item) => item.key).join(',') || '',
        grades: urlGrades.map((item) => item.key).join(',') || '',
        courseId: search.courseId || 'All',
        classIds: search.classIds || '',
        groupIds: search.groupIds || '',
        profileId: urlPerformanceBand?.key || '',
      }
      if (userRole === roleuser.TEACHER) {
        delete _filters.schoolIds
        delete _filters.teacherIds
      }
      const assessmentTypesArr = (search.assessmentTypes || '').split(',')
      const _filterTagsData = {
        termId: urlSchoolYear,
        assessmentTypes: availableAssessmentType.filter((a) =>
          assessmentTypesArr.includes(a.key)
        ),
        subjects: urlSubjects,
        grades: urlGrades,
        profileId: urlPerformanceBand,
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
          testIds: reject(_filters.testIds?.split(','), isEmpty),
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
