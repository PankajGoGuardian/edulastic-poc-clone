import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { debounce } from 'lodash'

// components & constants
import { AutoComplete, Input, Icon, Tooltip, Empty } from 'antd'
import { assignmentStatusOptions, roleuser } from '@edulastic/constants'

// ducks
import { useDropdownData } from '@edulastic/common'
import { getUser, getUserOrgId } from '../../../../src/selectors/user'
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
  grades,
  subjects,
  testTypes,
  selectedTestId,
  selectCB,
  tagIds,
  showApply,
  districtId,
}) => {
  const [searchTerms, setSearchTerms] = useState(DEFAULT_SEARCH_TERMS)
  const [fieldValue, setFieldValue] = useState('')

  const selectedTest = testList.find((t) => t._id === selectedTestId) || {}

  // build search query
  const query = useMemo(() => {
    const { role, orgData = {} } = user
    const { institutionIds } = orgData
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
    if (grades) {
      q.search.grades = Array.isArray(grades) ? grades : grades.split(',')
    }
    if (subjects) {
      q.search.subjects = Array.isArray(subjects)
        ? subjects
        : subjects.split(',')
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
    grades,
    subjects,
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
  const loadTestListDebounced = useCallback(
    debounce(loadTestList, 500, { trailing: true }),
    []
  )

  // effects
  useEffect(() => {
    if (firstLoad || (!firstLoad && !showApply)) {
      const { _id, title } = selectedTest
      if (_id) {
        setSearchTerms({ text: title, selectedText: title, selectedKey: _id })
        setFieldValue(title)
      } else {
        setSearchTerms({ ...DEFAULT_SEARCH_TERMS, selectedKey: selectedTestId })
        setFieldValue('')
      }
    }
  }, [selectedTestId, showApply])
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
  }, [termId, grades, subjects, testTypes, tagIds])
  useEffect(() => {
    if (
      (!searchTerms.text && !searchTerms.selectedText) ||
      searchTerms.text !== searchTerms.selectedText
    ) {
      loadTestListDebounced(query)
    }
  }, [query])

  // build dropdown data
  const dropdownData = useDropdownData(testList, {
    showId: true,
    searchText: searchTerms.text || '',
  })

  const selectedTestLabel =
    searchTerms.text === searchTerms.selectedText && selectedTest._id
      ? `${selectedTest.title} (ID:${selectedTest._id.substring(
          selectedTest._id.length - 5
        )})`
      : ''

  const InputSuffixIcon = loading ? (
    <Icon type="loading" />
  ) : searchTerms.text ? (
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
          onChange={onChange}
          allowClear={!loading && searchTerms.selectedText}
          clearIcon={<Icon type="close" style={{ color: '#1AB394' }} />}
          notFoundContent={
            <Empty
              className="ant-empty-small"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ textAlign: 'left', margin: '10px 0' }}
              description="No matching results"
            />
          }
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
    districtId: getUserOrgId(state),
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
    opacity: 1;
  }
  .ant-input-suffix .anticon-loading {
    font-size: 1.4em;
  }
`
