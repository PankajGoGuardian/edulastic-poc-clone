import { schoolApi, userApi } from '@edulastic/api'
import {
  CustomModalStyled,
  DatePickerStyled,
  EduButton,
  FieldLabel,
  SelectInputStyled,
  TextInputStyled,
} from '@edulastic/common'
import { IconAccessibility, IconUser } from '@edulastic/icons'
// components
import { Collapse, Icon, Select, Spin } from 'antd'
import { get, isEmpty } from 'lodash'
import React from 'react'
import { themeColor } from '@edulastic/colors'
import { isEmailValid, nameValidator } from '../../../../common/utils/helpers'
import hashIcon from '../../../../student/assets/hashtag-icon.svg'
import keyIcon from '../../../../student/assets/key-icon.svg'
import mailIcon from '../../../../student/assets/mail-icon.svg'
import userIcon from '../../../../student/assets/user-icon.svg'
import {
  Field,
  FooterDiv,
  Form,
  InputMessage,
  PanelHeader,
  Title,
} from './styled'
import AdditionalFields from '../../../ManageClass/components/ClassDetails/AddStudent/AdditionalFields'

const { Option } = Select
const { Panel } = Collapse
class AddNewUserForm extends React.Component {
  state = {
    keys: ['basic'],
    role: 'student',
    schoolsState: {
      list: [],
      value: [],
      fetching: false,
    },
    isUserExists: false,
    userInfo: {},
    userExistsInClass: false,
  }

  resetFormData = () => {
    const { resetClassDetails, form } = this.props
    this.setState({
      isUserExists: false,
      userInfo: {},
      userExistsInClass: false,
    })
    resetClassDetails()
    form.resetFields()
  }

  confirmPwdCheck = (rule, value, callback) => {
    const { form } = this.props
    const pwd = form.getFieldValue('password')
    if (pwd !== value) {
      callback(rule.message)
    } else {
      callback()
    }
  }

  validateEmailValue = async (rule, value, callback) => {
    if (
      !isEmailValid(
        rule,
        value,
        callback,
        'both',
        'Please enter valid username/email'
      )
    ) {
      return
    }
    const {
      userOrgId: districtId,
      form,
      location: { pathname },
    } = this.props

    const classCode = form.getFieldValue('code') || ''
    try {
      const res = await userApi.checkUser({
        username: value,
        districtId,
        classCode,
        role: 'student',
      })
      // many user can exists with same email
      // get user with student role
      let user = {}
      if (!isEmpty(res)) {
        const student = res.find((o) => o.role === 'student')
        if (student) {
          user = student
        }
      }
      // student exists in same class
      if (user.existInClass) {
        this.setState((prevState) => ({
          ...prevState,
          userExistsInClass: true,
          isUserExists: true,
        }))

        form.setFields({
          email: {
            value,
            errors: [new Error('User already part of this class')],
          },
        })
        callback()
        return null
      }

      this.setState((prevState) => ({
        ...prevState,
        userExistsInClass: false,
      }))

      // student exists in other class
      if (user._id) {
        this.setState((prevState) => ({
          ...prevState,
          isUserExists: true,
          userInfo: user,
          role: user.role === 'teacher' ? 'teacher' : 'student',
        }))
        if (
          user.role === 'teacher' &&
          pathname.split('/').includes('class-enrollment')
        ) {
          this.prePopulateDataToState()
        }
        const { lastName = '', firstName } = user
        form.setFields({
          fullName: {
            value: lastName
              ? `${firstName.trim()} ${lastName.trim()}`
              : `${firstName.trim()}`,
          },
          password: {
            value: '',
          },
          confirmPassword: {
            value: '',
          },
        })
        return callback()
      }
    } catch (err) {
      this.setState((prevState) => ({
        ...prevState,
        isUserExists: false,
        userInfo: {},
      }))
      form.setFields({
        email: {
          value,
          errors: [new Error('invalid value')],
        },
      })
    }
    // if user doesn't exist setting user obj empty
    this.setState((prevState) => ({
      ...prevState,
      isUserExists: false,
      userInfo: {},
    }))
    callback()
  }

  prePopulateDataToState = () => {
    const { validatedClassDetails } = this.props
    // pre-populate and disable the school dropdown
    // populate using class institution
    const groupInfo = get(validatedClassDetails, 'groupInfo', {})
    this.setState((prevState) => ({
      ...prevState,
      schoolsState: {
        list: [
          {
            _id: groupInfo.institutionId,
            _source: {
              name: groupInfo.institutionName,
            },
          },
        ],
      },
      selectedSchoolId: groupInfo.institutionId,
      disabledSchool: true,
    }))
  }

