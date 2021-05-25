import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { connect } from 'react-redux'
import { get, isEmpty, debounce } from 'lodash'

// components & constants
import { roleuser } from '@edulastic/constants'
import MultiSelectSearch from '../widgets/MultiSelectSearch'

// ducks
import { getUser } from '../../../../src/selectors/user'
import {
  receiveClassListAction,
  getClassListSelector,
} from '../../../../Classes/ducks'

const DEFAULT_SEARCH_TERMS = { text: '', selectedText: '', selectedKey: 'All' }

const ClassAutoComplete = ({
  userDetails,
  classList,
  loading,
  loadClassList,
  termId,
  schoolIds,
  teacherIds,
  grades,
  subjects,
  courseId,
  selectCB,
  selectedClassIds,
  dataCy,
}) => {
  const classFilterRef = useRef()
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
        type: ['class'],
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
    termId,
    schoolIds,
    teacherIds,
    grades,
    subjects,
    courseId,
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
    if (isEmpty(searchResult)) {
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
    // if (selectedClassIds.length) {
    //   selectCB({ key: '', title: '' })
    // }
  }, [termId, schoolIds, teacherIds, grades, subjects, courseId])
  useEffect(() => {
    if (!selectedClassIds.length) {
      setSearchTerms(DEFAULT_SEARCH_TERMS)
    }
  }, [selectedClassIds.join(',')])

  // build dropdown data
  const dropdownData = Object.values(
    searchTerms.text ? classList : searchResult
  ).map((item) => {
    return {
      key: item._id,
      title: item._source.name,
    }
  })

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
    classList: getClassListSelector(state),
    loading: get(state, ['classesReducer', 'loading'], false),
  }),
  {
    loadClassList: receiveClassListAction,
  }
)(ClassAutoComplete)
