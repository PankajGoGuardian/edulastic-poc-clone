import { FlexContainer } from '@edulastic/common'
import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { get } from 'lodash'
import { EXTERNAL_TEST_KEY_SEPARATOR } from '@edulastic/constants/reportUtils/common'
import { ControlDropDown } from '../../../../../../common/components/widgets/controlDropDown'
import { StyledText } from '../../../../common/components/styledComponents'
import {
  academicSummaryFiltersTypes,
  getPerformanceBandList,
  getAvailableAcademicTestTypesWithBands,
  tableFilterTypes,
} from '../../../utils'
import { filtersData } from '../../../ducks/selectors'

const AcademicSummaryWidgetFilters = ({
  filters,
  setFilters,
  tableFilters,
  setTableFilters,
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
    if (comData === academicSummaryFiltersTypes.TEST_TYPE) {
      const additionalData = {}
      // if user changes test type from an external to internal test type, profileId remains whatever was previously selected for internal test type but it's representation in the filter does not update, so we need to update it manually.
      if (!selected?.key?.includes(EXTERNAL_TEST_KEY_SEPARATOR)) {
        const performanceBandList = getPerformanceBandList(
          bandInfo,
          externalBands,
          selected.key,
          availableAcademicTestTypes
        )
        if (performanceBandList?.length) {
          const selectedPerformanceBandOption =
            performanceBandList.find(
              (pb) =>
                pb.key ===
                filters[academicSummaryFiltersTypes.PERFORMANCE_BAND]?.key
            ) || performanceBandList[0]
          additionalData[
            academicSummaryFiltersTypes.PERFORMANCE_BAND
          ] = selectedPerformanceBandOption
        }
      }
      setFilters({
        ...filters,
        [comData]: selected,
        ...additionalData,
      })
      setTableFilters({
        ...tableFilters,
        [tableFilterTypes.ABOVE_EQUAL_TO_AVG]: true,
        [tableFilterTypes.BELOW_AVG]: true,
      })
    } else {
      setFilters({ ...filters, [comData]: selected })
    }
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
