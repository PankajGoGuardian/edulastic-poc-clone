import styled from 'styled-components'
import { Divider } from 'antd'
import {
  desktopWidth,
  mobileWidth,
  secondaryTextColor,
  tabletWidth,
  white,
  themeColor,
} from '@edulastic/colors'
import { Select } from 'antd/lib/index'
import { EduButton, FlexContainer, Paper } from '@edulastic/common'

export const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;

  @media (max-width: ${mobileWidth}) {
    padding-bottom: 40px;
    padding-left: 0px;
  }
`

export const TopMenu = styled.div`
  margin: 0 45px 0px 45px;
`

export const QuestionsFound = styled.span`
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${secondaryTextColor};
`

export const ItemsMenu = styled(FlexContainer)`
  background: ${white};
  align-items: flex-start;
  justify-content: space-between;
  padding: 15px 30px;

  @media screen and (max-width: 993px) {
    padding: 8px 15px;
  }
`

export const MainList = styled.div`
  display: flex;
  height: 100%;
  @media (max-width: ${desktopWidth}) {
    display: block;
  }
`

export const ListItems = styled.div`
  flex: 1;
  margin: 0px;
  overflow: auto;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
  background: ${white};

  @media (min-width: 993px) {
    width: 200px;
  }

  .ant-pagination {
    display: flex;

    @media (max-width: ${tabletWidth}) {
      justify-content: flex-end;
      margin-left: 29px !important;
      margin-top: 80px !important;
    }
  }

  @media (max-width: ${mobileWidth}) {
    margin: 21px 26px 0px 26px;
  }
`

export const ItemsTableContainer = styled.div`
  background: ${white};
`

export const StyledButton = styled(EduButton)`
  height: 30px;
  font-size: 11px;
  text-transform: uppercase;
  background: transparent;
  color: ${themeColor};
  display: flex;
  align-items: center;
  border: 1px solid ${themeColor};
  border-radius: 5px;
  margin-left: 10px;

  &:hover,
  &:active {
    background: transparent;
    color: ${themeColor};
  }

  svg {
    margin-right: 15px;
  }

  :last-child {
    margin-right: 0;
  }
`

export const BtnActionsContainer = styled.div`
  display: flex;
`

export const StyledSelect = styled(Select)`
  height: 32px;

  .ant-select-selection--single {
    height: 32px;
  }

  .ant-select-selection__rendered {
    height: 32px;
  }

  .ant-select-selection-selected-value {
    height: 32px;
    display: flex !important;
    align-items: center;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.2px;
    color: ${secondaryTextColor};
  }

  .ant-select-arrow-icon {
    svg {
      fill: ${themeColor};
    }
  }
`

export const ItemsPagination = styled(FlexContainer)`
  justify-content: flex-end;
  padding: 20px 0px;
`

export const ListWrapper = styled(Paper)`
  @media screen and (max-width: 480px) {
    padding: 0;
  }
`
export const Selected = styled.span`
  white-space: nowrap;
  margin-right: 5px;
`
export const StyledVerticalDivider = styled(Divider)`
  height: 36px;
  background: #bbbbbb;
`
