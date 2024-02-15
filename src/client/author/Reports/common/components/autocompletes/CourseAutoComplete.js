import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { get, isEmpty, debounce } from 'lodash'

// components & constants
import { AutoComplete, Input, Icon, Empty } from 'antd'
import { themeColorBlue } from '@edulastic/colors'

// ducks
import { useDropdownData } from '@edulastic/common'
import { getUserOrgId } from '../../../../src/selectors/user'
import {
  receiveCourseListAction,
  getCourseListSelector,
} from '../../../../Courses/ducks'

const DEFAULT_SEARCH_TERMS = { text: '', selectedText: '', selectedKey: 'All' }

const CourseAutoComplete = ({
  courseList,
  loading,
  loadCourseList,
  selectCB,
  selectedCourseId,
  userDistrictId,
  districtId,
}) => {
  const [searchTerms, setSearchTerms] = useState(DEFAULT_SEARCH_TERMS)
  const [fieldValue, setFieldValue] = useState('')
  const [searchResult, setSearchResult] = useState([])
  const [isFocused, setIsFocused] = useState(false)

  // build search query
  const query = useMemo(() => {
    const q = {
      limit: 25,
      page: 1,
      districtId: districtId || userDistrictId,
      search: {
        name: [{ type: 'cont', value: searchTerms.text }],
      },
    }
    return q
  }, [searchTerms.text, districtId])

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
    const value = (searchTerms.text ? courseList : searchResult).find(
      (c) => c._id === key
    )?.name
    setSearchTerms({ text: value, selectedText: value, selectedKey: key })
    setFieldValue(value)
    selectCB({ key, title: value })
  }
  const onBlur = () => {
    setIsFocused(false)
    if (searchTerms.text === '' && searchTerms.selectedText !== '') {
      setSearchTerms(DEFAULT_SEARCH_TERMS)
      setFieldValue('')
      selectCB({ key: 'All', title: '' })
    } else {
      setSearchTerms({ ...searchTerms, text: searchTerms.selectedText })
      setFieldValue(searchTerms.selectedText)
    }
  }
  const loadCourseListDebounced = useCallback(
    debounce(loadCourseList, 500, { trailing: true }),
    []
  )
  const getDefaultCourseList = () => {
    setIsFocused(true)
    if (isEmpty(searchResult)) {
      loadCourseListDebounced(query)
    }
  }

  // effects
  useEffect(() => {
    if (isEmpty(searchResult)) {
      setSearchResult(courseList)
    }
  }, [courseList])
  useEffect(() => {
    if (searchTerms.text && searchTerms.text !== searchTerms.selectedText) {
      loadCourseListDebounced(query)
    }
  }, [searchTerms])
  useEffect(() => {
    if (selectedCourseId !== searchTerms.selectedKey) {
      const selectedCourse = courseList.find((c) => c._id === selectedCourseId)
      if (selectedCourse) {
        setSearchTerms({
          text: selectedCourse.name,
          selectedText: selectedCourse.name,
          selectedKey: selectedCourse._id,
        })
        setFieldValue(selectedCourse.name)
      } else if (selectedCourseId === 'All') {
        setSearchTerms({ ...DEFAULT_SEARCH_TERMS })
        setFieldValue('')
      }
    }
  }, [selectedCourseId, courseList])

  useEffect(() => {
    setSearchResult([])
  }, [districtId])

  // build dropdown data
  const dropdownData = useDropdownData(
    searchTerms.text ? courseList : searchResult,
    {
      title_key: 'name',
      cropTitle: true,
      searchText: searchTerms.text || '',
    }
  )

  const InputSuffixIcon = loading ? (
    <Icon type="loading" />
  ) : searchTerms.text && isFocused ? (
    <></>
  ) : (
    <Icon type="search" />
  )

  return (
    <AutoCompleteContainer>
      <AutoComplete
        getPopupContainer={(trigger) => trigger.parentNode}
        placeholder="All Courses"
        value={fieldValue}
        onSearch={onSearch}
        onChange={onChange}
        dataSource={dropdownData}
        onSelect={onSelect}
        onBlur={onBlur}
        onFocus={() => getDefaultCourseList()}
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
  )
}

export default connect(
  (state) => ({
    userDistrictId: getUserOrgId(state),
    courseList: getCourseListSelector(state),
    loading: get(state, ['coursesReducer', 'loading'], false),
  }),
  {
    loadCourseList: receiveCourseListAction,
  }
)(CourseAutoComplete)

const AutoCompleteContainer = styled.div`
  .ant-select-dropdown-menu-item-group-title {
    font-weight: bold;
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
