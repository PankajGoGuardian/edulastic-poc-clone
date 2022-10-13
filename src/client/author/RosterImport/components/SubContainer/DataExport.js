import { connect } from 'react-redux'
import React from 'react'
import {
  LeftWrapper,
  DownloadFileAndInstructions,
  DownloadCsv,
  StyledHeading1,
} from './styled'
import { RosterDataWrapper, UploadDragger } from '../Container/styled'
import { IconDownload, IconCloudUpload } from '@edulastic/icons'
import { greyThemeDark1, themeColorBlue, themeColor } from '@edulastic/colors'

import {
  Container,
  ButtonsContainer,
  RoundedButton,
} from '../../../../author/AssessmentCreate/components/CreateBlank/styled.js'

const RosterData = () => {
  const onUpload = () => {
    return 'uploaded'
  }
  const creating = () => {
    return 'creating'
  }

  return (
    <RosterDataWrapper>
      <LeftWrapper>
        <div>
          <StyledHeading1>Roster Data</StyledHeading1>
          <p>
            You can import data securely by attaching CSV files within a zip
            file format.
          </p>
        </div>
        <DownloadFileAndInstructions>
          <p color={themeColorBlue}>
            downloads example files
            <IconDownload color={themeColor} />
          </p>
          <p>view instructions</p>
        </DownloadFileAndInstructions>
      </LeftWrapper>
      <DownloadCsv>
        <p>ADD ROSTER DATA IN CSV FILES WITHIN A ZIP FILE FORMAT</p>
        <ButtonsContainer width="180px">
          <UploadDragger
            UploadDragger
            name="file"
            onChange={onUpload}
            disabled={creating}
            beforeUpload={() => false}
            accept=".pdf"
          >
            <div data-cy="uploadPdfFromFiles">
              <IconCloudUpload color={greyThemeDark1} />
            </div>
          </UploadDragger>
        </ButtonsContainer>
      </DownloadCsv>
    </RosterDataWrapper>
  )
}

export default connect(() => ({}), {})(RosterData)
