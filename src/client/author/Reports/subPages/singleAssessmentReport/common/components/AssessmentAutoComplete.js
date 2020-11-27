import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { debounce } from 'lodash'

// components & constants
import { AutoComplete, Input, Icon, Tooltip } from 'antd'
import { assignmentStatusOptions, roleuser } from '@edulastic/constants'

// ducks
import { getUser } from '../../../../../src/selectors/user'
import {
  receiveTestListAction,
  getTestListSelector,
  getTestListLoadingSelector,
} from '../filterDataDucks'

const { IN_PROGRESS, IN_GRADING, DONE } = assignmentStatusOptions

const DEFAULT_SEARCH_TERMS = { text: '', selectedText: '', selectedKey: '' }

const AssessmentAutoComplete = ({
  user,
  testList,
  loading,
  loadTestList,
  firstLoad,
  termId,
  selectedTestId,
  selectCB,
  filters,
}) => {
  const [searchTerms, setSearchTerms] = useState(DEFAULT_SEARCH_TERMS)
  const selectedTest = testList.find((t) => t._id === selectedTestId) || {}

  // build search query
  const query = useMemo(() => {
    const { role, orgData = {} } = user
    const { districtIds, institutionIds } = orgData
    const districtId = districtIds?.[0]
    const q = {
      limit: 25,
      page: 1,
      search: {
        searchString: searchTerms.text,
        statuses: [IN_PROGRESS, IN_GRADING, DONE],
        districtId,
        grades:
          !filters.grade || filters.grade === 'All' ? [] : [filters.grade],
        subjects:
          !filters.subject || filters.subject === 'All'
            ? []
            : [filters.subject],
        testTypes:
          (filters.assessmentTypes && filters.assessmentTypes.split(',')) || [],
        courseIds:
          !filters.courseId || filters.courseId === 'All'
            ? []
            : [filters.courseId],
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
    return q
  }, [
    searchTerms.text,
    selectedTestId,
    termId,
    filters.grade,
    filters.subject,
    filters.courseId,
    filters.assessmentTypes,
  ])

  // handle autocomplete actions
  const onSearch = (value) => {
    setSearchTerms({ ...searchTerms, text: value })
  }
  const onSelect = (key) => {
    if (key) {
      const value = testList.find((s) => s._id === key)?.title
      setSearchTerms({ text: value, selectedText: value, selectedKey: key })
      selectCB({ key, title: value })
    } else {
      setSearchTerms({ ...DEFAULT_SEARCH_TERMS })
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
    }
  }, [
    termId,
    filters.grade,
    filters.subject,
    filters.courseId,
    filters.assessmentTypes,
  ])
  useEffect(() => {
    if (
      (!searchTerms.text && !searchTerms.selectedText) ||
      searchTerms.text !== searchTerms.selectedText
    ) {
      loadTestListDebounced(query)
    }
  }, [query])
  // build dropdown data
  const dropdownData = searchTerms.text
    ? [
        <AutoComplete.OptGroup
          key="testList"
          label="Assessments [Type to search]"
        >
          {testList.map((item) => (
            <AutoComplete.Option key={item._id} title={item.title}>
              {`${item.title} (ID:${
                item._id.substring(item._id.length - 5) || ''
              })`}
            </AutoComplete.Option>
          ))}
        </AutoComplete.OptGroup>,
      ]
    : []

  const selectedTestLabel =
    searchTerms.text === searchTerms.selectedText && selectedTest._id
      ? `${selectedTest.title} (ID:${selectedTest._id.substring(
          selectedTest._id.length - 5
        )})`
      : ''

  return (
    <Tooltip title={selectedTestLabel} placement="top">
      <AutoCompleteContainer>
        <AutoComplete
          getPopupContainer={(trigger) => trigger.parentNode}
          value={searchTerms.text}
          onSearch={onSearch}
          dataSource={dropdownData}
          onSelect={onSelect}
          onBlur={onBlur}
        >
          <Input suffix={<Icon type={loading ? 'loading' : 'search'} />} />
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
  .ant-select-auto-complete {
    padding: 5px;
  }
  .ant-select-dropdown-menu-item-group-title {
    font-weight: bold;
    white-space: nowrap;
  }
`
