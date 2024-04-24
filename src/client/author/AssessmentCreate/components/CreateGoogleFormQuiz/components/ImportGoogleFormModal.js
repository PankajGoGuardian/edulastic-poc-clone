import { IconGoogleForm } from '@edulastic/icons'
import { Col, Divider, Modal, Row, Typography } from 'antd'
import React from 'react'
import { EduButton, EduElse, EduIf, EduThen } from '@edulastic/common'
import { withRouter } from 'react-router'
import { lightGreen10 } from '@edulastic/colors'
import {
  FormIconWrapper,
  FormNameWrapper,
  HeadingWrapper,
  StyledCancelButton,
  StyledList,
  StyledProgress,
  MessageWrapper,
  StyledListItem,
} from './styled'
import { formatIndexWithAnd } from '../utils'

const warnColor = '#EB9442'

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
      maskClosable={false}
      onCancel={onCancel}
      closable={false}
      footer={null}
      destroyOnClose
      width="540px"
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
              <EduIf
                condition={
                  !unsupportedItemIndexes?.length &&
                  !missingAnswerItemIndexes?.length
                }
              >
                <EduThen>
                  <MessageWrapper>
                    <Typography.Paragraph strong style={{ color: 'black' }}>
                      {successCount} out of {itemCount} questions imported.
                      Review all items before publishing test.
                    </Typography.Paragraph>
                  </MessageWrapper>
                </EduThen>
                <EduElse>
                  <StyledList>
                    <li>
                      <Typography.Text>
                        {successCount} out of {itemCount} questions imported.
                      </Typography.Text>
                    </li>
                    {!!unsupportedItemIndexes?.length && (
                      <StyledListItem color={warnColor}>
                        <Typography.Text style={{ color: warnColor }}>
                          {formatIndexWithAnd(unsupportedItemIndexes, 'Q')} from
                          Google Form failed to import. Please review these
                          questions and try importing again.
                        </Typography.Text>
                      </StyledListItem>
                    )}
                    {!!missingAnswerItemIndexes?.length && (
                      <StyledListItem color={warnColor}>
                        <Typography.Text style={{ color: warnColor }}>
                          Correct answers missing for items{' '}
                          {formatIndexWithAnd(missingAnswerItemIndexes, 'Q')} in
                          imported test. Please add them by editing these items
                          on the review screen.
                        </Typography.Text>
                      </StyledListItem>
                    )}
                  </StyledList>
                </EduElse>
              </EduIf>
            </EduIf>
            <EduIf condition={status === 'FAILED'}>
              <MessageWrapper>
                <Typography.Text strong style={{ color: warnColor }}>
                  {errorMessage}
                </Typography.Text>
              </MessageWrapper>
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

        <EduIf
          condition={status === 'SUCCESS' && !!unsupportedItemIndexes?.length}
        >
          <Typography.Paragraph style={{ color: '#474747', fontSize: '12px' }}>
            Note : Linear scale question type is not supported. Please use
            alternative question types for compatible imports.
          </Typography.Paragraph>
        </EduIf>

        <Row type="flex" justify="center" align="middle">
          <Col>
            <EduIf condition={status === 'SUCCESS'}>
              <EduThen>
                <EduButton type="primary" onClick={onReview}>
                  REVIEW
                </EduButton>
              </EduThen>
              <EduElse>
                <StyledCancelButton type="link" onClick={onCancel}>
                  CANCEL
                </StyledCancelButton>
              </EduElse>
            </EduIf>
          </Col>
        </Row>
      </>
    </Modal>
  )
}

export default withRouter(ImportGoogleFormModal)
