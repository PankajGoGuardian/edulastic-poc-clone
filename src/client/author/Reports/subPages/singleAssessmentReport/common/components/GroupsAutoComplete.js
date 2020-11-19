import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { get, isEmpty, debounce } from 'lodash'

// components & constants
import { AutoComplete, Input, Icon } from 'antd'
import { roleuser } from '@edulastic/constants'

// ducks
import { getUser } from '../../../../../src/selectors/user'
import {
  receiveGroupListAction,
  getGroupListSelector,
} from '../../../../../Groups/ducks'

const DEFAULT_SEARCH_TERMS = { text: '', selectedText: '', selectedKey: 'All' }

const GroupsAutoComplete = ({
  userDetails,
  groupList,
  loading,
  loadGroupList,
  grade,
  subject,
  school: institutionId,
  selectedGroup,
  selectCB,
}) => {
  const [searchTerms, setSearchTerms] = useState(DEFAULT_SEARCH_TERMS)
  const [searchResult, setSearchResult] = useState([])

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
        type: ['custom'],
      },
    }
    if (userRole === roleuser.TEACHER) {
      q.search.teachers = [{ type: 'eq', value: userId }]
    }
    if (userRole === roleuser.DISTRICT_ADMIN && institutionId) {
      q.search.institutionIds = [institutionId]
    }
    if (userRole === roleuser.SCHOOL_ADMIN) {
      q.search.institutionIds = institutionId ? [institutionId] : institutionIds
    }
    if (grade) {
      q.search.grades = [`${grade}`]
    }
    if (subject) {
      q.search.subjects = [subject]
    }
    return q
  }, [searchTerms.text])

  // handle autocomplete actions
  const onSearch = (value) => {
    setSearchTerms({ ...searchTerms, text: value })
  }
  const onSelect = (key) => {
    const value = (searchTerms.text ? groupList[key] : searchResult[key])
      ._source.name
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
  const loadGroupListDebounced = useCallback(
    debounce(loadGroupList, 500, { trailing: true }),
    []
  )
  const getDefaultGroupList = () => {
    if (isEmpty(searchResult)) {
      loadGroupListDebounced(query)
    }
  }

  // effects
  useEffect(() => {
    if (isEmpty(searchResult)) {
      setSearchResult(groupList)
    }
  }, [groupList])
  useEffect(() => {
    if (searchTerms.text && searchTerms.text !== searchTerms.selectedText) {
      loadGroupListDebounced(query)
    }
  }, [searchTerms])

  // build dropdown data
  const dropdownData = [
    <AutoComplete.OptGroup key="groupList" label="Groups [Type to search]">
      {Object.values(searchTerms.text ? groupList : searchResult).map(
        (item) => (
          <AutoComplete.Option key={item._id} title={item._source.name}>
            {item._source.name}
          </AutoComplete.Option>
        )
      )}
    </AutoComplete.OptGroup>,
  ]

  return (
    <AutoCompleteContainer>
      <AutoComplete
        getPopupContainer={(trigger) => trigger.parentNode}
        placeholder="All Groups"
        value={searchTerms.text}
        onSearch={onSearch}
        dataSource={dropdownData}
        onSelect={onSelect}
        onBlur={onBlur}
        onFocus={() => getDefaultGroupList()}
      >
        <Input suffix={<Icon type={loading ? 'loading' : 'search'} />} />
      </AutoComplete>
    </AutoCompleteContainer>
  )
}

export default connect(
  (state) => ({
    userDetails: getUser(state),
    groupList: getGroupListSelector(state),
    loading: get(state, ['groupsReducer', 'loading'], false),
  }),
  {
    loadGroupList: receiveGroupListAction,
  }
)(GroupsAutoComplete)

const AutoCompleteContainer = styled.div`
  .ant-select-auto-complete {
    padding: 5px;
  }
  .ant-select-dropdown-menu-item-group-title {
    font-weight: bold;
  }
`
