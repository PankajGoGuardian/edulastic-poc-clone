import React, { useMemo } from 'react'
import { Empty, Select } from 'antd'
import { connect } from 'react-redux'
import { debounce, isEmpty } from 'lodash'
import {
  EduIf,
  EduThen,
  EduElse,
  SelectWithPasteEnabledInput,
} from '@edulastic/common'
import {
  getAdvancedSearchDetailsSelector,
  getNameToCourseIdsMapSelector,
  setAdvancedSearchClassesAction,
  setAdvancedSearchCoursesAction,
  setAdvancedSearchSchoolsAction,
  setAdvancedSearchTagsAction,
  storeSelectedDataAction,
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
    storeSelectedData,
    path,
    nameToCourseIdsMap,
  } = props

  const dataCyValue = (pathLevel = [], selectorName) => {
    if (pathLevel.length) {
      if (pathLevel.length == 2)
        return `groupLevel-${pathLevel[0]}-${selectorName}-${pathLevel[1]}`
      return `${selectorName}-${pathLevel[0]}`
    }
    return selectorName
  }

  const allOptionsIds = useMemo(() => {
    if (field === fieldKey.courses) {
      // 2 or more courses with same name. Thus need all courseIds from nameToCourseIdsMap object
      if (!isEmpty(nameToCourseIdsMap)) {
        return Object.keys(nameToCourseIdsMap)
      }
      return []
    }
    return values.map((_value) => _value?.value || null)
  }, [values])

  const enableSearchFields = {
    [fieldKey.schools]: { key: 'schools', func: loadSchoolsData },
    [fieldKey.classes]: { key: 'classes', func: loadClassListData },
    [fieldKey.courses]: { key: 'courses', func: loadCourseListData },
    [fieldKey.tags]: { key: 'tags', func: loadTagListData },
  }
  const pasteEnabledSelectFields = [
    fieldKey.schools,
    fieldKey.classes,
    fieldKey.courses,
  ]
  const { label = 'values' } = fieldData || {}

  const handleSearch = (searchString, idsList = []) => {
    if (enableSearchFields[field] && enableSearchFields[field].func) {
      enableSearchFields[field].func({
        searchString,
        ...(idsList?.length ? { idsList } : {}),
      })
    }
  }

  const handleChange = (selectedValues, isIdsListObj = {}) => {
    const { isPastedIdsList = false } = isIdsListObj || {}
    if (isPastedIdsList && field === fieldKey.courses) {
      // selectedValues is list of ids and course field requires names as selectedValues
      const courseNames = []
      if (!isEmpty(nameToCourseIdsMap)) {
        Object.keys(nameToCourseIdsMap).forEach((courseId) => {
          if (selectedValues.includes(courseId)) {
            courseNames.push(nameToCourseIdsMap[courseId])
          }
        })
      }
      selectedValues = courseNames
    }
    handleOnChange(selectedValues)
    storeSelectedData({
      key: enableSearchFields[field].key,
      valueFromField: selectedValues,
      values,
    })
  }

  const searchHandler = debounce(handleSearch, debounceWait)

  if (operator === 'null' || operator === 'notNull') {
    handleOnChange(undefined)
    return null
  }

  const { key } = enableSearchFields[field] || {}
  const isLoading = advancedSearchDetails[key]?.isLoading
  const fetchedValues = advancedSearchDetails[key]?.data

  const SelectComponent = pasteEnabledSelectFields.includes(field)
    ? SelectWithPasteEnabledInput
    : StyledSelect

  return (
    <EduIf condition={Object.keys(enableSearchFields).includes(field)}>
      <EduThen>
        <SelectComponent
          data-cy={dataCyValue(path, 'valueEditor')}
          getPopupContainer={(triggerNode) => triggerNode.parentElement}
          mode="multiple"
          style={{ width: '80%', overflowY: 'auto', maxHeight: '70px' }}
          autoClearSearchValue={false}
          onChange={handleChange}
          onFocus={() => handleSearch('')}
          placeholder={`Select ${label}`}
          onSearch={searchHandler}
          value={value || undefined}
          showSearch
          tagsEllipsis
          filterOption={(input, option) =>
            fetchedValues?.some(
              (fetchedValue) => fetchedValue.value === option.props.value
            )
          }
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
          allOptionsIds={allOptionsIds}
          customSelectComponent={StyledSelect}
        >
          {values.map((item) => {
            return (
              <Select.Option
                value={item.value}
                key={item.value}
                data-cy={dataCyValue(path, 'valueOptions')}
              >
                {item.label}
              </Select.Option>
            )
          })}
        </SelectComponent>
      </EduThen>
      <EduElse>
        <StyledSelect
          data-cy={dataCyValue(path, 'valueEditor')}
          getPopupContainer={(triggerNode) => triggerNode.parentElement}
          mode={type === 'multiselect' ? 'multiple' : 'default'}
          placeholder={`Select ${label}`}
          style={{ width: '80%', overflowY: 'auto', maxHeight: '70px' }}
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
              <Select.Option
                value={item.value}
                key={item.value}
                data-cy={dataCyValue(path, 'valueOptions')}
              >
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
    nameToCourseIdsMap: getNameToCourseIdsMapSelector(state),
  }),
  {
    loadSchoolsData: setAdvancedSearchSchoolsAction,
    loadClassListData: setAdvancedSearchClassesAction,
    loadCourseListData: setAdvancedSearchCoursesAction,
    loadTagListData: setAdvancedSearchTagsAction,
    storeSelectedData: storeSelectedDataAction,
  }
)(ValueEditor)
