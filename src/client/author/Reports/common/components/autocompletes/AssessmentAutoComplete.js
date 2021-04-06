import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { debounce, isEmpty } from 'lodash'

// components & constants
import { AutoComplete, Input, Icon, Tooltip } from 'antd'
import { assignmentStatusOptions, roleuser } from '@edulastic/constants'

// ducks
import { getUser } from '../../../../src/selectors/user'
import {
  receiveTestListAction,
  getTestListSelector,
  getTestListLoadingSelector,
} from '../../../ducks'

const { IN_PROGRESS, IN_GRADING, DONE } = assignmentStatusOptions

const DEFAULT_SEARCH_TERMS = { text: '', selectedText: '', selectedKey: '' }

const AssessmentAutoComplete = ({
  user,
  testList,
  loading,
  loadTestList,
  firstLoad,
  termId,
  grade,
  subject,
  testTypes,
  selectedTestId,
  selectCB,
  tagIds,
}) => {
  const [searchTerms, setSearchTerms] = useState(DEFAULT_SEARCH_TERMS)
  const [fieldValue, setFieldValue] = useState('')
  const selectedTest = testList.find((t) => t._id === selectedTestId) || {}
  const [isFocused, setIsFocused] = useState(false)

  // build search query
  const query = useMemo(() => {
    const { role, orgData = {} } = user
    const { districtIds, institutionIds } = orgData
    const districtId = districtIds?.[0]
    const q = {
      limit: 35,
      page: 1,
      search: {
        searchString: searchTerms.text,
        statuses: [IN_PROGRESS, IN_GRADING, DONE],
        districtId,
      },
      aggregate: true,
    }
    if (firstLoad && !selectedTest._id && selectedTestId) {
      q.search.testIds = [selectedTestId]
    }
    if (role === roleuser.SCHOOL_ADMIN && institutionIds?.length) {
      q.search.institutionIds = institutionIds
    }
    if (termId) {
      q.search.termId = termId
    }
    if (grade) {
      q.search.grades = [grade]
    }
    if (subject) {
      q.search.subjects = [subject]
    }
    if (testTypes) {
      q.search.testTypes = Array.isArray(testTypes)
        ? testTypes
        : testTypes.split(',')
    }
    if (tagIds) {
      q.search.tagIds = tagIds.split(',')
    }
    return q
  }, [
    searchTerms.text,
    selectedTestId,
    termId,
    grade,
    subject,
    testTypes,
    tagIds,
  ])

  // handle autocomplete actions
  const onSearch = (value) => {
    setSearchTerms({ ...searchTerms, text: value })
  }
  const onChange = useCallback((_text, element) => {
    const _title = element?.props?.title
    setSearchTerms((s) => ({ ...s, text: _title || _text }))
    setFieldValue(_title || _text)
  }, [])
  const onSelect = (key) => {
    if (key) {
      const value = testList.find((s) => s._id === key)?.title
      setSearchTerms({ text: value, selectedText: value, selectedKey: key })
      setFieldValue(value)
      selectCB({ key, title: value })
    } else {
      selectCB({ key: '', title: '' })
    }
  }
  const onBlur = () => {
    // force fetch testList to reset assessment filter to previously selected test
    if (searchTerms.text !== searchTerms.selectedText) {
      setSearchTerms({
        ...searchTerms,
        selectedText: '',
        text: searchTerms.selectedText,
      })
      setFieldValue(searchTerms.selectedText)
    }
    setIsFocused(false)
  }
  const loadTestListDebounced = useCallback(
    debounce(loadTestList, 500, { trailing: true }),
    []
  )

  // effects
  useEffect(() => {
    const { _id, title } = selectedTest
    if (_id) {
      setSearchTerms({ text: title, selectedText: title, selectedKey: _id })
      setFieldValue(title)
    } else {
      setSearchTerms({ ...DEFAULT_SEARCH_TERMS, selectedKey: selectedTestId })
      setFieldValue('')
    }
  }, [selectedTestId])
  useEffect(() => {
    if (!searchTerms.selectedText && testList.length) {
      onSelect(testList[0]._id)
    } else if (firstLoad && !loading && !testList.length) {
      onSelect()
    }
  }, [testList])
  useEffect(() => {
    if (searchTerms.selectedText) {
      setSearchTerms({ ...DEFAULT_SEARCH_TERMS })
      setFieldValue('')
    }
  }, [termId, grade, subject, testTypes])
  useEffect(() => {
    if (
      (!searchTerms.text && !searchTerms.selectedText) ||
      searchTerms.text !== searchTerms.selectedText
    ) {
      loadTestListDebounced(query)
    }
  }, [query])
  // build dropdown data
  const dropdownData = isEmpty(testList)
    ? [
        <AutoComplete.Option disabled key={0} title="no data found">
          No Data Found
        </AutoComplete.Option>,
      ]
    : testList.map((item) => (
        <AutoComplete.Option key={item._id} title={item.title}>
          {`${
            item.title.length > 25
              ? `${item.title.slice(0, 22)}...`
              : item.title
          } (ID:${item._id.substring(item._id.length - 5) || ''})`}
        </AutoComplete.Option>
      ))

  const selectedTestLabel =
    searchTerms.text === searchTerms.selectedText && selectedTest._id
      ? `${selectedTest.title} (ID:${selectedTest._id.substring(
          selectedTest._id.length - 5
        )})`
      : ''

  const InputSuffixIcon = loading ? (
    <Icon type="loading" />
  ) : searchTerms.text && isFocused ? (
    <></>
  ) : (
    <Icon type="search" />
  )

  return (
    <Tooltip title={selectedTestLabel} placement="top">
      <AutoCompleteContainer>
        <AutoComplete
          getPopupContainer={(trigger) => trigger.parentNode}
          value={fieldValue}
          onSearch={onSearch}
          dataSource={dropdownData}
          onSelect={onSelect}
          onBlur={onBlur}
          onFocus={() => setIsFocused(true)}
          onChange={onChange}
          allowClear={!loading && searchTerms.selectedText && isFocused}
          clearIcon={<Icon type="close" style={{ color: '#1AB394' }} />}
        >
          <Input suffix={InputSuffixIcon} />
        </AutoComplete>
      </AutoCompleteContainer>
    </Tooltip>
  )
}

export default connect(
  (state) => ({
    user: getUser(state),
    testList: getTestListSelector(state),
    loading: getTestListLoadingSelector(state),
  }),
  {
    loadTestList: receiveTestListAction,
  }
)(AssessmentAutoComplete)

const AutoCompleteContainer = styled.div`
  .ant-select-dropdown-menu-item-group-title {
    font-weight: bold;
    white-space: nowrap;
  }
  .ant-select-selection__clear {
    background: transparent;
  }
`
