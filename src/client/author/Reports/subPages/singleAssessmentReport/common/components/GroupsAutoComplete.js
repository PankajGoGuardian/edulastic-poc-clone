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
  selectCB,
  filters,
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
    if (filters.teacherIds) {
      q.search.teachers = filters.teacherIds
        .split(',')
        .map((t) => ({ type: 'cont', value: t }))
    }
    if (
      (userRole === roleuser.DISTRICT_ADMIN ||
        userRole === roleuser.SCHOOL_ADMIN) &&
      !isEmpty(filters.schoolIds)
    ) {
      q.search.institutionIds = filters.schoolIds
        ? filters.schoolIds.split(',')
        : []
    }
    if (filters.studentGrade !== 'All' && filters.studentGrade) {
      q.search.grades = [filters.studentGrade]
    }
    if (filters.studentSubject !== 'All' && filters.studentSubject) {
      q.search.subjects = [filters.studentSubject]
    }
    if (filters.studentCourseId !== 'All' && filters.studentCourseId) {
      q.search.courseIds = [filters.studentCourseId]
    }
    return q
  }, [
    searchTerms.text,
    filters.schoolIds,
    filters.teacherIds,
    filters.studentSubject,
    filters.studentGrade,
    filters.studentCourseId,
    filters.classId,
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
    setSearchResult([])
  }, [
    filters.schoolIds,
    filters.teacherIds,
    filters.studentSubject,
    filters.studentGrade,
    filters.studentCourseId,
    filters.classId,
  ])

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
