import { uniqBy } from 'lodash'

export const getDomainOptions = (data) => [
  { key: 'All', title: 'All Domains' },
  ...uniqBy(data, 'domainId').map((x) => ({
    key: x.domainId.toString(),
    title: x.domain,
  })),
]

export const getStandardsOptions = (data, selectedDomain) => [
  { key: 'All', title: 'All Standards' },
  ...uniqBy(
    data.filter(
      (x) =>
        x.domainId.toString() === selectedDomain.key ||
        selectedDomain.key === 'All'
    ),
    'standardId'
  ).map((x) => ({
    key: x.standardId.toString(),
    title: x.standard,
  })),
]

export const filterMetricInfo = (
  metricInfo,
  selectedDomain,
  selectedStandard
) =>
  metricInfo.filter(
    (x) =>
      (x.domainId === selectedDomain.key || selectedDomain.key === 'All') &&
      (x.standardId === selectedStandard.key || selectedStandard.key === 'All')
  )
