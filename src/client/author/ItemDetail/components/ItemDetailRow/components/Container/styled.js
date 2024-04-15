import { FlexContainer, Paper } from '@edulastic/common'
import { themeColor, mobileWidth, greyThemeDark2 } from '@edulastic/colors'
import styled from 'styled-components'
import { Button } from 'antd'

export const Content = styled(Paper)`
  left: 0;
  right: 0;
  width: 100%;
  max-height: calc(
    100vh - ${({ langaugeTabExist }) => (langaugeTabExist ? '210px' : '170px')}
  );
  padding: ${(props) => (props.padding ? props.padding : '0px')};
  overflow: auto;
  position: relative;
  transition: width 0.3s;
  width: ${({ hide }) => (hide ? '0px' : '')};
  @media (max-width: ${mobileWidth}) {
    padding: 33px 30px;
  }
`

export const TabContainer = styled.div`
  margin-bottom: 30px;
`

export const AddButtonContainer = styled(FlexContainer)`
  margin-bottom: 0;
  margin-top: 25px;
  flex-wrap: wrap;
`

export const AddPassageBtnContainer = styled.div`
  display: flex;
  justify-content: center;
  button.ant-btn {
    width: 170px;
    margin-right: 10px;
    padding: 0px;
  }
`

export const AddTabButton = styled(Button)`
  color: ${themeColor};
  height: 45px;
  width: 170px;
  font-size: 11px;
  border: none;
  display: flex;
  flex-direction: row;
  width: max-content;
  align-items: center;
  padding: 0px 15px;
  &:focus > span {
    position: unset;
    color: ${themeColor};
  }
  &:active > span {
    position: unset;
    color: ${themeColor};
  }
`

export const MobileSide = styled.div`
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 220px);
  right: ${(props) => (props.type === 'right' ? '0' : 'unset')};
  left: ${(props) => (props.type === 'left' ? '0' : 'unset')};
  background: ${themeColor};
  width: 25px;
  bottom: 20px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
`

export const WidgetContainer = styled.div`
  display: ${({ flowLayout }) => (flowLayout ? 'flex' : 'block')};
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
`

export const CollapseBtn = styled.i`
  position: absolute;
  top: 0;
  cursor: pointer;
  font-size: 15px;
  cursor: pointer;
  padding: 5px 15px;
  border-radius: 5px;
  border: 1px solid ${themeColor};
  color: ${themeColor};
  margin: 10px;
  z-index: 1;
  &.fa-arrow-left {
    right: 1px;
  }
  &.fa-arrow-right {
    left: 1px;
  }
`

export const PlusIcon = styled.span`
  display: inline-block;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  margin-right: 10px;
  border: 1px solid ${greyThemeDark2};
  color: ${greyThemeDark2};
  font-size: 18px !important;
  line-height: 1;
`

export const GreenPlusIcon = styled(PlusIcon)`
  color: #fff;
  background: ${themeColor};
  position: unset;
`
