import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { connect } from 'react-redux'
import { get, isEmpty, debounce } from 'lodash'

// components & constants
import { roleuser } from '@edulastic/constants'
import MultiSelectSearch from '../widgets/MultiSelectSearch'

// ducks
import { getUser } from '../../../../src/selectors/user'
import {
  receiveGroupListAction,
  getGroupListSelector,
} from '../../../../Groups/ducks'

const DEFAULT_SEARCH_TERMS = { text: '', selectedText: '', selectedKey: 'All' }

const GroupsAutoComplete = ({
  userDetails,
  groupList,
  loading,
  loadGroupList,
  termId,
  schoolIds,
  teacherIds,
  grade,
  subject,
  courseId,
  selectCB,
  selectedGroupIds,
}) => {
  const groupFilterRef = useRef()
  const [searchTerms, setSearchTerms] = useState(DEFAULT_SEARCH_TERMS)
  const [searchResult, setSearchResult] = useState([])

  // build search query
  const query = useMemo(() => {
    const { role: userRole, orgData } = userDetails
    const { districtIds } = orgData
    const districtId = districtIds?.[0]
    const q = {
      limit: 25,
      page: 1,
      districtId,
      search: {
        name: searchTerms.text,
        type: ['custom'],
      },
      queryType: 'OR',
    }
    if (termId) {
      q.search.termIds = [termId]
    }
    if (teacherIds) {
      q.search.teachers = teacherIds
        .split(',')
        .map((t) => ({ type: 'cont', value: t }))
    }
    if (
      (userRole === roleuser.DISTRICT_ADMIN ||
        userRole === roleuser.SCHOOL_ADMIN) &&
      schoolIds
    ) {
      q.search.institutionIds = schoolIds.split(',')
    }
    if (grade) {
      q.search.grades = [grade]
    }
    if (subject) {
      q.search.subjects = [subject]
    }
    if (courseId) {
      q.search.courseIds = [courseId]
    }
    return q
  }, [
    searchTerms.text,
    termId,
    schoolIds,
    teacherIds,
    grade,
    subject,
    courseId,
  ])

  // handle autocomplete actions
  const onSearch = (value) => {
    setSearchTerms({ ...searchTerms, text: value })
  }
  const onBlur = () => {
    if (searchTerms.text === '' && searchTerms.selectedText !== '') {
      setSearchTerms(DEFAULT_SEARCH_TERMS)
      selectCB({ key: '', title: '' })
    } else {
      setSearchTerms({ ...searchTerms, text: searchTerms.selectedText })
    }
  }
  const loadGroupListDebounced = useCallback(
    debounce(loadGroupList, 500, { trailing: true }),
    []
  )
  const getDefaultGroupList = () => {
    if (isEmpty(searchResult)) {
      loadGroupListDebounced(query)
    }
  }

  // effects
  useEffect(() => {
    if (isEmpty(searchResult)) {
      setSearchResult(groupList)
    }
  }, [groupList])
  useEffect(() => {
    if (searchTerms.text && searchTerms.text !== searchTerms.selectedText) {
      loadGroupListDebounced(query)
    }
  }, [searchTerms])
  useEffect(() => {
    setSearchResult([])
    // if (selectedGroupIds.length) {
    //   selectCB({ key: '', title: '' })
    // }
  }, [termId, schoolIds, teacherIds, grade, subject, courseId])
  useEffect(() => {
    if (!selectedGroupIds.length) {
      setSearchTerms(DEFAULT_SEARCH_TERMS)
    }
  }, [selectedGroupIds])

  // build dropdown data
  const dropdownData = Object.values(
    searchTerms.text ? groupList : searchResult
  ).map((item) => {
    return {
      key: item._id,
      title: item._source.name,
    }
  })

  return (
    <MultiSelectSearch
      label="Group"
      placeholder="All Groups"
      el={groupFilterRef}
      onChange={(e) => selectCB(e)}
      onSearch={onSearch}
      onBlur={onBlur}
      onFocus={getDefaultGroupList}
      value={selectedGroupIds}
      options={!loading ? dropdownData : []}
      loading={loading}
    />
  )
}

export default connect(
  (state) => ({
    userDetails: getUser(state),
    groupList: getGroupListSelector(state),
    loading: get(state, ['groupsReducer', 'loading'], false),
  }),
  {
    loadGroupList: receiveGroupListAction,
  }
)(GroupsAutoComplete)
