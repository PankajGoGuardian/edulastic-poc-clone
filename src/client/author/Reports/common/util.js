import {
  partialRight,
  ceil,
  groupBy,
  sumBy,
  includes,
  map,
  orderBy,
  round,
  find,
  indexOf,
  keyBy,
} from 'lodash'
import next from 'immer'
import moment from 'moment'
import calcMethod from './static/json/calcMethod.json'

const studentFiltersDefaultValues = [
  {
    key: 'networkIds',
    value: '',
  },
  {
    key: 'schoolIds',
    value: '',
  },
  {
    key: 'teacherIds',
    value: '',
  },
  {
    key: '',
    nestedFilters: [
      {
        key: 'classIds',
        value: '',
      },
      {
        key: 'groupIds',
        value: '',
      },
    ],
  },
]

export const DemographicCompareByOptions = [
  'gender',
  'race',
  'gender',
  'frlStatus',
  'ellStatus',
  'iepStatus',
  'hispanicEthnicity',
]

export const percentage = (
  numerator = 0,
  denominator = 0,
  roundCalculation = false
) => {
  if (numerator == 0 && denominator == 0) {
    return 0
  }

  const calculatedPercentage = (numerator / denominator) * 100
  return roundCalculation ? round(calculatedPercentage) : calculatedPercentage
}

export const roundedPercentage = partialRight(percentage, true)

export const stringCompare = (a_string = '', b_string = '') =>
  (a_string || '').toLowerCase().localeCompare((b_string || '').toLowerCase())

export const getVariance = (arr) => {
  let sum = 0
  for (let i = 0; i < arr.length; i++) {
    sum += Number(arr[i])
  }
  const mean = sum / arr.length

  sum = 0
  for (let i = 0; i < arr.length; i++) {
    sum += (arr[i] - mean) ** 2
  }

  const variance = Number((sum / arr.length).toFixed(2))
  return variance
}
export const getStandardDeviation = (variance) =>
  Number(Math.sqrt(variance, 2).toFixed(2))

export const getHSLFromRange1 = (val, light = 79) =>
  `hsla(${val}, 100%, ${light}%, 1)`

export const getHSLFromRange2 = (val, light = 48) => {
  const tmp = val / 2
  return getHSLFromRange1(tmp, light)
}

export const isMobileScreen = () =>
  window.matchMedia('only screen and (max-width: 1033px) and (min-width : 1px)')
    .matches

export const getNavigationTabLinks = (list, id) => {
  for (const item of list) {
    item.location += id
  }
}

export const getDropDownTestIds = (arr) => {
  const sortedArr = [...arr]
  sortedArr.sort((a, b) => a - b)

  const _arr = sortedArr.map((data) => ({
    key: data.testId,
    title: data.testName,
  }))

  return _arr
}

export const filterData = (data, filter) => {
  const filteredData = data.filter(
    (item) =>
      (!filter.gender ||
        filter.gender === 'all' ||
        item.gender.toLowerCase() === filter.gender.toLowerCase()) &&
      (!filter.frlStatus ||
        filter.frlStatus === 'all' ||
        item.frlStatus.toLowerCase() === filter.frlStatus.toLowerCase()) &&
      (!filter.ellStatus ||
        filter.ellStatus === 'all' ||
        item.ellStatus.toLowerCase() === filter.ellStatus.toLowerCase()) &&
      (!filter.iepStatus ||
        filter.iepStatus === 'all' ||
        item.iepStatus.toLowerCase() === filter.iepStatus.toLowerCase()) &&
      (!filter.race ||
        filter.race === 'all' ||
        item.race.toLowerCase() === filter.race.toLowerCase()) &&
      (!filter.hispanicEthnicity ||
        filter.hispanicEthnicity === 'all' ||
        item.hispanicEthnicity.toLowerCase() ===
          filter.hispanicEthnicity.toLowerCase())
  )
  return filteredData
}

export const processFilteredClassAndGroupIds = (orgDataArr, currentFilter) => {
  const byGroupId = groupBy(
    orgDataArr.filter((item) => {
      const checkForGrades =
        (item.grades || '')
          .split(',')
          .filter((g) => g.length)
          .includes(currentFilter.grade) || currentFilter.grade === 'All'
      const checkForSchool =
        !currentFilter.schoolId ||
        currentFilter.schoolId === 'All' ||
        (item.groupType === 'class' && item.schoolId === currentFilter.schoolId)
      if (
        item.groupId &&
        checkForGrades &&
        checkForSchool &&
        (item.subject === currentFilter.subject ||
          currentFilter.subject === 'All') &&
        (item.courseId === currentFilter.courseId ||
          currentFilter.courseId === 'All')
      ) {
        return true
      }
      return false
    }),
    'groupId'
  )
  const classIdArr = [{ key: 'All', title: 'All Classes', groupType: 'class' }]
  const groupIdArr = [{ key: 'All', title: 'All Groups', groupType: 'custom' }]
  Object.keys(byGroupId).forEach((item) => {
    const ele = {
      key: byGroupId[item][0].groupId,
      title: byGroupId[item][0].groupName,
      groupType: byGroupId[item][0].groupType,
    }
    ele.groupType === 'class' ? classIdArr.push(ele) : groupIdArr.push(ele)
  })

  return [classIdArr, groupIdArr]
}

