import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { isEmpty, debounce } from 'lodash'
import { themeColorBlue } from '@edulastic/colors'

// components
import { AutoComplete, Input, Icon, Tooltip, Empty } from 'antd'

// ducks
import { useDropdownData } from '@edulastic/common'
import {
  currentDistrictInstitutionIds,
  getUserOrgId,
} from '../../../../../src/selectors/user'
import { actions, selectors } from '../ducks'

const DEFAULT_SEARCH_TERMS = { text: '', selectedText: '', selectedKey: '' }

const StudentAutoComplete = ({
  studentList,
  loading,
  loadStudentList,
  firstLoad,
  termId,
  schoolIds,
  grades,
  subjects,
  courseIds,
  classIds,
  selectedStudentId,
  selectCB,
  districtId,
  institutionIds,
  activeQuery,
}) => {
  const [searchTerms, setSearchTerms] = useState(DEFAULT_SEARCH_TERMS)
  const [fieldValue, setFieldValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [dropdownStudents, setDropdownStudents] = useState(studentList)

  const selectedStudent =
    studentList.find((s) => s._id === selectedStudentId) || {}

  // build search query
  const query = useMemo(() => {
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
  }, [
    searchTerms.text,
    termId,
    schoolIds,
    grades,
    subjects,
    courseIds,
    classIds,
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
  }, [termId, schoolIds, grades, subjects, courseIds, classIds])
  useEffect(() => {
    if (
      (!searchTerms.text && !searchTerms.selectedText) ||
      searchTerms.text !== searchTerms.selectedText
    ) {
      loadStudentListDebounced(query)
    }
  }, [query])

  const dropdownOpen = isFocused && searchTerms.text
  useEffect(() => {
    if (
      (activeQuery?.search?.searchString ||
        studentList.some((s) => s.title === searchTerms.text)) &&
      dropdownOpen
    )
      setDropdownStudents(studentList)
  }, [studentList, activeQuery, dropdownOpen])
  useEffect(() => {
    if (!dropdownOpen) setDropdownStudents([])
  }, [dropdownOpen])
  // build dropdown data
  const dropdownData = useDropdownData(dropdownStudents, {
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
          open={dropdownOpen}
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
    districtId: getUserOrgId(state),
    institutionIds: currentDistrictInstitutionIds(state),
    studentList: selectors.studentsList(state),
    activeQuery: selectors.studentsListQuery(state),
    loading: selectors.loadingStudentsData(state),
  }),
  {
    loadStudentList: actions.fetchStudentsDataRequest,
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
    & > svg {
      fill: ${themeColorBlue};
    }
  }
`
