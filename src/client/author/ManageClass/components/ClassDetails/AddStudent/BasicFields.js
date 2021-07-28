import { userApi } from '@edulastic/api'
import { red, themeColor } from '@edulastic/colors'
import { FieldLabel, TextInputStyled } from '@edulastic/common'
import { IconHash, IconLock, IconMail, IconUser } from '@edulastic/icons'
import { Form } from 'antd'
import { get, isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { nameValidator } from '../../../../../common/utils/helpers'
import { getUserOrgId } from '../../../../src/selectors/user'
import { Field } from './styled'

const BasicFields = ({
  stds,
  isEdit,
  students,
  districtId,
  getFieldValue,
  setFields,
  getFieldDecorator,
  isUpdate,
  setIsUpdate,
  setFounduser,
  showClassCodeField,
  fetchClassDetailsUsingCode,
  resetClassDetails = () => {},
  setFoundContactEmails,
  validatedClassDetails,
  classDetails,
}) => {
  const _className = get(validatedClassDetails, 'groupInfo.name', '')

  const {
    email,
    firstName,
    lastName,
    middleName,
    username,
    googleId,
    canvasId,
    cliId,
    cleverId,
  } = stds?.[0] || []

  const [userExistsInClass, setUserExistsInClass] = useState(false)

  const [enroll, setEnroll] = useState(false)
  const confirmPwdCheck = (rule, value, callback) => {
    const pwd = getFieldValue('password')
    if (pwd !== value) {
      callback(rule.message)
    } else {
      callback()
    }
  }
  const commonEmailValidations = [
    { required: true, message: 'Please provide valid Username or Email id' },
    {
      // validation so that no white spaces are allowed
      message: 'Please provide valid Username or Email id',
      // eslint-disable-next-line no-useless-escape
      pattern: /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/,
    },
    { max: 256, message: 'Must less than 256 characters!' },
  ]

  const checkUser = async (rule, value, callback) => {
    let { code = '' } = get(validatedClassDetails, 'groupInfo', {})
    if (isUpdate) setIsUpdate(!isUpdate)
    if (enroll) {
      setFields({
        fullName: {
          value: '',
        },
      })
      setEnroll(false)
    }

    // [manage class entity]
    if (!code) {
      code = classDetails?.code
    }

    let result = []

    try {
      result = await userApi.checkUser({
        username: value,
        districtId,
        classCode: code,
        role: 'student',
      })
    } catch (error) {
      callback('Invalid input')
      console.log(error)
      if (error) return null
    }

    // many user can exists with same email
    // get user with student role
    let user = {}
    if (!isEmpty(result)) {
      const student = result.find((o) => o.role === 'student')
      if (!isEmpty(student)) {
        user = student
      }
    }

    if (user.existInClass) {
      setUserExistsInClass(true)
      setFields({
        email: {
          value,
          errors: [new Error('User already part of this class')],
          touched: true,
        },
      })
      callback('User already part of this class')
      return null
    }

    setUserExistsInClass(false)
    let errorMsg = ''
    if (!isEmpty(user)) {
      const foundUser = user
      const isExistingStudent = students.find(
        (student) =>
          student._id == foundUser._id && student.enrollmentStatus === '1'
      )
      if (isExistingStudent) {
        errorMsg = 'User already part of this class section'
      } else {
        errorMsg = ''
        setEnroll(true)
        setIsUpdate(!isUpdate)
        setFounduser(foundUser._id)
        setFoundContactEmails(foundUser.contactEmails)
        const userFirstName = foundUser.firstName ? foundUser.firstName : ''
        const userLastName = foundUser.lastName ? foundUser.lastName : ''
        const userMiddleName = foundUser.middleName ? foundUser.middleName : ''
        if (foundUser.contactEmails?.length > 0) {
          setFields({ contactEmails: foundUser.contactEmails.join(',') })
        }
        if (userFirstName)
          setFields({
            fullName: {
              value: `${userFirstName} ${userMiddleName || ''} ${
                userLastName || ''
              }`,
            },
          })
      }
      if (errorMsg !== '' && !enroll) {
        callback(errorMsg)
      }
    }
  }

  const checkFirstName = (rule, value, callback) => {
    const userFirstName = value.split(' ')[0]
    if (userFirstName.length < 3) {
      callback('Name must contains atleast 3 characters')
    } else {
      callback()
    }
  }

  useEffect(() => {
    resetClassDetails()
  }, [])

  const validateName = (rule, value, callback) => {
    if (!nameValidator(value)) {
      callback('The input is not valid name')
    } else {
      callback()
    }
  }

  return (
    <FormBody>
      {showClassCodeField && (
        <Field name="ClassCode">
          <FieldLabel>Class Code</FieldLabel>
          <Form.Item>
            {getFieldDecorator('code', {
              validateTrigger: ['onBlur'],
              rules: [
                {
                  required: true,
                  message: 'Please input the destination class',
                },
              ],
            })(
              <TextInputStyled
                padding="0px 15px 0px 30px"
                data-cy="classCode"
                prefix={<IconHash color={themeColor} />}
                onBlur={(evt) => {
                  const classCode = evt.target.value.trim()
                  if (classCode.length) fetchClassDetailsUsingCode(classCode)
                }}
                onChange={(evt) => {
                  const classCode = evt.target.value.trim()
                  if (!classCode.length) resetClassDetails()
                }}
                placeholder="Enter Class Code"
              />
            )}
            {!isEmpty(_className) && `Class Name : ${_className}`}
          </Form.Item>
        </Field>
      )}
      {!isEdit ? (
        <Field name="email">
          <FieldLabel>Username</FieldLabel>
          <Form.Item>
            {getFieldDecorator('email', {
              validateTrigger: ['onBlur'],
              rules: [{ validator: checkUser }, ...commonEmailValidations],
            })(
              <TextInputStyled
                padding="0px 15px 0px 30px"
                data-cy="username"
                prefix={<IconMail color={themeColor} />}
                placeholder="Enter Username"
              />
            )}
            {enroll && (
              <InputMessage>User exists and will be enrolled.</InputMessage>
            )}
          </Form.Item>
        </Field>
      ) : (
        <Field name="email">
          <FieldLabel>Username/Email</FieldLabel>
          <Form.Item>
            {getFieldDecorator('email', {
              rules: [...commonEmailValidations],
              initialValue: email || username,
            })(
              <TextInputStyled
                padding="0px 15px 0px 30px"
                data-cy="username"
                prefix={<IconUser color={themeColor} />}
                placeholder="Enter Username"
                disabled={googleId || canvasId || cliId || cleverId}
              />
            )}
          </Form.Item>
        </Field>
      )}
      {showClassCodeField && (
        <Field name="role">
          <FieldLabel>Role</FieldLabel>
          <Form.Item>
            {getFieldDecorator('role', { initialValue: 'student' })(
              <TextInputStyled disabled />
            )}
          </Form.Item>
        </Field>
      )}
      {!isEdit && (
        <Field name="fullName">
          <FieldLabel>Name of User</FieldLabel>
          <Form.Item>
            {getFieldDecorator('fullName', {
              validateTrigger: ['onBlur'],
              rules: [{ validator: validateName }],
            })(
              <TextInputStyled
                padding="0px 15px 0px 30px"
                data-cy="fullName"
                prefix={<IconUser color={themeColor} />}
                placeholder="Enter the name of the user"
                disabled={enroll || userExistsInClass}
              />
            )}
          </Form.Item>
        </Field>
      )}
      {isEdit && (
        <>
          <Field name="firstName">
            <FieldLabel>First Name</FieldLabel>
            <Form.Item>
              {getFieldDecorator('firstName', {
                validateTrigger: ['onBlur'],
                rules: [{ validator: checkFirstName }],
                initialValue: firstName || '',
              })(
                <TextInputStyled
                  padding="0px 15px 0px 30px"
                  data-cy="fname"
                  prefix={<IconUser color={themeColor} />}
                  placeholder="Enter the first name of the user"
                />
              )}
            </Form.Item>
          </Field>
          <Field name="middleName">
            <FieldLabel>Middle name</FieldLabel>
            <Form.Item>
              {getFieldDecorator('middleName', {
                initialValue: middleName || '',
              })(
                <TextInputStyled
                  padding="0px 15px 0px 30px"
                  data-cy="mname"
                  prefix={<IconUser color={themeColor} />}
                  placeholder="Enter the middle name of the user"
                />
              )}
            </Form.Item>
          </Field>
          <Field name="lastName">
            <FieldLabel>Last name</FieldLabel>
            <Form.Item>
              {getFieldDecorator('lastName', {
                initialValue: lastName || '',
              })(
                <TextInputStyled
                  padding="0px 15px 0px 30px"
                  data-cy="lname"
                  prefix={<IconUser color={themeColor} />}
                  placeholder="Enter the last name of the user"
                />
              )}
            </Form.Item>
          </Field>
        </>
      )}

      {!isEdit ? (
        <>
          <Field name="password">
            <FieldLabel>Password</FieldLabel>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    message: 'Please provide a valid password',
                  },
                  { min: 6, message: 'Must larger than 6 characters!' },
                ],
              })(
                <TextInputStyled
                  padding="0px 15px 0px 30px"
                  data-cy="password"
                  prefix={<IconLock color={themeColor} />}
                  type="password"
                  placeholder="Enter Password"
                  autoComplete="new-password"
                  disabled={enroll || userExistsInClass}
                />
              )}
            </Form.Item>
          </Field>
          <Field name="confirmPassword">
            <FieldLabel>Confirm Password</FieldLabel>
            <Form.Item>
              {getFieldDecorator('confirmPassword', {
                rules: [
                  {
                    validator: confirmPwdCheck,
                    message: 'Retyped password do not match.',
                  },
                ],
              })(
                <TextInputStyled
                  padding="0px 15px 0px 30px"
                  data-cy="confirmPassword"
                  prefix={<IconLock color={themeColor} />}
                  type="password"
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  disabled={enroll || userExistsInClass}
                />
              )}
            </Form.Item>
          </Field>
        </>
      ) : (
        <>
          <Field name="password">
            <FieldLabel>Password</FieldLabel>
            <Form.Item>
              {getFieldDecorator(
                'password',
                {}
              )(
                <TextInputStyled
                  padding="0px 15px 0px 30px"
                  prefix={<IconLock color={themeColor} />}
                  type="password"
                  placeholder="Enter Password"
                  autoComplete="new-password"
                />
              )}
            </Form.Item>
          </Field>
          <Field name="confirmPassword">
            <FieldLabel>Confirm Password</FieldLabel>
            <Form.Item>
              {getFieldDecorator('confirmPassword', {
                rules: [
                  {
                    validator: confirmPwdCheck,
                    message: 'Retyped password do not match.',
                  },
                ],
              })(
                <TextInputStyled
                  padding="0px 15px 0px 30px"
                  prefix={<IconLock color={themeColor} />}
                  type="password"
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                />
              )}
            </Form.Item>
          </Field>
        </>
      )}
    </FormBody>
  )
}

BasicFields.propTypes = {
  isEdit: PropTypes.bool,
}

// eslint-disable-next-line no-unused-expressions
BasicFields.defaultProps = {
  isEdit: false,
}

export default connect((state) => ({
  students: get(state, 'manageClass.studentsList', []),
  districtId: getUserOrgId(state),
  classDetails: get(state, 'manageClass.entity', {}),
}))(BasicFields)

const FormBody = styled.div`
  background: white;
  .ant-input-affix-wrapper {
    .ant-input-prefix {
      width: 15px;
    }
  }
`

const InputMessage = styled.span`
  color: ${red};
`
