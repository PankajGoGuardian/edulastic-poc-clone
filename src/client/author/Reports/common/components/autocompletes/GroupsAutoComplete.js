import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { connect } from 'react-redux'
import { get, isEmpty, debounce } from 'lodash'

// components & constants
import { roleuser } from '@edulastic/constants'
import MultiSelectSearch from '../widgets/MultiSelectSearch'

// ducks
import { getUser, getUserOrgId } from '../../../../src/selectors/user'
import {
  receiveGroupListAction,
  getGroupListSelector,
} from '../../../../Groups/ducks'

const DEFAULT_SEARCH_TERMS = { text: '', selectedText: '', selectedKey: 'All' }

const GroupsAutoComplete = ({
  userDetails,
  groupList: groupListRaw,
  loading,
  loadGroupList,
  termIds,
  districtId,
  schoolIds,
  teacherIds,
  grades,
  subjects,
  courseId,
  selectCB,
  selectedGroupIds,
  dataCy,
  userDistrictId,
  networkIds,
}) => {
  const groupFilterRef = useRef()
  const [searchTerms, setSearchTerms] = useState(DEFAULT_SEARCH_TERMS)
  const [searchResult, setSearchResult] = useState([])

  const groupList = useMemo(() => Object.values(groupListRaw), [groupListRaw])

  // build search query
  const query = useMemo(() => {
    const { role: userRole } = userDetails
    const q = {
      limit: 25,
      page: 1,
      districtId: districtId || userDistrictId,
      search: {
        name: searchTerms.text,
        type: ['custom'],
        networkIds: (networkIds || '').split(',').filter(Boolean),
      },
      queryType: 'OR',
    }
    if (termIds) {
      q.search.termIds = termIds.split(',')
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
    if (grades) {
      q.search.grades = Array.isArray(grades) ? grades : grades.split(',')
    }
    if (subjects) {
      q.search.subjects = Array.isArray(subjects)
        ? subjects
        : subjects.split(',')
    }
    if (courseId) {
      q.search.courseIds = [courseId]
    }
    return q
  }, [
    searchTerms.text,
    termIds,
    districtId,
    schoolIds,
    teacherIds,
    grades,
    subjects,
    courseId,
    networkIds,
  ])

  // handle autocomplete actions
  const onSearch = (value) => {
    setSearchTerms({ ...searchTerms, text: value })
  }
  const onChange = (selected, selectedElements) => {
    const _selectedGroups = selectedElements.map(({ props }) => ({
      key: props.value,
      title: props.title,
    }))
    selectCB(_selectedGroups)
  }
  const onBlur = () => {
    if (searchTerms.text === '' && searchTerms.selectedText !== '') {
      setSearchTerms(DEFAULT_SEARCH_TERMS)
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
    if (selectedGroupIds.length) {
      const _search = { ...query.search, groupIds: selectedGroupIds }
      loadGroupListDebounced({ ...query, search: _search })
    }
  }, [])
  useEffect(() => {
    if (isEmpty(searchResult) || !searchTerms.text) {
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
  }, [
    termIds,
    districtId,
    schoolIds,
    teacherIds,
    grades,
    subjects,
    courseId,
    networkIds,
  ])

  // build dropdown data
  const dropdownData = (searchTerms.text ? groupList : searchResult).map(
    (item) => {
      return {
        key: item._id,
        title: item._source.name,
      }
    }
  )

  return (
    <MultiSelectSearch
      label="Group"
      dataCy={dataCy}
      placeholder="All Groups"
      el={groupFilterRef}
      onChange={onChange}
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
    userDistrictId: getUserOrgId(state),
    groupList: getGroupListSelector(state),
    loading: get(state, ['groupsReducer', 'loading'], false),
  }),
  {
    loadGroupList: receiveGroupListAction,
  }
)(GroupsAutoComplete)
