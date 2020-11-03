import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { debounce } from 'lodash'

// components & constants
import { AutoComplete, Input, Icon } from 'antd'
import { assignmentStatusOptions } from '@edulastic/constants'

// ducks
import { getOrgDataSelector } from '../../../../../src/selectors/user'
import {
  receiveTestListAction,
  getTestListSelector,
  getTestListLoadingSelector,
} from '../filterDataDucks'

const { IN_PROGRESS, IN_GRADING, DONE } = assignmentStatusOptions

const DEFAULT_SEARCH_TERMS = { text: '', selectedText: '', selectedKey: '' }

const AssessmentAutoComplete = ({
  userOrgData,
  testList,
  loading,
  loadTestList,
  firstLoad,
  termId,
  grade,
  subject,
  assessmentType,
  selectedTestId,
  selectCB,
}) => {
  const [searchTerms, setSearchTerms] = useState(DEFAULT_SEARCH_TERMS)
  const selectedTest = testList.find((t) => t._id === selectedTestId) || {}

  // build search query
  const query = useMemo(() => {
    const { districtIds } = userOrgData
    const districtId = districtIds?.[0]
    const q = {
      limit: 25,
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
    if (termId) {
      q.search.termId = termId
    }
    if (grade) {
      q.search.grades = [grade]
    }
    if (subject) {
      q.search.subjects = [subject]
    }
    if (assessmentType) {
      q.search.testTypes = [assessmentType]
    }
    return q
  }, [searchTerms.text, selectedTestId, termId, grade, subject, assessmentType])

  // handle autocomplete actions
  const onSearch = (value) => {
    setSearchTerms({ ...searchTerms, text: value })
  }
  const onSelect = (key) => {
    const value = testList.find((s) => s._id === key)?.title
    setSearchTerms({ text: value, selectedText: value, selectedKey: key })
    selectCB({ key, title: value })
  }
  const onBlur = () => {
    // force fetch testList to reset assessment filter to previously selected test
    if (searchTerms.text !== searchTerms.selectedText) {
      setSearchTerms({
        ...searchTerms,
        selectedText: '',
        text: searchTerms.selectedText,
      })
    }
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
    } else {
      setSearchTerms({ ...DEFAULT_SEARCH_TERMS, selectedKey: selectedTestId })
      loadTestListDebounced(query)
    }
  }, [selectedTestId])
  useEffect(() => {
    if (searchTerms.text && searchTerms.text !== searchTerms.selectedText) {
      loadTestListDebounced(query)
    }
  }, [searchTerms])
  useEffect(() => {
    if (!searchTerms.selectedText && testList.length) {
      onSelect(testList[0]._id)
    }
  }, [testList])
  useEffect(() => {
    if (searchTerms.selectedText) {
      setSearchTerms({ ...DEFAULT_SEARCH_TERMS })
    }
    loadTestListDebounced(query)
  }, [termId, grade, subject, assessmentType])

  // build dropdown data
  const dropdownData = searchTerms.text
    ? [
        <AutoComplete.OptGroup
          key="testList"
          label="Assessments [Type to search]"
        >
          {testList.map((item) => (
            <AutoComplete.Option key={item._id} title={item.title}>
              {`${item.title} (ID: ${
                item._id.substring(item._id.length - 5) || ''
              })`}
            </AutoComplete.Option>
          ))}
        </AutoComplete.OptGroup>,
      ]
    : []

  return (
    <AutoCompleteContainer>
      <AutoComplete
        getPopupContainer={(trigger) => trigger.parentNode}
        placeholder="All Assessments"
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
    testList: getTestListSelector(state),
    loading: getTestListLoadingSelector(state),
  }),
  {
    loadTestList: receiveTestListAction,
  }
)(AssessmentAutoComplete)

const AutoCompleteContainer = styled.div`
  .ant-select-auto-complete {
    padding: 5px;
  }
  .ant-select-dropdown-menu-item-group-title {
    font-weight: bold;
    white-space: nowrap;
  }
`
