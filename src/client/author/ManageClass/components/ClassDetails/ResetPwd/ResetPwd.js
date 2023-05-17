import { CustomModalStyled, EduButton } from '@edulastic/common'
import { Form, Tooltip } from 'antd'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { PASSWORD_KEY } from '@edulastic/constants/const/common'
import { withNamespaces } from '@edulastic/localization'
import { compose } from 'redux'
import { roleuser } from '@edulastic/constants'
import { resetPasswordRequestAction } from '../../../ducks'
import { StyledInput, Title } from './styled'
import MultiDistStudentList from './MultiDistStudentList'

class ResetPwd extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    handleCancel: PropTypes.func.isRequired,
    isOpen: PropTypes.bool,
    changePwd: PropTypes.func.isRequired,
    selectedStudent: PropTypes.array.isRequired,
    selectedClass: PropTypes.object.isRequired,
    resetPasswordUserIds: PropTypes.array,
  }

  static defaultProps = {
    isOpen: false,
    resetPasswordUserIds: undefined,
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const {
      form,
      changePwd,
      selectedStudent,
      resetPasswordUserIds,
      handleCancel,
      selectedClass,
    } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        const { code: classCode } = selectedClass
        const { password: newPassword } = values
        let userIds = selectedStudent
          .filter((student) => student.districtIds.length == 1)
          .map((std) => std._id || std.userId)

        if (resetPasswordUserIds) {
          userIds = resetPasswordUserIds
        }
        changePwd({
          userIds,
          newPassword,
          classCode,
        })
        if (handleCancel) {
          handleCancel()
        }
      }
    })
  }

  render() {
    const {
      isOpen,
      handleCancel,
      form,
      selectedStudent,
      t,
      userRole,
    } = this.props
    const { getFieldDecorator, getFieldValue } = form
    const title = (
      <Title>
        <label>Reset Password</label>
      </Title>
    )

    const multiDistStudents = selectedStudent.filter(
      (student) => student.districtIds.length > 1
    )
    const oneDistrictOnly = 1
    const singleDistStudents = selectedStudent.filter(
      (student) => student.districtIds.length === oneDistrictOnly
    )
    const confirmPwdCheck = (rule, value, callback) => {
      const pwd = getFieldValue(PASSWORD_KEY)
      if (pwd !== value) {
        callback(rule.message)
      } else {
        callback()
      }
    }
    const zeroStudents = 0
    const hasNoStudents = singleDistStudents.length === zeroStudents
    const footer = (
      <>
        <EduButton height="32px" isGhost onClick={handleCancel}>
          Cancel
        </EduButton>
        <EduButton height="32px" onClick={this.handleSubmit}>
          Reset
        </EduButton>
      </>
    )

    const adminRoles = [roleuser.DISTRICT_ADMIN, roleuser.SCHOOL_ADMIN]
    const getTooltipMsg = () => {
      if (!adminRoles.includes(userRole) && hasNoStudents) {
        return t('multiDistrictStudentPasswordError.singleStudentPasswordReset')
      }
      return null
    }

    const disablePasswordEdit = () => {
      if (!adminRoles.includes(userRole)) {
        return !(singleDistStudents.length >= 1)
      }
    }
    const showMultiDistrictStudentPasswordModal =
      singleDistStudents.length > 0 && multiDistStudents.length > 0
    return (
      <CustomModalStyled
        title={title}
        visible={isOpen}
        onCancel={handleCancel}
        footer={footer}
        destroyOnClose
        textAlign="center"
      >
        <Form
          onSubmit={this.handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <Form.Item style={{ textAlign: 'center' }}>
            <Tooltip title={getTooltipMsg()}>
              {getFieldDecorator(PASSWORD_KEY, {
                rules: [
                  { required: true, message: 'Please input your Password!' },
                ],
              })(
                <div>
                  <StyledInput
                    type={PASSWORD_KEY}
                    autoComplete="off"
                    placeholder="Enter Password"
                    data-cy="passwordTextBox"
                    disabled={disablePasswordEdit()}
                  />
                </div>
              )}
            </Tooltip>
          </Form.Item>
          <Form.Item style={{ textAlign: 'center' }}>
            <Tooltip title={getTooltipMsg()}>
              {getFieldDecorator('confirmPwd', {
                rules: [
                  {
                    validator: confirmPwdCheck,
                    message: 'Retyped password do not match.',
                  },
                ],
              })(
                <div>
                  <StyledInput
                    type={PASSWORD_KEY}
                    autoComplete="off"
                    placeholder="Confirm Password"
                    data-cy="confirmPasswordTextBox"
                    disabled={disablePasswordEdit()}
                  />
                </div>
              )}
            </Tooltip>
          </Form.Item>
        </Form>
        {showMultiDistrictStudentPasswordModal ? (
          <MultiDistStudentList multiDistStudents={multiDistStudents} t={t} />
        ) : null}
      </CustomModalStyled>
    )
  }
}

const ResetPwdModal = Form.create({ name: 'reset_password' })(ResetPwd)

const enhance = compose(
  withNamespaces('author'),
  connect(
    (state) => ({
      selectedStudent: get(state, 'manageClass.selectedStudent', []),
      selectedClass: get(state, 'manageClass.entity'),
      userRole: get(state.user, 'user.role', ''),
    }),
    {
      changePwd: resetPasswordRequestAction,
    }
  )
)

export default enhance(ResetPwdModal)
