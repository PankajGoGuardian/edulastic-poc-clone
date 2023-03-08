import qs from 'qs'
import { groupBy, keyBy, isEmpty, round, sumBy, orderBy } from 'lodash'
import { white } from '@edulastic/colors'
import {
  getProficiencyBand,
  DemographicCompareByOptions,
  percentage,
} from '../../../../common/util'

export const idToLabel = {
  standardId: 'standard',
  schoolId: 'schoolName',
  studentId: 'studentName',
  groupId: 'className',
  teacherId: 'teacherName',
  race: 'race',
  gender: 'gender',
  frlStatus: 'frlStatus',
  ellStatus: 'ellStatus',
  iepStatus: 'iepStatus',
  hispanicEthnicity: 'hispanicEthnicity',
}

export const idToName = {
  standardId: 'Standard',
  schoolId: 'School',
  studentId: 'Student',
  groupId: 'Class',
  teacherId: 'Teacher',
  race: 'Race',
  gender: 'Gender',
  frlStatus: 'FRL Status',
  ellStatus: 'ELL Status',
  iepStatus: 'IEP Status',
  hispanicEthnicity: 'Hispanic Ethnicity',
}

export const analyseByToName = {
  'score(%)': 'Score (%)',
  rawScore: 'Raw Score',
  masteryLevel: 'Mastery Level',
  masteryScore: 'Mastery Score',
}

export const analyseByToKeyToRender = {
  'score(%)': 'scorePercent',
  rawScore: 'rawScore',
  masteryLevel: 'masteryName',
  masteryScore: 'fm',
}

export const getMasteryDropDown = (masteryScale) => {
  const arr = []
  if (Array.isArray(masteryScale)) {
    for (const item of masteryScale) {
      arr.push({
        key: item.masteryName,
        title: item.masteryName,
      })
    }
  }
  arr.unshift({
    key: 'all',
    title: 'All',
  })
  return arr
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
    const hispanicEthnicityFlag = !!(
      item.hispanicEthnicity === filters.hispanicEthnicity ||
      filters.hispanicEthnicity === 'all'
    )
    return (
      genderFlag &&
      frlStatusFlag &&
      ellStatusFlag &&
      iepStatusFlag &&
      raceFlag &&
      hispanicEthnicityFlag
    )
  })

  return filteredDenormalizedData
    .sort((a, b) => a.standard.localeCompare(b.standard))
    .sort((a, b) =>
      a[idToLabel.studentId]
        .toLowerCase()
        .localeCompare(b[idToLabel.studentId].toLowerCase())
    )
}

export const getChartData = (chartData, masteryScale) => {
  if (isEmpty(chartData) || isEmpty(masteryScale)) {
    return []
  }

  const masteryLabelInfo = {}
  for (const item of masteryScale) {
    masteryLabelInfo[item.masteryLabel] = item.masteryName
  }

  return chartData.map((item) => {
    const masteryScorePercentages = {}
    const masteryScoreMap = keyBy(item.mastery, 'score')
    masteryScale.forEach((masteryScaleItem) => {
      const label = masteryScaleItem.masteryLabel
      const masteryScoreItem = masteryScoreMap[masteryScaleItem.score]
      if (masteryScoreItem) {
        const multiplicand = masteryScaleItem.score === 1 ? -1 : 1
        masteryScorePercentages[label] =
          multiplicand *
          percentage(masteryScoreItem.stuCount, item.totalStudents, true)
      } else {
        masteryScorePercentages[label] = 0
      }
    })

    return {
      ...item,
      standardId: item._id,
      ...masteryScorePercentages,
      masteryLabelInfo,
    }
  })
}

const getAnalysedData = (groupedData, compareBy, masteryScale) => {
  const arr = Object.keys(groupedData).map((item) => {
    const groupedStandardIds = groupBy(groupedData[item], 'standardId')

    // analysed data per standard for item
    const standardsInfo = Object.keys(groupedStandardIds).map((__item) => {
      const ___item = groupedStandardIds[__item].reduce(
        (res, ele) => {
          const _totalScore = Number(ele.totalScore) || 0
          const _maxScore = Number(ele.maxScore) || 0
          const _fm = Number(ele.fm) || 0
          return {
            totalMaxScore: res.totalMaxScore + _maxScore,
            totalTotalScore: res.totalTotalScore + _totalScore,
            totalScorePercent:
              res.totalScorePercent + (100 * _totalScore) / (_maxScore || 1),
            totalFinalMastery: res.totalFinalMastery + _fm,
          }
        },
        {
          totalMaxScore: 0,
          totalTotalScore: 0,
          totalScorePercent: 0,
          totalFinalMastery: 0,
        }
      )
      const scorePercentUnrounded = groupedStandardIds[__item].length
        ? ___item.totalScorePercent / groupedStandardIds[__item].length
        : 0
      const rawScoreUnrounded = ___item.totalTotalScore || 0
      const fmUnrounded = groupedStandardIds[__item].length
        ? ___item.totalFinalMastery / groupedStandardIds[__item].length
        : 0
      const fm = fmUnrounded ? Number(fmUnrounded.toFixed(2)) : 0
      const { masteryLevel = 'N/A', masteryName = 'N/A', color = white } = fm
        ? getProficiencyBand(Math.round(fm), masteryScale, 'score')
        : {}
      return {
        ...___item,
        standardId: __item,
        standardName: groupedStandardIds[__item][0][idToLabel.standardId],
        scorePercentUnrounded,
        scorePercent: Math.round(Number(scorePercentUnrounded)),
        rawScoreUnrounded,
        rawScore: Number(rawScoreUnrounded.toFixed(2)),
        fmUnrounded,
        fm,
        masteryLevel,
        masteryName,
        color,
      }
    })

    // analysed data for item
    const _item = standardsInfo.reduce(
      (res, ele) => ({
        totalMaxScore: res.totalMaxScore + ele.totalMaxScore,
        totalTotalScore: res.totalTotalScore + ele.totalTotalScore,
        totalScorePercent: res.totalScorePercent + ele.scorePercent,
        totalFinalMastery: res.totalFinalMastery + ele.fm,
      }),
      {
        totalMaxScore: 0,
        totalTotalScore: 0,
        totalScorePercent: 0,
        totalFinalMastery: 0,
      }
    )
    const scorePercentUnrounded = standardsInfo.length
      ? _item.totalScorePercent / standardsInfo.length
      : 0
    const rawScoreUnrounded = _item.totalTotalScore || 0
    const fmUnrounded = standardsInfo.length
      ? _item.totalFinalMastery / standardsInfo.length
      : 0
    const fm = fmUnrounded ? Number(fmUnrounded.toFixed(2)) : 0
    const { masteryLevel = 'N/A', masteryName = 'N/A', color = white } = fm
      ? getProficiencyBand(Math.round(fm), masteryScale, 'score')
      : {}
    return {
      ..._item,
      studentId: compareBy === 'studentId' ? item : _item.studentId,
      compareBy,
      compareByLabel: groupedData[item][0][idToLabel[compareBy]],
      compareByName: idToName[compareBy],
      scorePercentUnrounded,
      scorePercent: Math.round(Number(scorePercentUnrounded)),
      rawScoreUnrounded,
      rawScore: Number(rawScoreUnrounded.toFixed(2)),
      fmUnrounded,
      fm,
      masteryLevel,
      masteryName,
      color,
      sisId: groupedData[item][0].sisId,
      studentNumber: groupedData[item][0].studentNumber,
      standardsInfo,
      testActivityId: groupedData[item][0].testActivityId,
      assignmentId: groupedData[item][0].assignmentId,
      groupId: groupedData[item][0].groupId,
    }
  })
  return arr
}

