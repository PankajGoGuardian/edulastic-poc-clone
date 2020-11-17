/**
 * TODO: verify the usage and fix this function for student groups
 */
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
