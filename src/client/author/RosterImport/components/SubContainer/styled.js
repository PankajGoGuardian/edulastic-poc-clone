import styled from 'styled-components'
import { Button } from 'antd'
import {
  greyThemeDark1,
  greyThemeLight,
  themeColorBlue,
  lightGrey2,
} from '@edulastic/colors'
import { IconDownload, IconPDFFile } from '@edulastic/icons'

export const LeftWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: -15px;
`

export const DownloadFileAndInstructions = styled.div`
  width: 380px;
  display: flex;
  justify-content: space-between;
  align-self: center;
`

export const RosterHistoryWrapper = styled.div`
  width: 55%;
  display: flex;
  flex-direction: column;
  font-weight: bold;
  .ant-table-column-title {
    color: ${greyThemeDark1};
  }
  .ant-table-thead {
    background-color: black;
  }
`

export const DownloadCsv = styled.div`
  display: flex;
  flex-direction: column;
  align-self: center;
  width: content-width;
  color: ${lightGrey2};
  justify-content: space-evenly;
  font-size: 16px;
`

export const StyledIconPDFFile = styled(IconPDFFile)`
  position: relative;
  top: 3px;
  left: 3px;
  & > g > path {
    fill: ${themeColorBlue};
  }
`

export const StyledHeading2 = styled.h4`
  font-size: 18px !important;
  font-weight: ${({ bold }) => bold || 400};
  margin-top: -35px;
  padding: -10px 30px;
`

export const RecordTable = styled.div`
  .ant-table-body > table {
    border-collapse: collapse;
  }
  .ant-table-body > table > thead {
    border-bottom: 1px solid ${greyThemeLight};
  }
  .ant-table-tbody > tr {
    border-bottom: 1px solid ${greyThemeLight};
  }
  .ant-table-tbody > tr > td {
    border: none;
  }
`
export const StyledDownloadIcon = styled(IconDownload)`
  margin-left: 5px;
  margin-right: 3px;
  & > g > path {
    fill: ${themeColorBlue};
  }
`
export const HistoryWrapperChild = styled.div`
  display: flex;
  font-weight: normal;
  flex-direction: column;
  width: 35%;
`
export const CompleteWrapper = styled.div`
  width: 100%;
  display: flex;
  padding: 20px 10px;
  margin-bottom: 10px;
  margin-top: 10px;
  font-weight: bold;
  justify-content: space-between;
`
export const MetaDataOnTable = styled.div`
  display: flex;
  color: #a0a0a0;
  font-weight: normal;
`
export const StyledParagraph = styled.p`
  margin-top: ${({ mt }) => mt};
  margin-bottom: ${({ mb }) => mb};
  margin-right: ${({ mr }) => mr};
  margin-left: ${({ ml }) => ml};
`
export const StyledDiv = styled.div`
  margin-top: ${({ mt }) => mt};
  margin-bottom: ${({ mb }) => mb};
  margin-right: ${({ mr }) => mr};
  margin-left: ${({ ml }) => ml};
`
export const StyledAnchor = styled.a`
  color: ${themeColorBlue};
  font-weight: bold;
  margin-right: 15px;
`

export const StyledButton = styled(Button)`
  color: ${themeColorBlue};
  font-weight: bold;
  border: none;
`
