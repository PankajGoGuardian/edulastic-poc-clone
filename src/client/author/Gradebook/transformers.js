import {
  capitalize,
  groupBy,
  keyBy,
  countBy,
  pickBy,
  uniq,
  isEmpty,
  flatMap,
} from 'lodash'

// constants
import { test as testConstants, testActivityStatus } from '@edulastic/constants'

export const INITIAL_FILTERS = {
  assessmentIds: [],
  status: '',
  classIds: [],
  grades: [],
  subjects: [],
  termId: '',
  testType: '',
  groupId: '',
}

export const PAGE_DETAIL = {
  studentPage: 1,
  studentPageSize: 50,
  assignmentPage: 1,
  assignmentPageSize: 10,
}

// id for STATUS_LIST items correspond to
// testActivityStatus from @edulastic/constants
export const STATUS_LIST = [
  {
    idx: 0,
    id: 'NOT STARTED',
    name: 'NOT STARTED',
    color: '#E5E5E5',
    fgColor: '#a6a6a6',
  },
  {
    idx: 1,
    id: 'START',
    name: 'IN PROGRESS',
    color: '#BEDEFF',
    fgColor: '#66b3ff',
  },
  {
    idx: 2,
    id: 'SUBMITTED',
    name: 'SUBMITTED',
    color: '#FFE9A8',
    fgColor: '#ffc61a',
  },
  {
    idx: 3,
    id: 'GRADED',
    name: 'GRADED',
    color: '#DEF4E8',
    fgColor: '#79d2a1',
  },
  {
    idx: 4,
    id: 'ABSENT',
    name: 'ABSENT',
    color: '#FDE0E9',
    fgColor: '#f787ab',
  },
]

export const TEST_TYPE_COLOR = {
  [testConstants.type.ASSESSMENT]: '#5EB500',
  [testConstants.type.COMMON]: '#FF9100',
  [testConstants.type.PRACTICE]: '#00A8FF',
  'common assessment': '#FF9100',
}

export const getFormattedName = (
  firstName = '',
  middleName = '',
  lastName = ''
) => {
  if (
    (!firstName && !lastName && !middleName) ||
    (firstName && firstName === 'Anonymous')
  ) {
    return 'Anonymous'
  }
  let fullName = ''
  if (lastName && (firstName || middleName)) {
    fullName = `${capitalize(lastName)},`
  } else if (lastName) {
    return `${capitalize(lastName)}`
  }
  if (firstName) {
    fullName = fullName
      ? `${fullName} ${capitalize(firstName)}`
      : `${capitalize(firstName)}`
  }
  if (middleName) {
    fullName = fullName
      ? `${fullName} ${capitalize(middleName)}`
      : `${capitalize(middleName)}`
  }
  return fullName
}

export const splitFullName = (fullName = '') => {
  const trimmedFullName = fullName.trim()
  let firstName = ''
  let middleName = ''
  let lastName = ''
  if (trimmedFullName) {
    const splitNames = trimmedFullName.split(' ').map((o) => (o || '').trim())
    if (splitNames.length === 1) {
      firstName = splitNames[0]
    } else if (splitNames.length === 2) {
      firstName = splitNames[0]
      lastName = splitNames[1]
    } else if (splitNames.length > 2) {
      firstName = splitNames[0]
      middleName = splitNames.slice(1, splitNames.length - 1).join(' ')
      lastName = splitNames[splitNames.length - 1]
    }
  }
  return [firstName, middleName, lastName]
}

export const getUniqAssessments = (assessments = []) => {
  // group assignments by report key and title
  const assessmentGroups = groupBy(
    assessments,
    (a) => `${a.reportKey}_${a.title}`
  )
  const uniqAssessments = Object.keys(assessmentGroups).map((aId) => {
    const classIds = []
    const subjects = []
    const grades = []
    const assessmentIds = []
    let testTitle = ''
    const assessment = assessmentGroups[aId][0]
    assessmentGroups[aId].forEach((a) => {
      classIds.push(a.classId)
      subjects.push(...a.subjects)
      grades.push(...a.grades)
      assessmentIds.push(a._id)
      testTitle = testTitle || a.testTitle
    })
    return {
      id: assessment._id,
      name: testTitle,
      termId: assessment.termId,
      thumbnail: assessment.thumbnail,
      classIds: uniq(classIds),
      subjects: uniq(subjects),
      grades: uniq(grades),
      assessmentIds: uniq(assessmentIds),
    }
  })
  return uniqAssessments
}

