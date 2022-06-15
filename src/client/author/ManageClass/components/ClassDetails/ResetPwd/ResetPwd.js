import { CustomModalStyled, EduButton } from '@edulastic/common'
import { Form } from 'antd'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { resetPasswordRequestAction } from '../../../ducks'
import { StyledInput, Title } from './styled'

class ResetPwd extends React.Component {
  static propTypes = {
    form: PropTypes.object.isRequired,
    handleCancel: PropTypes.func.isRequired,
    isOpen: PropTypes.bool,
    changePwd: PropTypes.func.isRequired,
    selectedStudent: PropTypes.array.isRequired,
    selectedClass: PropTypes.object.isRequired,
  }

  static defaultProps = {
    isOpen: false,
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const {
      form,
      changePwd,
      selectedStudent,
      handleCancel,
      selectedClass,
    } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        const { code: classCode } = selectedClass
        const userIds = selectedStudent.map((std) => std._id || std.userId)
        const { password: newPassword } = values
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
    const { isOpen, handleCancel, form } = this.props
    const { getFieldDecorator, getFieldValue } = form
    const title = (
      <Title>
        <label>Reset Password</label>
      </Title>
    )

    const confirmPwdCheck = (rule, value, callback) => {
      const pwd = getFieldValue('password')
      if (pwd !== value) {
        callback(rule.message)
      } else {
        callback()
      }
    }

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
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: 'Please input your Password!' },
              ],
            })(
              <StyledInput
                type="password"
                autoComplete="off"
                placeholder="Enter Password"
                data-cy="passwordTextBox"
              />
            )}
          </Form.Item>
          <Form.Item style={{ textAlign: 'center' }}>
            {getFieldDecorator('confirmPwd', {
              rules: [
                {
                  validator: confirmPwdCheck,
                  message: 'Retyped password do not match.',
                },
              ],
            })(
              <StyledInput
                type="password"
                autoComplete="off"
                placeholder="Confirm Password"
                data-cy="confirmPasswordTextBox"
              />
            )}
          </Form.Item>
        </Form>
      </CustomModalStyled>
    )
  }
}

const ResetPwdModal = Form.create({ name: 'reset_password' })(ResetPwd)

export default connect(
  (state) => ({
    selectedStudent: get(state, 'manageClass.selectedStudent', []),
    selectedClass: get(state, 'manageClass.entity'),
  }),
  {
    changePwd: resetPasswordRequestAction,
  }
)(ResetPwdModal)
