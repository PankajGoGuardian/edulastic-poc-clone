import {
  dragDropUploadText,
  fadedBlack,
  themeColorBlue,
  dashBorderColor,
  greyThemeDark3,
  greyThemeLighter,
  greenPrimary,
  themeColor,
  lightGreen15,
} from '@edulastic/colors'
import { Col, Tabs } from 'antd'
import styled from 'styled-components'
import { StyledTable } from '../../../../../../common/styled'

export const StyledTabs = styled(Tabs)`
  width: 100%;
  margin-left: 0;
  .ant-tabs-bar {
    margin-bottom: 0;
    border-color: transparent;
  }
  .ant-tabs-nav-scroll {
    margin-bottom: 20px;
  }
  .ant-tabs-tab {
    font-weight: bold;
  }
`

export const BannerContainer = styled.div`
  .button {
    line-height: 58px;

    button {
      display: inline;
    }
  }

  .text {
    color: white;
    padding: 20px 24px;
  }

  border-radius: 4px;
  height: 60px;
  background: #313d50;
`

export const TableContainer = styled.div`
  min-height: 500px;
`

export const NoDataContainer = styled.div`
  background: white;
  color: ${fadedBlack};
  margin-top: 290px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 25px;
  font-weight: 700;
  text-align: 'center';
`
export const StyledText = styled(Col)`
  font-size: 12px;
  font-weight: bold;
  color: ${(p) => p.color};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
export const Header = styled.div`
  margin: ${({ $margin }) => $margin || '15px 15px 0 15px'};
  font-size: 17px;
  font-weight: bold;
`
export const Underlined = styled.span`
  color: ${themeColorBlue};
  cursor: pointer;
  text-decoration: underline;
`
export const DropzoneContentContainer = styled.div`
  margin: 32px 29px;
  padding: 50px;
  border-radius: 8px;
  height: 260px;
  width: 420px;
  display: flex;
  justify-content: center;
  border: ${({ isDragActive }) =>
    isDragActive
      ? `2px solid ${themeColorBlue}`
      : `2px dashed ${dashBorderColor}`};
  background: ${greyThemeLighter};
  svg {
    margin-bottom: 12px;
    width: 35px;
    height: 30px;
    fill: ${({ isDragActive }) =>
      isDragActive ? themeColorBlue : dragDropUploadText};
  }
  &:hover {
    border: 1px dashed ${greyThemeDark3};
    svg {
      fill: ${greyThemeDark3};
    }
  }
`

export const ModalContentWrapper = styled.div`
  width: 482px;
  height: 430px;
  border: 1px solid #d5d5d5;
  borderradius: 10px;
`

export const IconWrapper = styled.div`
  display: flex;
  width: fit-content;
  padding: 2px;
  border: 1px solid;
  margin-inline: auto;
  border-radius: 5px;
  border-color: ${themeColor};
  opacity: ${({ $disabled }) => ($disabled ? 0.3 : 1)};
`
export const Container = styled.div`
  text-align: left;
  font-weight: bold;
  margin-left: 30px;
  font-size: 10px;
  a {
    border-bottom: 1px solid ${greenPrimary};
    padding-bottom: 2px;
    border-bottom-style: dashed;
  }
`

export const FileNameTagContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${lightGreen15};
  height: 29px;
  max-width: 250px;
  border-radius: 5px;
  padding: 17px 12px;
  .file-name {
    width: fit-content;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-weight: 650;
    font-size: 12px;
  }
  svg {
    width: 12px !important;
    margin-top: 12px;
    margin-left: 13px;
    fill: black !important;
    path {
      stroke-width: 5px;
    }
  }
`
export const StyledTag = styled.span`
  background-color: ${({ $color }) => $color};
  color: black;
  padding: 6px 9px 6px 6px;
  font-size: 11px;
  border-radius: 8px;
`
export const CustomStyledTable = styled(StyledTable)`
  .ant-table-pagination {
    margin: 16px 5px;
  }
  .test-name {
    max-width: 300px;
    width: fit-content;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`
