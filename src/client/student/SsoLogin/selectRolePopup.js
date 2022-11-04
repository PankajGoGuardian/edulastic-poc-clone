import React, { useState } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { Modal, Button, Icon, Input, Form } from 'antd'
import { get, trim } from 'lodash'
import { white, greenDark, orange } from '@edulastic/colors'
import { withNamespaces } from '@edulastic/localization'
import { updateUserRoleAction, logoutAction } from '../Login/ducks'

const SelectRolePopup = (props) => {
  const { t, className, updateUserRoleAction, logoutAction } = props
  const [selectedRole, setSelectedRole] = useState('')

  const onSignupAsStudent = () => {
    setSelectedRole('student')
  }

  const onSignupAsStudentSubmit = (classCode) => {
    updateUserRoleAction({ role: 'student', classCode })
  }

  const onSignupAsTeacher = () => {
    updateUserRoleAction({ role: 'teacher' })
  }

  const onBackClick = () => {
    setSelectedRole('')
  }

  const onCancel = () => {
    logoutAction()
  }

  return (
    <Modal
      visible
      footer={null}
      className={className}
      width="500px"
      maskClosable={false}
      onCancel={onCancel}
    >
      {selectedRole !== 'student' ? (
        <div className="third-party-signup-select-role">
          <p>It seems you are new to Edulastic!</p>
          <p>Sign Up! It's Free</p>
          <div className="model-buttons">
            <Button
              className="signupAsStudent-button"
              key="signupAsStudent"
              onClick={onSignupAsStudent}
            >
              Sign up as Student
            </Button>
            <Button
              className="signupAsTeacher-button"
              key="signupAsTeacher"
              onClick={onSignupAsTeacher}
            >
              Sign up as Teacher
            </Button>
          </div>
        </div>
      ) : (
        <div className="third-party-signup-student-enter-class-code">
          <Button
            className="back-button"
            type="primary"
            shape="circle"
            icon="arrow-left"
            onClick={onBackClick}
          />
          <p>Please, enter your ClassCode</p>
          <p>(Provided by your teacher)</p>
          <ConnectedClassCodeForm onSubmit={onSignupAsStudentSubmit} t={t} />
        </div>
      )}
    </Modal>
  )
}

const ClassCodeForm = (props) => {
  const { getFieldDecorator } = props.form
  const { t, onSubmit: _onSubmit } = props

  const onSubmit = (event) => {
    event.preventDefault()
    const { form } = props
    form.validateFieldsAndScroll((err, { classCode }) => {
      _onSubmit(classCode)
    })
  }

  return (
    <Form onSubmit={onSubmit} autoComplete="new-password">
      <Form.Item>
        {getFieldDecorator('classCode', {
          validateFirst: true,
          initialValue: '',
          rules: [
            {
              transform: (value) => trim(value),
            },
            {
              required: true,
              message: t('component.signup.student.validclasscode'),
            },
          ],
        })(
          <Input
            className="class-code-input"
            type="text"
            placeholder="Class code"
            autoComplete="new-password"
          />
        )}
      </Form.Item>
      <div className="model-buttons">
        <Form.Item>
          <Button
            className="signup-as-student-button"
            key="signupAsStudent"
            htmlType="submit"
          >
            Sign up as Student
          </Button>
        </Form.Item>
      </div>
    </Form>
  )
}

const ConnectedClassCodeForm = Form.create({ name: 'classCodeForm' })(
  ClassCodeForm
)

const StyledSelectRolePopup = styled(SelectRolePopup)`
  .ant-modal-content {
    background-color: #40444f;
    color: ${white};
    .ant-modal-close {
      border: solid 3px white;
      border-radius: 20px;
      color: white;
      margin: -17px;
      height: 35px;
      width: 35px;
      .ant-modal-close-x {
        height: 100%;
        width: 100%;
        line-height: normal;
        padding: 5px;
        path {
          stroke: white;
          stroke-width: 150;
          fill: white;
        }
      }
    }

    .model-buttons {
      display: flex;
      justify-content: space-between;
      margin: 8px;
      button {
        height: 40px;
        background-color: transparent;
        border: none;
        border-radius: 5px;
        font-weight: 600;
        margin: 0 5px;
      }
    }

    .third-party-signup-select-role {
      display: flex;
      justify-content: center;
      flex-direction: column;
      text-align: center;
      .model-buttons {
        .signupAsStudent-button {
          border: solid 1px ${greenDark};
          color: ${greenDark};
        }
        .signupAsTeacher-button {
          border: solid 1px ${orange};
          color: ${orange};
        }
      }
    }

    .third-party-signup-student-enter-class-code {
      display: flex;
      justify-content: center;
      flex-direction: column;
      text-align: center;

      .back-button {
        position: absolute;
        top: 26px;
        background: transparent;
        border: none;
      }

      form {
        .class-code-input {
          background-color: #40444f;
          color: white;
        }
      }

      .model-buttons {
        justify-content: center;
        .signup-as-student-button {
          border: solid 1px ${greenDark};
          color: ${greenDark};
        }
      }
    }
  }
`

const enhance = compose(
  withNamespaces('login'),
  connect(
    (state) => ({
      user: get(state, 'user.user', null),
    }),
    { updateUserRoleAction, logoutAction }
  )
)

const ConnectedStyledSelectRolePopup = enhance(StyledSelectRolePopup)

export { ConnectedStyledSelectRolePopup as SelectRolePopup }
