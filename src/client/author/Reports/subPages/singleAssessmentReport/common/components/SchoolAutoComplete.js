import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { get, isEmpty, debounce } from 'lodash'

// components & constants
import { AutoComplete, Input, Icon } from 'antd'
import MultiSelectSearch from '../../../../common/components/widgets/MultiSelectSearch'

// ducks
import { getOrgDataSelector } from '../../../../../src/selectors/user'
import {
  getSchoolsSelector,
  receiveSchoolsAction,
} from '../../../../../Schools/ducks'

const DEFAULT_SEARCH_TERMS = { text: '', selectedText: '', selectedKey: '' }

const SchoolAutoComplete = ({
  userOrgData,
  schoolList,
  loading,
  loadSchoolList,
  selectCB,
  selectedSchoolId,
}) => {
  const schoolFilterRef = useRef()
  const [searchTerms, setSearchTerms] = useState(DEFAULT_SEARCH_TERMS)
  const [searchResult, setSearchResult] = useState([])

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
  const onSelect = (key) => {
    const value = (searchTerms.text ? schoolList : searchResult).find(
      (s) => s._id === key
    )?.name
    setSearchTerms({ text: value, selectedText: value, selectedKey: key })
    selectCB({ key, title: value })
  }
  const onBlur = () => {
    if (searchTerms.text === '' && searchTerms.selectedText !== '') {
      setSearchTerms(DEFAULT_SEARCH_TERMS)
      selectCB({ key: '', title: '' })
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
    if (isEmpty(searchResult)) {
      setSearchResult(schoolList)
    }
  }, [schoolList])
  useEffect(() => {
    if (searchTerms.text && searchTerms.text !== searchTerms.selectedText) {
      loadSchoolListDebounced(query)
    }
  }, [searchTerms])

  // build dropdown data
  // const dropdownData = (searchTerms.text ? schoolList : searchResult).map(
  //   (item) => {
  //     return {
  //       key: item._id,
  //       title: item.name,
  //     }
  //   }
  // )
  const dropdownData = [
    <AutoComplete.OptGroup key="schoolList" label="Schools [Type to search]">
      {(searchTerms.text ? schoolList : searchResult).map((item) => (
        <AutoComplete.Option key={item._id} title={item.name}>
          {item.name}
        </AutoComplete.Option>
      ))}
    </AutoComplete.OptGroup>,
  ]

  return (
    // <MultiSelectSearch
    //   label="School"
    //   el={schoolFilterRef}
    //   onChange={(e) => selectCB(e)}
    //   onSearch={onSearch}
    //   onBlur={onBlur}
    //   onFocus={getDefaultSchoolList}
    //   value={selectedSchoolId}
    //   options={dropdownData}
    //   loading={loading}
    // />
    <AutoCompleteContainer>
      <AutoComplete
        getPopupContainer={(trigger) => trigger.parentNode}
        placeholder="All Schools"
        value={searchTerms.text}
        onSearch={onSearch}
        dataSource={dropdownData}
        onSelect={onSelect}
        onBlur={onBlur}
        onFocus={() => getDefaultSchoolList()}
      >
        <Input suffix={<Icon type={loading ? 'loading' : 'search'} />} />
      </AutoComplete>
    </AutoCompleteContainer>
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

const AutoCompleteContainer = styled.div`
  .ant-select-auto-complete {
    padding: 5px;
  }
  .ant-select-dropdown-menu-item-group-title {
    font-weight: bold;
  }
`
