import React from 'react'
import { themeColor } from '@edulastic/colors'
import { IconInfo } from '@edulastic/icons'
import { EduElse, EduIf, EduThen, SpinLoader } from '@edulastic/common'
import { Tooltip } from 'antd'
import {
  FilterCellWrapper,
  StyledIconCaretDown,
} from '../common/styledComponents'
import TooltipContent from './TooltipContent'
import { tableFilterTypes } from '../../utils'
import { Spacer } from '../../../../../../../common/styled'
import { ColorCircle } from '../../../../../common/styled'
import { ColoredText } from '../../../common/components/styledComponents'

/**
 * This behaves like a filter if @param {boolean} isFilter is true & filters dashboard report table on click of filter text.
 */
const FilterCell = ({
  title,
  value,
  color = '',
  onFilterTextClick = null,
  isSelected = false,
  tableFilters = {},
  loading,
  arrowIcon = null,
  showTooltip = false,
  isFilter = true,
}) => {
  const filterText = isSelected
    ? 'Clear'
    : `View ${tableFilters[tableFilterTypes.COMPARE_BY]?.title}`

  const cellHeight = 50
  const arrowWidth = 25
  const arrowHeight = 12
  const arrowTopPosition = (cellHeight + arrowHeight) / 2
  return (
    <FilterCellWrapper
      isSelected={isSelected}
      isClickable={!!value}
      $cellHeight={cellHeight}
    >
      <EduIf condition={arrowIcon}>
        <ColorCircle color={color} height="40px">
          {arrowIcon}
        </ColorCircle>
      </EduIf>
      <div>{`${title} : `}</div>
      <EduIf condition={loading}>
        <EduThen>
          <Spacer />
          <Spacer />
          <SpinLoader tip="" position="relative" />
        </EduThen>
        <EduElse>
          <div style={{ fontWeight: '600', fontSize: '17px' }}>{value}</div>
          <EduIf condition={isFilter}>
            <ColoredText
              className="filter-text"
              $color={themeColor}
              $fontWeight={600}
              onClick={onFilterTextClick}
            >
              {filterText}
            </ColoredText>
          </EduIf>
          <EduIf condition={showTooltip}>
            <Tooltip title={<TooltipContent />}>
              <IconInfo />
            </Tooltip>
          </EduIf>
        </EduElse>
      </EduIf>
      <EduIf condition={isSelected}>
        <StyledIconCaretDown
          color={themeColor}
          $arrowWidth={arrowWidth}
          $arrowHeight={arrowHeight}
          $arrowTopPosition={arrowTopPosition}
        />
      </EduIf>
    </FilterCellWrapper>
  )
}

export default FilterCell
