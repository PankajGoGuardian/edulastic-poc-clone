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
  receiveClassListAction,
  getClassListSelector,
  clearClassListAction,
} from '../../../../../Classes/ducks'

const DEFAULT_SEARCH_TERMS = { text: '', selectedText: '', selectedKey: 'All' }

const ClassAutoComplete = ({
  userDetails,
  classList,
  loading,
  loadClassList,
  clearClassList,
  grade,
  subject,
  school: institutionId,
  selectedClass,
  selectCB,
  type = 'class',
}) => {
  const [searchTerms, setSearchTerms] = useState(DEFAULT_SEARCH_TERMS)
  const [isFocus, setIsFocus] = useState(false)

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
        type: [type],
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
    const value = classList[key]._source.name
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
    setIsFocus(false)
    clearClassList()
  }

  // effects
  useEffect(() => {
    if (!isEmpty(selectedClass)) {
      const { key, title } = selectedClass
      setSearchTerms({ text: title, selectedText: title, selectedKey: key })
    }
  }, [selectedClass])
  const loadClassListDebounced = useCallback(
    debounce(loadClassList, 500, { trailing: true }),
    []
  )
  useEffect(() => {
    if (searchTerms.text && searchTerms.text !== searchTerms.selectedText) {
      loadClassListDebounced(query)
    }
  }, [searchTerms])

  // build dropdown data
  const dropdownData = searchTerms.text
    ? [
        <AutoComplete.OptGroup
          key="classList"
          label={`${type === 'class' ? 'Classes' : 'Groups'} [Type to search]`}
        >
          {Object.values(classList).map((item) => (
            <AutoComplete.Option key={item._id} title={item._source.name}>
              {item._source.name}
            </AutoComplete.Option>
          ))}
        </AutoComplete.OptGroup>,
      ]
    : []

  return (
    <AutoCompleteContainer>
      <AutoComplete
        getPopupContainer={(trigger) => trigger.parentNode}
        placeholder={type === 'class' ? 'All Classes' : 'All Groups'}
        value={searchTerms.text}
        onSearch={onSearch}
        dataSource={dropdownData}
        onSelect={onSelect}
        onBlur={onBlur}
        onFocus={() => setIsFocus(true)}
      >
        <Input
          suffix={<Icon type={loading && isFocus ? 'loading' : 'search'} />}
        />
      </AutoComplete>
    </AutoCompleteContainer>
  )
}

export default connect(
  (state) => ({
    userDetails: getUser(state),
    classList: getClassListSelector(state),
    loading: get(state, ['classesReducer', 'loading'], false),
  }),
  {
    loadClassList: receiveClassListAction,
    clearClassList: clearClassListAction,
  }
)(ClassAutoComplete)

const AutoCompleteContainer = styled.div`
  .ant-select-auto-complete {
    padding: 5px;
  }
  .ant-select-dropdown-menu-item-group-title {
    font-weight: bold;
  }
`
