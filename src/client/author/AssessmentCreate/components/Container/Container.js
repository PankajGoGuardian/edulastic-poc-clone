/* eslint-disable react/prop-types */
import React from 'react'
import { withRouter } from 'react-router'
import { compose } from 'redux'
import { connect } from 'react-redux'
import qs from 'qs'
import PropTypes from 'prop-types'
import { Spin } from 'antd'
import { debounce } from 'lodash'
import {
  MainHeader,
  MainContentWrapper,
  notification,
  EduIf,
} from '@edulastic/common'

import { withNamespaces } from 'react-i18next'
import { white } from '@edulastic/colors'
import styled from 'styled-components'
import Breadcrumb from '../../../src/components/Breadcrumb'
import CreationOptions from '../CreationOptions/CreationOptions'
import DropArea from '../DropArea/DropArea'
import {
  receiveTestByIdAction,
  getTestsLoadingSelector,
} from '../../../TestPage/ducks'
import {
  createAssessmentRequestAction,
  getAssessmentCreatingSelector,
  percentageUploadedSelector,
  fileInfoSelector,
  setPercentUploadedAction,
  uploadToDriveAction,
} from '../../ducks'
import CreateVideoQuiz from '../CreateVideoQuiz/CreateVideoQuiz'

const breadcrumbStyle = {
  position: 'static',
}

const testBreadcrumbs = [
  {
    title: 'TEST',
    to: '/author/tests',
  },
  {
    title: 'Author Test',
    to: '/author/tests/select',
  },
]

const snapquizVideoBreadcrumb = {
  title: 'VideoQuiz',
  to: '',
}

const snapquizBreadcrumb = {
  title: 'Snapquiz',
  to: '',
}
const creationMethods = {
  SCRATCH: 'scratch',
  LIBRARY: 'library',
  PDF: 'pdf',
  VIDEO: 'video',
}

class Container extends React.Component {
  static propTypes = {
    createAssessment: PropTypes.func.isRequired,
    receiveTestById: PropTypes.func.isRequired,
    creating: PropTypes.bool.isRequired,
    location: PropTypes.func.isRequired,
    assessmentLoading: PropTypes.bool.isRequired,
  }

  state = {
    method: undefined,
  }

  cancelUpload

  scrollerRef = React.createRef()

  componentDidMount() {
    const { location, receiveTestById } = this.props
    const { assessmentId } = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    })

    if (assessmentId) {
      receiveTestById(assessmentId)
      this.handleSetMethod(creationMethods.PDF)()
    }
  }

  handleSetMethod = (method) => () => {
    this.setState({ method })
  }

  handleUploadProgress = (progressEvent) => {
    const { setPercentUploaded } = this.props
    const percentCompleted = Math.round(
      (progressEvent.loaded * 100) / progressEvent.total
    )
    setPercentUploaded(percentCompleted)
  }

  setCancelFn = (_cancelFn) => {
    this.cancelUpload = _cancelFn
  }

  handleUploadPDF = debounce(({ file }) => {
    const { location, createAssessment, isAddPdf = false } = this.props
    const { assessmentId } = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    })
    if (file.type !== 'application/pdf') {
      return notification({ messageKey: 'fileFormatNotSupported' })
    }
    if (file.size / 1024000 > 15) {
      return notification({ messageKey: 'fileSizeExceeds' })
    }
    createAssessment({
      file,
      assessmentId,
      progressCallback: this.handleUploadProgress,
      isAddPdf,
      cancelUpload: this.setCancelFn,
    })
  }, 1000)

  handleCreateBlankAssessment = (event) => {
    event.stopPropagation()

    const { location, createAssessment, isAddPdf } = this.props
    const { assessmentId } = qs.parse(location.search, {
      ignoreQueryPrefix: true,
    })

    createAssessment({ assessmentId, isAddPdf })
  }

  render() {
    let { method } = this.state
    const newBreadcrumb = [...testBreadcrumbs]
    const {
      creating,
      location,
      assessmentLoading,
      percentageUploaded,
      fileInfo,
      isAddPdf,
      uploadToDrive,
      t,
    } = this.props
    if (
      location &&
      location.pathname &&
      location.pathname.includes('videoquiz')
    ) {
      method = creationMethods.VIDEO
      newBreadcrumb.push(snapquizVideoBreadcrumb)

      Object.assign(breadcrumbStyle, {
        position: 'sticky',
        top: '0px',
        zIndex: 1,
        background: white,
        padding: '20px 0px',
      })
    } else if (
      location &&
      location.pathname &&
      location.pathname.includes('snapquiz')
    ) {
      method = creationMethods.PDF
      newBreadcrumb.push(snapquizBreadcrumb)
    }
    if (assessmentLoading) {
      return <Spin />
    }

    /** Todo:  should be coming from component props */
    const isVideoQuiz = location?.pathname?.includes('videoquiz')

    return (
      <>
        {creating && (
          <div
            style={{
              height: 'calc(100vh - 96px)',
              position: 'absolute',
              width: 'calc(100vw - 100px)',
              top: '96px',
              zIndex: '1',
              backgroundColor: 'transparent',
            }}
          />
        )}
        <MainHeader headingText={t('common.newTest')} />
        <MainContentWrapper
          padding={isVideoQuiz && '0px 30px 30px 30px'}
          ref={this.scrollerRef}
        >
          <Breadcrumb data={newBreadcrumb} style={breadcrumbStyle} />
          {!method && (
            <StyledCreateOptionWrapper>
              <CreationOptions />
            </StyledCreateOptionWrapper>
          )}
          {method === creationMethods.PDF && (
            <DropArea
              loading={creating}
              onUpload={this.handleUploadPDF}
              onCreateBlank={this.handleCreateBlankAssessment}
              percent={percentageUploaded}
              fileInfo={fileInfo}
              isAddPdf={isAddPdf}
              cancelUpload={this.cancelUpload}
              uploadToDrive={uploadToDrive}
            />
          )}
          <EduIf condition={method === creationMethods.VIDEO}>
            <CreateVideoQuiz scrollerRef={this.scrollerRef} />
          </EduIf>
        </MainContentWrapper>
      </>
    )
  }
}
const StyledCreateOptionWrapper = styled.div`
  padding: 16px 64px 0px 0px;
`
const enhance = compose(
  withRouter,
  withNamespaces('header'),
  connect(
    (state) => ({
      creating: getAssessmentCreatingSelector(state),
      assessmentLoading: getTestsLoadingSelector(state),
      percentageUploaded: percentageUploadedSelector(state),
      fileInfo: fileInfoSelector(state),
    }),
    {
      createAssessment: createAssessmentRequestAction,
      receiveTestById: receiveTestByIdAction,
      setPercentUploaded: setPercentUploadedAction,
      uploadToDrive: uploadToDriveAction,
    }
  )
)

export default enhance(Container)
