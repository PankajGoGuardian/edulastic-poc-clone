import { connect } from 'react-redux'
import React from 'react'
import { IconCloudUpload } from '@edulastic/icons'
import {
  greyThemeDark1,
  themeColorBlue,
  themeColor,
  borderGrey,
} from '@edulastic/colors'
import styled from 'styled-components'
import { Progress } from 'antd'
import {
  LeftWrapper,
  DownloadFileAndInstructions,
  DownloadCsv,
  StyledHeading1,
  StyledParagraph,
  StyledDownloadIcon,
  StyledIconPDFFile,
  StyledAnchor,
} from './styled'
import { RosterDataWrapper } from '../Container/styled'

const RosterData = ({ isFileUploading, uploadProgress }) => {
  return (
    <RosterDataWrapper>
      <LeftWrapper>
        <div>
          <StyledHeading1>Roster Data</StyledHeading1>
          <StyledParagraph>
            You can import data securely by attaching CSV files within a zip
            file format.
          </StyledParagraph>
        </div>
        <DownloadFileAndInstructions>
          <p color={themeColorBlue}>
            <StyledAnchor>
              <span> Downloads example files </span>
              <StyledDownloadIcon color={themeColor} />
            </StyledAnchor>
          </p>
          <p>
            <StyledAnchor>
              <span>View instructions</span> <StyledIconPDFFile />{' '}
            </StyledAnchor>
          </p>
        </DownloadFileAndInstructions>
      </LeftWrapper>
      <DownloadCsv>
        {isFileUploading ? (
          <StyledProgress percent={uploadProgress} />
        ) : (
          <>
            <p>ADD ROSTER DATA IN CSV FILES WITHIN A ZIP FILE FORMAT</p>
            <IconCloudUpload
              data-cy="uploadPdfFromFiles"
              color={greyThemeDark1}
              style={{ minWidth: '24px', minHeight: '24px' }}
            />
          </>
        )}
      </DownloadCsv>
    </RosterDataWrapper>
  )
}

export default connect(() => ({}), {})(RosterData)

const StyledProgress = styled(Progress)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  .ant-progress-inner {
    border-radius: 0px;
  }
  .ant-progress-bg {
    border-radius: 0px;
    height: 15px !important;
  }
  .ant-progress-inner {
    background: ${borderGrey};
  }
`
