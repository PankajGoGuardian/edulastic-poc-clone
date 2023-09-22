import React from 'react'
import { Tooltip } from 'antd'

import { IconInfo } from '@edulastic/icons'
import { themeColor } from '@edulastic/colors'
import { EduIf, FieldLabel, FlexContainer } from '@edulastic/common'
import { StyledDropDownContainer } from '../../../../common/styled'
import { EXTERNAL_SCORE_TOOLTIP_TEXT, EXTERNAL_SCORE_TYPES } from '../utils'
import { ControlDropDown } from '../../../../common/components/widgets/controlDropDown'

const ExternalScoreTypeFilter = ({
  selectedExternalScoreType,
  externalScoreTypesList,
  updateFilterDropdownCB,
}) => {
  return (
    <StyledDropDownContainer
      flex="0 0 300px"
      xs={24}
      sm={12}
      lg={6}
      data-cy="externalScoreType"
      data-testid="externalScoreType"
    >
      <FieldLabel fs=".7rem">
        <FlexContainer alignItems="center" justifyContent="left">
          EXTERNAL SCORE
          <EduIf
            condition={
              selectedExternalScoreType.key !==
              EXTERNAL_SCORE_TYPES.SCALED_SCORE
            }
          >
            <Tooltip
              title={EXTERNAL_SCORE_TOOLTIP_TEXT[selectedExternalScoreType.key]}
            >
              <IconInfo fill={themeColor} style={{ marginLeft: '20px' }} />
            </Tooltip>
          </EduIf>
        </FlexContainer>
      </FieldLabel>
      <ControlDropDown
        by={selectedExternalScoreType}
        selectCB={(e, selected) =>
          updateFilterDropdownCB(selected, 'externalScoreType')
        }
        data={externalScoreTypesList}
        prefix="External Score"
        showPrefixOnSelected={false}
      />
    </StyledDropDownContainer>
  )
}

export default ExternalScoreTypeFilter
