import { userApi } from '@edulastic/api'
import {
  CustomModalStyled,
  DatePickerStyled,
  EduButton,
  FieldLabel,
  SelectInputStyled,
  TextInputStyled,
} from '@edulastic/common'
import { IconUser } from '@edulastic/icons'
import { Collapse, Icon, Select } from 'antd'
import { get, identity, isEmpty, pickBy, unset } from 'lodash'
import moment from 'moment'
import React from 'react'
import keyIcon from '../../../student/assets/key-icon.svg'
import mailIcon from '../../../student/assets/mail-icon.svg'
import userIcon from '../../../student/assets/user-icon.svg'
import { Field, FooterDiv, Form, PanelHeader, Title } from './styled'

const { Panel } = Collapse
const { Option } = Select
class UserForm extends React.Component {
  state = {
    keys: ['basic'],
  }

  onProceed = () => {
    const { form } = this.props
    form.validateFields((err, row) => {
      if (!err) {
        const {
          modalData,
          modalFunc,
          userOrgId: districtId,
          closeModal,
        } = this.props
        if (row.dob) {
          row.dob = moment(row.dob).format('x')
        }
        const contactEmails = get(row, 'contactEmails')
        if (contactEmails) {
          row.contactEmails = [contactEmails]
        }
        unset(row, ['confirmPassword'])
        const nRow = pickBy(row, identity)
        modalFunc({
          userId: modalData._id,
          data: Object.assign(nRow, {
            districtId,
          }),
        })
        closeModal()
      }
    })
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
    const {
      userOrgId: districtId,
      modalData: { _source },
      role,
    } = this.props
    const email = get(_source, 'email', '')
    if (email !== value) {
      try {
        const res = await userApi.checkUser({
          username: value,
          districtId,
          role,
        })
        if (!isEmpty(res)) {
          return callback('Email Already exists')
        }
      } catch (error) {
        console.log(error)
      }
    }
  }

