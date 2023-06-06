import React, { useEffect, useMemo, useState, useRef } from 'react'
import { TreeSelect, Tooltip } from 'antd'
import { startCase, isEmpty } from 'lodash'
import styled from 'styled-components'
import { SelectInputStyled } from '@edulastic/common'
import { greyThemeLight, title } from '@edulastic/colors'

// approx space each character will take.
const CHARACTER_WIDTH_OFFSET = 7
// padding + left margin in each tag
const TAG_WIDTH_OFFSET = 25
// width to accomodate count tag, eg: +4
const COUNT_TAG_WIDTH_OFFSET = 50

// calculating tags content width based on below items:
// 1. total characters shown in all the tags.
// 2. Padding between each tag.
const getSelectedValuesTagWidths = (selectedValues) => {
  let tagWidthsSum = 0
  const tagWidths = selectedValues.map((selectedValue) => {
    const selectedObj = JSON.parse(selectedValue)
    const value = Object.values(selectedObj)[0] || ''
    const tagWidth = value.length * CHARACTER_WIDTH_OFFSET + TAG_WIDTH_OFFSET
    tagWidthsSum += tagWidth
    return tagWidth
  })
  return [tagWidths, tagWidthsSum]
}

const ExternalDemographicFilter = ({
  extDemographicData,
  updateFilters,
  extDemogaphicFilters,
}) => {
  const [selectedValues, setSelectedValues] = useState(extDemogaphicFilters)
  const [maxTagCount, setMaxTagCount] = useState(2)
  const [inputBoxWidth, setInputBoxWidth] = useState(250)

  const FilterContainerRef = useRef(null)

  const [treeData, allFilterValues] = useMemo(() => {
    const treeDataValues = Object.keys(extDemographicData).map((filterKey) => {
      const parent = {
        title: <SelectTextInline>{startCase(filterKey)}</SelectTextInline>,
        value: filterKey,
        disableCheckbox: true,
        disabled: true,
        children: extDemographicData[filterKey]
          .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
          .map((filterValue) => {
            const valueObject = {}
            valueObject[filterKey] = filterValue
            const value = JSON.stringify(valueObject)
            return {
              title: (
                <Tooltip title={filterValue} placement="right">
                  {filterValue.length > 20
                    ? `${filterValue.slice(0, 17)}...`
                    : filterValue}
                </Tooltip>
              ),
              value,
              key: value,
            }
          }),
      }
      return parent
    })
    const allValues = []
    treeDataValues.forEach((treeNode) => {
      treeNode.children.forEach((child) => {
        allValues.push(child.value)
      })
    })
    return [treeDataValues, allValues]
  }, [extDemographicData])

  const updateFilterValues = (isVisible) => {
    if (!isVisible) {
      updateFilters(selectedValues)
    }
  }

  useEffect(() => {
    if (!isEmpty(FilterContainerRef.current)) {
      // decrease by (10 + 2)px for effective width with 10px right margin
      setInputBoxWidth(FilterContainerRef.current.offsetWidth - 12)
    }
  }, [FilterContainerRef?.current?.offsetWidth])

  useEffect(() => {
    const [tagWidths, tagWidthsSum] = getSelectedValuesTagWidths(selectedValues)
    if (tagWidthsSum > inputBoxWidth) {
      const inputBoxWidthWithCountTag = inputBoxWidth - COUNT_TAG_WIDTH_OFFSET
      let _maxTagCount = 0
      let totalTagWidth = tagWidths[_maxTagCount]
      while (totalTagWidth < inputBoxWidthWithCountTag) {
        _maxTagCount += 1
        totalTagWidth += tagWidths[_maxTagCount]
      }
      setMaxTagCount(_maxTagCount)
    } else if (selectedValues.length) {
      setMaxTagCount(selectedValues.length + 1)
    }
  }, [selectedValues])

  return (
    <ExternalDemographicFilterContainer ref={FilterContainerRef}>
      <SelectInputStyled
        data-cy="external-demographic-filter"
        as={TreeSelect}
        style={{ paddingRight: '10px' }}
        placeholder="Filter Extension Fields"
        treeCheckable
        treeDefaultExpandAll
        multiple
        dropdownStyle={{ maxHeight: '300px' }}
        dropdownClassName="external-demographic-dropdown"
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        maxTagCount={maxTagCount}
        maxTagPlaceholder={(omittedValues) => `+${omittedValues.length}`}
        value={selectedValues}
        onChange={(value) => setSelectedValues(value)}
        onDropdownVisibleChange={(isVisible) => updateFilterValues(isVisible)}
        treeIcon={false}
        removeIcon={<></>}
        treeData={[
          {
            title: (
              <HeaderButtonsWrapper>
                <SelectAllBtn
                  isDisabled={selectedValues.length === allFilterValues.length}
                  dataCy="selectAllButton"
                  onClickHandler={() => setSelectedValues(allFilterValues)}
                  titleText="Select All"
                />
                <SelectAllBtn
                  isDisabled={selectedValues.length === 0}
                  dataCy="unselectAllButton"
                  onClickHandler={() => setSelectedValues([])}
                  titleText="Unselect All"
                />
              </HeaderButtonsWrapper>
            ),
            value: 'all',
            disableCheckbox: true,
            disabled: true,
          },
          ...treeData,
        ]}
      />
    </ExternalDemographicFilterContainer>
  )
}

const SelectAllBtn = ({ isDisabled, onClickHandler, dataCy, titleText }) => (
  <SelectAll
    className={isDisabled ? 'disabled' : ''}
    data-cy={dataCy}
    onClick={() => onClickHandler()}
  >
    {titleText}
  </SelectAll>
)

export default ExternalDemographicFilter

const HeaderButtonsWrapper = styled.div`
  width: 100%;
  padding: 0px 0px 5px;
`

const SelectAll = styled.div`
  display: inline-block;
  color: ${title};
  cursor: pointer;
  margin-right: 15px;
  text-transform: uppercase;
  font-weight: 600;
  font-size: 12px;
  &.disabled {
    color: ${greyThemeLight};
    cursor: not-allowed;
  }
`

export const SelectTextInline = styled.div`
  display: inline-block;
  color: ${title};
  cursor: pointer;
  margin-right: 15px;
  font-weight: 600;
  font-size: 12px;
`

export const ExternalDemographicFilterContainer = styled.div`
  .ant-select.ant-select-enabled {
    display: block;
    height: 32px;
  }
  li.ant-select-selection__choice {
    padding: 0px 10px;
  }
  .ant-select-selection__choice {
    height: 20px !important;
  }
  .ant-select-selection.ant-select-selection--multiple {
    padding-right: 0px !important;
  }
  .ant-select-dropdown.external-demographic-dropdown {
    // absoluted div won't consider parent div's padding
    // hence padding of 10px is added in width itself
    width: calc(100% - 10px);
    min-width: 200px !important;
    .ant-select-tree-switcher {
      display: none;
    }
    .ant-select-tree {
      padding: 0px;
      li .ant-select-tree-node-content-wrapper {
        padding: 0px 10px;
      }
    }
    .ant-select-tree-switcher {
      display: none;
    }
    .ant-select-tree-checkbox-disabled {
      display: none;
    }
  }
`
