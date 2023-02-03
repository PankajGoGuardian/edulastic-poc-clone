import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { debounce } from 'lodash'

// components & constants
import { AutoComplete, Input, Icon, Tooltip, Empty } from 'antd'
import { assignmentStatusOptions, roleuser } from '@edulastic/constants'
import { themeColorBlue } from '@edulastic/colors'

// ducks
import { useDropdownData } from '@edulastic/common'
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

const { IN_PROGRESS, IN_GRADING, DONE } = assignmentStatusOptions

const DEFAULT_SEARCH_TERMS = { text: '', selectedText: '', selectedKey: '' }
const AssessmentAutoComplete = ({
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
  statePrefix = '',
  waitForInitialLoad = false,
}) => {
  const [searchTerms, setSearchTerms] = useState(DEFAULT_SEARCH_TERMS)
  const [fieldValue, setFieldValue] = useState('')
  const [initialLoadCompleted, setInitialLoadCompleted] = useState(undefined)

  const selectedTest = testList.find((t) => t._id === selectedTestId) || {}

  useEffect(() => {
    if (loading && typeof initialLoadCompleted === 'undefined')
      setInitialLoadCompleted(false)
    if (!loading && typeof initialLoadCompleted !== 'undefined')
      setInitialLoadCompleted(true)
  }, [loading, initialLoadCompleted])
  // build search query
  const query = useMemo(() => {
    if (waitForInitialLoad && !initialLoadCompleted) return null
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
    initialLoadCompleted,
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
      autoSelectFirstItem ? onSelect(testList[0]._id) : onSelect()
    } else if (firstLoad && !loading && !testList.length) {
      onSelect()
    }
  }, [testList, autoSelectFirstItem])
  useEffect(() => {
    if (searchTerms.selectedText) {
      setSearchTerms({ ...DEFAULT_SEARCH_TERMS })
      setFieldValue('')
    }
  }, [termId, grades, subjects, testTypes, tagIds])
  useEffect(() => {
    if (!query) return
    if (
      (!searchTerms.text && !searchTerms.selectedText) ||
      searchTerms.text !== searchTerms.selectedText
    ) {
      loadTestListDebounced({ ...query, statePrefix })
    }
  }, [query, statePrefix])

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
          allowClear={
            !loading && searchTerms.selectedText && autoSelectFirstItem
          }
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
