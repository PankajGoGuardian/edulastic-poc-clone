import { roleuser } from '@edulastic/constants'
import { useEffect } from 'react'
import { reportGroupType } from '@edulastic/constants/const/report'
import {
  EXTERNAL_SCORE_TYPES,
  getUrlTestTermIds,
} from '../../../../common/utils'

function useFiltersFromUrl({
  location,
  termOptions,
  search,
  staticDropDownData,
  defaultTermId,
  reportId,
  userRole,
  setFilters,
  filterTagsData,
  setFilterTagsData,
  setShowApply,
  toggleFilter,
  setFirstLoad,
  setStudent,
  urlStudentId,
}) {
  useEffect(() => {
    const urlSchoolYear =
      termOptions.find((item) => item.key === search.termId) ||
      termOptions.find((item) => item.key === defaultTermId) ||
      (termOptions[0] ? termOptions[0] : { key: '', title: '' })
    const urlSubjects = staticDropDownData.subjects.filter(
      (item) => search.subjects && search.subjects.includes(item.key)
    )
    const urlGrades = staticDropDownData.grades.filter(
      (item) => search.grades && search.grades.includes(item.key)
    )

    const urlTestTermIds = getUrlTestTermIds(termOptions, search.testTermIds)

    const _filters = {
      reportId: reportId || '',
      termId: urlSchoolYear.key,
      testTermIds:
        urlTestTermIds.map((item) => item.key).join(',') || urlSchoolYear.key,
      testUniqIds: search.testUniqIds || '',
      testSubjects: search.testSubjects || '',
      testGrades: search.testGrades || '',
      tagIds: search.tagIds || '',
      grades: urlGrades.map((item) => item.key).join(',') || '',
      subjects: urlSubjects.map((item) => item.key).join(',') || '',
      schoolIds: search.schoolIds || '',
      classIds: search.classIds || '',
      courseIds: search.courseIds || '',
      performanceBandProfileId: search.performanceBandProfileId || '',
      externalScoreType:
        search.externalScoreType || EXTERNAL_SCORE_TYPES.SCALED_SCORE,
      subActiveKey: search.subActiveKey || '',
    }
    if (!roleuser.DA_SA_ROLE_ARRAY.includes(userRole)) {
      delete _filters.schoolIds
    }
    const _filterTagsData = {
      ...filterTagsData,
      termId: urlSchoolYear,
      testTermIds: urlTestTermIds.length ? urlTestTermIds : [urlSchoolYear],
      grades: urlGrades,
      subjects: urlSubjects,
    }
    setFilters(_filters)
    setFilterTagsData(_filterTagsData)
    if (location.state?.source === reportGroupType.DATA_WAREHOUSE_REPORT) {
      setShowApply(true)
      toggleFilter(null, true)
      setFirstLoad(false)
    }
    if (urlStudentId) {
      setStudent({ key: urlStudentId })
    } else {
      setFirstLoad(false)
    }
  }, [])
}

export default useFiltersFromUrl
