import { useEffect } from 'react'
import { get, isEmpty, reject } from 'lodash'

import { roleuser } from '@edulastic/constants'

import { staticDropDownData } from '../../../utils'
import { getDemographicsFilterTagsData } from '../../../../common/utils'

function useFiltersFromURL({
  _onGoClick,
  defaultTermId,
  fetchUpdateTagsData,
  filters,
  filtersData,
  prevFiltersData,
  location,
  reportId,
  schoolYears,
  performanceBandsList,
  availableAssessmentType,
  search,
  setFilters,
  setPrevFiltersData,
  setFilterTagsData,
  setFirstLoad,
  setShowApply,
  toggleFilter,
  userRole,
}) {
  useEffect(() => {
    if (filtersData !== prevFiltersData && !isEmpty(filtersData)) {
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
          (item) =>
            search.testSubjects && search.testSubjects.includes(item.key)
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

        const urlPrePerformanceBand =
          performanceBandsList.find(
            (item) => item.key === search.preProfileId
          ) || performanceBandsList[0]

        const urlPostPerformanceBand =
          performanceBandsList.find(
            (item) => item.key === search.postProfileId
          ) || performanceBandsList[0]

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
          preTestId: search.preTestId || '',
          postTestId: search.postTestId || '',
          preProfileId: urlPrePerformanceBand?.key || '',
          postProfileId: urlPostPerformanceBand?.key || '',
        }
        if (userRole === roleuser.TEACHER) {
          delete _filters.schoolIds
          delete _filters.teacherIds
        }
        const assessmentTypesArr = (search.assessmentTypes || '').split(',')
        const demographics = get(filtersData, 'data.result.demographics')
        const demographicsFilterTagsData = getDemographicsFilterTagsData(
          search,
          demographics
        )
        const _filterTagsData = {
          termId: urlSchoolYear,
          testSubjects: urlTestSubjects,
          testGrades: urlTestGrades,
          assessmentTypes: availableAssessmentType.filter((a) =>
            assessmentTypesArr.includes(a.key)
          ),
          subjects: urlSubjects,
          grades: urlGrades,

          ...demographicsFilterTagsData,
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
            selectedCompareBy: search.selectedCompareBy,
            selectedFilterTagsData: { ..._filterTagsData },
          })
          fetchUpdateTagsData({
            schoolIds: reject(_filters.schoolIds?.split(','), isEmpty),
            teacherIds: reject(_filters.teacherIds?.split(','), isEmpty),
            courseId: reject([search.courseId], isEmpty),
            classIds: reject(_filters.classIds?.split(','), isEmpty),
            groupIds: reject(_filters.groupIds?.split(','), isEmpty),
            tagIds: reject(_filters.tagIds?.split(','), isEmpty),
            options: {
              termId: _filters.termId,
              schoolIds: reject(_filters.schoolIds?.split(','), isEmpty),
            },
          })
        }
      }
      setFirstLoad(false)
      // update prevMARFilterData
      setPrevFiltersData(filtersData)
    }
  }, [filtersData, prevFiltersData])
}

export default useFiltersFromURL
