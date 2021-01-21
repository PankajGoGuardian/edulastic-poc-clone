import { get, isEmpty, groupBy, keyBy, uniq } from 'lodash'

const getFormattedName = (name) => {
  const nameArr = (name || '').trim().split(' ')
  const lName = nameArr.splice(nameArr.length - 1)[0]
  return nameArr.length ? `${lName}, ${nameArr.join(' ')}` : lName
}

export const getDenormalizedData = (rawData) => {
  if (isEmpty(rawData)) {
    return []
  }
  const rawTestInfo = get(rawData, 'data.result.testInfo', [])
  const testInfoMap = keyBy(rawTestInfo, 'reportKey')
  // store the order of tests to sort metric data
  const testOrderMap = {}
  rawTestInfo.forEach((t, index) => {
    testOrderMap[t.reportKey] = testOrderMap[t.reportKey] || index + 1
  })
  const rawStudInfo = get(rawData, 'data.result.studInfo', [])
  const studInfoMap = keyBy(rawStudInfo, 'studentId')
  const rawTeacherInfo = get(rawData, 'data.result.teacherInfo', [])
  const teacherInfoMap = keyBy(rawTeacherInfo, 'groupId')

  const rawStudentMetricInfo = get(rawData, 'data.result.studentMetricInfo', [])
  const studentMetricInfo = rawStudentMetricInfo
    .map((item) => {
      if (studInfoMap[item.studentId]) {
        return {
          ...item,
          ...studInfoMap[item.studentId],
          ...testInfoMap[item.reportKey],
          studentName: getFormattedName(
            `${studInfoMap[item.studentId].firstName || ''} ${
              studInfoMap[item.studentId].lastName || ''
            }`
          ),
          groupIds: uniq(studInfoMap[item.studentId].groupIds.split(',')),
        }
      }
      return item
    })
    .filter((item) => !isEmpty(item.groupIds))
    .sort((a, b) => testOrderMap(a.reportKey) - testOrderMap(b.reportKey))

  const denormalizedData = studentMetricInfo.flatMap(({ groupIds, ...item }) =>
    groupIds.map((groupId) => ({
      ...item,
      groupId,
      ...(teacherInfoMap[groupId] || {}),
    }))
  )

  return denormalizedData
}

export const getFilteredDenormalizedData = (denormalizedData, filters) => {
  const filteredDenormalizedData = denormalizedData.filter((item) => {
    const genderFlag = !!(
      item.gender === filters.gender || filters.gender === 'all'
    )
    const frlStatusFlag = !!(
      item.frlStatus === filters.frlStatus || filters.frlStatus === 'all'
    )
    const ellStatusFlag = !!(
      item.ellStatus === filters.ellStatus || filters.ellStatus === 'all'
    )
    const iepStatusFlag = !!(
      item.iepStatus === filters.iepStatus || filters.iepStatus === 'all'
    )
    const raceFlag = !!(item.race === filters.race || filters.race === 'all')
    return (
      genderFlag && frlStatusFlag && ellStatusFlag && iepStatusFlag && raceFlag
    )
  })
  return filteredDenormalizedData.sort((a, b) =>
    a.studentName.toLowerCase().localeCompare(b.studentName.toLowerCase())
  )
}

export const getChartData = (rawChartData, masteryScale) => {
  if (isEmpty(rawChartData) || isEmpty(masteryScale)) {
    return []
  }

  const groupedByReportKey = groupBy(rawChartData, 'reportKey')
  const reportKeysArr = Object.keys(groupedByReportKey)
  const masteryMap = keyBy(masteryScale, 'score')
  const masteryCountHelper = {}

  for (const item of masteryScale) {
    masteryCountHelper[item.score] = 0
  }

  const chartData = reportKeysArr.map((item) => {
    const totalStudents = groupedByReportKey[item].length
    const tempMasteryCountHelper = { ...masteryCountHelper }

    for (const _item of groupedByReportKey[item]) {
      if (tempMasteryCountHelper[Math.round(_item.fm)]) {
        tempMasteryCountHelper[Math.round(_item.fm)]++
      } else {
        tempMasteryCountHelper[Math.round(_item.fm)] = 1
      }
    }

    const obj = {
      totalStudents,
      reportKey: item,
      testName: groupedByReportKey[item][0].testName,
    }
    const masteryLabelInfo = {}

    Object.keys(tempMasteryCountHelper).forEach((_item) => {
      if (masteryMap[_item]) {
        const masteryPercentage = Math.round(
          (tempMasteryCountHelper[_item] / totalStudents) * 100
        )
        masteryLabelInfo[masteryMap[_item].masteryLabel] =
          masteryMap[_item].masteryName
        if (_item == 1) {
          obj[masteryMap[_item].masteryLabel] = -masteryPercentage
        } else {
          obj[masteryMap[_item].masteryLabel] = masteryPercentage
        }
      }
    })
    obj.masteryLabelInfo = masteryLabelInfo

    return obj
  })

  return chartData
}
