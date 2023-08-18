const {
  comDataForDropDown,
  compareByKeys,
  compareByKeyToNameMap,
  compareByDropDownData,
  analyseByKeys,
  analyseByKeyToNameMap,
  analyseByDropDownData,
} = require('../standardsGradebook/constants')

const CHART_PAGE_SIZE = 10
const TABLE_PAGE_SIZE = 50

const SortKeys = {
  DIMENSION: 'dimension',
  PERFORMANCE: 'performance',
}

const SortOrders = {
  ASCEND: 'ascend',
  DESCEND: 'descend',
}

const SortOrdersMap = {
  [SortOrders.ASCEND]: 'asc',
  [SortOrders.DESCEND]: 'desc',
}

const FilterSummaryFields = [
  'termId',
  'assessmentTypes',
  'assignedBy',
  'classIds',
  'courseId',
  'curriculumId',
  'standardId',
  'domainIds',
  'grades',
  'groupIds',
  'profileId',
  'schoolIds',
  'standardGrade',
  'subjects',
  'teacherIds',
  'testIds',
  'race',
  'gender',
  'iepStatus',
  'frlStatus',
  'ellStatus',
  'hispanicEthnicity',
]
const DetailsExtraFields = [
  'compareBy',
  'analyzeBy',
  'rowPage',
  'rowPageSize',
  'sortOrder',
  'sortKey',
  'requireTotalCount',
]
const SharedSummaryFields = ['reportId', 'standardId', 'testIds']
const FilterDetailsFields = [...FilterSummaryFields, ...DetailsExtraFields]
const SharedDetailsFields = [...SharedSummaryFields, ...DetailsExtraFields]

module.exports = {
  CHART_PAGE_SIZE,
  TABLE_PAGE_SIZE,
  SortKeys,
  SortOrders,
  SortOrdersMap,
  FilterSummaryFields,
  SharedSummaryFields,
  SharedDetailsFields,
  FilterDetailsFields,
  ComDataForDropDown: comDataForDropDown,
  CompareByKeys: compareByKeys,
  CompareByKeyToNameMap: compareByKeyToNameMap,
  CompareByDropDownData: compareByDropDownData,
  AnalyseByKeys: analyseByKeys,
  AnalyseByKeyToNameMap: analyseByKeyToNameMap,
  AnalyseByDropDownData: analyseByDropDownData,
}
