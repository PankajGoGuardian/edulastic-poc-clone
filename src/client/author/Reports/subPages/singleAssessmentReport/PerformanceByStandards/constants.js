const pickCommonData = [
  'reportId',
  'termId',
  'assessmentTypes',
  'assignedBy',
  'classIds',
  'courseId',
  'grades',
  'groupIds',
  'networkIds',
  'schoolIds',
  'subjects',
  'teacherIds',
  'testId',
  'race',
  'gender',
  'iepStatus',
  'frlStatus',
  'ellStatus',
  'hispanicEthnicity',
]
export const pickDataForSummary = [
  ...pickCommonData,
  'standardsProficiencyProfile',
]

export const pickDataForDetails = [
  ...pickCommonData,
  'compareBy',
  'analyseBy',
  'page',
  'pageSize',
  'recompute',
  'sorkKey',
  'sortOrder',
]

export const sortOrderMap = {
  ascend: 'asc',
  descend: 'desc',
}
