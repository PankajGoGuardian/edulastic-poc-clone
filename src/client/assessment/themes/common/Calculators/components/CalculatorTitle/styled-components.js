import styled from 'styled-components'
import { IconClose } from '@edulastic/icons'
import { darkBlueSecondary, white } from '@edulastic/colors'

export const TitleContainer = styled.div`
  position: relative;
`

export const CloseIcon = styled(IconClose)`
  width: 12px;
  height: 12px;
  right: 8px;
  cursor: pointer;
  position: absolute;
  top: calc(50% - 6px);
  fill: ${white};
`

export const CalcTitle = styled.div`
  width: 100%;
  height: 40px;
  /* background: -webkit-linear-gradient(top, #f9f9f9, #e6e6e6); */
  background: ${darkBlueSecondary};
  color: ${white};
  font-size: 14px;
  line-height: 40px;
  padding: 0 0 2px 15px;
  font-weight: 600;
  text-align: left;
  cursor: move;
`
