import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { connect } from 'react-redux'
import { get, isEmpty, debounce } from 'lodash'

// components & constants
import { roleuser } from '@edulastic/constants'
import MultiSelectSearch from '../widgets/MultiSelectSearch'

// ducks
import { getUser, getUserOrgId } from '../../../../src/selectors/user'
import {
  receiveClassListAction,
  getClassListSelector,
} from '../../../../Classes/ducks'

const DEFAULT_SEARCH_TERMS = { text: '', selectedText: '', selectedKey: 'All' }

const ClassAutoComplete = ({
  userDetails,
  classList: classListRaw,
  loading,
  loadClassList,
  districtId,
  termIds,
  schoolIds,
  teacherIds,
  grades,
  subjects,
  courseId,
  selectCB,
  selectedClassIds,
  dataCy,
  userDistrictId,
  networkIds,
}) => {
  const classFilterRef = useRef()
  const [searchTerms, setSearchTerms] = useState(DEFAULT_SEARCH_TERMS)
  const [searchResult, setSearchResult] = useState([])

  const classList = useMemo(() => Object.values(classListRaw), [classListRaw])

  // build search query
  const query = useMemo(() => {
    const { role: userRole } = userDetails
    const q = {
      limit: 25,
      page: 1,
      districtId: districtId || userDistrictId,
      search: {
        name: searchTerms.text,
        type: ['class'],
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
    districtId,
    termIds,
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
    const _selectedClasses = selectedElements.map(({ props }) => ({
      key: props.value,
      title: props.title,
    }))
    selectCB(_selectedClasses)
  }
  const onBlur = () => {
    if (searchTerms.text === '' && searchTerms.selectedText !== '') {
      setSearchTerms(DEFAULT_SEARCH_TERMS)
    } else {
      setSearchTerms({ ...searchTerms, text: searchTerms.selectedText })
    }
  }
  const loadClassListDebounced = useCallback(
    debounce(loadClassList, 500, { trailing: true }),
    []
  )
  const getDefaultClassList = () => {
    if (isEmpty(searchResult)) {
      loadClassListDebounced(query)
    }
  }

  // effects
  useEffect(() => {
    if (selectedClassIds.length) {
      const _search = { ...query.search, groupIds: selectedClassIds }
      loadClassListDebounced({ ...query, search: _search })
    }
  }, [])
  useEffect(() => {
    if (isEmpty(searchResult) || !searchTerms.text) {
      setSearchResult(classList)
    }
  }, [classList])
  useEffect(() => {
    if (searchTerms.text && searchTerms.text !== searchTerms.selectedText) {
      loadClassListDebounced(query)
    }
  }, [searchTerms])
  useEffect(() => {
    setSearchResult([])
  }, [
    districtId,
    termIds,
    schoolIds,
    teacherIds,
    grades,
    subjects,
    courseId,
    networkIds,
  ])

  // build dropdown data
  const dropdownData = (searchTerms.text ? classList : searchResult).map(
    (item) => {
      return {
        key: item._id,
        title: item._source.name,
      }
    }
  )

  return (
    <MultiSelectSearch
      label="Class"
      dataCy={dataCy}
      placeholder="All Classes"
      el={classFilterRef}
      onChange={onChange}
      onSearch={onSearch}
      onBlur={onBlur}
      onFocus={getDefaultClassList}
      value={selectedClassIds}
      options={!loading ? dropdownData : []}
      loading={loading}
    />
  )
}

export default connect(
  (state) => ({
    userDetails: getUser(state),
    userDistrictId: getUserOrgId(state),
    classList: getClassListSelector(state),
    loading: get(state, ['classesReducer', 'loading'], false),
  }),
  {
    loadClassList: receiveClassListAction,
  }
)(ClassAutoComplete)
