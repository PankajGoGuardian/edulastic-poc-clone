import { compose } from 'redux'
import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { List, Col, Row } from 'antd'
import { withNamespaces } from '@edulastic/localization'

import { FlexContainer, StyledButton } from './styled'
import TitleWrapper from '../../AssignmentCreate/common/TitleWrapper'
import {
  getJobsDataSelector,
  UPLOAD_STATUS,
  getUploadStatusSelector,
  getJobIdsSelector,
  qtiImportProgressAction,
  getQtiFileStatusSelector,
  JOB_STATUS,
  resetStateAction,
} from '../ducks'
import { contentImportProgressAction } from '../../ContentCollections/ducks'

const ImportDone = ({
  t,
  jobsData = [],
  status,
  jobIds = [],
  qtiImportProgress,
  contentImportProgress,
  history,
  location: { pathname: path },
  resetData,
  qtiFileStatus = {},
}) => {
  const jobId = Array.isArray(jobIds) ? jobIds.join() : jobIds
  const items = jobsData.flatMap((job) => job?.testItems || [])
  const manifestFileData = jobsData.find((ele) => ele.type === 'manifestation')
  const isQtiImport = jobId.includes('qti')
  const totalQtiFiles = jobsData.filter((ele) => ele.type !== 'manifestation')
    .length
  const completedQtiFiles = qtiFileStatus
    ? qtiFileStatus[JOB_STATUS.COMPLETED]
    : 0

  useEffect(() => {
    if (jobId.includes('qti') && !jobsData.length) {
      qtiImportProgress({ jobId })
    } else if (jobId && status !== UPLOAD_STATUS.STANDBY && !jobsData.length) {
      contentImportProgress({ jobIds })
    }
    // FIXME: Remove Polling and use firestore db / IOT messages to get the latest status of Import from server
    // Checking maifest file exits
    if (manifestFileData) {
      // Calling qti import progress in interval till it is not postprocessed.
      const interval = setInterval(() => {
        if (jobId.includes('qti') && !manifestFileData.postProcessed) {
          qtiImportProgress({ jobId })
        } else {
          clearInterval(interval)
        }
      }, 1000)
    }
  }, [jobsData])

  const continueToTest = () => {
    resetData()
    sessionStorage.removeItem('jobIds')
    sessionStorage.removeItem('testUploadStatus')
    if (path === '/author/import-content') {
      history.push('/author/content/collections')
    } else {
      sessionStorage.removeItem('qtiTags')
      if (manifestFileData?.testIds?.length)
        history.push(
          `/author/tests/tab/review/id/${manifestFileData?.testIds[0]}`
        )
      else if (jobsData && jobsData?.[0].testId)
        history.push(`/author/tests/tab/review/id/${jobsData?.[0].testId}`)
    }
  }

  const handleRetry = () => {
    resetData()
    sessionStorage.removeItem('jobIds')
    sessionStorage.removeItem('testUploadStatus')
    if (path === '/author/import-content') {
      history.push('/author/content/collections')
    } else {
      sessionStorage.removeItem('qtiTags')
    }
  }

  const ContinueBtn = (
    <Row
      type="flex"
      align="middle"
      gutter={[0, 20]}
      style={{ flexDirection: 'column', marginTop: 20 }}
    >
      <Col span={12}>
        <Row type="flex" justify="center">
          {jobId.includes('qti') ? (
            <Row type="flex" justify="center" gutter={[20, 20]}>
              <Col>
                {manifestFileData?.testIds?.length && (
                  <StyledButton onClick={continueToTest}>
                    View Test
                  </StyledButton>
                )}
              </Col>
              <Col>
                {completedQtiFiles !== totalQtiFiles && (
                  <StyledButton onClick={handleRetry}>
                    Retry Import
                  </StyledButton>
                )}
              </Col>
            </Row>
          ) : items.length ? (
            <StyledButton onClick={continueToTest}>View Test</StyledButton>
          ) : (
            <StyledButton onClick={handleRetry}>Retry Import</StyledButton>
          )}
        </Row>
      </Col>
      <Col>
        {manifestFileData?.postProcessed &&
          completedQtiFiles > 0 &&
          !manifestFileData?.testIds?.length && (
            <p>
              QTI imported items are in the{' '}
              <a href="author/items/filter/by-me">item library</a> under
              <b>Created by me</b> filter
            </p>
          )}
      </Col>
    </Row>
  )

  return (
    <FlexContainer flexDirection="column" width="65%">
      <TitleWrapper>{t('qtiimport.done.title')}</TitleWrapper>
      {isQtiImport && (
        <p style={{ textAlign: 'center', marginBottom: 30 }}>
          Import reference: <b>{jobId}</b>
        </p>
      )}
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
    </FlexContainer>
  )
}

ImportDone.propTypes = {
  t: PropTypes.func.isRequired,
  jobsData: PropTypes.object.isRequired,
}

const mapStateToProps = (state) => {
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
    qtiImportProgress: qtiImportProgressAction,
    contentImportProgress: contentImportProgressAction,
    resetData: resetStateAction,
  })
)(ImportDone)
