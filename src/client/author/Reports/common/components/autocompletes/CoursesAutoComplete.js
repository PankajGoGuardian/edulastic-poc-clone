import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { connect } from 'react-redux'
import { get, isEmpty, debounce } from 'lodash'

// components & constants
import MultiSelectSearch from '../widgets/MultiSelectSearch'

// ducks
import { getUser } from '../../../../src/selectors/user'
import {
  receiveCourseListAction,
  getCourseListSelector,
} from '../../../../Courses/ducks'

const DEFAULT_SEARCH_TERMS = { text: '', selectedText: '', selectedKey: '' }

const CoursesAutoComplete = ({
  userDetails,
  courseList,
  loading,
  loadCourseList,
  selectedCourseIds,
  selectCB,
  dataCy,
}) => {
  const CoursesAutoCompleteRef = useRef()
  const [searchTerms, setSearchTerms] = useState(DEFAULT_SEARCH_TERMS)
  const [defaultCourseList, setDefaultCourseList] = useState([])

  // build search query
  const query = useMemo(() => {
    const { orgData } = userDetails
    const { districtIds } = orgData
    const districtId = districtIds?.[0]
    const q = {
      limit: 25,
      page: 1,
      districtId,
      search: {
        name: [{ type: 'cont', value: searchTerms.text }],
      },
    }
    return q
  }, [searchTerms.text])

  // handle autocomplete actions
  const onSearch = (value) => {
    setSearchTerms({ ...searchTerms, text: value })
  }
  const onChange = (selected, selectedElements) => {
    const _selectedCourses = selectedElements.map(({ props }) => ({
      key: props.value,
      title: props.title,
    }))
    selectCB(_selectedCourses)
  }
  const onBlur = () => {
    if (searchTerms.text === '' && searchTerms.selectedText !== '') {
      setSearchTerms(DEFAULT_SEARCH_TERMS)
      selectCB('')
    } else {
      setSearchTerms({ ...searchTerms, text: searchTerms.selectedText })
    }
  }
  const loadCourseListDebounced = useCallback(
    debounce(loadCourseList, 500, { trailing: true }),
    []
  )
  const getDefaultCourseList = () => {
    if (isEmpty(defaultCourseList)) {
      loadCourseListDebounced(query)
    }
  }

  // effects
  useEffect(() => {
    if (isEmpty(defaultCourseList)) {
      setDefaultCourseList(courseList)
    }
  }, [courseList])
  useEffect(() => {
    if (searchTerms.text && searchTerms.text !== searchTerms.selectedText) {
      loadCourseListDebounced(query)
    }
  }, [searchTerms])

  const dropdownData = (searchTerms.text ? courseList : defaultCourseList).map(
    (item) => ({
      key: item._id,
      title: item.name,
    })
  )

  return (
    <MultiSelectSearch
      dataCy={dataCy}
      label="Course"
      el={CoursesAutoCompleteRef}
      onChange={onChange}
      onSearch={onSearch}
      onBlur={onBlur}
      onFocus={getDefaultCourseList}
      value={selectedCourseIds}
      options={dropdownData}
      loading={loading}
    />
  )
}

export default connect(
  (state) => ({
    userDetails: getUser(state),
    courseList: getCourseListSelector(state),
    loading: get(state, ['coursesReducer', 'loading'], false),
  }),
  {
    loadCourseList: receiveCourseListAction,
  }
)(CoursesAutoComplete)
