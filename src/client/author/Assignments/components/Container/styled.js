import { Radio, Switch } from 'antd'
import styled from 'styled-components'

import {
  mobileWidth,
  tabletWidth,
  white,
  themeColor,
  smallDesktopWidth,
  mediumDesktopExactWidth,
  extraDesktopWidthMax,
  filterIconColor,
  largeDesktopWidth,
} from '@edulastic/colors'
import {
  FlexContainer,
  Card,
  Button,
  MainContentWrapper,
} from '@edulastic/common'

export const Container = styled(MainContentWrapper)`
  overflow: auto;

  .scrollbar-container {
    height: ${(props) =>
      `calc(100vh - ${
        props.theme.HeaderHeight.xs + 60
      }px)`}; // 60px is margin from top and bottom.
    width: 100%;
    padding-right: 30px;
    padding-left: 2px;
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    .scrollbar-container {
      height: ${(props) =>
        `calc(100vh - ${props.theme.HeaderHeight.md + 60}px)`};
    }
  }
  @media (min-width: ${extraDesktopWidthMax}) {
    .scrollbar-container {
      height: ${(props) =>
        `calc(100vh - ${props.theme.HeaderHeight.xl + 60}px)`};
    }
  }
  @media (max-width: ${tabletWidth}) {
    .scrollbar-container {
      height: calc(100vh - 90px);
    }
  }
  @media (max-width: ${mobileWidth}) {
    padding: 20px 26px 45px 26px;
  }
`

export const LeftWrapper = styled.div`
  min-width: 230px;
  max-width: 230px;
  display: ${({ showFilter }) => (showFilter ? 'block' : 'none')};

  @media (max-width: ${smallDesktopWidth}) {
    position: fixed;
    top: 50px;
    left: 100px;
    background: white;
    padding: 15px;
    box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.07);
    height: calc(100vh - 50px);
    z-index: 1;
  }

  @media (max-width: ${tabletWidth}) {
    left: 0px;
  }
`

export const FixedWrapper = styled.div`
  width: 230px;
  position: fixed;
`

export const PaginationInfo = styled.span`
  font-weight: 600;
  font-size: 13px;
  display: inline-block;
  @media (max-width: ${tabletWidth}) {
    display: none;
  }
  @media (max-width: 770px) {
    display: none;
  }
`

export const Main = styled.div`
  flex: 1;
  width: 100%;
  display: flex;
  position: relative;
`

export const DRadio = styled(Radio)``

export const StyledCard = styled(Card)`
  overflow-x: auto;
  box-shadow: none;
  border-radius: 0;
  height: calc(100% - 40px);
  .ant-card-body {
    padding: 0px 0px 60px;
    .ant-table-pagination {
      position: fixed;
      bottom: 15px;
      right: 30px;
    }
  }
`

export const FullFlexContainer = styled(FlexContainer)`
  @media (max-width: 770px) {
    width: 100%;
  }
  justify-content: flex-end;
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

  @media (max-width: 770px) {
    display: flex;
    justify-content: space-between;
    flex-direction: row-reverse;
    width: 100%;
  }
`

export const ViewSwitch = styled(Switch)`
  width: 35px;
  margin: 0px 15px;
  background-color: ${white};
  &.ant-switch-checked {
    background-color: ${white};
  }
  &:after {
    background-color: ${themeColor};
  }
`

export const TestButton = styled(Button)`
  height: 45px;
  width: 130px;
  color: ${themeColor};
  border-radius: 3px;
  margin-left: 25px;
  background: ${white};
`

export const SwitchWrapper = styled.div`
  display: flex;
  align-items: center;
`

export const SwitchLabel = styled.div`
  font-size: 10px;
  font-weight: 600;
  color: ${white};
`

export const FilterButton = styled(Button)`
  min-width: 35px;
  min-height: 25px;
  padding: 2px;
  padding-top: 5px;
  border-radius: 3px;
  ${(props) => (props.isAdvancedView ? 'position: fixed;' : '')}
  margin-left: -23px;
  margin-top: 8px;
  z-index: 2;
  box-shadow: none;
  background: ${white} !important;
  &:focus,
  &:hover {
    outline: unset;
    color: ${(props) => (props.isShowFilter ? white : filterIconColor)};
  }

  svg {
    fill: ${(props) =>
      props.showFilter ? themeColor : filterIconColor} !important;
  }

  @media (max-width: ${smallDesktopWidth}) {
    margin-left: ${(props) => (props.showFilter ? '180px' : '-20px')};
    margin-top: ${(props) => (props.showFilter ? '-25px' : '34px')};
  }
`

export const TableWrapper = styled.div`
  position: relative;
  width: 100%;
`

export const TestItemPreviewContainer = styled(FlexContainer)`
  width: 100%;
  margin-bottom: 0px;
  padding-top: 20px;
  align-items: stretch;
  height: 100%;
  p {
    padding: 2px 0 0 0;
  }
`

export const StyledSpan = styled.span`
  text-transform: uppercase;
  font-size: 13px;
  font-weight: 600;
  margin-right: 20px;
  @media (max-width: ${largeDesktopWidth}) {
    display: none;
  }
`
