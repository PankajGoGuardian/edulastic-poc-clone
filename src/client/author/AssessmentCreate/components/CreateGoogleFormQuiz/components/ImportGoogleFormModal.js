import { IconGoogleForm } from '@edulastic/icons'
import { Col, Divider, Modal, Row, Typography } from 'antd'
import React from 'react'
import { EduButton, EduIf } from '@edulastic/common'
import { withRouter } from 'react-router'
import { lightGreen10 } from '@edulastic/colors'
import {
  FormIconWrapper,
  FormNameWrapper,
  HeadingWrapper,
  StyledCancelButton,
  StyledList,
  StyledProgress,
  ErrorMessageWrapper,
} from './styled'
import { formatIndexWithAnd } from '../utils'

const getTitle = (status) => {
  switch (status) {
    case 'INITIATED':
      return 'Loading Google Forms File'
    case 'SUCCESS':
      return 'Imported Successfully'
    case 'FAILED':
    default:
      return 'Import Failed'
  }
}
const ImportGoogleFormModal = ({
  status,
  visible,
  onCancel,
  formName,
  data,
  errorMessage,
  history,
}) => {
  const {
    test,
    metaData: {
      successCount = 0,
      itemCount = 0,
      missingAnswerItemIndexes = [],
      unsupportedItemIndexes = [],
    } = {},
  } = data || {}

  const onReview = () => {
    history.push({
      pathname: `/author/tests/tab/review/id/${test?._id}`,
      state: {
        editTestFlow: true,
      },
    })
  }
  return (
    <Modal
      visible={visible}
      centered
      onCancel={onCancel}
      closable={false}
      footer={null}
      destroyOnClose
      width="400px"
    >
      <>
        <HeadingWrapper strong>{getTitle(status)}</HeadingWrapper>
        <EduIf condition={status !== 'INITIATED'}>
          <Divider type="horizontal" />
        </EduIf>
        <Row type="flex" gutter={6}>
          <FormIconWrapper span={2}>
            <IconGoogleForm />
          </FormIconWrapper>
          <Col span={22}>
            <FormNameWrapper>{formName}</FormNameWrapper>
            <EduIf condition={status === 'SUCCESS'}>
              <StyledList>
                <li>
                  <Typography.Text>
                    {successCount} out of {itemCount} questions imported
                  </Typography.Text>
                </li>
                {!!unsupportedItemIndexes?.length && (
                  <li>
                    <Typography.Text style={{ color: '#EB9442' }}>
                      {formatIndexWithAnd(unsupportedItemIndexes, 'Q')} failed
                      to import
                    </Typography.Text>
                  </li>
                )}
                {!!missingAnswerItemIndexes?.length && (
                  <li>
                    <Typography.Text style={{ color: '#EB9442' }}>
                      {formatIndexWithAnd(missingAnswerItemIndexes, 'Q')} has no
                      answer filled
                    </Typography.Text>
                  </li>
                )}
              </StyledList>
            </EduIf>
            <EduIf condition={status === 'FAILED'}>
              <ErrorMessageWrapper>
                <Typography.Text strong style={{ color: '#EB9442' }}>
                  {errorMessage}
                </Typography.Text>
              </ErrorMessageWrapper>
            </EduIf>
          </Col>
        </Row>
        <EduIf condition={status === 'INITIATED'}>
          <StyledProgress
            percent={50}
            showInfo={false}
            status="active"
            strokeColor={lightGreen10}
          />
        </EduIf>
        <EduIf condition={status !== 'SUCCESS'}>
          <Row type="flex" justify="center" align="middle">
            <Col>
              <StyledCancelButton type="link" onClick={onCancel}>
                CANCEL
              </StyledCancelButton>
            </Col>
          </Row>
        </EduIf>
        <EduIf condition={status === 'SUCCESS'}>
          <Row type="flex" justify="end" align="middle">
            <Col>
              <EduButton type="primary" onClick={onReview}>
                REVIEW
              </EduButton>
            </Col>
          </Row>
        </EduIf>
      </>
    </Modal>
  )
}

export default withRouter(ImportGoogleFormModal)
