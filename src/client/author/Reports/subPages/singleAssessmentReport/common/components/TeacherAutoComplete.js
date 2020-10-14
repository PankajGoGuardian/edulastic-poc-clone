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

  const teacherList = teacherListRaw.map((t) => ({
    ...t,
    name: [t.firstName, t.middleName, t.lastName]
      .filter((n) => n)
      .join(' ')
      .trim(),
  }))

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
    const value = teacherList.find((s) => s._id === key)?.name
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
    if (!isEmpty(selectedTeacherId)) {
      const { _id, name } = teacherList.find((t) => t._id === selectedTeacherId)
      setSearchTerms({ text: name, selectedText: name, selectedKey: _id })
    }
  }, [selectedTeacherId])
  const loadTeacherListDebounced = useCallback(
    debounce(loadTeacherList, 500, { trailing: true }),
    []
  )
  useEffect(() => {
    if (searchTerms.text && searchTerms.text !== searchTerms.selectedText) {
      loadTeacherListDebounced(query)
    }
  }, [searchTerms])

  // build dropdown data
  const dropdownData = searchTerms.text
    ? [
        <AutoComplete.OptGroup
          key="teacherList"
          label="Teachers [Type to search]"
        >
          {teacherList.map((item) => (
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
        placeholder="All Teachers"
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
