import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { debounce } from 'lodash'

// components & constants
import { AutoComplete, Input, Icon, Tooltip, Empty } from 'antd'
import { assignmentStatusOptions, roleuser } from '@edulastic/constants'
import { themeColor, themeColorBlue } from '@edulastic/colors'

// ducks
import { useDropdownData } from '@edulastic/common'
import {
  EMPTY_ARRAY,
  EXTERNAL_TEST_KEY_SEPARATOR,
} from '@edulastic/constants/reportUtils/common'
import {
  currentDistrictInstitutionIds,
  getUser,
  getUserOrgId,
} from '../../../../src/selectors/user'
import {
  createTestListLoadingSelector,
  createTestListSelector,
  receiveTestListAction,
} from '../../../ducks'
import { shortTestIdKeyLength } from '../../../../Assignments/constants'

const { IN_PROGRESS, IN_GRADING, DONE } = assignmentStatusOptions

const DEFAULT_SEARCH_TERMS = { text: '', selectedText: '', selectedKey: '' }

function getSelectedTestLabel(selectedTest, searchTerms) {
  if (!selectedTest?._id) return ''

  const isExternal =
    selectedTest._id.split(EXTERNAL_TEST_KEY_SEPARATOR).length > 1

  let selectedTestLabel = ''
  if (searchTerms.text === searchTerms.selectedText) {
    selectedTestLabel = `${selectedTest.title}`
    if (!isExternal) {
      selectedTestLabel += ` (ID:${selectedTest._id.substring(
        selectedTest._id.length - shortTestIdKeyLength
      )})`
    }
  }
  return selectedTestLabel
}

const AssessmentAutoComplete = ({
  statePrefix = '',
  user,
  districtId,
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
  autoSelectFirstItem = true,
  institutionIds,
  externalTests = EMPTY_ARRAY,
}) => {
  const [searchTerms, setSearchTerms] = useState(DEFAULT_SEARCH_TERMS)
  const [fieldValue, setFieldValue] = useState('')

  const selectedTest = testList.find((t) => t._id === selectedTestId) || {}

  // build search query
  const query = useMemo(() => {
    const { role } = user
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
    institutionIds,
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
  const onBlur = (text) => {
    setSearchTerms({ ...searchTerms, selectedText: text })
    setFieldValue(text)
  }
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
    if (!searchTerms.selectedText && testList.length && autoSelectFirstItem) {
      onSelect(testList[0]._id)
    } else if (
      !searchTerms.selectedText &&
      !autoSelectFirstItem &&
      selectedTest._id
    ) {
      onSelect(selectedTest._id)
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
      loadTestListDebounced({ ...query, statePrefix, externalTests })
    }
  }, [query, statePrefix, externalTests])

  // build dropdown data
  const dropdownData = useDropdownData(testList, {
    showId: true,
    searchText: searchTerms.text || '',
    idKeyLength: shortTestIdKeyLength,
  })

  const selectedTestLabel = getSelectedTestLabel(selectedTest, searchTerms)

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
          onBlur={onBlur}
          allowClear={!loading && searchTerms.selectedText}
          clearIcon={
            <Icon
              type="close"
              style={{ color: themeColor, marginTop: '4px' }}
            />
          }
          notFoundContent={
            <Empty
              className="ant-empty-small"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ textAlign: 'left', margin: '10px 0' }}
              description="No matching results"
            />
          }
        >
          <Input
            placeholder="Search and select a test using the name or last 5 digits of test ID"
            suffix={InputSuffixIcon}
          />
        </AutoComplete>
      </AutoCompleteContainer>
    </Tooltip>
  )
}

export default connect(
  (state, { statePrefix }) => ({
    user: getUser(state),
    testList: createTestListSelector(statePrefix)(state),
    loading: createTestListLoadingSelector(statePrefix)(state),
    districtId: getUserOrgId(state),
    institutionIds: currentDistrictInstitutionIds(state),
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
    & > svg {
      fill: ${themeColorBlue};
    }
  }
`
