import React, { useRef, useEffect } from 'react'
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
  status,
  location: { pathname },
  history,
  uploadTestStatus,
}) => {
  const intervalRef = useRef(null)

  useEffect(() => {
    // When jobIds doesn't exist in session updating status to standby.
    const jobIds = JSON.parse(sessionStorage.getItem('jobIds'))
    if (!jobIds?.length) {
      uploadTestStatus(UPLOAD_STATUS.STANDBY)
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