export const processClassAndGroupIds = (orgDataArr) => {
  const byGroupId = groupBy(
    orgDataArr.filter((item) => !!item.groupId),
    'groupId'
  )
  const classIdArr = [{ key: 'All', title: 'All Classes', groupType: 'class' }]
  const groupIdArr = [{ key: 'All', title: 'All Groups', groupType: 'custom' }]
  Object.keys(byGroupId).forEach((item) => {
    const ele = {
      key: byGroupId[item][0].groupId,
      title: byGroupId[item][0].groupName,
      groupType: byGroupId[item][0].groupType,
    }
    // differentiate groups and classes into individual arrays
    ele.groupType === 'class' ? classIdArr.push(ele) : groupIdArr.push(ele)
  })

  return [classIdArr, groupIdArr]
}

export const processSchoolIds = (orgDataArr) => {
  const bySchoolId = groupBy(
    orgDataArr.filter((item) => !!item.schoolId),
    'schoolId'
  )
  const schoolIdArr = Object.keys(bySchoolId).map((item) => ({
    key: bySchoolId[item][0].schoolId,
    title: bySchoolId[item][0].schoolName,
  }))
  schoolIdArr.unshift({
    key: 'All',
    title: 'All Schools',
  })

  return schoolIdArr
}

export const processTeacherIds = (orgDataArr) => {
  const byTeacherId = groupBy(
    orgDataArr.filter((item) => !!item.teacherId),
    'teacherId'
  )
  const teacherIdArr = Object.keys(byTeacherId).map((item) => ({
    key: byTeacherId[item][0].teacherId,
    title: byTeacherId[item][0].teacherName,
  }))
  teacherIdArr.unshift({
    key: 'All',
    title: 'All Teachers',
  })

  return teacherIdArr
}

export const getOverallScore = (metrics = []) =>
  metrics.length
    ? sumBy(metrics, (item) =>
        percentage(
          parseFloat(item.totalScore) || 0,
          parseFloat(item.maxScore) || 1
        )
      ) / metrics.length
    : 0

export const filterAccordingToRole = (columns, role) =>
  columns.filter((column) => !includes(column.hiddenFromRole, role))

export const getLeastProficiencyBand = (bandInfo = []) =>
  orderBy(bandInfo, 'threshold', ['desc'])[bandInfo.length - 1] || {}

export const getProficiencyBand = (score, bandInfo, field = 'threshold') => {
  const bandInfoWithColor = map(
    orderBy(bandInfo, 'threshold'),
    (band, index) => ({
      ...band,
      color: band.color
        ? band.color
        : getHSLFromRange1(round((100 / (bandInfo.length - 1)) * index)),
    })
  )
  const orderedScaleInfo = orderBy(bandInfoWithColor, 'threshold', ['desc'])
  return (
    find(orderedScaleInfo, (info) => ceil(score) >= info[field]) ||
    getLeastProficiencyBand(orderedScaleInfo)
  )
}

export const toggleItem = (items, item) =>
  next(items, (draftState) => {
    const index = indexOf(items, item)
    if (index > -1) {
      draftState.splice(index, 1)
    } else {
      draftState.push(item)
    }
  })

