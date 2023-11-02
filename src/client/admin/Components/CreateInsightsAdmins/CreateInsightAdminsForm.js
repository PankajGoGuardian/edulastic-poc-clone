import { schoolApi, userApi } from '@edulastic/api'
import { EduButton, notification } from '@edulastic/common'
import { Col, Form, Input, Row, Select, Spin } from 'antd'
import React, { useState } from 'react'
import { validateEmail } from '../../../common/utils/helpers'
import { FormItem, LeftButtonsContainer, StyledSelect } from './styled'

const { TextArea } = Input
const Option = Select.Option

const INITIAL_VALIDATION = {
  status: 'success',
  message: '',
}

const CreateInsightsAdminsForm = ({
  form,
  isCreatingDistrictAdmin,
  isCreatingSchoolAdmin,
  districtId,
  onCancel,
  t,
}) => {
  const [validation, setValidation] = useState(INITIAL_VALIDATION)

  const [schoolList, setSchoolList] = useState([])

  const [fetching, setFetching] = useState(false)

  const handleChange = (value) => {
    form.setFieldsValue({ institutionIds: value })
    setFetching(false)
    setSchoolList([])
    setValidation({
      status: '',
      message: '',
    })
  }

  const resetFields = () => {
    form.resetFields()
  }

  const createInsightsAdmins = async (createAdminsReq) => {
    createAdminsReq.role = isCreatingDistrictAdmin
      ? 'district-admin'
      : 'school-admin'
    createAdminsReq.districtId = districtId
    try {
      await userApi.addBulkAdminsAdminTool(createAdminsReq)
      notification({
        type: 'success',
        msg: `Insights ${
          isCreatingDistrictAdmin ? 'District Admin' : 'School Admin'
        } created successfully`,
      })
      resetFields()
    } catch (error) {
      notification({ msg: error.message, messageKey: 'apiFormErr' })
    }
  }

  const fetchSchool = async (value) => {
    setFetching(true)
    setSchoolList([])
    const isSchoolId = (value || '').match(/^[0-9a-fA-F]{24}$/)
    let searchParam = {}
    if (value && !isSchoolId) {
      searchParam = { search: { name: [{ type: 'cont', value }] } }
    }
    const schoolListData = await schoolApi.getSchools({
      districtId,
      limit: 25,
      page: 1,
      sortField: 'name',
      order: 'asc',
      ...searchParam,
      schoolIds: isSchoolId ? [value] : [],
    })
    setSchoolList(schoolListData.data)
    setFetching(false)
  }
  const validateEmails = (rule, value, callback) => {
    setValidation({ status: '', message: '' })
    if (value) {
      const emails = value.split(',')?.map((v) => v.trim())
      const invalidEmail = emails.find((userEmail) => !validateEmail(userEmail))
      if (invalidEmail) {
        setValidation({ status: 'error', message: 'Invalid email Id' })
        callback(`Please check and enter all valid email Ids - ${invalidEmail}`)
      } else {
        setValidation({ status: '', message: '' })
      }
      callback()
    }
    callback()
  }
  const validateNames = (rule, value, callback) => {
    setValidation({ status: '', message: '' })
    if (value) {
      const emails = form
        .getFieldValue('emails')
        .split(',')
        ?.map((v) => v.trim())
      const names = value.split(',')?.map((v) => v.trim())
      if (emails.length !== names.length) {
        setValidation({
          status: 'error',
          message: 'Number of names and emails should be same',
        })
        callback('Number of names and emails should be same')
      }
    }
    callback()
  }

  const onCreateInsightAdmins = async () => {
    form.validateFields((err, row) => {
      if (!err) {
        console.log('success.....')
        const emails = form
          .getFieldValue('emails')
          .split(',')
          ?.map((v) => v.trim())
        const names = form
          .getFieldValue('names')
          .split(',')
          ?.map((v) => v.trim())
        let personIds = []
        let schoolId
        if (form.getFieldValue('personIds')) {
          personIds = form
            .getFieldValue('personIds')
            .split(',')
            ?.map((v) => v.trim())
        }
        if (form.getFieldValue('institutionIds')) {
          const institutionIds = form
            .getFieldValue('institutionIds')
            .map((each) => each.key)
          if (institutionIds.length > 1) {
            setValidation({
              status: 'error',
              message: 'Number of names and emails should be same',
            })
            notification({
              messageKey: 'apiFormErr',
              msg: 'Please select only one school to create the admin',
            })
            return
          }
          schoolId = institutionIds[0]
        }
        createInsightsAdmins({
          emails,
          names,
          personIds,
          schoolId,
        })
      }
    })
  }

  const { getFieldDecorator } = form

  return (
    <>
      {isCreatingSchoolAdmin && (
        <>
          <Row>
            <Col span={24}>
              <FormItem label={t('users.schooladmin.school')}>
                {getFieldDecorator('institutionIds', {
                  rules: [
                    {
                      required: true,
                      message: t(
                        'users.schooladmin.createsa.validations.school'
                      ),
                    },
                  ],
                })(
                  <StyledSelect
                    mode="multiple"
                    dropdownClassName="dropdown-custom-menu"
                    labelInValue
                    placeholder={t('users.schooladmin.createsa.selectschool')}
                    notFoundContent={fetching ? <Spin size="small" /> : null}
                    filterOption={false}
                    onSearch={fetchSchool}
                    onChange={handleChange}
                    onFocus={fetchSchool}
                    getPopupContainer={(triggerNode) => triggerNode.parentNode}
                    optionLabelProp="label"
                  >
                    {schoolList.map((school) => (
                      <Option
                        key={school._id}
                        value={school._id}
                        label={school._source.name}
                      >
                        <p>
                          {school._source.name}{' '}
                          <span style={{ color: 'red' }}> ({school._id}) </span>
                        </p>
                      </Option>
                    ))}
                  </StyledSelect>
                )}
              </FormItem>
            </Col>
          </Row>
        </>
      )}

      <Row>
        <Col span={24}>
          <FormItem label="Emails / Usernames">
            {getFieldDecorator('emails', {
              validateTrigger: ['onBlur'],
              rules: [
                {
                  required: true,
                  message: 'Emails field can not be empty',
                },
                {
                  validator: validateEmails,
                },
              ],
            })(
              <TextArea
                data-cy="emailsInput"
                rows={4}
                placeholder="Enter comma separated  email ids..."
              />
            )}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem label="Full Names">
            {getFieldDecorator('names', {
              validateTrigger: ['onBlur'],
              rules: [
                {
                  required: true,
                  message: 'Full names field can not be empty',
                },
                {
                  validator: validateNames,
                },
              ],
            })(
              <TextArea
                data-cy="namesInput"
                rows={4}
                placeholder="Enter comma separated full  names like Annie Newsome,FirstName LastName"
              />
            )}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem label="Person Ids">
            {getFieldDecorator('personIds', {
              rules: [
                {
                  required: false,
                },
              ],
            })(
              <TextArea
                data-cy="personIds"
                rows={4}
                placeholder="Enter comma separated person's Ids..."
              />
            )}
          </FormItem>
        </Col>
      </Row>

      <LeftButtonsContainer>
        <EduButton onClick={onCancel}>
          {t('users.districtadmin.createda.nocancel')}
        </EduButton>
        <EduButton
          disabled={validation.status === 'error'}
          onClick={onCreateInsightAdmins}
        >
          {t('users.districtadmin.createda.yescreate')}
        </EduButton>
      </LeftButtonsContainer>
    </>
  )
}

export default Form.create()(CreateInsightsAdminsForm)
