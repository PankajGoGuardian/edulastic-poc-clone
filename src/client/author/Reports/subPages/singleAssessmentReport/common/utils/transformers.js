export const transformFiltersForSAR = ({
  grade,
  subject,
  studentGrade,
  studentSubject,
  studentCourseId,
  classId,
  classIds,
  groupId,
  groupIds,
  performanceBandProfile,
  ...requestFilters
}) => {
  classIds = classIds && Array.isArray(classIds) ? classIds.join(',') : classId
  groupIds = groupIds && Array.isArray(groupIds) ? groupIds.join(',') : groupId
  return {
    ...requestFilters,
    testGrade: grade,
    testSubject: subject,
    grade: studentGrade,
    subject: studentSubject,
    courseId: studentCourseId,
    classIds: classIds || '',
    groupIds: groupIds || '',
    profileId: performanceBandProfile,
  }
}

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
