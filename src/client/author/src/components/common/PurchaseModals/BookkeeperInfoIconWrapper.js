import React from 'react'
import { FieldLabel, TextInputStyled } from '@edulastic/common'
import { IconInfo } from '@edulastic/icons'
import { EmailWrapper, LabelIconWrapper } from './styled'
import { Tooltip } from '../../../../../common/utils/helpers'

const BookkeeperInfoIconWrapper = ({
  tooltipMessage,
  emailValues,
  handleInputEmailAddress,
}) => (
  <EmailWrapper>
    <LabelIconWrapper>
      <FieldLabel>Bookkeeper Email</FieldLabel>
      <Tooltip title={tooltipMessage}>
        <IconInfo
          width={16}
          height={16}
          style={{
            marginLeft: '5px',
            marginBottom: '5px',
          }}
        />
      </Tooltip>
    </LabelIconWrapper>
    <TextInputStyled
      value={emailValues}
      onChange={handleInputEmailAddress}
      placeholder="Type the emails"
      height="40px"
      data-cy="bookKeeperEmailField"
    />
  </EmailWrapper>
)

export default BookkeeperInfoIconWrapper
