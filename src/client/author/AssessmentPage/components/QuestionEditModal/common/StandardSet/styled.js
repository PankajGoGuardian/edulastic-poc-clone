import styled from 'styled-components'

import { secondaryTextColor } from '@edulastic/colors'
import { Paper } from '@edulastic/common'

export const StandardsTitle = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: ${secondaryTextColor};
  margin-top: 20px;
`

export const StandardSelectWrapper = styled(Paper)`
  border-radius: 4px;
  padding: 15px;
  padding-left: 0px;
  margin-top: 15px;
`
