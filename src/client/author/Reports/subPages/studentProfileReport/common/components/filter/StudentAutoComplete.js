import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { isEmpty, debounce } from 'lodash'

// components
import { AutoComplete, Input, Icon, Tooltip, Empty } from 'antd'

// ducks
import { useDropdownData } from '@edulastic/common'
import { getOrgDataSelector } from '../../../../../../src/selectors/user'
import {
  getSPRStudentDataRequestAction,
  getStudentsListSelector,
  getStudentsLoading,
} from '../../filterDataDucks'

const DEFAULT_SEARCH_TERMS = { text: '', selectedText: '', selectedKey: '' }

const StudentAutoComplete = ({
  userOrgData,
  studentList,
  loading,
  loadStudentList,
  firstLoad,
  termId,
  grades,
  subjects,
  courseIds,
  classIds,
  selectedStudentId,
  selectCB,
}) => {
  const [searchTerms, setSearchTerms] = useState(DEFAULT_SEARCH_TERMS)
  const [fieldValue, setFieldValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const selectedStudent =
    studentList.find((s) => s._id === selectedStudentId) || {}

  // build search query
  const query = useMemo(() => {
    const { districtIds, institutionIds } = userOrgData
    const districtId = districtIds?.[0]
    const q = {
      limit: 35,
      page: 0,
      districtId,
      search: {
        role: ['student'],
      },
      type: 'DISTRICT',
    }
    if (searchTerms.text) {
      q.search.searchString = searchTerms.text
    }
    if (firstLoad && !selectedStudent._id && selectedStudentId) {
      q.search.userIds = [selectedStudentId]
    }
    if (termId) {
      q.termId = termId
    }
    if (!isEmpty(institutionIds)) {
      q.institutionIds = institutionIds
    }
    if (grades) {
      q.grades = Array.isArray(grades) ? grades : grades.split(',')
    }
    if (subjects) {
      q.subjects = Array.isArray(subjects) ? subjects : subjects.split(',')
    }
    if (courseIds) {
      q.courseIds = courseIds.split(',')
    }
    if (classIds) {
      q.search.groupIds = classIds.split(',')
    }
    return q
  }, [searchTerms.text, termId, grades, subjects, courseIds, classIds])

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
      const value = studentList.find((s) => s._id === key)?.title
      setSearchTerms({ text: value, selectedText: value, selectedKey: key })
      setFieldValue(value)
      selectCB({ key, title: value })
    } else {
      selectCB({ key: '', title: '' })
    }
  }
  const onBlur = () => {
    // force fetch studentList to reset assessment filter to previously selected student
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

  const loadStudentListDebounced = useCallback(
    debounce(loadStudentList, 500, { trailing: true }),
    []
  )

  // effects
  useEffect(() => {
    const { _id, title } = selectedStudent
    if (_id) {
      setSearchTerms({ text: title, selectedText: title, selectedKey: _id })
      setFieldValue(title)
    } else {
      setSearchTerms({
        ...DEFAULT_SEARCH_TERMS,
        selectedKey: selectedStudentId,
      })
      setFieldValue('')
    }
  }, [selectedStudentId])
  useEffect(() => {
    if (!searchTerms.selectedText && studentList.length) {
      const _tempStudent =
        studentList.find((s) => s._id === selectedStudentId) || studentList[0]
      onSelect(_tempStudent._id)
    } else if (firstLoad && !loading && !studentList.length) {
      onSelect()
    }
  }, [studentList])
  useEffect(() => {
    if (searchTerms.selectedText) {
      setSearchTerms({ ...DEFAULT_SEARCH_TERMS })
      setFieldValue('')
    }
  }, [termId, grades, subjects, courseIds, classIds])
  useEffect(() => {
    if (
      (!searchTerms.text && !searchTerms.selectedText) ||
      searchTerms.text !== searchTerms.selectedText
    ) {
      loadStudentListDebounced(query)
    }
  }, [query])

  // build dropdown data
  const dropdownData = useDropdownData(studentList, {
    cropTitle: false,
    searchText: searchTerms.text || '',
  })

  const selectedStudentLabel =
    searchTerms.text === searchTerms.selectedText && selectedStudent._id
      ? selectedStudent.title
      : ''

  const InputSuffixIcon = loading ? (
    <Icon type="loading" />
  ) : searchTerms.text && isFocused ? (
    <></>
  ) : (
    <Icon type="search" />
  )

  return (
    <Tooltip title={selectedStudentLabel} placement="top">
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
    userOrgData: getOrgDataSelector(state),
    studentList: getStudentsListSelector(state),
    loading: getStudentsLoading(state),
  }),
  {
    loadStudentList: getSPRStudentDataRequestAction,
  }
)(StudentAutoComplete)

const AutoCompleteContainer = styled.div`
  .ant-select-dropdown-menu-item-group-title {
    font-weight: bold;
    white-space: nowrap;
  }
  .ant-select-selection__clear {
    background: transparent;
  }
  .ant-input-suffix .anticon-loading {
    font-size: 1.4em;
  }
`
