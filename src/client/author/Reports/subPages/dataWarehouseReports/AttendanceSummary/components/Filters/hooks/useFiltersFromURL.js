import { useEffect } from 'react'
import { capitalize, isEmpty, reject } from 'lodash'

import { roleuser } from '@edulastic/constants'

import { staticDropDownData } from '../../../utils/constants'
import { allFilterValue } from '../../../../../../common/constants'

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
  schoolList,
  teacherList,
  classList,
  groupList,
  courseList,
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

      const getFilterTagsValue = (list, data) => {
        return !isEmpty(list)
          ? list
              .filter((item) => data.includes(item._id))
              .map((itemObj) => ({ key: itemObj._id, title: itemObj.title }))
          : { key: '', title: '' }
      }
      const schools = getFilterTagsValue(schoolList, search.schoolIds)
      const teachers = getFilterTagsValue(teacherList, search.teacherIds)
      const classes = getFilterTagsValue(classList, search.classIds)
      const groups = getFilterTagsValue(groupList, search.groupIds)
      const courses = getFilterTagsValue(courseList, [search.courseId])

      const _filters = {
        termId: urlSchoolYear.key,
        schoolIds: search.schoolIds || '',
        teacherIds: search.teacherIds || '',
        subjects: urlSubjects.map((item) => item.key).join(',') || '',
        grades: urlGrades.map((item) => item.key).join(',') || '',
        courseId: search.courseId || capitalize(allFilterValue),
        classIds: search.classIds || '',
        groupIds: search.groupIds || '',

        race: search.race || allFilterValue,
        gender: search.gender || allFilterValue,
        iepStatus: search.iepStatus || allFilterValue,
        frlStatus: search.frlStatus || allFilterValue,
        ellStatus: search.ellStatus || allFilterValue,
        hispanicEthnicity: search.hispanicEthnicity || allFilterValue,
        periodType: urlPeriod.key,
        customPeriodStart: search.customPeriodStart,
        customPeriodEnd: search.customPeriodEnd,
        groupBy: search.groupBy,
        profileId: search.profileId,
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
        schoolIds: schools,
        teacherIds: teachers,
        classIds: classes,
        groupIds: groups,
        courseIds: courses,
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
