import { useEffect } from 'react'
import { capitalize, isEmpty, reject, isNil, groupBy as _groupBy } from 'lodash'

import { roleuser } from '@edulastic/constants'

import { staticDropDownData, compareByEnums } from '../../../utils/constants'
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
  demographics,
}) {
  useEffect(() => {
    if (isEmpty(filtersData)) return
    if (reportId) {
      _onGoClick({
        requestFilters: { ...filters, ...search },
        selectedFilterTagsData: {},
      })
    } else {
      const {
        termId,
        subjects,
        grades,
        periodType,
        schoolIds,
        teacherIds,
        classIds,
        groupIds,
        courseId,
        race,
        gender,
        iepStatus,
        frlStatus,
        ellStatus,
        hispanicEthnicity,
        customPeriodStart,
        customPeriodEnd,
        groupBy,
        profileId,
      } = search
      const urlSchoolYear =
        schoolYears.find((item) => item.key === termId) ||
        schoolYears.find((item) => item.key === defaultTermId) ||
        (schoolYears[0] ? schoolYears[0] : { key: '', title: '' })
      const urlSubjects = staticDropDownData.subjects.filter(
        (item) => subjects && subjects.includes(item.key)
      )
      const urlGrades = staticDropDownData.grades.filter(
        (item) => grades && grades.includes(item.key)
      )
      const urlPeriod =
        staticDropDownData.periodTypes.find((a) => a.key === periodType) ||
        staticDropDownData.periodTypes[0]

      const getClassFilterTagsValue = (list, data) => {
        return !isEmpty(list) && !isNil(data)
          ? list
              .filter((item) => data.includes(item._id))
              .map((itemObj) => ({
                key: itemObj._id,
                title: itemObj.title ? itemObj.title : itemObj.name,
              }))
          : { key: '', title: '' }
      }
      const schools = getClassFilterTagsValue(schoolList, schoolIds)
      const teachers = getClassFilterTagsValue(teacherList, teacherIds)
      const classes = getClassFilterTagsValue(classList, classIds)
      const groups = getClassFilterTagsValue(groupList, groupIds)
      const courses = getClassFilterTagsValue(courseList, [courseId])

      const demographicsGroupByKeys = _groupBy(demographics, 'key') || {}
      const getDemographicsFilterTagValue = (fieldName, searchValue) => {
        const dataList = demographicsGroupByKeys[fieldName]?.data || []
        if (!isEmpty(dataList) && !isNil(searchValue)) {
          return searchValue !== capitalize(allFilterValue)
            ? dataList.find((item) => item.title === searchValue)
            : { key: '', title: '' }
        }
        return { key: '', title: '' }
      }

      const raceFilterTag = getDemographicsFilterTagValue(
        compareByEnums.RACE,
        race
      )
      const genderFilterTag = getDemographicsFilterTagValue(
        compareByEnums.GENDER,
        gender
      )
      const iepStatusFilterTag = getDemographicsFilterTagValue(
        compareByEnums.IEP_STATUS,
        iepStatus
      )
      const frlStatusFilterTag = getDemographicsFilterTagValue(
        compareByEnums.FRL_STATUS,
        frlStatus
      )
      const ellStatusFilterTag = getDemographicsFilterTagValue(
        compareByEnums.ELL_STATUS,
        ellStatus
      )
      const hispanicEthnicityFilterTag = getDemographicsFilterTagValue(
        compareByEnums.HISPANIC_ETHNICITY,
        hispanicEthnicity
      )

      const _filters = {
        termId: urlSchoolYear.key,
        schoolIds: schoolIds || '',
        teacherIds: teacherIds || '',
        subjects: urlSubjects.map((item) => item.key).join(',') || '',
        grades: urlGrades.map((item) => item.key).join(',') || '',
        courseId: courseId || capitalize(allFilterValue),
        classIds: classIds || '',
        groupIds: groupIds || '',

        race: race || allFilterValue,
        gender: gender || allFilterValue,
        iepStatus: iepStatus || allFilterValue,
        frlStatus: frlStatus || allFilterValue,
        ellStatus: ellStatus || allFilterValue,
        hispanicEthnicity: hispanicEthnicity || allFilterValue,
        periodType: urlPeriod.key,
        customPeriodStart,
        customPeriodEnd,
        groupBy,
        profileId,
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
        courseId: courses,
        race: raceFilterTag,
        gender: genderFilterTag,
        iepStatus: iepStatusFilterTag,
        frlStatus: frlStatusFilterTag,
        ellStatus: ellStatusFilterTag,
        hispanicEthnicity: hispanicEthnicityFilterTag,
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
          courseIds: reject([courseId], isEmpty),
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
