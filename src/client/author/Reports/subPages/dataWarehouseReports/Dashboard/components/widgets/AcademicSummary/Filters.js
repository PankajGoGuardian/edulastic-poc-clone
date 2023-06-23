import { FlexContainer } from '@edulastic/common'
import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { ControlDropDown } from '../../../../../../common/components/widgets/controlDropDown'
import { StyledText } from '../../../../common/components/styledComponents'
import {
  academicSummaryFiltersTypes,
  getPerformanceBandList,
  getAvailableAcademicTestTypesWithBands,
} from '../../../utils'
import { filtersData } from '../../../ducks/selectors'

const AcademicSummaryWidgetFilters = ({
  filters,
  setFilters,
  performanceBandsList,
  availableTestTypes,
  dataFilters,
}) => {
  const { bandInfo = [], externalBands = [] } = get(
    dataFilters,
    'data.result',
    {}
  )
  const availableAcademicTestTypes = useMemo(
    () => getAvailableAcademicTestTypesWithBands(bandInfo, externalBands),
    [bandInfo, externalBands]
  )

  const updateFilterDropdownCB = (e, selected, comData) => {
    const additionalData = {}
    if (comData === academicSummaryFiltersTypes.TEST_TYPE) {
      const performanceBandList = getPerformanceBandList(
        bandInfo,
        externalBands,
        selected.key,
        availableAcademicTestTypes
      )
      if (performanceBandList?.length) {
        additionalData[academicSummaryFiltersTypes.PERFORMANCE_BAND] = {
          key: performanceBandList[0].key,
          title: performanceBandList[0].title,
        }
      }
    }
    setFilters({
      ...filters,
      [comData]: selected,
      ...additionalData,
    })
  }

  return (
    <FlexContainer
      padding="50px 40px"
      mr="30px"
      justifyContent="space-between"
      alignItems="center"
    >
      <FlexContainer alignItems="center">
        <StyledText margin="0 10px 0 0" fontSize="11px">
          TEST TYPE:
        </StyledText>
        <ControlDropDown
          height="36px"
          buttonWidth="160px"
          by={filters[academicSummaryFiltersTypes.TEST_TYPE]}
          selectCB={updateFilterDropdownCB}
          data={availableTestTypes}
          comData={academicSummaryFiltersTypes.TEST_TYPE}
          prefix="Test Type"
          showPrefixOnSelected={false}
        />
      </FlexContainer>
      <FlexContainer alignItems="center" flexWrap="nowrap">
        <StyledText margin="0 10px 0 0" fontSize="11px">
          PERFORMANCE BAND:
        </StyledText>
        <ControlDropDown
          height="36px"
          buttonWidth="160px"
          by={filters[academicSummaryFiltersTypes.PERFORMANCE_BAND]}
          selectCB={updateFilterDropdownCB}
          data={performanceBandsList}
          comData={academicSummaryFiltersTypes.PERFORMANCE_BAND}
          prefix="Performance Band"
          showPrefixOnSelected={false}
        />
      </FlexContainer>
    </FlexContainer>
  )
}

export default connect((state) => ({
  dataFilters: filtersData(state),
}))(AcademicSummaryWidgetFilters)