export const convertTableToCSV = (refComponent) => {
  const rows = refComponent.querySelectorAll('table')[0].querySelectorAll('tr')
  const csv = []
  const csvRawData = []
  for (let i = 0; i < rows.length; i++) {
    const row = []
    const cols = rows[i].querySelectorAll('td, th')
    for (let j = 0; j < cols.length; j++) {
      if (cols[j].getElementsByClassName('ant-checkbox').length > 0) continue
      let data = (cols[j].innerText || cols[j].textContent)
        .replace(/(\r\n|\n|\r)/gm, ' ')
        .replace(/(\s+)/gm, ' ')
      data = data.replace(/"/g, '""')
      row.push(`"${data}"`)
    }
    csv.push(row.join(','))
    csvRawData.push(row)
  }
  return {
    csvText: csv.join('\n'),
    csvRawData,
  }
}

export const downloadCSV = (filename, data) => {
  const link = document.createElement('a')
  link.style.display = 'none'
  link.setAttribute('target', '_blank')
  link.setAttribute(
    'href',
    `data:text/csv;charset=utf-8,${encodeURIComponent(data)}`
  )
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const getStudentAssignments = (
  scaleInfo = [],
  studentStandardData = []
) => {
  const scaleMap = keyBy(scaleInfo, 'score')
  const assignments = studentStandardData
    .sort((a, b) => a.insertedAt - b.insertedAt)
    .map((data) => {
      const score = round(percentage(data.obtainedScore, data.maxScore))
      const scale =
        scaleMap[data.assignmentMastery] || getProficiencyBand(score, scaleInfo)
      return {
        score,
        scale,
        standardBasedScore: `${data.assignmentMastery}(${scale.masteryLabel})`,
        assessmentName: data.testName,
        questions: data.questions,
        obtainedScore: data.obtainedScore,
        maxScore: data.maxScore,
        performance: data.performance,
        standardMastery: data.standardMastery,
      }
    })

  const maxScoreTotal = sumBy(assignments, 'maxScore') || 0
  const obtainedScoreTotal = sumBy(assignments, 'obtainedScore') || 0
  const scoreAvg = round(percentage(obtainedScoreTotal, maxScoreTotal)) || 0
  const overallScale = scaleInfo.find(
    (s) => s.score === round(studentStandardData[0]?.fm || 1)
  )
  const overallStandardBasedScore = `${overallScale?.score || ''}(${
    overallScale?.masteryLabel || ''
  })`
  const calcType = calcMethod[overallScale?.calcType] || ''
  const overallAssessmentName = `Current Mastery (${calcType})`

  const overallAssignmentDetail = {
    maxScore: maxScoreTotal,
    obtainedScore: obtainedScoreTotal,
    score: scoreAvg,
    scale: overallScale,
    standardBasedScore: overallStandardBasedScore,
    assessmentName: overallAssessmentName,
    questions: 'N/A',
  }

  return [...assignments, overallAssignmentDetail]
}

export const formatDate = (milliseconds, showTime) => {
  if (showTime && milliseconds) {
    return moment(parseInt(milliseconds, 10)).format('MMM DD, YYYY, h:mm A')
  }
  return milliseconds
    ? moment(parseInt(milliseconds, 10)).format('MMM DD, YYYY')
    : 'NA'
}

const resetFilter = (filtersToReset, prevFilters, tagsData) => {
  for (const filter of filtersToReset) {
    if (filter.nestedFilters) {
      resetFilter(filter.nestedFilters, prevFilters, tagsData)
    } else {
      prevFilters[filter.key] = filter.value
      delete tagsData[filter.key]
    }
  }
}

export const resetStudentFilters = (
  tagsData,
  prevFilters,
  key,
  selected,
  defaultValues = studentFiltersDefaultValues
) => {
  const index = defaultValues.findIndex((s) => s.key === key)
  if (index !== -1 && prevFilters[key] !== selected) {
    const filtersToReset = defaultValues.slice(index + 1)
    resetFilter(filtersToReset, prevFilters, tagsData)
  } else if (['grades', 'subjects', 'courseId'].includes(key)) {
    const filtersToReset = defaultValues.slice(3)
    resetFilter(filtersToReset, prevFilters, tagsData)
  }
}

export const combineNames = (list) =>
  list.map((t) => ({
    ...t,
    name: [t.firstName, t.middleName, t.lastName]
      .filter((n) => n)
      .join(' ')
      .trim(),
  }))

export const getAssessmentName = (test) => {
  const [key, title] = [test._id || test.key, test.title]
  return `${title} (ID:${key.substring(key.length - 5)})`
}

export const getTooltipArrowStyles = ({ tooltipType, tooltipArrowMargin }) => {
  let style
  switch (tooltipType) {
    case 'right':
      style = {
        left: '-15px',
        bottom: `${
          tooltipArrowMargin ? `calc(50% - ${tooltipArrowMargin}px)` : '50%'
        }`,
        transform: 'translateY(50%) rotate(90deg)',
      }
      break
    case 'left':
      style = {
        left: '195px',
        bottom: `${
          tooltipArrowMargin ? `calc(50% - ${tooltipArrowMargin}px)` : '50%'
        }`,
        transform: 'translateY(50%) rotate(-90deg)',
      }
      break

    case 'bottom':
      style = {
        left: `50%`,
        top: `-10px`,
        transform: 'translateX(-50%) rotate(180deg)',
      }
      break

    default:
      style = {
        left: '50%',
        bottom: '-10px',
        transform: 'translateX(-50%)',
      }
  }
  return style
}

export const setProperties = (ref, obj) => {
  const keys = Object.keys(obj)
  keys.forEach((key) => {
    ref.current.style.setProperty(key, obj[key])
  })
}

export const getHoveredBarDimensions = (event) => {
  const attributes = event.target.parentNode.attributes
  const width = 45
  if (Number.isNaN(width)) return
  const height = +attributes.height?.nodeValue
  const x = +attributes.x?.nodeValue
  const y = +attributes.y?.nodeValue
  const d = {
    x,
    y,
    width,
    height,
  }
  return d
}

export const tooltipParams = {
  tooltipWidth: 200,
  maxTooltipHeight: 250,
  spaceForLittleTriangle: 10,
  spaceForPercentageLabel: 20,
  navButtonMargin: 50,
  xAxisHeight: 100,
}
