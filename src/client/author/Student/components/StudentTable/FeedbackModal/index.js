import React, { useEffect, useMemo, useState } from 'react'
import { EduButton, notification } from '@edulastic/common'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import { Col, Form, Row, Select } from 'antd'
import { get } from 'lodash'
import { userApi } from '@edulastic/api'
import { getFormattedName } from '../../../../Gradebook/transformers'
import { StyledFormItem, StyledRoundedModal, StyledTextArea } from './styled'
import FeedbacksTable, {
  FEEDBACK_TYPE_TO_ICONS,
} from '../../../../Reports/subPages/dataWarehouseReports/wholeChildReport/components/FeedbacksTable'

const { Option } = Select

// TODO Disable Async Validator logs https://stackoverflow.com/a/67188224/11218031

const FeedbackTypes = Object.keys(FEEDBACK_TYPE_TO_ICONS)

/**
 * @param {import('antd/lib/form').FormComponentProps & {feedbackStudentId: string | null; handleClose: () => void}} props
 */
const FeedbackModal = (props) => {
  const { form, feedbackStudentId, onClose, students, currentClass } = props
  const [isSubmitting, setIsSubmitting] = useState(false)

  const student = useMemo(() => {
    if (!currentClass) return null
    const _student = students.find((st) => st._id === feedbackStudentId)
    if (!_student) return null
    const fullName = getFormattedName(
      _student.firstName,
      _student.middleName,
      _student.lastName
    )
    return {
      ..._student,
      name: `${fullName === 'Anonymous' || fullName === '' ? '-' : fullName}`,
    }
  }, [feedbackStudentId])

  useEffect(() => {
    form.resetFields()
    setIsSubmitting(false)
  }, [student])

  const handleClose = () => {
    if (!isSubmitting) onClose()
  }

  const handleSubmit = () => {
    form.validateFieldsAndScroll(async (err, values) => {
      if (err) return
      try {
        setIsSubmitting(true)
        const data = {
          ...values,
          classId: currentClass._id,
        }
        const response = await userApi.addFeedback(student._id, data)
        if (response.error) {
          throw new Error(response.error)
        }
        onClose()
      } catch (responseErr) {
        notification({
          type: 'error',
          msg: `Unable to save feedback: ${responseErr}`,
        })
      } finally {
        setIsSubmitting(false)
      }
    })
  }

  return (
    <StyledRoundedModal
      visible={!!student}
      onCancel={handleClose}
      closable={!isSubmitting}
      footer={null}
      title="New Feedback"
      width="1200px"
    >
      <Form
        form={form}
        hideRequiredMark
        layout="horizontal"
        onSubmit={handleSubmit}
      >
        <Row>
          <Col span={6}>
            <StyledFormItem labelAlign="right" label="STUDENT NAME">
              <b>{student?.name}</b>
            </StyledFormItem>
          </Col>
          <Col span={12} style={{ alignItems: 'center' }}>
            <StyledFormItem labelAlign="left" label="FEEDBACK TYPE">
              {form.getFieldDecorator('type', {
                rules: [
                  {
                    required: true,
                  },
                ],
                initialValue: FeedbackTypes[0],
              })(
                <Select size="large" getPopupContainer={(e) => e.parentNode}>
                  {FeedbackTypes.map((ft) => (
                    <Option key={ft} value={ft}>
                      {ft}
                    </Option>
                  ))}
                </Select>
              )}
            </StyledFormItem>
          </Col>
        </Row>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'stretch' }}>
          <Col span={16} style={{ alignItems: 'center', height: '100%' }}>
            <StyledFormItem label="ENTER FEEDBACK">
              {form.getFieldDecorator('feedback', {
                rules: [
                  {
                    required: true,
                    message: 'Feedback required',
                  },
                  {
                    max: 500,
                    message: 'Feedback should be max 500 characters',
                  },
                  {
                    min: 10,
                    message: 'Feedback should be min 10 characters',
                  },
                ],
              })(
                <StyledTextArea
                  placeholder="Enter text here"
                  autoFocus
                  maxLength={500}
                  autoSize={{
                    minRows: 2,
                    maxRows: 4,
                  }}
                />
              )}
            </StyledFormItem>
          </Col>
          <Col span={8} style={{ alignItems: 'center', display: 'flex' }}>
            <EduButton
              disabled={isSubmitting}
              onClick={handleSubmit}
              size="small"
            >
              Add Feedback
            </EduButton>
          </Col>
        </div>
      </Form>
      <FeedbacksTable
        studentId={student?._id}
        termId={currentClass?.termId}
        label="Student Feedback"
      />
    </StyledRoundedModal>
  )
}

const enhance = compose(
  withNamespaces('manageDistrict'),
  Form.create(),
  connect((state) => ({
    students: get(state, 'manageClass.studentsList', []),
    currentClass: get(state, 'manageClass.entity'),
  }))
)

export default enhance(FeedbackModal)
