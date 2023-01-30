import React from 'react'
import { Empty, Select } from 'antd'
import { connect } from 'react-redux'
import { debounce } from 'lodash'
import { StyledSelect } from './QueryBuilder'
import {
  getAdvancedSearchDetailsSelector,
  setAdvancedSearchClassesAction,
  setAdvancedSearchCoursesAction,
  setAdvancedSearchTagsAction,
} from '../ducks'

export const fieldKey = {
  schools: 'institutionIds',
  courses: 'courses',
  grades: 'grades',
  subjects: 'subjects',
  groupType: 'groupType',
  classes: 'groupIds',
  tags: 'tagIds',
}

const enableSearchFields = {
  [fieldKey.classes]: 'classes',
  [fieldKey.courses]: 'courses',
  [fieldKey.tags]: 'tags',
}

const ValueEditor = (props) => {
  const {
    operator,
    type,
    values,
    handleOnChange,
    field,
    value,
    fieldData,
    advancedSearchDetails,
    loadClassListData,
    loadCourseListData,
    loadTagListData,
  } = props
  const { label = 'values' } = fieldData || {}

  const handleSearch = (searchString) => {
    switch (field) {
      case fieldKey.classes:
        loadClassListData({ searchString })
        break

      case fieldKey.courses:
        loadCourseListData({ searchString })
        break

      case fieldKey.tags:
        loadTagListData({ searchString })
        break
      default:
        break
    }
  }

  const searchHandler = debounce(handleSearch, 500)

  if (operator === 'null' || operator === 'notNull') {
    return null
  }

  if (Object.keys(enableSearchFields).includes(field)) {
    const key = enableSearchFields[field]
    const isLoading = advancedSearchDetails[key]?.isLoading
    return (
      <StyledSelect
        getPopupContainer={(triggerNode) => triggerNode.parentElement}
        mode="multiple"
        style={{ width: '200px' }}
        autoClearSearchValue={false}
        onChange={handleOnChange}
        onFocus={() => handleSearch('')}
        placeholder={`Select ${label}`}
        onSearch={searchHandler}
        value={value || undefined}
        showSearch
        tagsEllipsis
        filterOption={null}
        loading={isLoading}
        notFoundContent={
          !isLoading && (
            <Empty
              className="ant-empty-small"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ textAlign: 'left', margin: '10px 0' }}
              description="No match found"
            />
          )
        }
      >
        {values.map((item) => {
          return (
            <Select.Option value={item.value} key={item.value}>
              {item.label}
            </Select.Option>
          )
        })}
      </StyledSelect>
    )
  }

  return (
    <StyledSelect
      getPopupContainer={(triggerNode) => triggerNode.parentElement}
      mode={type === 'multiselect' ? 'multiple' : 'default'}
      placeholder={`Select ${label}`}
      style={{ width: '200px' }}
      onChange={handleOnChange}
      value={value || undefined}
      showSearch
      tagsEllipsis
      filterOption={(input, option) =>
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {values.map((item) => {
        return (
          <Select.Option value={item.value} key={item.value}>
            {item.label}
          </Select.Option>
        )
      })}
    </StyledSelect>
  )
}

export default connect(
  (state) => ({
    advancedSearchDetails: getAdvancedSearchDetailsSelector(state),
  }),
  {
    loadClassListData: setAdvancedSearchClassesAction,
    loadCourseListData: setAdvancedSearchCoursesAction,
    loadTagListData: setAdvancedSearchTagsAction,
  }
)(ValueEditor)
