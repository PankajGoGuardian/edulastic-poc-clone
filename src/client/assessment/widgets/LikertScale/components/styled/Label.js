import { greyThemeLight } from '@edulastic/colors'
import styled from 'styled-components'

export const OptionLabelDiv = styled.div`
  flex: 1;
  z-index: 990;
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 12px;
  margin-bottom: 4px;
  border: 1px solid ${greyThemeLight};
  border-left: solid 3px ${greyThemeLight};
`
