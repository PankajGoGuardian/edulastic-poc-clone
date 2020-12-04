import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { connect } from 'react-redux'
import { get, isEmpty, debounce } from 'lodash'

// components & constants
import { roleuser } from '@edulastic/constants'
import MultiSelectSearch from '../../../../../common/components/widgets/MultiSelectSearch'

// ducks
import { getUser } from '../../../../../../src/selectors/user'
import {
  receiveClassListAction,
  getClassListSelector,
} from '../../../../../../Classes/ducks'

const DEFAULT_SEARCH_TERMS = { text: '', selectedText: '', selectedKey: '' }

const ClassAutoComplete = ({
  userDetails,
  classList,
  loading,
  loadClassList,
  selectedCourseIds,
  selectedGrade,
  selectedSubject,
  selectedClassIds,
  selectCB,
}) => {
  const classAutoCompleteRef = useRef()
  const [searchTerms, setSearchTerms] = useState(DEFAULT_SEARCH_TERMS)
  const [defaultClassList, setDefaultClassList] = useState([])

  // build search query
  const query = useMemo(() => {
    const { institutionIds, role: userRole, orgData, _id: userId } = userDetails
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
    }
    if (userRole === roleuser.TEACHER) {
      q.search.teachers = [{ type: 'eq', value: userId }]
    }
    if (userRole === roleuser.SCHOOL_ADMIN) {
      q.search.institutionIds = institutionIds
    }
    if (selectedCourseIds) {
      q.search.courseIds = selectedCourseIds.split(',')
    }
    if (selectedGrade) {
      q.search.grades = [`${selectedGrade}`]
    }
    if (selectedSubject) {
      q.search.subjects = [selectedSubject]
    }
    return q
  }, [searchTerms.text])

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

  const loadClassListDebounced = useCallback(
    debounce(loadClassList, 500, { trailing: true }),
    []
  )
  const getDefaultClassList = () => {
    if (isEmpty(defaultClassList)) {
      loadClassListDebounced(query)
    }
  }

  // effects
  useEffect(() => {
    if (isEmpty(defaultClassList)) {
      setDefaultClassList(Object.values(classList))
    }
  }, [classList])
  useEffect(() => {
    if (searchTerms.text && searchTerms.text !== searchTerms.selectedText) {
      loadClassListDebounced(query)
    }
  }, [searchTerms])
  useEffect(() => {
    setSearchTerms(DEFAULT_SEARCH_TERMS)
    setDefaultClassList([])
  }, [selectedCourseIds, selectedGrade, selectedSubject])

  // build dropdown data
  const dropdownData = (searchTerms.text
    ? Object.values(classList)
    : defaultClassList
  ).map((item) => ({
    key: item._id,
    title: item._source.name,
  }))

  return (
    <MultiSelectSearch
      label="Class"
      el={classAutoCompleteRef}
      onChange={(e) => selectCB(e)}
      onSearch={onSearch}
      onBlur={onBlur}
      onFocus={getDefaultClassList}
      value={selectedClassIds}
      options={dropdownData}
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
