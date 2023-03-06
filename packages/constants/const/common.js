const helpCenterUrl = 'https://edulastic.com/help-center/'

const sessionFilters = {
  TEST_FILTER: 'filters[testList]',
  TEST_SORT: 'sortBy[testList]',
  TEST_ITEM_FILTER: 'filters[itemList]',
  TEST_ITEM_SORT: 'sortBy[itemList]',
  PLAYLIST_FILTER: 'filters[playList]',
  PLAYLIST_SORT: 'sortBy[playList]',
}

const WEEK_DAYS = {
  MONDAY: 'MON',
  TUESDAY: 'TUE',
  WEDNESDAY: 'WED',
  THURSDAY: 'THU',
  FRIDAY: 'FRI',
  SATURDAY: 'SAT',
  SUNDAY: 'SUN',
}

const hour12inMiliSec = 12 * 60 * 60 * 1000

const ATTEMPT_WINDOW_DEFAULT_START_TIME = '06:00 AM'
const ATTEMPT_WINDOW_DEFAULT_END_TIME = '06:00 PM'

const STUDENT_ATTEMPT_TIME_WINDOW = 'attemptWindow'

const ONE_HOURS_IN_MILLISECONDS = 3600000
const ONE_MINUTES_IN_MILLISECONDS = 60000
const TOTAL_MINUTE_IN_HOURS = 60
const TOTAL_HOURS_IN_ONE_DAY = 24
const TOTAL_HOURS_IN_HALF_DAY = 12
const ANTE_MERIDIEM = 'AM'
const POST_MERIDIEM = 'PM'

const PASSWORD_KEY = 'password'

module.exports = {
  helpCenterUrl,
  sessionFilters,
  WEEK_DAYS,
  ATTEMPT_WINDOW_DEFAULT_START_TIME,
  ATTEMPT_WINDOW_DEFAULT_END_TIME,
  STUDENT_ATTEMPT_TIME_WINDOW,
  hour12inMiliSec,
  ONE_HOURS_IN_MILLISECONDS,
  ONE_MINUTES_IN_MILLISECONDS,
  TOTAL_MINUTE_IN_HOURS,
  TOTAL_HOURS_IN_ONE_DAY,
  TOTAL_HOURS_IN_HALF_DAY,
  ANTE_MERIDIEM,
  POST_MERIDIEM,
  PASSWORD_KEY,
}