const filterByMasteryLevel = (analysedData, masteryLevel) => {
  const filteredAnalysedData = analysedData.filter((item) => {
    if (item.masteryName === masteryLevel || masteryLevel === 'all') {
      return true
    }
    return false
  })
  return filteredAnalysedData
}

export const getTableData = (
  filteredDenormalizedData,
  masteryScale,
  compareBy,
  masteryLevel
) => {
  if (
    !filteredDenormalizedData ||
    isEmpty(filteredDenormalizedData) ||
    !masteryScale ||
    isEmpty(masteryScale)
  ) {
    return []
  }
  const groupedData = groupBy(
    filteredDenormalizedData.filter((item) => !!item[compareBy]),
    compareBy
  )
  const analysedData = getAnalysedData(groupedData, compareBy, masteryScale)
  let filteredData = filterByMasteryLevel(analysedData, masteryLevel)
  if (DemographicCompareByOptions.includes(compareBy)) {
    filteredData = orderBy(filteredData, 'compareByLabel', ['asc'])
  }
  return filteredData
}

export const getLeastMasteryLevel = (scaleInfo = []) =>
  orderBy(scaleInfo, 'score', ['desc'])[scaleInfo.length - 1] || {
    masteryLabel: '',
  }

export const getMasteryLevel = (score, scaleInfo) => {
  for (const obj of scaleInfo) {
    if (round(score) === obj.score) {
      return obj || getLeastMasteryLevel(scaleInfo)
    }
  }
  return getLeastMasteryLevel(scaleInfo)
}

export const groupedByStandard = (
  metricInfo = [],
  maxScore,
  scaleInfo = []
) => {
  const standards = groupBy(metricInfo, 'standardId')
  return Object.keys(standards).map((standardId) => {
    const standardData = standards[standardId] || []
    const masteryScore = (
      sumBy(standardData, 'fm') / standardData.length
    ).toFixed(2)
    const score = round(
      sumBy(
        standardData,
        (item) => (100 * (item.totalScore || 0)) / (item.maxScore || 1)
      ) / standardData.length
    )
    const rawScore = `${(sumBy(standardData, 'totalScore') || 0).toFixed(
      2
    )} / ${sumBy(standardData, 'maxScore')}`
    const masteryLevel = getMasteryLevel(masteryScore, scaleInfo).masteryLabel

    return {
      standardId,
      masteryScore,
      diffMasteryScore: maxScore - round(masteryScore, 2),
      score,
      rawScore,
      masteryLevel,
      records: standardData,
    }
  })
}

export const getStandardProgressNav = (
  navigationItems,
  standardId,
  compareByKey
) => {
  const standardsProgressNavLink = navigationItems.find(
    (n) => n.key === 'standards-progress'
  )?.location
  if (standardId && standardsProgressNavLink) {
    const [
      standardsProgressNavPrefix,
      standardsProgressNavQuery,
    ] = standardsProgressNavLink.split('?')
    const standardsProgressNavObj = qs.parse(standardsProgressNavQuery, {
      ignoreQueryPrefix: true,
    })
    const gradebookToProgressCompareByKey = {
      schoolId: 'school',
      teacherId: 'teacher',
      studentId: 'student',
      groupId: 'class',
    }
    const _standardsProgressNavObj = { ...standardsProgressNavObj, standardId }
    const _standardsProgressNavQuery = qs.stringify(_standardsProgressNavObj)
    return {
      pathname: standardsProgressNavPrefix,
      search: `?${_standardsProgressNavQuery}`,
      state: {
        standardId,
        compareByKey:
          gradebookToProgressCompareByKey[compareByKey] || compareByKey,
      },
    }
  }
  return null
}
