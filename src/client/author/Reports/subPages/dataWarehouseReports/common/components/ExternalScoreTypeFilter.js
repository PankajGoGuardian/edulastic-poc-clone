import React from 'react'
import { Tooltip } from 'antd'

import { IconInfo } from '@edulastic/icons'
import { themeColor } from '@edulastic/colors'
import { EduIf } from '@edulastic/common'
import { EXTERNAL_SCORE_TOOLTIP_TEXT, EXTERNAL_SCORE_TYPES } from '../utils'
import LabelledControlDropdown from './LabelledControlDropdown'

const ExternalScoreTypeFilter = ({
  selectedExternalScoreType,
  externalScoreTypesList,
  updateFilterDropdownCB,
}) => {
  return (
    <LabelledControlDropdown
      labelComponent={
        <>
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
        </>
      }
      dataCy="externalScoreType"
      by={selectedExternalScoreType}
      selectCB={(e, selected) =>
        updateFilterDropdownCB(selected, 'externalScoreType')
      }
      data={externalScoreTypesList}
      label="External Score"
      showPrefix={false}
    />
  )
}

export default ExternalScoreTypeFilter
