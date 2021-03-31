import {
  greyDarken,
  lightGreen1,
  linkColor,
  mobileWidth,
  tabletWidth,
  themeColor,
  backgroundGrey2,
  white,
} from '@edulastic/colors'
import { Card, FlexContainer } from '@edulastic/common'
import { Radio, Switch, Modal } from 'antd'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

export const Container = styled.div`
  padding: 20px 30px;
  left: 0;
  right: 0;
  height: 100%;
  overflow: auto;
`

export const Main = styled.div`
  flex: 1;
  width: 100%;
`

export const DRadio = styled(Radio)``

export const StyledCard = styled(Card)`
  border-radius: 5;
  overflow-x: auto;

  .ant-card-body {
    padding: 24px;
  }

  @media (max-width: ${tabletWidth}) {
    display: none;
  }
`

export const PaginationInfo = styled.span`
  font-weight: 600;
  display: inline-block;
  font-size: 11px;
  word-spacing: 5px;
  color: ${linkColor};
`

export const AnchorLink = styled(Link)`
  text-transform: uppercase;
  color: ${linkColor};
`

export const ActionDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  flex: 1;
  padding-right: 7px;
`

export const Anchor = styled.a`
  text-transform: uppercase;
  color: ${linkColor};
  font-weight: bold;
`

export const TextAnchor = styled.span`
  text-transform: uppercase;
  color: ${linkColor};
  cursor: pointer;
`

export const FullFlexContainer = styled(FlexContainer)`
  @media (max-width: ${tabletWidth}) {
    width: 100%;
  }
  justify-content: ${({ justifyContent }) => justifyContent || 'flex-start'};
`

export const StyledFlexContainer = styled(FlexContainer)`
  @media (max-width: ${tabletWidth}) {
    width: 100%;
    display: flex;
    justify-content: space-around;
  }

  @media (max-width: ${mobileWidth}) {
    width: 100%;
    display: flex;
    justify-content: space-around;
  }

  @media (max-width: ${tabletWidth}) {
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
    width: 100%;
  }
`

export const SwitchWrapper = styled.div`
  display: flex;
  align-items: center;
`

export const SwitchLabel = styled.div`
  font-size: 10px;
  font-weight: 600;
  color: ${greyDarken};
`

export const ViewSwitch = styled(Switch)`
  width: 35px;
  margin: 0px 15px;
  background-color: ${lightGreen1};
`

export const Paragraph = styled.p`
  margin-bottom: 15px;
  text-align: ${(props) => props.alignItems && props.alignItems};
`
export const TabContentContainer = styled.div`
  width: ${({ width }) => (width || window.innerWidth <= 780 ? '100%' : '50%')};
  margin: auto;
`
export const SettingContainer = styled.div`
  position: relative;
`
export const SavedSettingsContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  > div:first-child {
    margin-right: 15px;
  }
  .ant-select {
    width: 200px;
  }
  .ant-select-selection {
    border-color: ${themeColor};
  }
  .ant-select-selection-selected-value {
    font-size: 12px;
    color: ${themeColor};
  }
  .ant-select-dropdown-menu {
    li {
      font-size: 12px;
      word-break: break-word;
      > span {
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
      }
      &:hover {
        svg {
          fill: ${white};
          path {
            fill: ${white};
          }
        }
        span {
          color: ${white};
        }
      }
    }
    .save-settings-option {
      border-top: 1px solid #00000029;
      padding: 8px 12px;
      font-size: 11px;
      i {
        font-size: 18px;
      }
      > span {
        justify-content: space-around;
        color: #3f85e5;
        font-weight: 600;
        line-height: normal;
        > svg {
          fill: #3f85e5;
        }
      }
    }
  }
`

export const StyledModal = styled(Modal)`
  .ant-modal-header {
    border-bottom: none;
    h2 {
      margin-bottom: 0px;
      font-weight: 600;
    }
  }
  .ant-modal-body {
    div {
      text-align: center;
      font-size: 15px;
      > span {
        color: ${themeColor};
        font-weight: 600;
      }
    }
    label {
      font-size: 12px;
      font-weight: 600;
      margin-bottom: 4px;
      display: inline-block;
    }
    input {
      height: 40px;
      background: ${backgroundGrey2};
    }
  }
  .ant-modal-footer {
    border-top: none;
    > div {
      display: flex;
      justify-content: center;
      margin-bottom: 10px;
      button {
        font-size: 12px;
        height: 35px;
        padding: 0px 30px;
      }
    }
  }
`
export const DeleteIconContainer = styled.span`
  display: none;
`
