import { themeColorBlue } from '@edulastic/colors'
import { Tag } from 'antd'
import { white } from 'color-name'
import styled from 'styled-components'

export const BetaTag = styled(Tag)`
  left: ${({ left }) => left};
  top: ${({ top }) => top};
  background-color: ${({ backGroundColor }) => backGroundColor || white};
  border: 1.5px solid ${({ borderColor }) => borderColor || themeColorBlue};
  color: ${themeColorBlue};
`

export const BetaTag2 = styled.div`
  height: 23px;
  width: 44px;
  background-color: ${white};
  color: ${themeColorBlue};
  margin-left: ${({ ml }) => ml || '3px'};
  margin-top: ${({ mt }) => mt || '-11px'};
  border: 1.5px solid ${themeColorBlue};
  border-radius: 2px;
  font: normal normal bold 10px/14px Open Sans;
  letter-spacing: 0.19px;
  text-transform: uppercase;
  display: flex;
  justify-content: center;
  align-items: center;
`
