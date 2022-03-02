import styled from 'styled-components'
import { Input } from 'antd'
import { IconInfo } from '@edulastic/icons'
import {
  lightGreySecondary,
  secondaryTextColor,
  largeDesktopWidth,
} from '@edulastic/colors'

export const PointsInput = styled(Input)`
  width: 100px;
  height: 40px;
  background: ${lightGreySecondary};
  font-size: 16px;
  font-weight: 600;
  color: ${secondaryTextColor};
  text-align: center;
  padding-left: 20px;

  @media (max-width: ${largeDesktopWidth}) {
    padding: 10px;
    width: 80px;
  }
`

export const ScoreInputWrapper = styled.div`
  position: relative;
`

export const InfoIcon = styled(IconInfo)`
  cursor: pointer;
  position: absolute;
  top: -6px;
  right: 4px;
`
