import styled from 'styled-components'
import {
  greyLight1,
  greyThemeDark1,
  greyThemeLight,
  themeColorBlue,
} from '@edulastic/colors'
import { IconDownload, IconNewFile } from '@edulastic/icons'
import { CSVLink } from 'react-csv'

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
  padding: 10px 25px;
  margin-bottom: 10px;
  margin-top: 10px;
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
  align-self: center;
  width: 40%;
  padding: 10px 10px;
  border: 2px solid ${greyLight1};
  margin-top: 25px;
  justify-content: space-evenly;
`
export const StyledHeading1 = styled.h3`
  font-size: 16px !important;
  font-weight: bold;
  margin-top: 0px;
  margin-bottom: 15px;
  text-align: left;
`

export const StyledIconNewFile = styled(IconNewFile)`
  position: relative;
  top: 3px;
  right: -5px;
  & > g > path {
    fill: ${themeColorBlue};
  }
`

export const StyledHeading2 = styled.h4`
  font-size: 25px !important;
  font-weight: bold;
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
  margin-right: 10px;
  & > g > path {
    fill: ${themeColorBlue};
  }
`
export const HistoryWrapper = styled.div`
  margin-top: -30px;
`
export const HistoryWrapperChild = styled.div`
  display: flex;
  font-weight: normal;
`
export const CompleteWrapper = styled.div`
  width: 100%;
  display: flex;
  padding: 10px 25px;
  margin-bottom: 10px;
  margin-top: 10px;
  font-weight: bold;
  justify-content: space-between;
`
export const MetaDataOnTable = styled.div`
  width: 35%;
  display: flex;
  justify-content: space-between;
  color: #a0a0a0;
  font-weight: normal;
`
export const StyledParagraph = styled.p`
  margin-left: 10px;
`
export const StyledDiv = styled.div`
  margin-left: 50px;
  margin-top: 5px;
`
export const StyledAnchor = styled.a`
  color: ${themeColorBlue};
  font-weight: bold;
`

export const StyledCSVLink = styled(CSVLink)`
  color: ${themeColorBlue};
  font-weight: bold;
`
