import { EduButton, FlexContainer } from '@edulastic/common'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get } from 'lodash'
import {
  ContentWrapper,
  SettingsWrapper,
  StyledContent,
  StyledHeading1,
  StyledLayout,
  StyledRow,
} from '../../../../admin/Common/StyledComponents/settingsContent'
import {
  SpinContainer,
  StyledSpin,
} from '../../../../admin/Common/StyledComponents'
import AdminHeader from '../../../src/components/common/AdminHeader/AdminHeader'
import AdminSubHeader from '../../../src/components/common/AdminSubHeader/SettingSubHeader'
import CsvUploadButton from '../CsvUploadButton'
import LastUploadTable from '../LastUploadTable'
import { uploadFilesRequestAction } from '../../ducks'

const title = 'Manage District'
const menuActive = { mainMenu: 'Settings', subMenu: 'Roster Import' }

const RosterImport = ({ history, uploadFilesRequest, loading }) => {
  const [filesToUpload, setFilesToUpload] = useState([])
  const addFileToUploads = (file) => {
    setFilesToUpload([...filesToUpload, file])
  }

  const uploadFiles = () => {
    uploadFilesRequest(filesToUpload)
  }

  return (
    <SettingsWrapper>
      <AdminHeader title={title} active={menuActive} history={history} />
      <StyledContent>
        <StyledLayout>
          <AdminSubHeader active={menuActive} history={history} />
          {loading && (
            <SpinContainer loading={loading}>
              <StyledSpin size="large" />
            </SpinContainer>
          )}
          <ContentWrapper>
            <StyledRow>
              <StyledHeading1>Roster Import</StyledHeading1>
              <p>
                You can upload roster data securely by attaching the
                corresponding CSV files below.
              </p>
              <FlexContainer justifyContent="flex-start">
                <CsvUploadButton
                  title="Upload Schools CSV"
                  addFileToUploads={addFileToUploads}
                />
                <CsvUploadButton
                  title="Upload Teachers CSV"
                  addFileToUploads={addFileToUploads}
                />
                <CsvUploadButton
                  title="Upload Students CSV"
                  addFileToUploads={addFileToUploads}
                />
              </FlexContainer>
              <FlexContainer justifyContent="flex-start" marginBottom="20px">
                <CsvUploadButton
                  title="Upload Sections CSV"
                  addFileToUploads={addFileToUploads}
                />
                <CsvUploadButton
                  title="Upload Enrollments CSV"
                  addFileToUploads={addFileToUploads}
                />
                <CsvUploadButton
                  title="Upload Courses CSV"
                  addFileToUploads={addFileToUploads}
                />
              </FlexContainer>
              <EduButton onClick={uploadFiles}>Import</EduButton>
            </StyledRow>
            <LastUploadTable />
          </ContentWrapper>
        </StyledLayout>
      </StyledContent>
    </SettingsWrapper>
  )
}

const enhance = compose(
  connect(
    (state) => ({
      loading: get(state, ['rosterImportReducer', 'loading'], false),
    }),
    {
      uploadFilesRequest: uploadFilesRequestAction,
    }
  )
)

export default enhance(RosterImport)
