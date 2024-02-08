import { reportGroupType } from '@edulastic/constants/const/report'
import { useEffect } from 'react'

function useFiltersFromUrl({
  location,
  termOptions,
  defaultTermId,
  search,
  staticDropDownData,
  reportId,
  setFilters,
  tempTagsData,
  setTempTagsData,
  urlStudentId,
  setStudent,
  setShowApply,
  toggleFilter,
  setFirstLoad,
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
    const urlAssignedBy =
      staticDropDownData.assignedBy.find((a) => a.key === search.assignedBy) ||
      staticDropDownData.assignedBy[0]
    const urlDomainId = search.domainId || 'All'
    const urlStandardId = search.standardId || 'All'
    const urlCurriculumId = search.curriculumId || 'All'

    const _filters = {
      reportId: reportId || '',
      termId: urlSchoolYear.key,
      grades: urlGrades.map((item) => item.key).join(',') || '',
      subjects: urlSubjects.map((item) => item.key).join(',') || '',
      classIds: search.classIds || '',
      courseIds: search.courseIds || '',
      performanceBandProfileId: '',
      standardsProficiencyProfileId: '',
      assignedBy: urlAssignedBy.key,
      domainId: urlDomainId,
      standardId: urlStandardId,
      curriculumId: urlCurriculumId,
    }
    const _tempTagsData = {
      ...tempTagsData,
      termId: urlSchoolYear,
      grades: urlGrades,
      subjects: urlSubjects,
      assignedBy: urlAssignedBy,
    }
    setFilters(_filters)
    setTempTagsData(_tempTagsData)
    if (urlStudentId) {
      setStudent({ key: urlStudentId })
    }
    if (location.state?.source === reportGroupType.STANDARD_REPORT) {
      setShowApply(true)
      toggleFilter(null, true)
      setFirstLoad(false)
    }
  }, [])
}

export default useFiltersFromUrl
