import { useMemo } from 'react'
import { sortBy, groupBy, keyBy, reduce, round, flatMap } from 'lodash'
import { lightGreen7, lightBlue8, lightRed2 } from '@edulastic/colors'

/* Important Constants */

// for domainRange = 800 => range = [-400, 400]
export const domainRange = 800
// scaleFactor to keep all the data inside the graph
// should be close to {sqrt(2) * limit}
export const scaleFactor = 1.8
// distance used for grouping students
const groupingDist = round(0.2 * domainRange)

// (function) to get the normalized value, given the mean and the range
const getNormalizedValue = (item, mean, range) =>
  item === mean ? 0 : round((domainRange * (item - mean)) / range)

// (function) to check if the points p & q can be grouped based on distance
// effort => x, performance => y
const canBeGrouped = (p, q) => {
  if (
    Math.abs(p.effort - q.effort) < groupingDist &&
    Math.abs(p.performance - q.performance) < groupingDist
  ) {
    return true
  }
  return false
}

// (function) to curate the filters list (modules, standards, groups)
export const getFilterData = (modules = [], selectedModules = []) => {
  const modulesData = modules.map((item) => {
    const standards = []
    const groups = []
    item.data.forEach((ele) => {
      standards.push(...(ele.standards || []))
      ;(ele.assignments || []).forEach((assignment) =>
        assignment.class?.forEach((cl) =>
          groups.push({ id: cl._id, name: cl.name })
        )
      )
    })
    return {
      id: item._id,
      name: item.title,
      standards,
      groups,
    }
  })
  const filteredModules = selectedModules.length
    ? modulesData.filter((module) =>
        selectedModules.map((_module) => _module.key).includes(module.id)
      )
    : modulesData

  // filter standards dropdown data based on the filtered modules
  const standardsData = Object.values(
    keyBy(
      flatMap(filteredModules, (item) => item.standards),
      'standardId'
    )
  ).map(({ standardId, name }) => ({ id: standardId.toString(), name }))
  const groupsData = Object.values(
    keyBy(
      flatMap(filteredModules, (item) => item.groups),
      'id'
    )
  )

  return {
    modulesData,
    standardsData,
    groupsData,
  }
}

// (function) to get the trendAngle from the trendSlope
const calcTrendAngle = (trendSlope) =>
  round((Math.atan(trendSlope || 0) * 360) / Math.PI)

// (function) to get a unique student map complete with trendAngle
export const getMergedTrendMap = (studInfo = [], trendData = []) =>
  useMemo(() => {
    const studentMap = groupBy(studInfo, 'userId')
    // reduce multiple entries and club their groupIds
    Object.keys(studentMap).map((sId) => {
      studentMap[sId] = reduce(
        studentMap[sId],
        (res, ele) => {
          res.firstName = res.firstName || ele.firstName
          res.lastName = res.lastName || ele.lastName
          res.groupIds.push(ele.groupId)
          return res
        },
        {
          userId: sId,
          firstName: '',
          lastName: '',
          groupIds: [],
          trendAngle: 0,
          hasTrend: false,
        }
      )
      return null
    })
    // calculate and set flag for students with available trend data
    trendData.forEach((item) => {
      if (studentMap[item.id] && Object.keys(item.tests).length > 1) {
        studentMap[item.id].trendAngle = calcTrendAngle(item.slope)
        studentMap[item.id].hasTrend = true
      }
    })
    return studentMap
  }, [studInfo, trendData])

// (function) to filter student data based on modules, standards &
export const getFilteredMetrics = (
  metricInfo = [],
  studInfoMap = {},
  filters = {}
) => {
  const modules = filters.modules.map((item) => item.key)
  const standards = filters.standards.map((item) => item.key)
  const groups = filters.groups.map((item) => item.id)

  // filter by groups
  const filteredMap = groups.length
    ? keyBy(
        Object.values(studInfoMap).filter(({ groupIds }) =>
          groups.find((item) => groupIds.includes(item))
        ),
        'userId'
      )
    : studInfoMap

  const groupedData = groupBy(metricInfo, 'studentId')

  const filteredData = Object.keys(groupedData)
    .map((sId) => {
      // filter by standards
      groupedData[sId] = groupedData[sId].filter(
        ({ standardId, playlistModuleId }) =>
          (!standards.length || standards.includes(`${standardId}`)) &&
          (!modules.length || modules.includes(playlistModuleId))
      )
      if (groupedData[sId].length) {
        // reduce grouped student data to a single object if not null
        groupedData[sId] = reduce(
          groupedData[sId],
          (res, ele) => {
            res.playlistModuleIds.push(ele.playlistModuleId)
            res.standardIds.push(`${ele.standardId}`)
            res.totalTotalScore += ele.totalScore || 0
            res.totalMaxScore += ele.maxScore || 0
            res.totalTimeSpent += parseInt(ele.timeSpent, 10)
            res.count += 1
            return res
          },
          {
            studentId: sId,
            standardIds: [],
            playlistModuleIds: [],
            count: 0,
            totalTotalScore: 0,
            totalMaxScore: 0,
            totalTimeSpent: 0,
          }
        )
      } else {
        groupedData[sId] = null
      }
      return groupedData[sId]
    })
    .filter((item) => item && filteredMap[item.studentId])
  // TODO: Remove the second check in the filter above if the data is consistent in metricInfo & studInfo

  return { filteredData, filteredMap, masteryList: filters.masteryList }
}

