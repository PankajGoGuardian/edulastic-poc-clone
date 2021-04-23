import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { connect } from 'react-redux'
import { get, isEmpty, debounce } from 'lodash'

// components & constants
import MultiSelectSearch from '../widgets/MultiSelectSearch'

// ducks
import { getOrgDataSelector } from '../../../../src/selectors/user'
import {
  getSchoolsSelector,
  receiveSchoolsAction,
} from '../../../../Schools/ducks'

const DEFAULT_SEARCH_TERMS = { text: '', selectedText: '', selectedKey: '' }

const SchoolAutoComplete = ({
  dataCy,
  userOrgData,
  schoolList,
  loading,
  loadSchoolList,
  selectCB,
  selectedSchoolIds,
  firstLoad,
  tempTagsData,
  setTagsData,
  setTempTagsData,
}) => {
  const schoolFilterRef = useRef()
  const [searchTerms, setSearchTerms] = useState(DEFAULT_SEARCH_TERMS)
  const [searchResult, setSearchResult] = useState([])
  const [firstUpdate, setFirstUpdate] = useState(false)

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
    const { districtIds } = userOrgData
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
      // TODO: add backend support for selected ids in query
      loadSchoolListDebounced(query)
      setFirstUpdate(true)
    }
  }, [])
  useEffect(() => {
    if (isEmpty(searchResult)) {
      setSearchResult(schoolList)
    }
  }, [schoolList])
  useEffect(() => {
    const _schools = dropdownData.filter((d) =>
      selectedSchoolIds.includes(d.key)
    )
    if (
      firstUpdate &&
      _schools.length &&
      !firstLoad &&
      setTempTagsData &&
      setTagsData
    ) {
      // TODO: find a better way to do this
      // add delay for other tag updates to complete
      setTimeout(() => {
        setTempTagsData({ ...tempTagsData, schoolIds: _schools })
        setTagsData({ ...tempTagsData, schoolIds: _schools })
      }, 500)
      setFirstUpdate(false)
    }
  }, [schoolList, firstLoad, firstUpdate])
  useEffect(() => {
    if (searchTerms.text && searchTerms.text !== searchTerms.selectedText) {
      loadSchoolListDebounced(query)
    }
  }, [searchTerms])

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
    userOrgData: getOrgDataSelector(state),
    schoolList: getSchoolsSelector(state),
    loading: get(state, ['schoolsReducer', 'loading'], false),
  }),
  {
    loadSchoolList: receiveSchoolsAction,
  }
)(SchoolAutoComplete)