  render() {
    const {
      form: { getFieldDecorator },
      closeModal,
      showModal,
      formTitle,
      showAdditionalFields,
      modalData: { _source } = {},
      buttonText,
      isStudentEdit,
    } = this.props
    const dobValue = get(_source, 'dob')
    const contactEmails = get(_source, 'contactEmails')
    const { keys } = this.state
    const title = (
      <Title>
        <IconUser />
        <label>{formTitle}</label>
      </Title>
    )

    const footer = (
      <FooterDiv>
        <EduButton isGhost onClick={() => closeModal()}>
          No, Cancel
        </EduButton>
        <EduButton onClick={() => this.onProceed()}>
          {buttonText || `Yes, Update`}
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

    const iconSize = {
      width: '12px',
      height: '12px',
    }

    return (
      <CustomModalStyled
        centered
        title={title}
        footer={footer}
        visible={showModal}
        onCancel={() => closeModal()}
      >
        <Form>
          <Collapse
            accordion
            defaultActiveKey={keys}
            expandIcon={expandIcon}
            expandIconPosition="right"
          >
            <Panel header={BasicDetailsHeader} key="basic">
              {isStudentEdit && (
                <Field name="Username">
                  <FieldLabel>Username</FieldLabel>
                  <Form.Item>
                    {getFieldDecorator('username', {
                      initialValue: get(
                        _source,
                        'username',
                        get(_source, 'username', '')
                      ),
                    })(
                      <TextInputStyled
                        padding="0px 15px 0px 30px"
                        prefix={<img style={iconSize} src={mailIcon} alt="" />}
                        placeholder="Enter Username/email"
                        disabled
                      />
                    )}
                  </Form.Item>
                </Field>
              )}
              {!isStudentEdit && (
                <Field name="email">
                  <FieldLabel>Username/Email</FieldLabel>
                  <Form.Item>
                    {getFieldDecorator('email', {
                      rules: [
                        {
                          required: true,
                          message: 'Please enter valid username',
                        },
                      ],
                      initialValue: get(
                        _source,
                        'username',
                        get(_source, 'email', '')
                      ),
                    })(
                      <TextInputStyled
                        padding="0px 15px 0px 30px"
                        prefix={<img style={iconSize} src={mailIcon} alt="" />}
                        placeholder="Enter Username/email"
                        disabled
                      />
                    )}
                  </Form.Item>
                </Field>
              )}
              <Field name="firstName">
                <FieldLabel>First Name</FieldLabel>
                <Form.Item>
                  {getFieldDecorator('firstName', {
                    rules: [
                      {
                        required: true,
                        message: 'Please provide user first name',
                      },
                      { max: 128, message: 'Must less than 128 characters!' },
                    ],
                    initialValue: get(_source, 'firstName', ''),
                  })(
                    <TextInputStyled
                      padding="0px 15px 0px 30px"
                      prefix={<img style={iconSize} src={userIcon} alt="" />}
                      placeholder="Enter the first name of the user"
                    />
                  )}
                </Form.Item>
              </Field>
              <Field name="middleName">
                <FieldLabel>Middle Name</FieldLabel>
                <Form.Item>
                  {getFieldDecorator('middleName', {
                    initialValue: get(_source, 'middleName', ''),
                  })(
                    <TextInputStyled
                      padding="0px 15px 0px 30px"
                      prefix={<img style={iconSize} src={userIcon} alt="" />}
                      placeholder="Enter the middle name of the user"
                    />
                  )}
                </Form.Item>
              </Field>
              <Field name="lastName">
                <FieldLabel>Last name</FieldLabel>
                <Form.Item>
                  {getFieldDecorator('lastName', {
                    initialValue: get(_source, 'lastName', ''),
                  })(
                    <TextInputStyled
                      padding="0px 15px 0px 30px"
                      prefix={<img style={iconSize} src={userIcon} alt="" />}
                      placeholder="Enter the last name of the user"
                    />
                  )}
                </Form.Item>
              </Field>
              {isStudentEdit && (
                <Field name="email">
                  <FieldLabel>Email</FieldLabel>
                  <Form.Item>
                    {getFieldDecorator('email', {
                      validateTrigger: ['onBlur'],
                      rules: [{ validator: this.validateEmailValue }],
                      initialValue: get(
                        _source,
                        'email',
                        get(_source, 'email', '')
                      ),
                    })(
                      <TextInputStyled
                        padding="0px 15px 0px 30px"
                        prefix={<img style={iconSize} src={mailIcon} alt="" />}
                        placeholder="Enter email"
                      />
                    )}
                  </Form.Item>
                </Field>
              )}
              <Field name="password">
                <FieldLabel>Password</FieldLabel>
                <Form.Item>
                  {getFieldDecorator('password')(
                    <TextInputStyled
                      padding="0px 15px 0px 30px"
                      prefix={<img style={iconSize} src={keyIcon} alt="" />}
                      type="password"
                      autoComplete="off"
                      placeholder="Enter Password"
                      data-cy="passwordTextBox"
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
                      autoComplete="off"
                      placeholder="Confirm Password"
                      data-cy="confirmPasswordTextBox"
                    />
                  )}
                </Form.Item>
              </Field>
            </Panel>
            {showAdditionalFields && (
              <Panel header={AdditionalDetailsHeader} key="additional">
                <Field name="sisId">
                  <FieldLabel>SIS ID</FieldLabel>
                  <Form.Item>
                    {getFieldDecorator('sisId', {
                      initialValue: get(_source, 'sisId', ''),
                    })(<TextInputStyled placeholder="Enter SIS ID" />)}
                  </Form.Item>
                </Field>
                <Field name="studentNumber">
                  <FieldLabel>Student Number</FieldLabel>
                  <Form.Item>
                    {getFieldDecorator('studentNumber', {
                      initialValue: get(_source, 'studentNumber', ''),
                    })(<TextInputStyled placeholder="Enter Student Number" />)}
                  </Form.Item>
                </Field>
                <Field name="frlStatus">
                  <FieldLabel>Free Reduced Lunch</FieldLabel>
                  <Form.Item>
                    {getFieldDecorator('frlStatus', {
                      initialValue: get(_source, 'frlStatus', ''),
                    })(
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
                    {getFieldDecorator('iepStatus', {
                      initialValue: get(_source, 'iepStatus', ''),
                    })(
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
                    {getFieldDecorator('ellStatus', {
                      initialValue: get(_source, 'ellStatus', ''),
                    })(
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
                    {getFieldDecorator('sedStatus', {
                      initialValue: get(_source, 'sedStatus', ''),
                    })(
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
                    {getFieldDecorator('hispanicEthnicity', {
                      initialValue: get(_source, 'hispanicEthnicity', ''),
                    })(
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
                    {getFieldDecorator('race', {
                      initialValue: get(_source, 'race', ''),
                    })(<TextInputStyled placeholder="Race" />)}
                  </Form.Item>
                </Field>
                <Field name="dob" optional>
                  <FieldLabel>DOB</FieldLabel>
                  <Form.Item>
                    {getFieldDecorator('dob', {
                      initialValue: dobValue ? moment(dobValue) : null,
                    })(<DatePickerStyled format="DD MMM, YYYY" />)}
                  </Form.Item>
                </Field>
                <Field name="gender">
                  <FieldLabel>Gender</FieldLabel>
                  <Form.Item>
                    {getFieldDecorator('gender', {
                      initialValue: get(_source, 'gender', ''),
                    })(
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
                    {getFieldDecorator('contactEmails', {
                      initialValue: contactEmails
                        ? contactEmails.join(',')
                        : '',
                    })(
                      <TextInputStyled placeholder="Enter email comma separated..." />
                    )}
                  </Form.Item>
                </Field>
                <Field name="tts">
                  <FieldLabel>Enable Text To Speech</FieldLabel>
                  <Form.Item>
                    {getFieldDecorator('tts', {
                      initialValue: get(_source, 'tts', ''),
                    })(
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
              </Panel>
            )}
          </Collapse>
        </Form>
      </CustomModalStyled>
    )
  }
}
export const UserFormModal = Form.create({ name: 'user_form_modal' })(UserForm)
