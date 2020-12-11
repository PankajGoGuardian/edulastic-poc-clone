import styled from 'styled-components'
import Input from "antd/es/Input";
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
