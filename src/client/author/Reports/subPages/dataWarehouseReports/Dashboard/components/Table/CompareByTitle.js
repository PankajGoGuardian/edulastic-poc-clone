import { themeColor } from '@edulastic/colors'
import { Tooltip } from 'antd'
import { min } from 'lodash'
import React from 'react'
import { DashedLine } from '../../../../../common/styled'
import { CompareByContainer } from '../common/styledComponents'

const CompareByTitle = ({ value }) => {
  const maxCharsInColumn = 25
  const dashedLineMarginX =
    96 - 3.5 * min([value.name?.length, maxCharsInColumn])
  return value.name ? (
    <Tooltip title={value.name}>
      <div>
        <CompareByContainer>{value.name}</CompareByContainer>
        <DashedLine
          dashColor={themeColor}
          dashWidth="2px"
          margin={`4px ${dashedLineMarginX}px`}
          height="1.3px"
        />
      </div>
    </Tooltip>
  ) : (
    '-'
  )
}

export default CompareByTitle
