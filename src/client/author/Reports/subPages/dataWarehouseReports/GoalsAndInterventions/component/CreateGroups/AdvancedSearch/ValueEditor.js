import React from 'react'
import { Empty, Select } from 'antd'
import { connect } from 'react-redux'
import { debounce } from 'lodash'
import { EduIf, EduThen, EduElse } from '@edulastic/common'
import { StyledSelect, StyledInputNumber } from './styled-components'
import { debounceWait, groupType } from './config/qb-config'
import { getAdvancedSearchDetailsSelector } from '../../../ducks/selectors'
import { actions } from '../../../ducks'
import { fieldKey } from '../../../ducks/constants'

const { classes, schools, groups, courses } = fieldKey

const ValueEditor = (props) => {
  const {
    operator,
    type,
    values,
    handleOnChange,
    field,
    value: originalValue,
    fieldData,
    advancedSearchDetails,
    loadSchools,
    loadClasses,
    loadCourses,
    loadGroups,
    path,
  } = props

  const getValue = () => {
    if (
      (field.startsWith(fieldKey.attendanceBands) ||
        field.startsWith(fieldKey.proficiencyBands)) &&
      originalValue &&
      typeof originalValue === 'string'
    ) {
      return originalValue?.split(',')
    }
    return originalValue
  }
  let value = getValue()
  if (
    (field.startsWith(fieldKey.attendanceBands) ||
      field.startsWith(fieldKey.proficiencyBands)) &&
    value?.length &&
    typeof value[0] !== 'string'
  ) {
    value = undefined
  }
  const dataCyValue = (pathLevel = [], selectorName) => {
    if (pathLevel.length) {
      if (pathLevel.length == 2)
        return `groupLevel-${pathLevel[0]}-${selectorName}-${pathLevel[1]}`
      return `${selectorName}-${pathLevel[0]}`
    }
    return selectorName
  }

  const enableSearchFields = {
    [schools]: { key: schools, func: loadSchools },
    [classes]: { key: classes, func: loadClasses },
    [courses]: { key: courses, func: loadCourses },
    [groups]: { key: groups, func: loadGroups },
  }
  const { label = 'values' } = fieldData || {}
  const groupsKey = [classes, groups]

  const handleSearch = (searchString) => {
    if (enableSearchFields[field] && enableSearchFields[field].func) {
      const payload = {
        searchString,
      }
      if (groupsKey.includes(enableSearchFields[field].key)) {
        payload.type = groupType[enableSearchFields[field].key]
      }
      enableSearchFields[field].func(payload)
    }
  }

  const handleChange = (selectedValues) => {
    if (
      (field.startsWith(fieldKey.attendanceBands) ||
        field.startsWith(fieldKey.proficiencyBands)) &&
      selectedValues
    ) {
      handleOnChange(selectedValues.join(','))
    } else {
      handleOnChange(selectedValues)
    }
  }

  const searchHandler = debounce(handleSearch, debounceWait)

  if (operator === 'null' || operator === 'notNull') {
    handleOnChange(undefined)
    return null
  }

  const { key } = enableSearchFields[field] || {}
  const isLoading = advancedSearchDetails[key]?.isLoading
  const fetchedValues = advancedSearchDetails[key]?.data

  return (
    <>
      <EduIf condition={Object.keys(enableSearchFields).includes(field)}>
        <EduThen>
          <StyledSelect
            data-cy={dataCyValue(path, 'valueEditor')}
            getPopupContainer={(triggerNode) => triggerNode.parentElement}
            mode="multiple"
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
        </EduThen>
        <EduElse>
          <EduIf condition={type === 'number'}>
            <EduThen>
              <StyledInputNumber
                max={fieldData.maxValue}
                min={fieldData.minValue}
                onChange={handleChange}
                value={value}
              />
            </EduThen>
            <EduElse>
              <StyledSelect
                data-cy={dataCyValue(path, 'valueEditor')}
                getPopupContainer={(triggerNode) => triggerNode.parentElement}
                mode={type === 'multiselect' ? 'multiple' : 'default'}
                placeholder={`Select ${label}`}
                onChange={handleChange}
                value={value || undefined}
                showSearch
                tagsEllipsis
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
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
        </EduElse>
      </EduIf>
    </>
  )
}

export default connect(
  (state) => ({
    advancedSearchDetails: getAdvancedSearchDetailsSelector(state),
  }),
  {
    loadSchools: actions.getAdvancedSearchSchools,
    loadCourses: actions.getAdvancedSearchCourses,
    loadClasses: actions.getAdvancedSearchClasses,
    loadGroups: actions.getAdvancedSearchGroups,
  }
)(ValueEditor)
