import { EduIf, FlexContainer } from '@edulastic/common'

import React from 'react'

import { filterDetails, vqConst } from '../../const'
import TestFiltersDD from './TestFilterDD'

const { YOUTUBE } = vqConst.vqTabs

const Filters = ({
  handleFilterChanges,
  isLoading,
  currentTab,
  filterGrades,
  filterStatus,
  filterSubjects,
}) => {
  const filterValues = {
    grades: filterGrades,
    status: filterStatus,
    subjects: filterSubjects,
  }
  return (
    <EduIf condition={currentTab !== YOUTUBE}>
      <FlexContainer
        justifyContent="flex-start"
        mr="16px"
        marginBottom="32px"
        mt="16px"
      >
        {['grades', 'subjects', 'status'].map((filterName) => {
          const {
            filterHeader,
            filterKey,
            placeholder,
            options,
            mode,
          } = filterDetails[filterName]
          if (
            currentTab === vqConst.vqTabs.COMMUNITY &&
            filterName === 'status'
          ) {
            return null
          }

          return (
            <FlexContainer
              mr="16px"
              width="250px"
              flexDirection="column"
              justifyContent="flex-start"
            >
              <TestFiltersDD
                options={options}
                filterHeader={filterHeader}
                filterKey={filterKey}
                placeholder={placeholder}
                handleFilterChanges={handleFilterChanges}
                isLoading={isLoading}
                filterValue={filterValues[filterName]}
                mode={mode}
              />
            </FlexContainer>
          )
        })}
      </FlexContainer>
    </EduIf>
  )
}

export default Filters
