import React, { useCallback, useState, useEffect } from 'react'
import { themeColorBlue } from '@edulastic/colors'

import { AutoComplete, Empty, Icon, Input } from 'antd'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { debounce, isEmpty } from 'lodash'

import { useDropdownData } from '@edulastic/common'
import { EMPTY_ARRAY } from '@edulastic/constants/reportUtils/common'
import {
  currentDistrictInstitutionIds,
  getUserOrgId,
} from '../../../../src/selectors/user'

const DEFAULT_SEARCH_TERMS = { text: '', selectedText: '', selectedKey: '' }

function buildSearchQuery({
  districtId,
  institutionIds,
  searchTerms,
  filters,
}) {
  const { termId, grades, subjects, courseIds, classIds, schoolIds } = filters
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
  if (termId) {
    q.termId = termId
  }
  if (!isEmpty(schoolIds)) {
    q.institutionIds = schoolIds.split(',')
  } else if (!isEmpty(institutionIds)) {
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
}

function StudentAutoComplete({
  studentList,
  loading,
  loadStudentList,
  filters,
  selectedStudent,
  selectCB,
  districtId,
  institutionIds,
  activeQuery,
  height = 'auto',
}) {
  const [searchTerms, setSearchTerms] = useState(DEFAULT_SEARCH_TERMS)
  const [fieldValue, setFieldValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [dropdownStudents, setDropdownStudents] = useState(studentList)

  const {
    termId,
    grades,
    subjects,
    courseIds,
    classIds,
    schoolIds = EMPTY_ARRAY,
  } = filters

  const loadStudentListDebounced = useCallback(
    debounce(loadStudentList, 500, { trailing: true }),
    []
  )

  const onSearch = (value) => {
    setSearchTerms({ ...searchTerms, text: value })
    if (value !== searchTerms.selectedText && value.length > 1) {
      const query = buildSearchQuery({
        districtId,
        searchTerms,
        institutionIds,
        filters,
      })
      loadStudentListDebounced(query)
    }
  }

  const onSelect = (key) => {
    if (key) {
      const value =
        studentList.find((s) => s._id === key)?.title || selectedStudent?.title
      setSearchTerms({ text: value, selectedText: value, selectedKey: key })
      setFieldValue(value)
      selectCB({ key, title: value })
    } else {
      selectCB({ key: '', title: '' })
    }
  }

  const onChange = useCallback((_text, element) => {
    const _title = element?.props?.title
    setSearchTerms((s) => ({ ...s, text: _title || _text }))
    setFieldValue(_title || _text)
  }, [])

  const onBlur = () => {
    // force fetch studentList to reset student filter to previously selected student
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

  useEffect(() => {
    if (
      activeQuery?.search?.searchString ||
      studentList.some((s) => s.title === searchTerms.text)
    )
      setDropdownStudents(studentList)
  }, [studentList, activeQuery])

  useEffect(() => {
    if (searchTerms.selectedText) {
      setSearchTerms({ ...DEFAULT_SEARCH_TERMS })
      setFieldValue('')
    }
    setDropdownStudents([])
  }, [termId, grades, subjects, courseIds, classIds, schoolIds])

  useEffect(() => {
    const { key, title } = selectedStudent
    if (key) {
      setSearchTerms({ text: title, selectedText: title, selectedKey: key })
      setFieldValue(title)
      if (title && isEmpty(dropdownStudents)) {
        setDropdownStudents([{ _id: key, title }])
      }
    } else {
      setSearchTerms({
        ...DEFAULT_SEARCH_TERMS,
        selectedKey: key,
      })
      setFieldValue('')
    }
  }, [selectedStudent])

  const dropdownData = useDropdownData(dropdownStudents, {
    cropTitle: false,
    searchText: searchTerms.text || '',
  })

  const InputSuffixIcon = loading ? (
    <Icon type="loading" />
  ) : searchTerms.text && isFocused ? (
    <></>
  ) : (
    <Icon type="search" />
  )

  const emptyDescription =
    searchTerms.selectedText?.length > 1
      ? 'No matching results'
      : 'Enter minimum 2 letters to start searching'

  return (
    <AutoCompleteContainer $height={height}>
      <AutoComplete
        style={{ width: '100%' }}
        onSearch={onSearch}
        onSelect={onSelect}
        onChange={onChange}
        onBlur={onBlur}
        value={fieldValue}
        dataSource={dropdownData}
        onFocus={() => setIsFocused(true)}
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        placeholder="Enter student name"
        allowClear={!loading && searchTerms.selectedText && isFocused}
        clearIcon={<Icon type="close" style={{ color: '#1AB394' }} />}
        notFoundContent={
          <Empty
            className="ant-empty-small"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ textAlign: 'left', margin: '10px 0' }}
            description={emptyDescription}
          />
        }
      >
        <Input suffix={InputSuffixIcon} />
      </AutoComplete>
    </AutoCompleteContainer>
  )
}

export default connect(
  (state) => ({
    districtId: getUserOrgId(state),
    institutionIds: currentDistrictInstitutionIds(state),
  }),
  {}
)(StudentAutoComplete)

const AutoCompleteContainer = styled.div`
  .ant-select-auto-complete.ant-select .ant-input {
    height: ${(props) => props.$height || 'auto'};
  }
  .ant-select-dropdown-menu-item-group-title {
    font-weight: bold;
    white-space: nowrap;
  }
  .ant-select-selection__clear {
    background: transparent;
  }
  .ant-input-suffix .anticon-loading {
    font-size: 1.4em;
    & > svg {
      fill: ${themeColorBlue};
    }
  }
`
