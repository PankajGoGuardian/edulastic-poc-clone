import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { connect } from 'react-redux'
import { get, isEmpty, debounce } from 'lodash'
import { Tooltip } from 'antd'

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
  districtId,
  selectedSchoolIds,
  userDistrictId,
  networkIds,
  disabled,
  disabledMessage,
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
      districtId: districtId || userDistrictId,
      search: {
        name: [{ type: 'cont', value: searchTerms.text }],
      },
      networkIds: (networkIds || '').split(',').filter(Boolean),
    }
    return q
  }, [searchTerms.text, districtId, networkIds])

  // handle autocomplete actions
  const onSearch = (value) => {
    if (!disabled) {
      setSearchTerms({ ...searchTerms, text: value })
    }
  }
  const onChange = (selected, selectedElements) => {
    if (!disabled) {
      const _selectedSchools = selectedElements.map(({ props }) => ({
        key: props.value,
        title: props.title,
      }))
      selectCB(_selectedSchools)
    }
  }
  const onBlur = () => {
    if (
      (searchTerms.text === '' && searchTerms.selectedText !== '') ||
      disabled
    ) {
      setSearchTerms(DEFAULT_SEARCH_TERMS)
    } else {
      setSearchTerms({ ...searchTerms, text: searchTerms.selectedText })
    }
  }
  const loadSchoolListDebounced = useCallback(
    debounce(loadSchoolList, 500, { trailing: true }),
    []
  )
  const onFocus = () => {
    if (isEmpty(searchResult) && !disabled) {
      // get default school list
      loadSchoolListDebounced(query)
    }
  }

  // effects
  useEffect(() => {
    onFocus()
    if (selectedSchoolIds.length && !disabled) {
      loadSchoolListDebounced({ ...query, schoolIds: selectedSchoolIds })
    }
  }, [])
  useEffect(() => {
    if (isEmpty(searchResult)) {
      setSearchResult(schoolList)
    }
  }, [schoolList])
  useEffect(() => {
    if (
      searchTerms.text &&
      searchTerms.text !== searchTerms.selectedText &&
      !disabled
    ) {
      loadSchoolListDebounced(query)
    }
  }, [searchTerms])
  useEffect(() => {
    setSearchResult([])
  }, [districtId, networkIds, disabled])

  return (
    <Tooltip title={disabledMessage}>
      <MultiSelectSearch
        dataCy={dataCy}
        label="School"
        placeholder="All Schools"
        el={schoolFilterRef}
        onChange={onChange}
        onSearch={onSearch}
        onBlur={onBlur}
        onFocus={onFocus}
        value={selectedSchoolIds}
        options={dropdownData}
        loading={loading}
      />
    </Tooltip>
  )
}

export default connect(
  (state) => ({
    schoolList: getSchoolsSelector(state),
    loading: get(state, ['schoolsReducer', 'loading'], false),
    userDistrictId: getUserOrgId(state),
  }),
  {
    loadSchoolList: receiveSchoolsAction,
  }
)(SchoolAutoComplete)
