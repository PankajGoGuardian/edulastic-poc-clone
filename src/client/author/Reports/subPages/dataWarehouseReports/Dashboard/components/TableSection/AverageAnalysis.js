import { EduIf, FlexContainer } from '@edulastic/common'
import React from 'react'
import { black, lightGreen13, lightRed6 } from '@edulastic/colors'
import { round } from 'lodash'
import { getScoreLabel } from '@edulastic/constants/const/dataWarehouse'
import { EXTERNAL_TEST_KEY_SEPARATOR } from '@edulastic/constants/reportUtils/common'

import { IconArrowDown, IconArrowUp } from '@edulastic/icons'
import FilterCell from './FilterCell'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import { academicSummaryFiltersTypes, tableFilterTypes } from '../../utils'
import { StyledText } from '../../../common/components/styledComponents'
import { OverallAverageWrapper } from '../common/styledComponents'

function AverageAnalysis({
  loading,
  districtAveragesMetricInfo,
  onTableHeaderCellClick,
  tableFilters,
  setTableFilters,
  academicSummaryFilters,
  setAcademicSummaryFilters,
  availableTestTypes,
  academicTestType,
}) {
  const externalTestType = academicTestType?.includes(
    EXTERNAL_TEST_KEY_SEPARATOR
  )
    ? academicTestType.split(EXTERNAL_TEST_KEY_SEPARATOR)[0]
    : null
  const { avgScore: districtAvgScore, aboveAvgCount, belowAvgCount } =
    districtAveragesMetricInfo?.[academicTestType] || {}
  const districtAvgScoreStr = districtAvgScore
    ? getScoreLabel(round(districtAvgScore), { externalTestType })
    : 'N/A'

  const updateFilterDropdownCB = (e, selected, key) => {
    setAcademicSummaryFilters({
      ...academicSummaryFilters,
      [key]: selected,
    })
    setTableFilters({
      ...tableFilters,
      [tableFilterTypes.ABOVE_EQUAL_TO_AVG]: true,
      [tableFilterTypes.BELOW_AVG]: true,
    })
  }

  const aboveEqualToAvgFilter =
    tableFilters[tableFilterTypes.ABOVE_EQUAL_TO_AVG]
  const belowAvgFilter = tableFilters[tableFilterTypes.BELOW_AVG]
  const isAboveEqualToAvgSelected =
    aboveEqualToAvgFilter !== belowAvgFilter && aboveEqualToAvgFilter
  const isBelowAvgSelected =
    aboveEqualToAvgFilter !== belowAvgFilter && belowAvgFilter
  return (
    <OverallAverageWrapper
      alignItems="center"
      justifyContent="left"
      flexWrap="wrap"
    >
      <FlexContainer mr="30px" alignItems="center" flexWrap="nowrap">
        <StyledText
          fontWeight={600}
          fontSize="15px"
          color={black}
          margin="0 10px 0 0"
        >
          Average analysis for
        </StyledText>
        <ControlDropDown
          height="32px"
          buttonWidth="200px"
          by={academicSummaryFilters[academicSummaryFiltersTypes.TEST_TYPE]}
          selectCB={updateFilterDropdownCB}
          data={availableTestTypes}
          comData={academicSummaryFiltersTypes.TEST_TYPE}
          prefix="Test Type"
          showPrefixOnSelected={false}
          containerClassName="based-on-test-type"
        />
      </FlexContainer>
      <FlexContainer justifyContent="right" flexWrap="nowrap">
        <FilterCell
          title="Overall Average"
          value={districtAvgScoreStr}
          loading={loading}
          showTooltip
          isFilter={false}
        />
        <EduIf condition={districtAvgScore}>
          <FilterCell
            title="Above / Equal"
            value={aboveAvgCount}
            color={lightGreen13}
            onFilterTextClick={() => {
              onTableHeaderCellClick(
                tableFilterTypes.ABOVE_EQUAL_TO_AVG,
                aboveAvgCount
              )
            }}
            isSelected={isAboveEqualToAvgSelected}
            tableFilters={tableFilters}
            loading={loading}
            arrowIcon={<IconArrowUp />}
          />
          <FilterCell
            title="Below"
            value={belowAvgCount}
            color={lightRed6}
            onFilterTextClick={() => {
              onTableHeaderCellClick(tableFilterTypes.BELOW_AVG, belowAvgCount)
            }}
            isSelected={isBelowAvgSelected}
            tableFilters={tableFilters}
            loading={loading}
            arrowIcon={<IconArrowDown />}
          />
        </EduIf>
      </FlexContainer>
    </OverallAverageWrapper>
  )
}

export default AverageAnalysis
