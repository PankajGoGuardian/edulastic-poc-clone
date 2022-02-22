import React, { useEffect, useMemo, useState } from 'react'
import { TreeSelect, Tooltip } from 'antd'
import { startCase } from 'lodash'
import styled from 'styled-components'
import { SelectInputStyled } from '@edulastic/common'
import { greyThemeLight, title } from '@edulastic/colors'

const MAX_TAG_LENGTH = 10

const getSelectedValuesCharacterLength = (selectedValues) => {
  let totalCharacters = 0
  selectedValues.forEach((selectedValue) => {
    const selectedObj = JSON.parse(selectedValue)
    const value = Object.values(selectedObj)[0] || ''
    totalCharacters += value.length
  })
  totalCharacters += selectedValues.length * 2
  return totalCharacters
}

const ExternalDemographicFilter = ({ extDemographicData, updateFilters }) => {
  const [selectedValues, setSelectedValues] = useState([])
  const [maxTagCount, setMaxTagCount] = useState(2)
  const [shouldUpdateMaxTagCount, setShouldUpdateMaxTagCount] = useState(true)

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
    const totalCharacters = getSelectedValuesCharacterLength(selectedValues)
    if (
      totalCharacters >= MAX_TAG_LENGTH * 2 - 2 &&
      shouldUpdateMaxTagCount &&
      selectedValues.length !== allFilterValues.length
    ) {
      setMaxTagCount(selectedValues.length)
      setShouldUpdateMaxTagCount(false)
    } else if (totalCharacters < MAX_TAG_LENGTH * 2) {
      setShouldUpdateMaxTagCount(true)
      setMaxTagCount(10)
    }
  }, [selectedValues])

  const handleSelectAll = () => {
    const totalCharacters = getSelectedValuesCharacterLength(allFilterValues)
    if (totalCharacters >= MAX_TAG_LENGTH * 2 - 2) {
      setMaxTagCount(2)
      setShouldUpdateMaxTagCount(false)
    }
    setSelectedValues(allFilterValues)
  }

  return (
    <ExternalDemographicFilterContainer>
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
        maxTagTextLength={MAX_TAG_LENGTH}
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
                  onClickHandler={() => handleSelectAll()}
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
