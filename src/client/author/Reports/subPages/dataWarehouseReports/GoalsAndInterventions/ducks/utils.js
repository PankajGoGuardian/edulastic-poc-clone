export const updateStudentCount = (data) => {
  data.forEach((item) => {
    if (!item.studentCount) {
      item.studentCount = (item.groupMembers || []).length
    }
  })

  return data
}