// (function) to curate metrics for each student by calculating their effort & performance and filter them by selected mastery level
export const getCuratedMetrics = ({
  filteredData = [],
  filteredMap = {},
  masteryList = [],
  masteryData = [],
}) => {
  if (!filteredData.length) {
    return []
  }
  let minTimeSpent = filteredData[0].totalTimeSpent
  let maxTimeSpent = filteredData[0].totalTimeSpent
  let minPercentScore = 1
  let maxPercentScore = 0

  // calculate max & min for percentScore & timeSpent
  let curatedMetrics = filteredData.map((item) => {
    const percentScore = item.totalMaxScore
      ? item.totalTotalScore / item.totalMaxScore
      : 0
    if (item.totalTimeSpent < minTimeSpent) {
      minTimeSpent = item.totalTimeSpent
    }
    if (percentScore < minPercentScore) {
      minPercentScore = percentScore
    }
    if (item.totalTimeSpent > maxTimeSpent) {
      maxTimeSpent = item.totalTimeSpent
    }
    if (percentScore > maxPercentScore) {
      maxPercentScore = percentScore
    }
    return {
      ...item,
      percentScore,
      ...filteredMap[item.studentId],
    }
  })

  // filter based on mastery threshold
  const masteryToShow = masteryList.map((item) => item.key)
  const masteryRangeToShow = []
  masteryData.forEach((item, index) => {
    let max = 100
    let min = 0
    if (index == 0) {
      min = item.threshold
    } else {
      max = masteryData[index - 1].threshold
      min = item.threshold
    }
    if (masteryToShow.includes(item.id)) {
      masteryRangeToShow.push({ min, max })
    }
  })
  if (masteryRangeToShow.length) {
    curatedMetrics = curatedMetrics.filter((item) => {
      let flag = false
      const pScore = round(item.percentScore, 2) * 100
      masteryRangeToShow.forEach(({ min, max }) => {
        if (
          min <= pScore &&
          (pScore < max || (max === 100 && pScore === 100))
        ) {
          flag = true
        }
      })
      return flag
    })
  }

  // calculate the mean & range for percentScore & timeSpent
  const timeRange = maxTimeSpent - minTimeSpent
  const percentRange = maxPercentScore - minPercentScore
  const timeMean = (maxTimeSpent + minTimeSpent) / 2
  const percentMean = (maxPercentScore + minPercentScore) / 2

  // normalize values to get effort & performance
  return sortBy(
    curatedMetrics.map((item) => {
      const fName = item.firstName && item.firstName.trim()
      const lName = item.lastName && item.lastName.trim()
      const name =
        fName && lName ? `${lName}, ${fName[0]}` : lName || fName || '-'
      const fullName =
        fName && lName ? `${lName}, ${fName}` : lName || fName || '-'
      const effort = getNormalizedValue(
        item.totalTimeSpent,
        timeMean,
        timeRange
      )
      const performance = getNormalizedValue(
        item.percentScore,
        percentMean,
        percentRange
      )
      return { name, fullName, ...item, effort, performance, isActive: true }
    }),
    ['lastName', 'firstName']
  )
}

// (function) to get the mastery scale for comparing students
export const getMasteryData = (scaleInfo = []) => {
  const defaultScaleInfo = [
    {
      score: 4,
      threshold: 90,
      masteryName: 'Exceeds Mastery',
    },
    {
      score: 3,
      threshold: 80,
      masteryName: 'Mastered',
    },
    {
      score: 2,
      threshold: 70,
      masteryName: 'Almost Mastered',
    },
    {
      score: 1,
      threshold: 0,
      masteryName: 'Not Mastered',
    },
  ]

  return (scaleInfo?.length ? scaleInfo : defaultScaleInfo).map(
    ({ score, masteryName, threshold }) => ({
      id: score.toString(),
      name: masteryName,
      threshold,
    })
  )
}

