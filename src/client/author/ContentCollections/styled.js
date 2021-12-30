import styled from 'styled-components'
import { Tabs } from 'antd'
import PerfectScrollbar from 'react-perfect-scrollbar'
import {
  white,
  themeColor,
  smallDesktopWidth,
  themeColorLight,
  red,
  themeColorBlue,
} from '@edulastic/colors'
import { StyledTable as CommonTable } from '../../common/styled'

export const CollectionTableContainer = styled.div`
  width: ${({ isCollectionSelected }) =>
    isCollectionSelected ? '35%' : '100%'};
  background-color: ${white};
  border-radius: 8px;
  padding: ${({ isCollectionSelected }) =>
    isCollectionSelected ? '0px 10px' : '0px'};
  display: inline-block;
  float: left;
  @media (max-width: ${smallDesktopWidth}) {
    width: 100%;
    margin-right: 0px;
    margin-bottom: 20px;
    display: block;
  }
`

export const HeadingContainer = styled.div`
  height: 40px;
  margin-bottom: 10px;
  display: flex;
`

export const EditPencilBtn = styled.span`
  display: inline-block;
  width: 25px;
`

export const PermissionsButton = styled.span`
  color: ${themeColor};
  border: 1px solid ${themeColor};
  border-radius: 4px;
  display: inline-block;
  width: 120px;
  height: 30px;
  line-height: 30px;
  text-align: center;
  text-transform: uppercase;
  font-size: ${(props) => props.theme.commentFontSize};
  cursor: pointer;
  transition: all 0.3s ease-in;
  margin-right: 10px;
  &:hover {
    border: 1px solid ${themeColorBlue};
    background-color: ${themeColorBlue};
    color: ${white};
    span {
      display: none;
    }
    &:before {
      content: 'Add Permissions';
    }
  }

  @media (max-width: ${smallDesktopWidth}) {
    width: 105px;
    margin-right: 5px;
  }
`

export const StyledTable = styled(CommonTable)`
  .ant-table {
    &-thead {
      & > tr > th:last-child {
        text-align: center !important;
      }
    }
  }
`

export const AddCollectionButton = styled.span`
  background: ${themeColor};
  color: ${white};
  border-radius: 4px;
  display: inline-block;
  width: 150px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  text-transform: uppercase;
  font-size: ${(props) => props.theme.commentFontSize};
  cursor: pointer;
  font-weight: ${(props) => props.theme.semiBold};
  margin-left: 20px;
`

export const ImportButton = styled(AddCollectionButton)`
  background: transparent;
  color: ${themeColor};
  border: 1px solid ${themeColor};
  margin-top: 0px;
  margin-left: 0px;
  width: 170px;
  height: 30px;
  line-height: 30px;
  transition: all 0.3s ease-in;
  i {
    font-size: ${(props) => props.theme.questionTextlargeFontSize};
    margin-right: 10px;
  }
  &:hover {
    color: ${white};
    background: ${themeColor};
  }
`

export const BackArrowButton = styled.span`
  cursor: pointer;
  font-size: ${(props) => props.theme.questionTexthugeFontSize};
  svg {
    fill: ${themeColor};
  }
`

export const PermissionTableContainer = styled(CollectionTableContainer)`
  padding-top: 5px;
  width: 65%;
  display: inline-block;
  .heading-container {
    > div:nth-child(odd) {
      width: 25%;
    }
    > div:nth-child(even) {
      width: 50%;
      margin-right: 10px;
    }
  }
  @media (max-width: ${smallDesktopWidth}) {
    width: 100%;
    display: block;
  }
`

export const StyledTab = styled(Tabs)`
  .ant-tabs-bar {
    border-bottom: 0px;
    .ant-tabs-tab {
      font-size: ${(props) => props.theme.smallFontSize};
      font-weight: ${(props) => props.theme.semiBold};
      padding-top: 20px;
      padding-bottom: 20px;
    }
  }
`

export const StatusText = styled.span`
  font-size: ${(props) => props.theme.tagFontSize};
  text-transform: uppercase;
  color: ${({ color }) => (color === 'red' ? red : themeColorLight)};
`

export const StyledScollBar = styled(PerfectScrollbar)`
  max-height: ${({ maxHeight }) => maxHeight}px;
  padding-right: 15px;
  overflow: hidden;
  @media (max-width: ${smallDesktopWidth}) {
    max-height: 350px;
  }
`

export const DeletePermissionButton = styled.span`
  cursor: pointer;
  color: ${themeColor};
  margin-left: 7px;
  font-size: 18px;
`
