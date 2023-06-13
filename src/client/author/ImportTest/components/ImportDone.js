import { compose } from 'redux'
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { List } from 'antd'
import { withNamespaces } from '@edulastic/localization'

import { FlexContainer, StyledButton } from './styled'
import TitleWrapper from '../../AssignmentCreate/common/TitleWrapper'
import {
  getJobsDataSelector,
  UPLOAD_STATUS,
  uploadTestStatusAction,
  setJobIdsAction,
  getUploadStatusSelector,
  getJobIdsSelector,
  qtiImportProgressAction,
  getQtiFileStatusSelector,
  JOB_STATUS,
} from '../ducks'
import {
  contentImportJobIds,
  uploadContnentStatus,
  contentImportProgressAction,
  contentImportJobsData,
  uploadContentStatusAction,
  setImportContentJobIdsAction,
} from '../../ContentCollections/ducks'

const ImportDone = ({
  t,
  jobsData = [],
  setJobIds,
  uploadTestStatus,
  status,
  jobIds = [],
  qtiImportProgress,
  contentImportProgress,
  history,
  location: { pathname: path },
  setUploadContnentStatus,
  setImportContentJobIds,
  qtiFileStatus = {},
}) => {
  const jobId = Array.isArray(jobIds) ? jobIds.join() : jobIds
  const items = jobsData.flatMap((job) => job?.testItems || [])
  const testIds = jobsData.map(({ testId }) => testId)
  const isQtiImport = jobId.includes('qti')
  const totalQtiFiles = jobsData.filter((ele) => ele.type !== 'manifestation')
    .length
  const completedQtiFiles = qtiFileStatus
    ? qtiFileStatus[JOB_STATUS.COMPLETED]
    : 0

  useEffect(() => {
    if (jobId.includes('qti')) {
      qtiImportProgress({ jobId })
    } else if (status !== UPLOAD_STATUS.STANDBY && jobIds.length) {
      contentImportProgress(jobIds)
    }
  }, [])

  const continueToTest = () => {
    if (path === '/author/import-content') {
      setUploadContnentStatus(UPLOAD_STATUS.INITIATE)
      uploadTestStatus(UPLOAD_STATUS.INITIATE)
      setImportContentJobIds([])
      sessionStorage.removeItem('jobIds')
      history.push('/author/content/collections')
    } else {
      uploadTestStatus(UPLOAD_STATUS.STANDBY)
      sessionStorage.removeItem('qtiTags')
      history.push(`/author/tests/tab/review/id/${testIds[0]}`)
      setJobIds([])
    }
  }

  const handleRetry = () => {
    if (path === '/author/import-content') {
      setUploadContnentStatus(UPLOAD_STATUS.INITIATE)
      uploadTestStatus(UPLOAD_STATUS.INITIATE)
      setImportContentJobIds([])
      sessionStorage.removeItem('jobIds')
      history.push('/author/content/collections')
    } else {
      setJobIds([])
      uploadTestStatus(UPLOAD_STATUS.STANDBY)
      sessionStorage.removeItem('qtiTags') // TODO: what it does
    }
  }

  const ContinueBtn = (
    <div
      style={{
        textAlign: 'center',
        marginTop: 12,
        height: 32,
        lineHeight: '32px',
      }}
    >
      {items.length || completedQtiFiles === totalQtiFiles ? (
        <StyledButton onClick={continueToTest}>Continue</StyledButton>
      ) : (
        <StyledButton onClick={handleRetry}>Retry</StyledButton>
      )}
    </div>
  )

  return (
    <FlexContainer flexDirection="column" width="65%">
      <TitleWrapper>{t('qtiimport.done.title')}</TitleWrapper>
      {isQtiImport && (
        <p style={{ textAlign: 'center', marginBottom: 30 }}>
          Import reference: <b>{jobId}</b>
        </p>
      )}
      {jobsData.length > 0 && (
        <List itemLayout="horizontal" loadMore={ContinueBtn}>
          <List.Item>
            <FlexContainer justifyContent="space-between" width="100%">
              <div>No of questions imported</div>
              <div>
                {isQtiImport
                  ? qtiFileStatus[JOB_STATUS.COMPLETED] || 0
                  : items.length}
              </div>
            </FlexContainer>
          </List.Item>
          <List.Item>
            <FlexContainer justifyContent="space-between" width="100%">
              <div>No of questions skipped due to unsupported type</div>
              <div>
                {isQtiImport ? qtiFileStatus[JOB_STATUS.UNSUPPORTED] || 0 : '0'}
              </div>
            </FlexContainer>
          </List.Item>
          <List.Item>
            <FlexContainer justifyContent="space-between" width="100%">
              <div>
                No of questions skipped due to incomplete question content
              </div>
              <div>
                {isQtiImport
                  ? (qtiFileStatus[JOB_STATUS.INVALID] || 0) +
                    (qtiFileStatus[JOB_STATUS.ERROR] || 0)
                  : '0'}
              </div>
            </FlexContainer>
          </List.Item>
        </List>
      )}
    </FlexContainer>
  )
}

ImportDone.propTypes = {
  t: PropTypes.func.isRequired,
  jobsData: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => {
  const path = state?.router?.location?.pathname
  const jobIds = contentImportJobIds(state)
  const jobId = Array.isArray(jobIds) ? jobIds.join() : jobIds
  if (path === '/author/import-content' && !jobId.includes('qti')) {
    return {
      jobsData: contentImportJobsData(state),
      status: uploadContnentStatus(state),
      jobIds: contentImportJobIds(state),
    }
  }

  return {
    status: getUploadStatusSelector(state),
    jobIds: getJobIdsSelector(state),
    jobsData: getJobsDataSelector(state),
    qtiFileStatus: getQtiFileStatusSelector(state),
  }
}

export default compose(
  withNamespaces('qtiimport'),
  withRouter,
  connect(mapStateToProps, {
    uploadTestStatus: uploadTestStatusAction,
    setJobIds: setJobIdsAction,
    qtiImportProgress: qtiImportProgressAction,
    contentImportProgress: contentImportProgressAction,
    setUploadContnentStatus: uploadContentStatusAction,
    setImportContentJobIds: setImportContentJobIdsAction,
  })
)(ImportDone)
