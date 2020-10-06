import React, { useMemo, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { get, isEmpty } from 'lodash'

// components & constants
import { AutoComplete, Input, Icon } from 'antd'

// ducks
import { getUser } from '../../../../../src/selectors/user'
import {
  getSchoolsSelector,
  receiveSchoolsAction,
} from '../../../../../Schools/ducks'

const DEFAULT_SEARCH_TERMS = { text: '', selectedText: '', selectedKey: '' }

const SchoolAutoComplete = ({
  userDetails,
  schoolList,
  loading,
  loadSchoolList,
  selectedSchool,
  selectCB,
}) => {
  const [searchTerms, setSearchTerms] = useState(DEFAULT_SEARCH_TERMS)

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
  const onSelect = (key) => {
    const value = schoolList.find((s) => s._id === key)?.name
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

  // effects
  useEffect(() => {
    if (!isEmpty(selectedSchool)) {
      const { key, title } = selectedSchool
      setSearchTerms({ text: title, selectedText: title, selectedKey: key })
    }
  }, [selectedSchool])
  useEffect(() => {
    if (searchTerms.text && searchTerms.text !== searchTerms.selectedText) {
      loadSchoolList(query)
    }
  }, [searchTerms])

  // build dropdown data
  const dropdownData = searchTerms.text
    ? [
        <AutoComplete.OptGroup
          key="schoolList"
          label="Schools [Type to search]"
        >
          {schoolList.map((item) => (
            <AutoComplete.Option key={item._id} title={item.name}>
              {item.name}
            </AutoComplete.Option>
          ))}
        </AutoComplete.OptGroup>,
      ]
    : []

  return (
    <AutoCompleteContainer>
      <AutoComplete
        getPopupContainer={(trigger) => trigger.parentNode}
        placeholder="All Schools"
        value={searchTerms.text}
        onSearch={onSearch}
        dataSource={dropdownData}
        onSelect={onSelect}
        onBlur={onBlur}
      >
        <Input suffix={<Icon type={loading ? 'loading' : 'search'} />} />
      </AutoComplete>
    </AutoCompleteContainer>
  )
}

export default connect(
  (state) => ({
    userDetails: getUser(state),
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
