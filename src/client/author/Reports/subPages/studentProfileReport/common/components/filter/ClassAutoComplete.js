import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { connect } from 'react-redux'
import { get, isEmpty, debounce } from 'lodash'

// components & constants
import { roleuser } from '@edulastic/constants'
import MultiSelectSearch from '../../../../../common/components/widgets/MultiSelectSearch'

// ducks
import {
  currentDistrictInstitutionIds,
  getUser,
  getUserOrgId,
} from '../../../../../../src/selectors/user'
import {
  receiveClassListAction,
  getClassListSelector,
} from '../../../../../../Classes/ducks'

const DEFAULT_SEARCH_TERMS = { text: '', selectedText: '', selectedKey: 'All' }

const ClassAutoComplete = ({
  userDetails,
  classList: classListRaw,
  loading,
  loadClassList,
  termId,
  grades,
  subjects,
  courseIds,
  selectCB,
  selectedClassIds,
  dataCy,
  districtId,
  institutionIds,
}) => {
  const classFilterRef = useRef()
  const [searchTerms, setSearchTerms] = useState(DEFAULT_SEARCH_TERMS)
  const [searchResult, setSearchResult] = useState([])

  const classList = useMemo(() => Object.values(classListRaw), [classListRaw])

  // build search query
  const query = useMemo(() => {
    const { role: userRole, _id: userId } = userDetails
    const q = {
      limit: 25,
      page: 1,
      districtId,
      queryType: 'OR',
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
    if (termId) {
      q.search.termIds = [termId]
    }
    if (courseIds) {
      q.search.courseIds = courseIds.split(',')
    }
    if (grades) {
      q.search.grades = Array.isArray(grades) ? grades : grades.split(',')
    }
    if (subjects) {
      q.search.subjects = Array.isArray(subjects)
        ? subjects
        : subjects.split(',')
    }
    return q
  }, [searchTerms.text, termId, grades, subjects, courseIds, institutionIds])

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
  }, [termId, grades, subjects, courseIds])

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
    classList: getClassListSelector(state),
    loading: get(state, ['classesReducer', 'loading'], false),
    districtId: getUserOrgId(state),
    institutionIds: currentDistrictInstitutionIds(state),
  }),
  {
    loadClassList: receiveClassListAction,
  }
)(ClassAutoComplete)