export const curateFiltersData = (filtersData, filters) => {
  const { assessments = [] } = filtersData
  const { termId } = filters
  // TODO: raise query for filtering based on subjects, grades, or classIds in PRD
  const filteredAssessments = assessments.filter(
    (a) => !termId || a.termId === termId
  )
  const uniqAssessments = getUniqAssessments(filteredAssessments)
  return { ...filtersData, assessments: uniqAssessments }
}

// curate percentScore, status & lastActivityDAte for testActivity
const getCuratedTestActivity = (taGroup) => {
  const curatedGroup = taGroup.map((ta) => {
    const {
      status,
      graded,
      startDate,
      endDate,
      score = 0,
      maxScore = 1,
      redirect,
      isAssigned,
      isEnrolled,
    } = ta
    const laDate = endDate || startDate || 0
    if (status === testActivityStatus.START) {
      return { laDate, status: 'START', score, maxScore, redirect }
    }
    if (
      isAssigned === true &&
      isEnrolled === true &&
      status === testActivityStatus.NOT_STARTED
    ) {
      return {
        laDate,
        status: 'NOT STARTED',
        percentScore: ' ',
        redirect,
      }
    }
    if (status === testActivityStatus.SUBMITTED) {
      return {
        laDate,
        status: graded === 'GRADED' ? 'GRADED' : 'SUBMITTED',
        percentScore: `${Math.round((100 * score) / maxScore)}%`,
        score,
        maxScore,
        redirect,
      }
    }
    if (status === testActivityStatus.ABSENT) {
      return {
        laDate,
        status: 'ABSENT',
        percentScore: '0%',
        score,
        maxScore,
        redirect,
      }
    }
    return null
  })
  // if last attempted ta is redirected, show a ta with status "NOT STARTED"
  if (curatedGroup[0] && curatedGroup[0].redirect) {
    return {
      laDate: curatedGroup[0].laDate,
      status: 'NOT STARTED',
      percentScore: ' ',
      archived: curatedGroup,
    }
  }
  // return last attempted ta with others as archived
  return (
    curatedGroup[0] && { ...curatedGroup[0], archived: curatedGroup.slice(1) }
  )
}

// function to get paginated student data for gradebook student drilldown
const getPaginatedStudentData = (studentData, assessmentsData, pagination) => {
  const { assignmentPage, assignmentPageSize } = pagination
  const assignmentPos = (assignmentPage - 1) * assignmentPageSize
  // re-curate to combine student assessments from multiple classes
  const assMap = keyBy(assessmentsData, 'id')
  const studentAssessments = flatMap(studentData, (d) =>
    Object.entries(d.assessments).map(([aId, aData]) => ({
      ...assMap[aId],
      endDate: assMap[aId]?.class?.find((c) => c.endDate && c._id === d.classId)
        ?.endDate,
      ...aData,
      archived: aData.archived || [],
      classId: d.classId,
      key: `${aId}_${d.classId}`,
    }))
  )
  // paginate re-curated student assessments
  const assignmentsCount = studentAssessments.length
  const curatedData = studentAssessments.slice(
    assignmentPos,
    assignmentPos + assignmentPageSize
  )
  return { curatedData, assessmentsData, assignmentsCount, studentsCount: 1 }
}

// function to get paginated data when test-activity status filter is set
const getPaginatedData = (curatedData, assessmentsData, pagination) => {
  const {
    studentPage,
    assignmentPage,
    studentPageSize,
    assignmentPageSize,
  } = pagination
  const studentPos = (studentPage - 1) * studentPageSize
  const assignmentPos = (assignmentPage - 1) * assignmentPageSize

  // filter out empty rows
  curatedData = curatedData.filter((d) => !isEmpty(d.assessments))
  // get student count and student paginated data
  const studentsCount = curatedData.length
  curatedData = curatedData.slice(studentPos, studentPos + studentPageSize)

  // filter out empty columns
  const assessmentIds = uniq(
    curatedData.flatMap((d) => Object.keys(d.assessments))
  )
  assessmentsData = assessmentsData.filter((a) => assessmentIds.includes(a.id))
  // get assignment count and assignment paginated data
  const assignmentsCount = assessmentsData.length
  assessmentsData = assessmentsData.slice(
    assignmentPos,
    assignmentPos + assignmentPageSize
  )

  return { curatedData, assessmentsData, assignmentsCount, studentsCount }
}

