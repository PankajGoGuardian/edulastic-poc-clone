import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { get, isEmpty, debounce } from 'lodash'

// components & constants
import { AutoComplete, Input, Icon } from 'antd'
import { roleuser } from '@edulastic/constants'

// ducks
import { getUser } from '../../../../src/selectors/user'
import {
  receiveGroupListAction,
  getGroupListSelector,
} from '../../../../Groups/ducks'

const DEFAULT_SEARCH_TERMS = { text: '', selectedText: '', selectedKey: 'All' }

const GroupsAutoComplete = ({
  userDetails,
  groupList,
  loading,
  loadGroupList,
  termId,
  schoolIds,
  teacherIds,
  grade,
  subject,
  courseId,
  selectCB,
}) => {
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
        type: ['custom'],
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
    if (grade) {
      q.search.grades = [grade]
    }
    if (subject) {
      q.search.subjects = [subject]
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
    grade,
    subject,
    courseId,
  ])

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
  useEffect(() => {
    setSearchTerms(DEFAULT_SEARCH_TERMS)
    setSearchResult([])
  }, [termId, schoolIds, teacherIds, grade, subject, courseId])

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
