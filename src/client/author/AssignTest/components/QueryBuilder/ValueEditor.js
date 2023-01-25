import React from 'react'
import { Empty, Select } from 'antd'
import { StyledSelect } from './QueryBuilder'
import { connect } from 'react-redux'
import {
  getAdvancedSearchDetailsSelector,
  setAdvancedSearchClassesAction,
  setAdvancedSearchCoursesAction,
  setAdvancedSearchTagsAction,
} from '../../../TestPage/components/Assign/ducks'
import { debounce } from 'lodash'

const mapFieldWithLabel = {
  'course.id': 'courses',
  _id: 'classes',
  tags: 'tags',
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
      case '_id':
        loadClassListData({ searchString })
        break

      case 'course.id':
        loadCourseListData({ searchString })
        break

      case 'tags':
        loadTagListData({ searchString })
        break
    }
  }

  const searchHandler = debounce(handleSearch, 500)

  if (operator === 'null' || operator === 'notNull') {
    return null
  }

  if (!value) handleOnChange(undefined)

  if (Object.keys(mapFieldWithLabel).includes(field)) {
    const key = mapFieldWithLabel[field]
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
        value={value}
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
          return <Select.Option value={item.value}>{item.label}</Select.Option>
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
      value={value}
      showSearch
      tagsEllipsis
      filterOption={(input, option) =>
        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    >
      {values.map((item) => {
        return <Select.Option value={item.value}>{item.label}</Select.Option>
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
