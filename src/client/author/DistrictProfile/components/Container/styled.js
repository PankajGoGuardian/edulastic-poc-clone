import styled from 'styled-components'
import { Layout, Spin, Button, Typography } from 'antd'

import {
  white,
  largeDesktopWidth,
  mobileWidthMax,
  green,
  backgrounds,
} from '@edulastic/colors'

const { Content } = Layout

const { Text } = Typography

export const StyledLayout = styled(Layout)`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  padding: 0 30px 30px 30px;
`

export const SpinContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  background: rgba(68, 68, 68, 0.1);
  z-index: 999;
  border-radius: 10px;
`

export const StyledSpin = styled(Spin)`
  position: absolute;
  left: 50%;
  top: 35%;
  transform: translate(-50%, -50%);
`

export const ProfileImgWrapper = styled.div`
  width: 350px;
  height: 320px;
  position: relative;
  background-color: ${backgrounds?.default};
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;

  @media (max-width: ${largeDesktopWidth}) {
    width: 250px;
    height: 250px;
  }
  @media (max-width: ${mobileWidthMax}) {
    display: none;
  }
`

export const RightContainer = styled.div`
  width: calc(100% - 370px);

  @media (max-width: ${largeDesktopWidth}) {
    width: calc(100% - 270px);
  }
  @media (max-width: ${mobileWidthMax}) {
    width: 100%;
  }
`

export const FormContent = styled(Content)`
  background-color: ${white};
  border-radius: 10px;
  border: 1px solid #b6b6cc;
  padding: 20px;
`

export const TwoColumnFormContainer = styled.div`
  display: flex;
  flex-direction: row;
`

export const SubHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 30px;
`

export const StyledButton = styled(Button)`
  margin-left: 5px;
`

export const ButtonText = styled(Text)`
  color: ${green};
`

export const DropdownWrapper = styled.div`
  width: 360px;
  display: flex;
  .ant-select {
    width: 200px;
  }
  .ant-select-selection {
    border: 1px solid #40b394;
    color: #40b394;
  }
`
