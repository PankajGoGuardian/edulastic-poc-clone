import React, { useEffect } from 'react'
import { withNamespaces } from '@edulastic/localization'
import { Spin, List } from 'antd'
import PropTypes from 'prop-types'
// import useInterval from '@use-it/interval'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { compose } from 'redux'
import TitleWrapper from '../../AssignmentCreate/common/TitleWrapper'
import TextWrapper from '../../AssignmentCreate/common/TextWrapper'
import { FlexContainer, StyledButton } from './styled'
import {
  qtiImportProgressAction,
  UPLOAD_STATUS,
  getIsSuccessSelector,
  getErrorDetailsSelector,
  getSuccessMessageSelector,
  getJobIdsSelector,
  getUploadStatusSelector,
  setJobIdsAction,
  uploadTestStatusAction,
  getIsImportingselector,
  JOB_STATUS,
  getJobsDataSelector,
  getQtiFileStatusSelector,
  setJobsDataAction,
} from '../ducks'
import {
  contentImportJobIds,
  importingLoaderSelector,
  contentImportSuccessMessage,
  contentImportError,
  uploadContnentStatus,
  contentImportProgressAction,
  isContentImportSuccess,
  uploadContentStatusAction,
  setImportContentJobIdsAction,
  importTypeSelector,
} from '../../ContentCollections/ducks'

let interval

const ImportInprogress = ({
  t,
  qtiImportProgress,
  jobIds,
  status,
  successMessage,
  isSuccess,
  errorDetails,
  uploadTestStatus,
  setJobIds,
  isImporting,
  contentImportProgress,
  location: { pathname: path },
  setUploadContnentStatus,
  setImportContentJobIds,
  setJobsData,
  history,
  importType,
  jobsData,
  qtiFileStatus = {},
}) => {
  const checkProgress = () => {
    const jobId = Array.isArray(jobIds) ? jobIds.join() : jobIds
    if (jobId.includes('qti') && jobIds.length) {
      if (
        jobsData.length === 0 ||
        jobsData.some((job) =>
          [JOB_STATUS.INITIATED, JOB_STATUS.IN_PROGRESS].includes(job.status)
        )
      ) {
        qtiImportProgress({ jobId: jobIds, interval })
      }
    } else if (status !== UPLOAD_STATUS.STANDBY && jobIds.length) {
      contentImportProgress(jobIds)
    }
  }

  // TODO: need to handle
  const handleRetry = () => {
    if (path === '/author/import-content') {
      setUploadContnentStatus(UPLOAD_STATUS.INITIATE)
      uploadTestStatus(UPLOAD_STATUS.INITIATE)
      setJobsData([])
      setImportContentJobIds([])
      sessionStorage.removeItem('jobIds')
      history.push('/author/content/collections')
    } else {
      setJobIds([])
      uploadTestStatus(UPLOAD_STATUS.STANDBY)
      sessionStorage.removeItem('qtiTags')
    }
  }

  useEffect(() => {
    interval = setInterval(() => {
      checkProgress()
    }, 1000 * 5)
  }, [jobIds])

  const isQtiImport = importType === 'qti'
  const totalQtiFiles = jobsData.filter((ele) => ele.type !== 'manifestation')
    .length

  return (
    <FlexContainer flexDirection="column" alignItems="column" width="50%">
      <Spin size="large" />
      <TitleWrapper>{t('qtiimport.importinprogress.title')}</TitleWrapper>
      <TextWrapper
        style={{ color: isSuccess ? 'green' : 'red', fontWeight: 'bold' }}
      >
        {isSuccess
          ? successMessage
          : errorDetails?.message || 'Importing Failed retry'}
        {!isSuccess && (
          <p>
            <StyledButton position="relative" onClick={handleRetry}>
              {t('qtiimport.uploadpage.retry')}
            </StyledButton>
          </p>
        )}
      </TextWrapper>
      <TextWrapper>
        {isQtiImport
          ? jobIds.length
            ? `Import reference: ${jobIds}`
            : ''
          : path === '/author/import-test'
          ? isImporting
            ? t('qtiimport.importinprogress.description')
            : 'Please stay on the screen while we are unzipping your files'
          : 'Files are being processed'}
      </TextWrapper>
      {isQtiImport && (
        <List itemLayout="horizontal">
          <List.Item>
            <FlexContainer justifyContent="space-between" width="100%">
              <div>Total no of questions</div>
              <div>{totalQtiFiles || 0}</div>
            </FlexContainer>
          </List.Item>
          <List.Item>
            <FlexContainer justifyContent="space-between" width="100%">
              <div>No of questions is processing</div>
              <div>{qtiFileStatus[JOB_STATUS.INITIATED] || 0}</div>
            </FlexContainer>
          </List.Item>
          <List.Item>
            <FlexContainer justifyContent="space-between" width="100%">
              <div>No of questions completed</div>
              <div>{qtiFileStatus[JOB_STATUS.COMPLETED] || 0}</div>
            </FlexContainer>
          </List.Item>
          <List.Item>
            <FlexContainer justifyContent="space-between" width="100%">
              <div>No of questions failed</div>
              <div>
                {totalQtiFiles -
                  qtiFileStatus[JOB_STATUS.COMPLETED] -
                  qtiFileStatus[JOB_STATUS.INITIATED] || 0}
              </div>
            </FlexContainer>
          </List.Item>
        </List>
      )}
    </FlexContainer>
  )
}

ImportInprogress.propTypes = {
  t: PropTypes.func.isRequired,
}

const mapStateToProps = (state) => {
  const path = state?.router?.location?.pathname || ''
  const jobIds = contentImportJobIds(state)
  const jobId = Array.isArray(jobIds) ? jobIds.join() : jobIds
  if (path === '/author/import-content' && !jobId.includes('qti')) {
    return {
      status: uploadContnentStatus(state),
      jobIds: contentImportJobIds(state),
      successMessage: contentImportSuccessMessage(state),
      isSuccess: isContentImportSuccess(state),
      errorDetails: contentImportError(state),
      isImporting: importingLoaderSelector(state),
      jobsData: getJobsDataSelector(state),
      importType: importTypeSelector(state),
    }
  }

  return {
    jobIds: getJobIdsSelector(state),
    status: getUploadStatusSelector(state),
    successMessage: getSuccessMessageSelector(state),
    isSuccess: getIsSuccessSelector(state),
    errorDetails: getErrorDetailsSelector(state),
    isImporting: getIsImportingselector(state),
    jobsData: getJobsDataSelector(state),
    importType: importTypeSelector(state),
    qtiFileStatus: getQtiFileStatusSelector(state),
  }
}

const enhancedComponent = compose(
  withNamespaces('qtiimport'),
  withRouter,
  connect(mapStateToProps, {
    qtiImportProgress: qtiImportProgressAction,
    setJobIds: setJobIdsAction,
    uploadTestStatus: uploadTestStatusAction,
    uploadContentStatus: uploadTestStatusAction,
    contentImportProgress: contentImportProgressAction,
    setUploadContnentStatus: uploadContentStatusAction,
    setImportContentJobIds: setImportContentJobIdsAction,
    setJobsData: setJobsDataAction,
  })
)

export default enhancedComponent(ImportInprogress)
