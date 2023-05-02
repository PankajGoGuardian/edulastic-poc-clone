import { useEffect } from 'react'
import { isEmpty, reject } from 'lodash'

import { roleuser } from '@edulastic/constants'

import { reportGroupType } from '@edulastic/constants/const/report'
import { staticDropDownData } from '../../../utils'

function useFiltersFromURL({
  _onGoClick,
  availableAssessmentType,
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
      const urlAssignedBy =
        staticDropDownData.assignedBy.find(
          (a) => a.key === search.assignedBy
        ) || staticDropDownData.assignedBy[0]
      const urlPeriod =
        staticDropDownData.periodTypes.find(
          (a) => a.key === search.periodType
        ) || staticDropDownData.periodTypes[0]

      const _filters = {
        termId: urlSchoolYear.key,
        testSubjects: urlTestSubjects.map((item) => item.key).join(',') || '',
        testGrades: urlTestGrades.map((item) => item.key).join(',') || '',
        assessmentTypes: search.assessmentTypes || '',
        testIds: search.testIds || '',
        schoolIds: search.schoolIds || '',
        teacherIds: search.teacherIds || '',
        subjects: urlSubjects.map((item) => item.key).join(',') || '',
        grades: urlGrades.map((item) => item.key).join(',') || '',
        courseId: search.courseId || 'All',
        classIds: search.classIds || '',
        groupIds: search.groupIds || '',

        assignedBy: urlAssignedBy.key,
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
      const assessmentTypesArr = (search.assessmentTypes || '').split(',')
      const _filterTagsData = {
        termId: urlSchoolYear,
        assessmentTypes: availableAssessmentType.filter((a) =>
          assessmentTypesArr.includes(a.key)
        ),
        subjects: urlSubjects,
        grades: urlGrades,
        assignedBy: urlAssignedBy,
        periodType: urlPeriod,
      }

      // set filterTagsData, filters and testId
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
          testIds: reject(_filters.testIds?.split(','), isEmpty),
          schoolIds: reject(_filters.schoolIds?.split(','), isEmpty),
          courseIds: reject([search.courseId], isEmpty),
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
