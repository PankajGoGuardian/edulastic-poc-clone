/**
 * TODO: verify the usage and fix this function for student groups
 */
export const transformMetricForStudentGroups = (groups, metricInfo) => {
  const studentGroupsMap = {}
  groups.forEach((group) => {
    if (group.groupType === 'custom') {
      if (!studentGroupsMap[group.studentId]) {
        studentGroupsMap[group.studentId] = []
      }
      studentGroupsMap[group.studentId].push({
        groupId: group.groupId,
        groupName: group.groupName,
      })
    }
  })

  // filter student based on student groups
  // and replace group info with student group info in meticInfo
  const metics = []
  metricInfo.forEach((info) => {
    if (studentGroupsMap[info.studentId]) {
      metics.push(
        ...studentGroupsMap[info.studentId].map(({ groupId, groupName }) => ({
          ...info,
          groupId,
          groupName,
        }))
      )
    }
  })
  return metics
}
