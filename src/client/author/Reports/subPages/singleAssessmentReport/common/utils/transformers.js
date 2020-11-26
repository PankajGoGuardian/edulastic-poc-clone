const getFormattedString = (prop) => (prop ? Array.from(prop).join(',') : '')

export const transformFiltersForSAR = (requestFilters = {}) => ({
  ...requestFilters,
  classIds: getFormattedString(
    requestFilters.classIds || requestFilters.classId
  ),
  groupIds: getFormattedString(
    requestFilters.groupIds || requestFilters.groupId
  ),
  assessmentTypes: requestFilters?.assessmentTypes || '',
  teacherIds: requestFilters.teacherIds,
  schoolIds: requestFilters.schoolIds,
  grade: requestFilters.studentGrade,
  courseId: requestFilters.studentCourseId,
  subject: requestFilters.studentSubject,
  profileId: requestFilters.performanceBandProfile,
})

export const transformMetricForStudentGroups = (
  studentGroupInfo = [],
  metricInfo = []
) => {
  const studentToGroupsMap = {}
  // curate studentId to groups mapping
  studentGroupInfo.forEach((group) => {
    if (group.groupType === 'custom' && group.students?.length) {
      group.students.forEach((studentId) => {
        if (!studentToGroupsMap[studentId]) {
          studentToGroupsMap[studentId] = []
        }
        studentToGroupsMap[studentId].push({
          groupId: group.groupId,
          groupName: group.groupName,
        })
      })
    }
  })

  // replace group info with student group info in metricInfo
  const transformedMetrics = []
  metricInfo.forEach((studentMetric) => {
    const studentGroupList = studentToGroupsMap[studentMetric.studentId]
    if (studentGroupList) {
      const studentGroupMetrics = studentGroupList.map((studentGroup) => ({
        ...studentMetric,
        ...studentGroup,
      }))
      transformedMetrics.push(...studentGroupMetrics)
    }
  })
  return transformedMetrics
}