// function to get curated gradebook data
export const curateGradebookData = (
  gradebookData,
  filtersData,
  pagination,
  status,
  urlHasStudent
) => {
  const {
    students = [],
    assignments = [],
    testActivities = [],
    assignmentsCount,
    studentsCount,
  } = gradebookData
  const { assessments: assessmentsList } = filtersData
  const mappedAssessmentsById = keyBy(assessmentsList, '_id')

  // group test-activity by assignmentId
  const taGroups = groupBy(testActivities, 'assignmentId')

  // curate student-class data
  const curatedData = students.map((student) => {
    const {
      _id: sId,
      firstName,
      middleName,
      lastName,
      group,
      assessments = {},
    } = student
    const { _id: classId, name: className } = group
    let laDate = 0
    // get formatted student name
    const studentName = getFormattedName(firstName, middleName, lastName)
    // update assessments for the curated student
    assignments.forEach((a) => {
      // check for test-activity belonging to the curated student
      const taGroup = taGroups[a._id]?.filter(
        (ta) => ta.userId === sId && ta.groupId === classId
      )
      const taCurated = taGroup?.length && getCuratedTestActivity(taGroup)
      if (taCurated) {
        // update test-activity & last-activity date for the assignment-student-class combo
        assessments[a._id] = {
          ...taCurated,
          assignmentId: a._id,
          testType: a.testType,
        }
        laDate = Math.max(laDate, taCurated.laDate)
      } else {
        // check for not started
        a.class?.forEach((c) => {
          if (
            c._id === classId &&
            !c.exStudents?.includes(sId) &&
            (!c?.students?.length ||
              (c?.students?.length && c.students?.includes(sId)))
          ) {
            assessments[a._id] = {
              assignmentId: a._id,
              testType: a.testType,
              laDate: 0,
              status: 'UN ASSIGNED',
              percentScore: '-',
            }
          }
        })
      }
    })
    // return updated student data
    return { _id: sId, studentName, classId, className, laDate, assessments }
  })

  // group assignments by report key and title
  const assignmentsMap = {}
  const assignmentGroups = groupBy(
    assignments,
    (a) => `${a.reportKey}_${a.title}`
  )
  const assignmentsData = Object.keys(assignmentGroups).map((aId) => {
    const assignment = assignmentGroups[aId][0]
    assignmentGroups[aId].forEach((a) => {
      assignmentsMap[a._id] = assignment._id
    })
    return assignment
  })

  // re-curate student data for the grouped assignments
  curatedData.forEach((d) => {
    const assessments = {}
    Object.entries(d.assessments).forEach(([k, v]) => {
      // store the latest test activity
      const prevLaDate = assessments[assignmentsMap[k]]?.laDate
      const selectPrev = prevLaDate && prevLaDate > v.laDate
      assessments[assignmentsMap[k]] = selectPrev
        ? assessments[assignmentsMap[k]]
        : v
    })
    // filter out the assignments for the selected status
    d.assessments = pickBy(assessments, (a) => !status || status === a.status)
    // assessments count for all status
    const assessmentsArr = Object.values(assessments)
    d.countByStatus = countBy(assessmentsArr, (a) => a.status)
  })

  const assessmentsData = assignmentsData.map((a) => {
    const name = mappedAssessmentsById[a._id]?.testTitle || a.title
    const thumbnail = mappedAssessmentsById[a._id]?.thumbnail
    return { id: a._id, name, class: a.class, thumbnail }
  })

  if (urlHasStudent) {
    // calculate overall countByStatus
    const countByStatus = {}
    STATUS_LIST.map(({ id }) => {
      countByStatus[id] = 0
      curatedData.forEach((d) => {
        countByStatus[id] += d.countByStatus[id] || 0
      })
    })
    return {
      ...getPaginatedStudentData(curatedData, assessmentsData, pagination),
      countByStatus,
    }
  }

  if (status) {
    return getPaginatedData(curatedData, assessmentsData, pagination)
  }

  return { curatedData, assessmentsData, assignmentsCount, studentsCount }
}
