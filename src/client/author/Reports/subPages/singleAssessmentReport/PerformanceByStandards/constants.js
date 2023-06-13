export const pickDataForSummary = [
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
  'profileId',
]

export const pickDataForDetails = [
  ...pickDataForSummary,
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
