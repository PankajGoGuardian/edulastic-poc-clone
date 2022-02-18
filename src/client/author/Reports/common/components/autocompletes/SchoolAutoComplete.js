import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { connect } from 'react-redux'
import { get, isEmpty, debounce } from 'lodash'

// components & constants
import MultiSelectSearch from '../widgets/MultiSelectSearch'

// ducks
import { getUserOrgId } from '../../../../src/selectors/user'
import {
  getSchoolsSelector,
  receiveSchoolsAction,
} from '../../../../Schools/ducks'

const DEFAULT_SEARCH_TERMS = { text: '', selectedText: '', selectedKey: '' }

const SchoolAutoComplete = ({
  dataCy,
  schoolList,
  loading,
  loadSchoolList,
  selectCB,
  selectedSchoolIds,
  districtId,
  networkIds,
}) => {
  const schoolFilterRef = useRef()
  const [searchTerms, setSearchTerms] = useState(DEFAULT_SEARCH_TERMS)
  const [searchResult, setSearchResult] = useState([])

  // build dropdown data
  const dropdownData = (searchTerms.text ? schoolList : searchResult).map(
    (item) => {
      return {
        key: item._id,
        title: item.name,
      }
    }
  )

  // build search query
  const query = useMemo(() => {
    const q = {
      limit: 25,
      page: 1,
      districtId,
      search: {
        name: [{ type: 'cont', value: searchTerms.text }],
      },
      networkIds: (networkIds || '').split(',').filter(Boolean),
    }
    return q
  }, [searchTerms.text, networkIds])

  // handle autocomplete actions
  const onSearch = (value) => {
    setSearchTerms({ ...searchTerms, text: value })
  }
  const onChange = (selected, selectedElements) => {
    const _selectedSchools = selectedElements.map(({ props }) => ({
      key: props.value,
      title: props.title,
    }))
    selectCB(_selectedSchools)
  }
  const onBlur = () => {
    if (searchTerms.text === '' && searchTerms.selectedText !== '') {
      setSearchTerms(DEFAULT_SEARCH_TERMS)
    } else {
      setSearchTerms({ ...searchTerms, text: searchTerms.selectedText })
    }
  }
  const loadSchoolListDebounced = useCallback(
    debounce(loadSchoolList, 500, { trailing: true }),
    []
  )
  const getDefaultSchoolList = () => {
    if (isEmpty(searchResult)) {
      loadSchoolListDebounced(query)
    }
  }

  // effects
  useEffect(() => {
    if (selectedSchoolIds.length) {
      loadSchoolListDebounced({ ...query, schoolIds: selectedSchoolIds })
    }
  }, [])
  useEffect(() => {
    if (isEmpty(searchResult)) {
      setSearchResult(schoolList)
    }
  }, [schoolList])
  useEffect(() => {
    if (searchTerms.text && searchTerms.text !== searchTerms.selectedText) {
      loadSchoolListDebounced(query)
    }
  }, [searchTerms])
  useEffect(() => {
    setSearchResult([])
  }, [networkIds])

  return (
    <MultiSelectSearch
      dataCy={dataCy}
      label="School"
      placeholder="All Schools"
      el={schoolFilterRef}
      onChange={onChange}
      onSearch={onSearch}
      onBlur={onBlur}
      onFocus={getDefaultSchoolList}
      value={selectedSchoolIds}
      options={dropdownData}
      loading={loading}
    />
  )
}

export default connect(
  (state) => ({
    schoolList: getSchoolsSelector(state),
    loading: get(state, ['schoolsReducer', 'loading'], false),
    districtId: getUserOrgId(state),
  }),
  {
    loadSchoolList: receiveSchoolsAction,
  }
)(SchoolAutoComplete)
