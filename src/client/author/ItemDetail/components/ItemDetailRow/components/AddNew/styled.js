import {
  dashBorderColor,
  themeColorHoverBlue,
  themeColor,
  white,
  tabletWidth,
  cardBg,
  secondaryTextColor,
} from '@edulastic/colors'

import Button from "antd/es/button";
import styled from 'styled-components'

export const Container = styled.div`
  svg {
    margin: 0px 10px;
    fill: ${secondaryTextColor};
    &:hover {
      fill: ${secondaryTextColor};
    }
  }
  button.ant-btn {
    border-color: ${dashBorderColor};
    &:hover {
      border-color: ${dashBorderColor};
    }
  }
`

export const PassageButtonContainer = styled(Container)`
  svg {
    fill: ${white};
    &:hover {
      fill: ${white};
    }
  }
`

export const AddNewButton = styled(Button)`
  align-items: center;
  display: flex;
  justify-content: space-between;
  padding: 10px 25px;
  height: auto;
  border-radius: 8px;
  background-color: ${cardBg};
  color: ${secondaryTextColor};
  font-size: 13px;
  &:hover {
    color: ${secondaryTextColor};
  }
`

export const PassageAddNewButton = styled(AddNewButton)`
  background-color: ${themeColor};
  color: ${white};
  margin: 4px 5px;
  &:hover {
    color: ${white};
    background-color: ${themeColorHoverBlue};
  }
  @media (max-width: ${tabletWidth}) {
    padding: 5px 15px;
  }
`

export const TextWrapper = styled.span`
  margin-right: 15px;
`
