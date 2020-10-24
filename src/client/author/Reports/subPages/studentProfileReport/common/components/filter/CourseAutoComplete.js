import React, { useMemo, useState, useEffect, useCallback } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { get, isEmpty, debounce } from 'lodash'

// components & constants
import { AutoComplete, Input, Icon } from 'antd'

// ducks
import { getUser } from '../../../../../../src/selectors/user'
import {
  receiveCourseListAction,
  getCourseListSelector,
} from '../../../../../../Courses/ducks'

const DEFAULT_SEARCH_TERMS = { text: '', selectedText: '', selectedKey: '' }

const CourseAutoComplete = ({
  userDetails,
  courseList,
  loading,
  loadCourseList,
  selectedCourseId,
  selectCB,
}) => {
  const [searchTerms, setSearchTerms] = useState(DEFAULT_SEARCH_TERMS)

  // build search query
  const query = useMemo(() => {
    const { orgData } = userDetails
    const { districtIds } = orgData
    const districtId = districtIds?.[0]
    const q = {
      limit: 25,
      page: 1,
      districtId,
      search: {
        name: [{ type: 'cont', value: searchTerms.text }],
      },
    }
    return q
  }, [searchTerms.text])

  // handle autocomplete actions
  const onSearch = (value) => {
    setSearchTerms({ ...searchTerms, text: value })
  }
  const onSelect = (key) => {
    const value = courseList.find((c) => c._id === key)?.name
    setSearchTerms({ text: value, selectedText: value, selectedKey: key })
    selectCB({ key, title: value })
  }
  const onBlur = () => {
    if (searchTerms.text === '' && searchTerms.selectedText !== '') {
      setSearchTerms(DEFAULT_SEARCH_TERMS)
      selectCB({ key: '', title: '' })
    } else {
      setSearchTerms({ ...searchTerms, text: searchTerms.selectedText })
    }
  }

  // effects
  useEffect(() => {
    if (!isEmpty(selectedCourseId)) {
      const { _id, name } = courseList.find((t) => t._id === selectedCourseId)
      setSearchTerms({ text: name, selectedText: name, selectedKey: _id })
    }
  }, [selectedCourseId])
  const loadCourseListDebounced = useCallback(
    debounce(loadCourseList, 500, { trailing: true }),
    []
  )
  useEffect(() => {
    if (searchTerms.text && searchTerms.text !== searchTerms.selectedText) {
      loadCourseListDebounced(query)
    }
  }, [searchTerms])

  // build dropdown data
  const dropdownData = searchTerms.text
    ? [
        <AutoComplete.OptGroup
          key="courseList"
          label="Courses [Type to search]"
        >
          {Object.values(courseList).map((item) => (
            <AutoComplete.Option key={item._id} title={item.name}>
              {item.name}
            </AutoComplete.Option>
          ))}
        </AutoComplete.OptGroup>,
      ]
    : []

  return (
    <AutoCompleteContainer>
      <AutoComplete
        getPopupContainer={(trigger) => trigger.parentNode}
        placeholder="All Courses"
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
    userDetails: getUser(state),
    courseList: getCourseListSelector(state),
    loading: get(state, ['coursesReducer', 'loading'], false),
  }),
  {
    loadCourseList: receiveCourseListAction,
  }
)(CourseAutoComplete)

const AutoCompleteContainer = styled.div`
  .ant-select-auto-complete {
    padding: 5px;
  }
  .ant-select-dropdown-menu-item-group-title {
    font-weight: bold;
  }
`
