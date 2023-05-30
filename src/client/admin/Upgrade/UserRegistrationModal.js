import React from 'react'
import { Form, Modal, Input } from 'antd'
import { ACCESS_WITHOUT_SCHOOL } from '@edulastic/constants/const/signUpState'
import {
  TextInputStyled,
  notification,
  EduIf,
  EduElse,
  EduThen,
} from '@edulastic/common'

import { userApi } from '@edulastic/api'
import { EMAIL_PATTERN_FORMAT } from '../Components/CustomReportModal'
import DistrictSearchBox from './DistrictSearchBox'
import UserRegistrationModalFooter from './UserRegistrationModalFooter'

const { TextArea } = Input

const ADD_USER_STATUS = {
  SUCCESS: 'SUCCESS',
  FAILED_USER_EXISTS: 'FAILED_USER_EXISTS',
}

const UserRegistrationModal = Form.create({
  name: 'userRegistrationModal',
})(
  ({
    form: { getFieldDecorator, validateFields },
    fieldData,
    setFieldData,
    t,
  }) => {
    const layout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 16 },
    }

    const handleOk = (e) => {
      e.preventDefault()
      validateFields(async (err, values) => {
        if (!err) {
          const emailIdArray = !fieldData.isMultipleEmails
            ? [values.email]
            : values.emailIdsArray
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean)
          const emailValidationError = emailIdArray.some(
            (emailId) => !new RegExp(EMAIL_PATTERN_FORMAT).test(emailId)
          )

          if (fieldData.isMultipleEmails && emailValidationError)
            return notification({
              type: 'warn',
              messageKey: 'multipleEmailIdError',
            })
          const data = {
            districtId: values.districtSearchValue?.key,
            userDetails: emailIdArray,
            userSignUpState: ACCESS_WITHOUT_SCHOOL,
          }
          try {
            const result = await userApi.adddBulkTeacher(data)
            const isTeacherExist = result?.some(
              ({ status }) => status === ADD_USER_STATUS.FAILED_USER_EXISTS
            )
            notification({
              type: isTeacherExist ? 'warn' : 'success',
              messageKey: isTeacherExist
                ? 'teacherAlreadyAdded'
                : fieldData.isMultipleEmails
                ? 'multipleTeacherAddedSuccess'
                : 'teacherAddedSuccess',
            })

            setFieldData({
              ...fieldData,
              isModal: false,
              isMultipleEmails: false,
              username: '',
            })
          } catch (error) {
            notification({
              type: 'warn',
              msg: error?.response?.data?.message,
            })
          }
        }
      })
    }

    const handleCancel = () =>
      setFieldData({
        ...fieldData,
        isModal: false,
        isMultipleEmails: false,
        username: '',
      })

    return (
      <Modal
        title={
          fieldData.isMultipleEmails
            ? t('manageByUser.userRegistration.modalTitles')
            : t('manageByUser.userRegistration.modalTitle')
        }
        visible={fieldData.isModal}
        width="570px"
        zIndex={13}
        onCancel={handleCancel}
        footer={
          <UserRegistrationModalFooter
            handleCancel={handleCancel}
            handleOk={handleOk}
            t={t}
          />
        }
      >
        <Form {...layout}>
          <EduIf condition={!fieldData.isMultipleEmails}>
            <EduThen>
              <Form.Item
                label={t('manageByUser.userRegistration.emailInputField')}
              >
                {getFieldDecorator('email', {
                  rules: [
                    {
                      required: !fieldData.isMultipleEmails,
                      message: t(
                        'manageByUser.userRegistration.requestToProvideEmail'
                      ),
                    },
                    {
                      type: 'email',
                      message: t(
                        'manageByUser.userRegistration.requestToProvideValidEmail'
                      ),
                    },
                  ],
                  initialValue: fieldData.username,
                })(
                  <TextInputStyled
                    padding="0px 12px"
                    style={{ fontWeight: 500 }}
                    placeholder={t(
                      'manageByUser.userRegistration.placeholderEmailId'
                    )}
                  />
                )}
              </Form.Item>
            </EduThen>

            <EduElse>
              <Form.Item
                label={t('manageByUser.userRegistration.emailInputFields')}
              >
                {getFieldDecorator('emailIdsArray', {
                  rules: [
                    {
                      required: fieldData.isMultipleEmails,
                      message: t(
                        'manageByUser.userRegistration.requestToProvideEmails'
                      ),
                    },
                  ],
                  initialValue: fieldData.checkedList.join(', '),
                })(
                  <TextArea
                    data-cy="userInput"
                    rows={4}
                    placeholder={t(
                      'manageByUser.userRegistration.placeholderEmailIds'
                    )}
                  />
                )}
              </Form.Item>
            </EduElse>
          </EduIf>

          <Form.Item label={t('manageByUser.userRegistration.districtField')}>
            {getFieldDecorator('districtSearchValue', {
              rules: [
                {
                  required: true,
                  message: t(
                    'manageByUser.userRegistration.requestToProvedDistrict'
                  ),
                },
              ],
            })(<DistrictSearchBox />)}
          </Form.Item>
        </Form>
      </Modal>
    )
  }
)

export default UserRegistrationModal
