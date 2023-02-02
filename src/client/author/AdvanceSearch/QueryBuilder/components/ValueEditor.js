import React from 'react'
import { Empty, Select } from 'antd'
import { connect } from 'react-redux'
import { debounce } from 'lodash'
import { EduIf, EduThen, EduElse } from '@edulastic/common'
import {
  getAdvancedSearchDetailsSelector,
  setAdvancedSearchClassesAction,
  setAdvancedSearchCoursesAction,
  setAdvancedSearchSchoolsAction,
  setAdvancedSearchTagsAction,
} from '../../ducks'
import { StyledSelect } from './styled-components'
import { fieldKey } from '../config/constants'
import { debounceWait } from '../config/qb-config'

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
    loadSchoolsData,
    loadClassListData,
    loadCourseListData,
    loadTagListData,
  } = props

  const enableSearchFields = {
    [fieldKey.schools]: { key: 'schools', func: loadSchoolsData },
    [fieldKey.classes]: { key: 'classes', func: loadClassListData },
    [fieldKey.courses]: { key: 'courses', func: loadCourseListData },
    [fieldKey.tags]: { key: 'tags', func: loadTagListData },
  }
  const { label = 'values' } = fieldData || {}

  const handleSearch = (searchString) => {
    if (enableSearchFields[field] && enableSearchFields[field].func) {
      enableSearchFields[field].func({ searchString })
    }
  }

  const searchHandler = debounce(handleSearch, debounceWait)

  if (operator === 'null' || operator === 'notNull') {
    handleOnChange(undefined)
    return null
  }

  const { key } = enableSearchFields[field] || {}
  const isLoading = advancedSearchDetails[key]?.isLoading
  return (
    <EduIf condition={Object.keys(enableSearchFields).includes(field)}>
      <EduThen>
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
      </EduThen>
      <EduElse>
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
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
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
      </EduElse>
    </EduIf>
  )
}

export default connect(
  (state) => ({
    advancedSearchDetails: getAdvancedSearchDetailsSelector(state),
  }),
  {
    loadSchoolsData: setAdvancedSearchSchoolsAction,
    loadClassListData: setAdvancedSearchClassesAction,
    loadCourseListData: setAdvancedSearchCoursesAction,
    loadTagListData: setAdvancedSearchTagsAction,
  }
)(ValueEditor)
