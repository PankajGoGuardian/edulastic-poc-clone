/* eslint-disable no-unused-vars */
import { FieldLabel, SelectInputStyled } from '@edulastic/common'
import React from 'react'
import connect from 'react-redux/lib/connect/connect'
import {
  getFormattedCurriculumsSelector,
  getStandardsListSelector,
} from '../../../src/selectors/dictionaries'
import filterData from '../../../TestList/components/Container/FilterData'
import { getTestsFilterSelector } from '../../../TestList/ducks'
import { FlexRow } from './styled'

const ResourcesFiltersModal = (props) => {
  const {
    subjects,
    onSubjectChange,
    allSubjects,
    curriculum,
    onCurriculumChange,
    allCurriculum,
    standards,
    onStandardsChange,
    allStandards,
    formattedCuriculums,
    curriculumStandards,
    testFilters,
  } = props

  const getResourceFilters = () => {
    let filterData1 = []
    const filtersTitle = ['Subject']
    const { curriculumId = '', subject = [] } = testFilters
    const formattedStandards = (curriculumStandards.elo || []).map((item) => ({
      value: item._id,
      text: item.identifier,
    }))

    const isStandardsDisabled =
      !(curriculumStandards.elo && curriculumStandards.elo.length > 0) ||
      !curriculumId

    filterData1 = filterData.filter((o) => filtersTitle.includes(o.title))
    let curriculumsList = []
    if (subject.length) curriculumsList = [...formattedCuriculums]
    filterData1.splice(
      2,
      0,
      ...[
        {
          size: 'large',
          title: 'Standard set',
          onChange: 'curriculumId',
          data: [{ value: '', text: 'All Standard set' }, ...curriculumsList],
          optionFilterProp: 'children',
          showSearch: true,
        },
        {
          size: 'large',
          mode: 'multiple',
          placeholder: 'All Standards',
          title: 'Standards',
          disabled: isStandardsDisabled,
          onChange: 'standardIds',
          optionFilterProp: 'children',
          data: formattedStandards,
          showSearch: true,
          isStandardSelect: true,
        },
      ]
    )
    return filterData1
  }

  const handleFiltersChange = (name, value) => {
    console.log('data', name, value)
  }

  const resourcesData = getResourceFilters()

  return (
    <>
      {resourcesData.map((filterItem, index) => {
        return (
          <FlexRow key={index}>
            <FieldLabel>{filterItem.title}</FieldLabel>
            <SelectInputStyled
              data-cy={filterItem.title}
              showSearch={filterItem.showSearch}
              onSearch={filterItem.onSearch && filterItem.onSearch}
              mode={filterItem.mode}
              size={filterItem.size}
              placeholder={filterItem.placeholder}
              filterOption={filterItem.filterOption}
              optionFilterProp={filterItem.optionFilterProp}
              value={testFilters[filterItem.onChange]}
              key={filterItem.title}
              disabled={filterItem.disabled}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              defaultValue={
                filterItem.mode === 'multiple'
                  ? undefined
                  : filterItem.data[0] && filterItem.data[0].value
              }
              onChange={(value) =>
                handleFiltersChange(filterItem.onChange, value)
              }
            >
              {filterItem.data.map(({ value, text, disabled }, index1) => (
                <SelectInputStyled.Option
                  value={value}
                  key={index1}
                  disabled={disabled}
                >
                  {text}
                </SelectInputStyled.Option>
              ))}
            </SelectInputStyled>
          </FlexRow>
        )
      })}
    </>
  )
}

export default connect(
  (state, { search = {} }) => ({
    curriculumStandards: getStandardsListSelector(state),
    formattedCuriculums: getFormattedCurriculumsSelector(state, search),
    testFilters: getTestsFilterSelector(state),
  }),
  null
)(ResourcesFiltersModal)
