import React from 'react'
import { Tooltip } from 'antd'
import { EduIf, EduThen, EduElse } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { Label } from './styled-components'

const LabelWithTooltipComponent = ({ t: translate, showPopover, text, id }) => {
  return (
    <EduIf condition={showPopover}>
      <EduThen>
        {() => (
          <Tooltip
            title={translate(
              'component.helperText.contactSupportForDesmosStateCalculator'
            )}
          >
            <Label data-cy={id}>{text}</Label>
          </Tooltip>
        )}
      </EduThen>
      <EduElse>
        <Label data-cy={id}>{text}</Label>
      </EduElse>
    </EduIf>
  )
}

export const LabelWithTooltip = withNamespaces('assessment')(
  LabelWithTooltipComponent
)
