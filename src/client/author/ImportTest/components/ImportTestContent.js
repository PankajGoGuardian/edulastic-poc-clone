import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { withNamespaces } from '@edulastic/localization'
import { withRouter } from 'react-router'
import BreadCrumb from '../../src/components/Breadcrumb'
import { ContentWrapper, StyledContent } from './styled'
import UploadTest from './UploadTest'
import ImportInprogress from './ImportInProgress'
import ImportDone from './ImportDone'
import {
  uploadTestStatusAction,
  setJobIdsAction,
  qtiImportProgressAction,
  UPLOAD_STATUS,
} from '../ducks'
import {
  setImportContentJobIdsAction,
  uploadContentStatusAction,
} from '../../ContentCollections/ducks'

const ImportTestContent = ({
  uploadTestStatus,
  setJobIds,
  status,
  location: { pathname },
  setContentImportJobIds,
  uploadContnentStatus,
  history,
}) => {
  const intervalRef = useRef(null)
  useEffect(() => {
    const currentStatus = sessionStorage.getItem('testUploadStatus')
    const sessionJobs = sessionStorage.getItem('jobIds')
    if (currentStatus) {
      if (pathname === '/author/import-content') {
        setContentImportJobIds(sessionJobs ? JSON.parse(sessionJobs) : [])
        uploadContnentStatus(currentStatus)
        setJobIds(sessionJobs ? JSON.parse(sessionJobs) : [])
      } else {
        uploadTestStatus(currentStatus) // upload progress
        setJobIds(sessionJobs ? JSON.parse(sessionJobs) : [])
      }
    }
  }, [])
  const breadcrumbData =
    pathname === '/author/import-content'
      ? [
          {
            title: 'MANAGE DISTRICT',
            to: '/author/content/collections',
          },
          {
            title: 'IMPORT CONTENT',
            to: '',
          },
        ]
      : [
          {
            title: 'RECENT ASSIGNMENTS',
            to: '/author/assignments',
          },
          {
            title: 'IMPORT TEST',
            to: '',
          },
        ]

  const getComponentBySatus = () => {
    const path = pathname
    if (status === UPLOAD_STATUS.STANDBY && path === '/author/import-content') {
      history.push('/author/content/collections')
      return null
    }

    switch (true) {
      case status === UPLOAD_STATUS.STANDBY:
        return <UploadTest />
      case status === UPLOAD_STATUS.INITIATE:
        return <ImportInprogress intervalRef={intervalRef} />
      case status === UPLOAD_STATUS.DONE:
        return <ImportDone />
      default:
        return <UploadTest />
    }
  }

  return (
    <ContentWrapper>
      <BreadCrumb
        data={breadcrumbData}
        style={{
          position: 'static',
          padding: '10px',
        }}
      />

      <StyledContent status={status}>{getComponentBySatus()}</StyledContent>
    </ContentWrapper>
  )
}

ImportTestContent.propTypes = {
  status: PropTypes.string.isRequired,
}

const mapStateToProps = (state) => {
  if (
    state?.router?.location?.pathname === '/author/import-content' &&
    state.collectionsReducer.type !== 'qti'
  ) {
    const { collectionsReducer } = state
    return { status: collectionsReducer?.status || '' }
  }
  const {
    admin: { importTest },
  } = state
  return { status: importTest.status }
}

export default withNamespaces('qtiimport')(
  withRouter(
    connect(mapStateToProps, {
      uploadTestStatus: uploadTestStatusAction,
      setJobIds: setJobIdsAction,
      setContentImportJobIds: setImportContentJobIdsAction,
      qtiImportProgress: qtiImportProgressAction,
      uploadContnentStatus: uploadContentStatusAction,
    })(ImportTestContent)
  )
)
