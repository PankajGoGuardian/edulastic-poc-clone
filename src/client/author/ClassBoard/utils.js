import { test as testConstants } from '@edulastic/constants'
import moment from 'moment'

const {
  ITEM_GROUP_TYPES,
  ITEM_GROUP_DELIVERY_TYPES,
  testCategoryTypes,
} = testConstants

let colors = [
  'red',
  'grey',
  'green',
  'yellow',
  'pink',
  'blue',
  'violet',
  'orange',
  'black',
  'magenta',
]
const items = [
  {
    name: 'bell',
    icon: 'bell-o',
  },
  {
    name: 'snow',
    icon: 'snowflake-o',
  },
  {
    name: 'car',
    icon: 'car',
  },
  {
    name: 'ball',
    icon: 'futbol-o',
  },
  {
    name: 'camera',
    icon: 'camera',
  },
  {
    name: 'magnet',
    icon: 'magnet',
  },
  {
    name: 'book',
    icon: 'book',
  },
  {
    name: 'eraser',
    icon: 'eraser',
  },
  {
    name: 'bug',
    icon: 'bug',
  },
  {
    name: 'bike',
    icon: 'motorcycle',
  },
]

export const TUTORME_TO_EDULASTIC_GRADES = {
  0: 'K',
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10',
  11: '11',
  12: '12',
  13: 'O',
}

export const TUTORME_TO_EDULASTIC_SUBJECTS = {
  Math: 'Mathematics',
  'English Language Arts': 'ELA',
  'Natural Science': 'Science',
  'Social Science': 'Social Studies',
  'Computer Science': 'Computer Science',
  NA: 'Other Subjects',
  Spanish: 'Other Subjects',
}

/**
 * generate "count" number of fake names and details!
 * @param {number} count
 */
export const createFakeData = (count) => {
  const students = []
  const offenceStudentNames = ['blue ball', 'yellow snow']
  let i = 0
  while (students.length < count) {
    const index = i % 10
    const fakeFirstName = colors[index]
    const fakeLastName = items[index].name
    const icon = items[index].icon
    if (!offenceStudentNames.includes(`${fakeFirstName} ${fakeLastName}`)) {
      students.push({
        fakeFirstName,
        fakeLastName,
        icon,
      })
    }
    i++
    if (i % 10 === 0) {
      colors = [...colors.slice(1), colors[0]]
    }
  }

  return students
}

/**
 *
 * @param {*} student
 * student full name should be displayed to the user by default if student first name exists <FirstName>, <LastName> (username)
 * student doesnt have first name then print last name with user name in brackets eg: <LastName> (username)
 * student doesnt have first and last name then print user name only <UserName>
 * None of the student details exist then print Anonymous
 */
export const getUserName = (student) => {
  if (student.firstName) {
    return `${student.firstName}${
      student.lastName ? `, ${student.lastName}` : ''
    }
              ${student.username ? ` (${student.username})` : ''}`
  }
  if (student.lastName) {
    return `${student.lastName ? `${student.lastName}` : ''}
              ${student.username ? ` (${student.username})` : ''}`
  }
  if (student.username) {
    return student.username
  }
  return 'Anonymous'
}

/**
 * @param {Object} test
 * no item groups - if dynamic test return true else false
 * dynamic test with auto-select itemGroup or with limited/random delivery type - return true
 * keep in sync with `hasRandomQuestionsInGroup()` in `edu-api/src/utils/test.js`
 */
export const hasRandomQuestions = (test = {}) => {
  const { itemGroups = [], testCategory = testCategoryTypes.DEFAULT } = test

  if (!itemGroups || !itemGroups.length) {
    // hasRandomQuestion should be true when itemGroups are absent for dynamic test
    // this is done so that all features relying on this check are disabled
    return testCategory === testCategoryTypes.DYNAMIC_TEST
  }
  return (
    testCategory === testCategoryTypes.DYNAMIC_TEST &&
    // if all itemGroups do not belong to type STATIC with deliveryType ALL
    itemGroups.some(
      (group) =>
        group.type === ITEM_GROUP_TYPES.AUTOSELECT ||
        group.deliveryType !== ITEM_GROUP_DELIVERY_TYPES.ALL
    )
  )
}

/**
 * @param {Object} _class
 * return date in miliseconds
 * if assignment closed/passed close date, duedate will be close date or today + 1day
 * if assignmnet not closed enddate will redurn
 */
export const getRedirectEndDate = (_class, dueDate) => {
  const { closed, ts: dateNow, dueDate: classDue } = _class
  const endDate = classDue || _class.endDate
  const diffInSecs = (endDate - dateNow) / 1000
  const diffInHours = diffInSecs / (60 * 60)
  if (diffInHours < 24 || !endDate) {
    return moment().add(2, 'day')
  }
  if (closed || dueDate > moment(endDate)) {
    return dueDate
  }
  return endDate
}

export const getSubmittedDate = (activityEndDate, classEndDate) => {
  let endDate = activityEndDate
  if (activityEndDate && classEndDate) {
    endDate = activityEndDate < classEndDate ? activityEndDate : classEndDate
  }
  if (!endDate) {
    return '-'
  }
  return moment(endDate).format('MMM DD, YYYY HH:mm')
}
