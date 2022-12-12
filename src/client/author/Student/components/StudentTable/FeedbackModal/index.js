import React, { useEffect, useMemo, useState } from 'react'
import { EduButton, notification } from '@edulastic/common'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'
import { connect } from 'react-redux'
import { Form, Select } from 'antd'
import { get } from 'lodash'
import { userApi } from '@edulastic/api'
import { StyledTextArea } from '../InviteMultipleStudentModal/styled'
import { getFormattedName } from '../../../../Gradebook/transformers'
import { StyledFormItem, StyledRoundedModal } from './styled'

const { Option } = Select

// TODO Disable Async Validator logs https://stackoverflow.com/a/67188224/11218031

const FeedbackTypes = ['Academic', 'Behavioural', 'Attendance', 'Engagement']

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
      footer={
        <EduButton disabled={isSubmitting} onClick={handleSubmit}>
          Add Feedback
        </EduButton>
      }
      title="New Feedback"
    >
      <Form
        form={form}
        hideRequiredMark
        layout="vertical"
        onSubmit={handleSubmit}
      >
        <StyledFormItem labelAlign="right" label="STUDENT NAME">
          <b>{student?.name}</b>
        </StyledFormItem>
        <StyledFormItem labelAlign="right" label="FEEDBACK TYPE">
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
                minRows: 5,
                maxRows: 10,
              }}
            />
          )}
        </StyledFormItem>
      </Form>
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
