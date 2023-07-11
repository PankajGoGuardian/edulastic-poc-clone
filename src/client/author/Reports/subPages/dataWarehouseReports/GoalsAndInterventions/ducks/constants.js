export const ADVANCED_SEARCH_DETAILS = 'advancedSearchDetails'
export const ADVANCED_SEARCH_QUERY = 'advancedSearchQuery'
export const ADVANCED_SEARCH_DATA = 'advancedSearchData'
export const ADVANCED_SEARCH_LOADING = 'isAdvancedSearchLoading'
export const GROUP = 'group'

export const fieldKey = {
  schools: 'institutionIds',
  courses: 'courses',
  grades: 'grades',
  subjects: 'subjects',
  groupType: 'groupType',
  classes: 'classIds',
  groups: 'groupIds',
  tags: 'tagIds',
  attendanceBands: 'attendanceBands',
  proficiencyBands: 'proficiencyBands',
  testType: 'testType',
  avgScore: 'avgScore',
  avgAttendance: 'avgAttendance',
}

// initial values
export const INITIAL_VALUE = {
  data: [],
  isLoading: false,
  isLoadingOnGroupEdit: false,
}

export const DEFAULT_QUERY = { combinator: 'and', rules: [] }
export const INITIAL_STATE_ADV_SEARCH = {
  [ADVANCED_SEARCH_QUERY]: DEFAULT_QUERY,
  [ADVANCED_SEARCH_DETAILS]: {
    [fieldKey.schools]: INITIAL_VALUE,
    [fieldKey.courses]: INITIAL_VALUE,
    [fieldKey.classes]: INITIAL_VALUE,
    [fieldKey.groups]: INITIAL_VALUE,
    [fieldKey.attendanceBands]: INITIAL_VALUE,
  },
  [ADVANCED_SEARCH_DATA]: INITIAL_VALUE,
  [GROUP]: {
    status: 'init',
    groupDetails: {},
    isLoading: false,
  },
}
