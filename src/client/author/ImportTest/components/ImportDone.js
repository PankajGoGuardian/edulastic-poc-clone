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
} from '../ducks'
import {
  contentImportJobIds,
  uploadContnentStatus,
  contentImportProgressAction,
  contentImportJobsData,
  uploadContentStatusAction,
  setImportContentJobIdsAction,
  importTypeSelector,
} from '../../ContentCollections/ducks'

const ImportDone = ({
  t,
  jobsData,
  setJobIds,
  uploadTestStatus,
  status,
  jobIds,
  qtiImportProgress,
  contentImportProgress,
  history,
  location: { pathname: path },
  setUploadContnentStatus,
  setImportContentJobIds,
  importType,
}) => {
  const items = jobsData.flatMap((job) => job?.testItems || []) || []
  const testIds = jobsData.map(({ testId }) => testId)
  useEffect(() => {
    if (importType === 'qti') {
      qtiImportProgress({ jobId: jobIds })
    } else if (status !== UPLOAD_STATUS.STANDBY && jobIds.length) {
      contentImportProgress(jobIds)
    }
  }, [])

  const continueToTest = () => {
    if (path === '/author/import-content') {
      setUploadContnentStatus(UPLOAD_STATUS.INITIATE)
      setImportContentJobIds([])
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
      setImportContentJobIds([])
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
      {items.length ? (
        <StyledButton onClick={continueToTest}>Continue</StyledButton>
      ) : (
        <StyledButton onClick={handleRetry}>Retry</StyledButton>
      )}
    </div>
  )

  return (
    <FlexContainer flexDirection="column" width="65%">
      <TitleWrapper>{t('qtiimport.done.title')}</TitleWrapper>
      <List itemLayout="horizontal" loadMore={ContinueBtn}>
        <List.Item>
          <FlexContainer justifyContent="space-between" width="100%">
            <div>No of questions imported</div>
            <div>{items.length}</div>
          </FlexContainer>
        </List.Item>
        <List.Item>
          <FlexContainer justifyContent="space-between" width="100%">
            <div>No of questions skipped due to unsupported type</div>
            <div>0</div>
          </FlexContainer>
        </List.Item>
        <List.Item>
          <FlexContainer justifyContent="space-between" width="100%">
            <div>
              No of questions skipped due to incomplete question content
            </div>
            <div>0</div>
          </FlexContainer>
        </List.Item>
      </List>
    </FlexContainer>
  )
}

ImportDone.propTypes = {
  t: PropTypes.func.isRequired,
  jobsData: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => {
  const path = state?.router?.location?.pathname
  if (path === '/author/import-content') {
    return {
      jobsData: contentImportJobsData(state),
      status: uploadContnentStatus(state),
      jobIds: contentImportJobIds(state),
      importType: importTypeSelector(state),
    }
  }

  return {
    status: getUploadStatusSelector(state),
    jobIds: getJobIdsSelector(state),
    jobsData: getJobsDataSelector(state),
    importType: importTypeSelector(state),
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
