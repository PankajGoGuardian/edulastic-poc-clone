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

module.exports = {
  helpCenterUrl,
  sessionFilters,
  WEEK_DAYS,
  ATTEMPT_WINDOW_DEFAULT_START_TIME,
  ATTEMPT_WINDOW_DEFAULT_END_TIME,
  STUDENT_ATTEMPT_TIME_WINDOW,
  hour12inMiliSec,
}
