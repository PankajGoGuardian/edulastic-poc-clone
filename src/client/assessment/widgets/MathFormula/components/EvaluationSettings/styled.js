import styled from 'styled-components'
import { IconClose } from '@edulastic/icons'
import { greyThemeDark1, greyThemeDark4 } from '@edulastic/colors'

export const Container = styled.div`
  position: relative;
`

export const SettingHeader = styled.span`
  color: ${greyThemeDark4};
  font-weight: bold;
  font-size: 18px;
`

export const CloseIcon = styled(IconClose)`
  fill: ${greyThemeDark1};
  cursor: pointer;
`

export const SettingBody = styled.div`
  padding: 16px 32px 0px;
`
