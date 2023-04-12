import React from 'react'
import { EduIf } from '@edulastic/common'
import {
  StyledEduButton,
  StyledDropDownContainer,
  SecondaryFilterRow,
} from '../../../../../common/styled'
import { ControlDropDown } from '../../../../../common/components/widgets/controlDropDown'
import { staticDropDownData } from '../../utils'

const PageLevelFilters = ({
  reportId,
  filters,
  showPageLevelApply,
  loadingFiltersData,
  updateFilterDropdownCB,
  onGoClick,
}) => {
  return (
    <SecondaryFilterRow hidden={!!reportId} width="100%" fieldHeight="40px">
      <StyledDropDownContainer
        flex="0 0 300px"
        xs={24}
        sm={12}
        lg={6}
        data-cy="riskType"
        data-testid="riskType"
      >
        <ControlDropDown
          by={filters.riskType}
          selectCB={(e, selected) =>
            updateFilterDropdownCB(selected, 'riskType', false, true)
          }
          data={staticDropDownData.riskTypes}
          prefix="Risk Type"
          showPrefixOnSelected={false}
        />
      </StyledDropDownContainer>
      <EduIf condition={showPageLevelApply}>
        <StyledEduButton
          btnType="primary"
          data-testid="applyRowFilter"
          data-cy="applyRowFilter"
          disabled={loadingFiltersData}
          onClick={() => onGoClick()}
        >
          APPLY
        </StyledEduButton>
      </EduIf>
    </SecondaryFilterRow>
  )
}

export default PageLevelFilters
