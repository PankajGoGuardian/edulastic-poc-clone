import { flatMap, groupBy, map, maxBy, sortBy, sumBy } from 'lodash'
import { downloadCSV } from '../../../common/util'

export const MULTIPART_LABEL = 'Multipart'
export const NOT_AVAILABLE_LABEL = 'NA'

export function onCsvConvert(data, rawData) {
  // extract all rows except the columns name
  const csvRows = rawData.splice(1, rawData.length)
  const modifiedCsvRows = csvRows.map((csvRow) => {
    const item = csvRow[6]
    csvRow[6] = `"${item
      .replace(/"/g, '')
      .replace(/%/g, '%,')
      .split(',')
      .filter((_item) => _item)
      .map((_item) => {
        const option = _item.replace(/\d+%/g, '')
        if (option === NOT_AVAILABLE_LABEL) return NOT_AVAILABLE_LABEL
        const number = _item.match(/\d+%/g)?.[0]
        return `${option ? `${option} :` : ''} ${number || 'N/A'}`
      })
      .join(', ')}"`

    return csvRow.join(',')
  })
  const csvData = [rawData[0].join(','), ...modifiedCsvRows].join('\n')
  downloadCSV(`Response Frequency.csv`, csvData)
}

export const filterData = (data, filter) =>
  Object.keys(filter).length > 0
    ? data.filter((item) => filter[item.qType])
    : data

export function getTableData(metricInfo, isCsvDownloading) {
  const sortedMetricInfo = sortBy(metricInfo, 'qLabel')
  const groupedMetricInfo = groupBy(sortedMetricInfo, 'testItemId')

  const result = flatMap(Object.keys(groupedMetricInfo), (key) => {
    const data = groupedMetricInfo[key]
    if (!data[0].multipartItem) return { ...data[0] }

    const parentRowInfo = maxBy(data, 'maxScore')
    const combinedStandards = [
      ...new Set(flatMap(data.map((d) => d.standards))),
    ]

    const parentRow = {
      ...parentRowInfo,
      uid: key,
      questionId: parentRowInfo.uid,
      qType: MULTIPART_LABEL,
      qLabel: parentRowInfo.qLabel.split('.')[0],
      standards: combinedStandards,
    }

    let childRows = data
    if (parentRowInfo.itemLevelScoring) {
      childRows = map(data, (d) => ({
        ...d,
        total_score: 0,
        total_max_score: 0,
        maxScore: NOT_AVAILABLE_LABEL,
      }))
    } else {
      parentRow.total_max_score = sumBy(data, 'total_max_score')
      parentRow.total_score = sumBy(data, 'total_score')
      parentRow.maxScore = sumBy(data, 'maxScore')
    }

    // flatten the rows for download csv
    if (isCsvDownloading) return [parentRow, ...childRows]

    parentRow.children = childRows
    return parentRow
  })

  return result
}
