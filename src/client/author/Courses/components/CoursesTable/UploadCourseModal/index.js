import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get } from 'lodash'
import { CSVLink } from 'react-csv'

import { Icon } from 'antd'
import {
  uploadCSVAction,
  removeCourseOfUploadedAction,
  setUpdateModalPageStatusAction,
  saveBulkCourseRequestAction,
} from '../../../ducks'

import {
  StyledModal,
  StyledUploadBtn,
  StyledUploadCSVDiv,
  SuccessIcon,
  AlertIcon,
  ConfirmP,
  SuccessP,
  AlertP,
  UploadedContent,
  StyledSpin,
  StyledTable,
  StyledTableButton,
  StyledConfirmButton,
  AlertSuccess,
  StyledAlert,
  StatusDiv,
} from './styled'

const UPLOAD_FILE_TEMPLATE_ERROR =
  'Template format incorrect. Please check the sample template, to know the exact format.'
const UPLOAD_FILE_UNSUPPORTED_FORMAT_ERROR = 'Unsupported file format'

class UploadCourseModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      alertMsgStr: '',
    }

    this.columns = []
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      dataSource: nextProps.uploadedCSVData,
    }
  }

  handleDeleteCourse = (key) => {
    this.props.removeSelectedCourse(key)
  }

  onCloseModal = () => {
    this.props.closeModal()
  }

  onUploadCSV = () => {
    this.inputElement.click()
  }

  handleCSVChange = (event) => {
    const { uploadCSVCourse, setPageStatus } = this.props
    const file = event.target.files[0]
    if (file.type === 'text/csv' || file.name.indexOf('.csv') !== -1) {
      const fileReader = new FileReader()
      const scope = this

      fileReader.onload = (fileLoadedEvent) => {
        const textFromFileLoaded = fileLoadedEvent.target.result
        const lineArr = textFromFileLoaded.split('\n')
        const headerArr = lineArr[0].split(',')
        if (
          headerArr.length === 2 &&
          (headerArr[0] === `"course_id"` || headerArr[0] === `'course_id'`) &&
          (headerArr[1] === `"course_name"` || headerArr[1] === `'course_name'`)
        ) {
          uploadCSVCourse(file)
        } else {
          setPageStatus('upload-novalidate-csv')
          scope.setState({ alertMsgStr: UPLOAD_FILE_TEMPLATE_ERROR })
        }
      }

      fileReader.readAsText(file, 'UTF-8')
    } else {
      setPageStatus('upload-novalidate-csv')
      this.setState({ alertMsgStr: UPLOAD_FILE_UNSUPPORTED_FORMAT_ERROR })
    }
  }

  uploadCourse = () => {
    const uploadBulkCourseData = []
    for (let i = 0; i < this.state.dataSource.length; i++) {
      uploadBulkCourseData.push({
        number: this.state.dataSource[i].courseNo,
        name: this.state.dataSource[i].courseName,
      })
    }
    const { uploadBulkCourse, searchData } = this.props
    uploadBulkCourse({ uploadBulkCourseData, searchData })
  }

  goBackUpload = () => {
    this.props.setPageStatus('normal')
  }

  render() {
    const { modalVisible, pageStatus, savingBulkCourse, t } = this.props
    const { dataSource, alertMsgStr } = this.state

    if (pageStatus === 'uploaded') {
      this.columns = [
        {
          title: t('course.courseid'),
          dataIndex: 'courseNo',
          render: (text, record) => {
            return (
              <>
                <StyledTableButton
                  onClick={() => this.handleDeleteCourse(record.key)}
                >
                  <Icon type="delete" theme="twoTone" />
                </StyledTableButton>
                {record.courseNo}
              </>
            )
          },
        },
        {
          title: t('course.coursename'),
          dataIndex: 'courseName',
        },
        {
          title: t('course.status'),
          dataIndex: 'status',
          render: (text, record) => {
            return (
              <>
                {record.status === 'success' ? (
                  <StatusDiv>
                    <SuccessIcon type="check-circle" />
                    <SuccessP>{record.status}</SuccessP>
                  </StatusDiv>
                ) : (
                  <StatusDiv>
                    <AlertIcon type="close-circle" />
                    <AlertP>{record.statusMessage}</AlertP>
                  </StatusDiv>
                )}
              </>
            )
          },
        },
      ]
    } else if (pageStatus === 'bulk-success') {
      this.columns = [
        {
          title: t('course.coursename'),
          dataIndex: 'courseName',
        },
        {
          title: t('course.status'),
          dataIndex: 'status',
          render: (text, record) => {
            return <p>{t('course.uploadcoursemodal.coursecreated')}</p>
          },
        },
      ]
    }

    const columns = this.columns.map((col) => {
      return {
        ...col,
      }
    })

    let isError = false
    for (let i = 0; i < dataSource.length; i++) {
      if (dataSource[i].status === 'error') isError = true
    }

    let modalFooter = [
      <p>{t('course.uploadcoursemodal.templatetxt')}</p>,
      <CSVLink
        filename="courseUploadTemplate.csv"
        data={[{ course_id: '', course_name: '' }]}
      >
        <Icon type="download" />{' '}
        {t('course.uploadcoursemodal.downloadtemplate')}
      </CSVLink>,
    ]
    if (pageStatus === 'uploaded') {
      modalFooter = [
        <StyledConfirmButton
          type="primary"
          onClick={this.uploadCourse}
          disabled={isError || dataSource.length == 0}
        >
          {t('course.uploadcoursemodal.correctformat')}
        </StyledConfirmButton>,
        <StyledConfirmButton onClick={this.goBackUpload}>
          {t('course.uploadcoursemodal.uploadnew')}
        </StyledConfirmButton>,
      ]
    } else if (pageStatus === 'bulk-success') {
      modalFooter = [
        <StyledConfirmButton onClick={this.goBackUpload}>
          {t('course.uploadcoursemodal.uploadagain')}
        </StyledConfirmButton>,
        <StyledConfirmButton type="primary" onClick={this.onCloseModal}>
          Done
        </StyledConfirmButton>,
      ]
    } else if (pageStatus === 'upload-novalidate-csv') {
      modalFooter = [
        <StyledConfirmButton onClick={this.goBackUpload}>
          {t('course.uploadcoursemodal.uploadagain')}
        </StyledConfirmButton>,
      ]
    }

    return (
      <StyledModal
        visible={modalVisible}
        title={t('course.uploadcourse')}
        onCancel={this.onCloseModal}
        maskClosable={false}
        width="840px"
        footer={modalFooter}
      >
        {(pageStatus === 'normal' || pageStatus === 'uploading') && (
          <>
            <StyledUploadBtn
              type="primary"
              ghost
              onClick={this.onUploadCSV}
              disabled={pageStatus !== 'normal'}
            >
              <Icon type="upload" />
              <p>{t('course.uploadcourse')}</p>
            </StyledUploadBtn>
            <StyledUploadCSVDiv>
              <input
                ref={(input) => (this.inputElement = input)}
                type="file"
                onChange={this.handleCSVChange}
                accept=".csv"
              />
            </StyledUploadCSVDiv>
            <StyledSpin isVisible={pageStatus === 'uploading'} size="large" />
          </>
        )}

        {pageStatus === 'upload-novalidate-csv' && (
          <UploadedContent>
            <StyledAlert message={alertMsgStr} type="error" />
          </UploadedContent>
        )}

        {(pageStatus === 'uploaded' || pageStatus === 'bulk-success') && (
          <UploadedContent isBulkSuccess={pageStatus === 'bulk-success'}>
            {pageStatus === 'uploaded' && (
              <>
                <ConfirmP>
                  {t('course.uploadcoursemodal.confirmformat')}
                </ConfirmP>
                {isError ? (
                  <AlertP>
                    {t('course.uploadcoursemodal.ensurecorrectinfo')}
                  </AlertP>
                ) : (
                  <AlertP>{t('course.uploadcoursemodal.ensureinfo1')}</AlertP>
                )}
              </>
            )}
            {pageStatus === 'bulk-success' && (
              <AlertSuccess>
                {dataSource.length}{' '}
                {t('course.uploadcoursemodal.uploadsuccess')}
              </AlertSuccess>
            )}
            <StyledTable
              dataSource={dataSource}
              columns={columns}
              pagination={false}
            />
            <StyledSpin isVisible={savingBulkCourse} size="large" />
          </UploadedContent>
        )}
      </StyledModal>
    )
  }
}

const enhance = compose(
  connect(
    (state) => ({
      uploadedCSVData: get(state, ['coursesReducer', 'uploadCSV'], []),
      pageStatus: get(
        state,
        ['coursesReducer', 'uploadModalPageStatus'],
        'normal'
      ),
      savingBulkCourse: get(
        state,
        ['courseReducer', 'saveingBulkCourse'],
        false
      ),
    }),
    {
      uploadCSVCourse: uploadCSVAction,
      removeSelectedCourse: removeCourseOfUploadedAction,
      setPageStatus: setUpdateModalPageStatusAction,
      uploadBulkCourse: saveBulkCourseRequestAction,
    }
  )
)

export default enhance(UploadCourseModal)
