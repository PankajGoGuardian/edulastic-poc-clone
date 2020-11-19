import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { get, isEmpty, debounce } from 'lodash'

// components & constants
import { AutoComplete, Input, Icon } from 'antd'
import { roleuser } from '@edulastic/constants'

// ducks
import { getOrgDataSelector } from '../../../../../src/selectors/user'
import {
  getTeachersListSelector,
  receiveTeachersListAction,
} from '../../../../../Teacher/ducks'

const DEFAULT_SEARCH_TERMS = { text: '', selectedText: '', selectedKey: '' }

const transformTeacherList = (list) => {
  return list.map((t) => ({
    ...t,
    name: [t.firstName, t.middleName, t.lastName]
      .filter((n) => n)
      .join(' ')
      .trim(),
  }))
}

const TeacherAutoComplete = ({
  userOrgData,
  teacherList: teacherListRaw,
  loading,
  loadTeacherList,
  school: institutionId,
  selectedTeacherId,
  selectCB,
}) => {
  const [searchTerms, setSearchTerms] = useState(DEFAULT_SEARCH_TERMS)
  const [searchResult, setSearchResult] = useState([])

  const teacherList = transformTeacherList(teacherListRaw)

  // build search query
  const query = useMemo(() => {
    const { districtIds } = userOrgData
    const districtId = districtIds?.[0]
    const q = {
      limit: 25,
      page: 1,
      districtId,
      search: { name: searchTerms.text },
      role: roleuser.TEACHER,
    }
    if (institutionId) {
      q.search.institutionId = institutionId
    }
    return q
  }, [searchTerms.text])

  // handle autocomplete actions
  const onSearch = (value) => {
    setSearchTerms({ ...searchTerms, text: value })
  }
  const onSelect = (key) => {
    const value = (searchTerms.text ? teacherList : searchResult).find(
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
  const loadTeacherListDebounced = useCallback(
    debounce(loadTeacherList, 500, { trailing: true }),
    []
  )
  const getDefaultTeacherList = () => {
    if (isEmpty(searchResult)) {
      loadTeacherListDebounced(query)
    }
  }

  // effects
  useEffect(() => {
    if (isEmpty(searchResult)) {
      setSearchResult(transformTeacherList(teacherListRaw))
    }
  }, [teacherListRaw])
  useEffect(() => {
    if (searchTerms.text && searchTerms.text !== searchTerms.selectedText) {
      loadTeacherListDebounced(query)
    }
  }, [searchTerms])

  // build dropdown data
  const dropdownData = [
    <AutoComplete.OptGroup key="teacherList" label="Teachers [Type to search]">
      {(searchTerms.text ? teacherList : searchResult).map((item) => (
        <AutoComplete.Option key={item._id} title={item.name}>
          {item.name}
        </AutoComplete.Option>
      ))}
    </AutoComplete.OptGroup>,
  ]

  return (
    <AutoCompleteContainer>
      <AutoComplete
        getPopupContainer={(trigger) => trigger.parentNode}
        placeholder="All Teachers"
        value={searchTerms.text}
        onSearch={onSearch}
        dataSource={dropdownData}
        onSelect={onSelect}
        onBlur={onBlur}
        onFocus={() => getDefaultTeacherList()}
      >
        <Input suffix={<Icon type={loading ? 'loading' : 'search'} />} />
      </AutoComplete>
    </AutoCompleteContainer>
  )
}

export default connect(
  (state) => ({
    userOrgData: getOrgDataSelector(state),
    teacherList: getTeachersListSelector(state),
    loading: get(state, ['teacherReducer', 'loading'], false),
  }),
  {
    loadTeacherList: receiveTeachersListAction,
  }
)(TeacherAutoComplete)

const AutoCompleteContainer = styled.div`
  .ant-select-auto-complete {
    padding: 5px;
  }
  .ant-select-dropdown-menu-item-group-title {
    font-weight: bold;
  }
`