  onRoleChange = (role) => {
    this.setState((prevState) => ({
      ...prevState,
      role,
    }))
  }

  fetchSchool = async (value) => {
    const { userOrgId: districtId } = this.props
    const { schoolsState } = this.state
    const schoolsData = { ...schoolsState }

    this.setState({
      schoolsState: {
        list: [],
        fetching: true,
        value: schoolsData.value,
      },
    })
    const schoolListData = await schoolApi.getSchools({
      districtId,
      limit: 25,
      page: 1,
      sortField: 'name',
      order: 'asc',
      search: { name: [{ type: 'cont', value }] },
    })

    this.setState({
      schoolsState: {
        list: schoolListData.data,
        fetching: false,
        value: schoolsData.value,
      },
    })
  }

  handleChange = (value) => {
    const { schoolsState } = this.state
    this.setState((prevState) => ({
      ...prevState,
      schoolsState: {
        ...schoolsState,
        fetching: false,
        value,
      },
    }))
  }

  render() {
    const iconSize = {
      width: '12px',
      height: '12px',
    }
    const {
      form: { getFieldDecorator },
      closeModal,
      showModal,
      formTitle,
      fetchClassDetailsUsingCode,
      validatedClassDetails,
      addNewUser,
      resetClassDetails,
      location: { pathname },
    } = this.props

    const { isUserExists, userInfo, userExistsInClass } = this.state

    const { role, schoolsState, selectedSchoolId, disabledSchool } = this.state
    const isValidClassCode = get(
      validatedClassDetails,
      'isValidClassCode',
      false
    )
    const _className = get(validatedClassDetails, 'groupInfo.name', '')
    const { keys } = this.state
    const title = (
      <Title>
        <IconUser />
        <label>{formTitle}</label>
      </Title>
    )

    const footer = (
      <FooterDiv>
        <EduButton isGhost data-cy="cancel" onClick={() => closeModal()}>
          No, Cancel
        </EduButton>
        <EduButton
          data-cy="addUser"
          onClick={() => addNewUser(userInfo)}
          disabled={!isValidClassCode || userExistsInClass}
        >
          {role === 'student' ? 'Yes, Add Student' : 'Yes, Add User'}
          <Icon type="right" />
        </EduButton>
      </FooterDiv>
    )

    const expandIcon = (panelProps) =>
      panelProps.isActive ? (
        <Icon type="caret-up" />
      ) : (
        <Icon type="caret-down" />
      )

    const BasicDetailsHeader = (
      <PanelHeader>
        <Icon type="bars" />
        <label>Basic Details</label>
      </PanelHeader>
    )

    const AdditionalDetailsHeader = (
      <PanelHeader>
        <Icon type="setting" theme="filled" />
        <label>Configure Additional Details</label>
      </PanelHeader>
    )

    const AccommodationsHeader = (
      <PanelHeader>
        <div className="flex">
          <IconAccessibility style={{ fill: themeColor }} />
          <label>Configure Accommodations</label>
        </div>
        <small>Set TTS, STT, IR acommodations</small>
      </PanelHeader>
    )

    const validateName = (rule, value, callback) => {
      if (!nameValidator(value)) {
        callback('The input is not valid name')
      } else {
        callback()
      }
    }

    return (
      <CustomModalStyled
        title={title}
        footer={footer}
        visible={showModal}
        onCancel={() => closeModal()}
        destroyOnClose
        afterClose={this.resetFormData}
        centered
      >
        <Form>
          <Collapse
            accordion
            defaultActiveKey={keys}
            expandIcon={expandIcon}
            expandIconPosition="right"
          >
            <Panel header={BasicDetailsHeader} key="basic">
              <Field name="code">
                <FieldLabel>Class Code</FieldLabel>
                <Form.Item>
                  {getFieldDecorator('code', {
                    rules: [
                      {
                        required: true,
                        message: 'Please enter valid class code',
                      },
                    ],
                    initialValue: '',
                  })(
                    <TextInputStyled
                      padding="0px 15px 0px 30px"
                      prefix={<img style={iconSize} src={hashIcon} alt="" />}
                      onBlur={(evt) => {
                        const classCodeValue = evt.target.value.trim()
                        if (classCodeValue.length)
                          fetchClassDetailsUsingCode(classCodeValue)
                      }}
                      onChange={(evt) => {
                        const classCodeValue = evt.target.value.trim()
                        if (!classCodeValue.length) resetClassDetails()
                      }}
                      placeholder="Enter Class Code"
                    />
                  )}
                  {!isEmpty(_className) && `class name : ${_className}`}
                </Form.Item>
              </Field>
              <Field name="email">
                <FieldLabel>Username/Email</FieldLabel>
                <Form.Item>
                  {getFieldDecorator('email', {
                    validateTrigger: ['onBlur'],
                    rules: [{ validator: this.validateEmailValue }],
                    initialValue: '',
                  })(
                    <TextInputStyled
                      padding="0px 15px 0px 30px"
                      data-cy="username"
                      prefix={<img style={iconSize} src={mailIcon} alt="" />}
                      placeholder="Enter Username/email"
                      disabled={!isValidClassCode}
                    />
                  )}
                  {isUserExists && !userExistsInClass && (
                    <InputMessage>
                      User exists and will be enrolled.
                    </InputMessage>
                  )}
                </Form.Item>
              </Field>
              <Field name="role">
                <FieldLabel>Role</FieldLabel>
                <Form.Item>
                  {getFieldDecorator('role', { initialValue: role })(
                    <SelectInputStyled
                      disabled={pathname
                        .split('/')
                        .includes('class-enrollment')}
                      onSelect={this.onRoleChange}
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    >
                      <Option value="role" disabled>
                        Role
                      </Option>
                      <Option value="student">Student</Option>
                      <Option value="teacher">Teacher</Option>
                    </SelectInputStyled>
                  )}
                </Form.Item>
              </Field>
              <Field name="fullName">
                <FieldLabel>Name of user</FieldLabel>
                <Form.Item>
                  {getFieldDecorator('fullName', {
                    validateTrigger: ['onBlur'],
                    rules: [
                      { validator: validateName },
                      { max: 128, message: 'Must less than 128 characters!' },
                    ],
                    initialValue: '',
                  })(
                    <TextInputStyled
                      padding="0px 15px 0px 30px"
                      prefix={<img style={iconSize} src={userIcon} alt="" />}
                      placeholder="Enter the name of user"
                      disabled={
                        isUserExists || userExistsInClass || !isValidClassCode
                      }
                    />
                  )}
                </Form.Item>
              </Field>
              <Field name="password">
                <FieldLabel>Password</FieldLabel>
                <Form.Item>
                  {getFieldDecorator('password')(
                    <TextInputStyled
                      padding="0px 15px 0px 30px"
                      prefix={<img style={iconSize} src={keyIcon} alt="" />}
                      type="password"
                      placeholder="Enter Password"
                      data-cy="passwordTextBox"
                      autoComplete="new-password"
                      disabled={
                        isUserExists || userExistsInClass || !isValidClassCode
                      }
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
                        validator: this.confirmPwdCheck,
                        message: 'Retyped password do not match.',
                      },
                    ],
                  })(
                    <TextInputStyled
                      padding="0px 15px 0px 30px"
                      prefix={<img style={iconSize} src={keyIcon} alt="" />}
                      type="password"
                      placeholder="Confirm Password"
                      data-cy="confirmPasswordTextBox"
                      autoComplete="new-password"
                      disabled={
                        isUserExists || userExistsInClass || !isValidClassCode
                      }
                    />
                  )}
                </Form.Item>
              </Field>
              {role === 'teacher' && (
                <Field name="institutionIds">
                  <FieldLabel>Select School</FieldLabel>
                  <Form.Item>
                    {getFieldDecorator('institutionIds', {
                      initialValue: selectedSchoolId,
                      rules: [
                        {
                          required: true,
                          message: 'Please select school',
                        },
                      ],
                    })(
                      <SelectInputStyled
                        mode="multiple"
                        placeholder="Please Select schools"
                        notFoundContent={
                          schoolsState.fetching ? <Spin size="small" /> : null
                        }
                        filterOption={false}
                        onSearch={this.fetchSchool}
                        onChange={this.handleChange}
                        getPopupContainer={(triggerNode) =>
                          triggerNode.parentNode
                        }
                        disabled={disabledSchool || !isValidClassCode}
                      >
                        {schoolsState.list.map((school) => (
                          <Option key={school._id} value={school._id}>
                            {school._source.name}
                          </Option>
                        ))}
                      </SelectInputStyled>
                    )}
                  </Form.Item>
                </Field>
              )}
            </Panel>
            <Panel header={AdditionalDetailsHeader} key="additional">
              <Field name="sisId">
                <FieldLabel>SIS ID</FieldLabel>
                <Form.Item>
                  {getFieldDecorator('sisId')(
                    <TextInputStyled placeholder="Enter SIS ID" disabled />
                  )}
                </Form.Item>
              </Field>
              <Field name="studentNumber">
                <FieldLabel>Student Number</FieldLabel>
                <Form.Item>
                  {getFieldDecorator('studentNumber')(
                    <TextInputStyled
                      placeholder="Enter Student Number"
                      disabled
                    />
                  )}
                </Form.Item>
              </Field>
              <Field name="frlStatus">
                <FieldLabel>Free Reduced Lunch</FieldLabel>
                <Form.Item>
                  {getFieldDecorator('frlStatus')(
                    <SelectInputStyled
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    >
                      <Option value="Yes">Yes</Option>
                      <Option value="No">No</Option>
                    </SelectInputStyled>
                  )}
                </Form.Item>
              </Field>
              <Field name="iepStatus">
                <FieldLabel>Individual Education Plan</FieldLabel>
                <Form.Item>
                  {getFieldDecorator('iepStatus')(
                    <SelectInputStyled
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    >
                      <Option value="Yes">Yes</Option>
                      <Option value="No">No</Option>
                    </SelectInputStyled>
                  )}
                </Form.Item>
              </Field>
              <Field name="ellStatus">
                <FieldLabel>English Language Learner</FieldLabel>
                <Form.Item>
                  {getFieldDecorator('ellStatus')(
                    <SelectInputStyled
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    >
                      <Option value="Yes">Yes</Option>
                      <Option value="No">No</Option>
                    </SelectInputStyled>
                  )}
                </Form.Item>
              </Field>
              <Field name="sedStatus">
                <FieldLabel>Special ED</FieldLabel>
                <Form.Item>
                  {getFieldDecorator('sedStatus')(
                    <SelectInputStyled
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    >
                      <Option value="Yes">Yes</Option>
                      <Option value="No">No</Option>
                    </SelectInputStyled>
                  )}
                </Form.Item>
              </Field>
              <Field name="hispanicEthnicity">
                <FieldLabel>Hispanic Ethnicity</FieldLabel>
                <Form.Item>
                  {getFieldDecorator('hispanicEthnicity')(
                    <SelectInputStyled
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    >
                      <Option value="Yes">Yes</Option>
                      <Option value="No">No</Option>
                    </SelectInputStyled>
                  )}
                </Form.Item>
              </Field>
              <Field name="race">
                <FieldLabel>Race</FieldLabel>
                <Form.Item>
                  {getFieldDecorator('race')(
                    <TextInputStyled placeholder="Race" />
                  )}
                </Form.Item>
              </Field>

              <Field name="dob" optional>
                <FieldLabel>DOB</FieldLabel>
                <Form.Item>
                  {getFieldDecorator('dob')(
                    <DatePickerStyled format="DD MMM, YYYY" />
                  )}
                </Form.Item>
              </Field>
              <Field name="gender">
                <FieldLabel>Gender</FieldLabel>
                <Form.Item>
                  {getFieldDecorator('gender')(
                    <SelectInputStyled
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    >
                      <Option value="male">Male</Option>
                      <Option value="female">Female</Option>
                      <Option value="other">Other</Option>
                    </SelectInputStyled>
                  )}
                </Form.Item>
              </Field>
              <Field name="contactEmails">
                <FieldLabel>Parents/Guardians</FieldLabel>
                <Form.Item>
                  {getFieldDecorator('contactEmails')(
                    <TextInputStyled placeholder="Enter email comma separated..." />
                  )}
                </Form.Item>
              </Field>
              <Field name="tts">
                <FieldLabel>Enable Text To Speech</FieldLabel>
                <Form.Item>
                  {getFieldDecorator('tts')(
                    <SelectInputStyled
                      getPopupContainer={(triggerNode) =>
                        triggerNode.parentNode
                      }
                    >
                      <Option value="yes">Yes</Option>
                      <Option value="no">No</Option>
                    </SelectInputStyled>
                  )}
                </Form.Item>
              </Field>
            </Panel>
            <Panel header={AccommodationsHeader} key="accommodations">
              <AdditionalFields
                type="accommodations"
                getFieldDecorator={getFieldDecorator}
              />
            </Panel>
          </Collapse>
        </Form>
      </CustomModalStyled>
    )
  }
}
export const AddNewUserModal = Form.create({ name: 'user_form_modal' })(
  AddNewUserForm
)
