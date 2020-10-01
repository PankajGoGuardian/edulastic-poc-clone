import { test } from '@edulastic/constants'
import moment from 'moment'

const { ITEM_GROUP_TYPES, ITEM_GROUP_DELIVERY_TYPES } = test

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

/**
 * generate "count" number of fake names and details!
 * @param {number} count
 */
export const createFakeData = (count) => {
  const students = []
  let i = 0
  while (i < count) {
    const index = i % 10
    students.push({
      fakeFirstName: colors[index],
      fakeLastName: items[index].name,
      icon: items[index].icon,
    })

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
 * @param {Object} itemGroups
 * no itemGroups return false
 * for itemGroups exists - atleast one group with AUTOSELECT or STATIC with limited random can have random items, hence return true
 *
 */
export const hasRandomQuestions = (itemGroups = []) => {
  if (!itemGroups || !itemGroups.length) {
    return false
  }
  return itemGroups.some(
    (group) =>
      group.type === ITEM_GROUP_TYPES.AUTOSELECT ||
      group.deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM
  )
}

/**
 * @param {Object} _class
 * return date in miliseconds
 * if assignment closed/passed close date, duedate will be close date or today + 1day
 * if assignmnet not closed enddate will redurn
 */
export const getRedirectEndDate = (_class, dueDate) => {
  const { endDate, closed } = _class

  if (closed || dueDate > moment(endDate)) {
    return dueDate
  }
  return endDate
}