// (function) to get the summary data for BoxedSummary component
export const getBoxedSummaryData = ({ up, flat, down }) => {
  const summaryData = [
    {
      label: 'Exceeding',
      count: up,
    },
    {
      label: 'Meeting',
      count: flat,
    },
    {
      label: 'At Risk',
      count: down,
    },
  ]
  return summaryData
}

// (function) to calculate the color and groupings for quadrant based student data
export const getQuadsData = (data) => {
  const quads = [[], [], [], []]

  data.map((item) => {
    // add the color and quad info
    if (item.effort < 0 && item.performance > 0) {
      quads[0].push({ ...item, color: lightBlue8, quad: 1 })
    } else if (item.effort >= 0 && item.performance >= 0) {
      quads[1].push({ ...item, color: lightGreen7, quad: 2 })
    } else if (item.effort <= 0 && item.performance <= 0) {
      quads[2].push({ ...item, color: lightRed2, quad: 3 })
    } else {
      quads[3].push({ ...item, color: lightBlue8, quad: 4 })
    }
    return null
  })

  // logic to create groupings for nearby data using greedy approach
  return flatMap(quads, (quad) => {
    const len = quad.length
    let i
    let j
    // grouped => maps the index of the grouped element to the index of the parent grouping element
    // groupings => stores the data of all possible groups with parent element index as the key
    const grouped = {}
    const groupings = {}
    // create groupings
    for (i = 0; grouped[i] == null && i < len; i++) {
      grouped[i] = i
      groupings[i] = [quad[i]]
      for (j = i + 1; grouped[j] == null && j < len; j++) {
        if (canBeGrouped(quad[i], quad[j])) {
          grouped[j] = i
          groupings[i].push(quad[j])
        }
      }
    }
    // curate groupings to object
    return Object.keys(groupings).map((key) => {
      const _len = groupings[key].length
      return _len === 1
        ? groupings[key][0]
        : reduce(
            groupings[key],
            (res, ele) => {
              res.color = res.color || ele.color
              res.effort = round(
                (res.effort * res.count + ele.effort) / (res.count + 1)
              )
              res.performance = round(
                (res.performance * res.count + ele.performance) /
                  (res.count + 1)
              )
              res.count += 1
              return res
            },
            {
              isGrouped: true,
              color: '',
              count: 0,
              effort: 0,
              performance: 0,
              studentIds: groupings[key].map((item) => item.studentId),
            }
          )
    })
  })
}

// (function) to calculate the label position in InsightsChart
export const calcLabelPosition = ({ cx, cy, angle = 0 }) => {
  const isPositive = angle > 0
  if (angle >= 160 || angle <= -160) {
    cx -= isPositive ? 29 : 28
    cy -= isPositive ? 8 : 8
  } else if (angle > 130 || angle < -130) {
    cx -= isPositive ? 25 : 18
    cy -= isPositive ? 6 : 9
  } else if (angle > 80 || angle < -80) {
    cx -= isPositive ? 15 : 9
    cy -= isPositive ? 3 : 9
  } else if (angle > 40 || angle < -30) {
    cx -= isPositive ? 10 : 5
    cy -= isPositive ? 1 : 6
  } else {
    cx -= isPositive ? 7 : 5
    cy -= isPositive ? 0 : 2
  }
  return { nameX: cx, arrowY: cy }
}

// (function) to calculate the arrow position for the AddGroupTable
export const calcArrowPosition = (angle) => {
  let cx = 0
  let cy = 0
  if (angle <= -150) {
    cx += 1
    cy += 10
  } else if (angle <= -120) {
    cx += 3
    cy += 7
  } else if (angle <= -100) {
    cx += 5
    cy += 2
  } else if (angle <= -70) {
    cx += 7
    cy -= 1
  } else if (angle <= -40) {
    cx += 7
    cy -= 4
  } else if (angle <= -20) {
    cx += 4
    cy -= 6
  } else if (angle <= -5) {
    cx += 1
    cy -= 7
  } else if (angle <= 5) {
    cy -= 6
  } else if (angle <= 20) {
    cx -= 3
    cy -= 6
  } else if (angle <= 45) {
    cx -= 5
    cy -= 6
  } else if (angle <= 70) {
    cx -= 6
    cy -= 5
  } else if (angle <= 90) {
    cx -= 7
    cy -= 1
  } else if (angle <= 120) {
    cx -= 7
    cy += 1
  } else if (angle <= 150) {
    cx -= 7
    cy += 6
  } else if (angle <= 180) {
    cx -= 1
    cy += 10
  }
  return [cx, cy]
}
