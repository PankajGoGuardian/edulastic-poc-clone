import React, { useState } from 'react'
import { Col, Form, Row, Select, Spin, Input } from 'antd'
import { authApi, schoolApi, userApi } from '@edulastic/api'
import { CheckboxLabel, EduButton, notification } from '@edulastic/common'
import { validateEmail } from '../../../common/utils/helpers'
import { LeftButtonsContainer, FormItem, StyledSelect } from './styled'

const Option = Select.Option

const INITIAL_EMAIL_VALIDATION = {
  status: 'success',
  message: '',
}

const CreateAdminForm = ({
  form,
  isCreatingDistrictAdmin,
  isCreatingSchoolAdmin,
  districtId,
  onCancel,
  t,
}) => {
  const [emailValidation, setEmailValidation] = useState(
    INITIAL_EMAIL_VALIDATION
  )
  const [email, setEmail] = useState('')

  const [schoolList, setSchoolList] = useState([])
  const [isPowerTeacher, setIsPowerTeacher] = useState(false)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [fetching, setFetching] = useState(false)

  const handleChange = (value) => {
    form.setFieldsValue({ institutionIds: value })
    setFetching(false)
    setSchoolList([])
  }

  const changePowerTool = (e) => setIsPowerTeacher(e.target.checked)

  const changeIsSuperAdmin = (e) => setIsSuperAdmin(e.target.checked)

  const resetFields = () => {
    form.resetFields()
    setEmail('')
    setIsPowerTeacher(false)
    setIsSuperAdmin(false)
  }

  const createAdmin = async (createReq) => {
    createReq.role = isCreatingDistrictAdmin ? 'district-admin' : 'school-admin'
    createReq.districtId = districtId

    try {
      await userApi.createUser(createReq)
      notification({
        type: 'success',
        msg: `${
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

  const onCreateAdmin = async () => {
    let checkUserResponse = { userExists: true }
    if (emailValidation.status === 'success' && email.length > 0) {
      checkUserResponse = await authApi.checkUserExist({ email })
      if (
        checkUserResponse.userExists &&
        ((checkUserResponse.role === 'district-admin' &&
          isCreatingDistrictAdmin) ||
          (checkUserResponse.role === 'school-admin' && isCreatingSchoolAdmin))
      ) {
        setEmailValidation({
          status: 'error',
          message: 'Username already exists',
        })
      }
    } else if (email.length == 0) {
      setEmailValidation({
        status: 'error',
        message: 'Please input Email',
      })
    } else if (validateEmail(email)) {
      setEmailValidation({
        status: 'error',
        message: 'Username already exists',
      })
    } else {
      setEmailValidation({
        status: 'error',
        message: 'Please input valid Email',
      })
    }

    form.validateFields((err, row) => {
      if (!err) {
        if (
          checkUserResponse.userExists &&
          ((checkUserResponse.role === 'district-admin' &&
            isCreatingDistrictAdmin) ||
            (checkUserResponse.role === 'school-admin' &&
              isCreatingSchoolAdmin))
        )
          return

        const firstName = row.name.split(' ', 1)
        let lastName = ''
        if (firstName.length < row.name.length) {
          const lastNameIndex = firstName[0].length + 1
          lastName = row.name.substr(lastNameIndex, row.name.length)
        }
        const newUser = {
          firstName: firstName[0],
          lastName,
          password: row.password,
          email,
        }
        if (isSuperAdmin) {
          newUser.permissions = ['super_admin']
        }
        if (isCreatingSchoolAdmin) {
          newUser.institutionIds = row.institutionIds.map((each) => each.key)
          newUser.isPowerTeacher = isPowerTeacher
        }
        createAdmin(newUser)
      }
    })
  }

  const changeEmail = (e) => {
    setEmail(e.target.value)
    if (e.target.value.length === 0) {
      setEmailValidation({
        status: 'error',
        message: 'Please input Email',
      })
    } else if (validateEmail(e.target.value)) {
      setEmailValidation({
        status: 'success',
        message: '',
      })
    } else {
      setEmailValidation({
        status: 'error',
        message: 'Please input valid Email',
      })
    }
  }

  const { getFieldDecorator } = form
  const { status, message } = emailValidation

  return (
    <>
      <Row>
        <Col span={24}>
          <FormItem label={t('users.districtadmin.name')}>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: t('users.districtadmin.createda.validations.name'),
                },
              ],
            })(
              <Input
                placeholder={t('users.districtadmin.createda.entername')}
              />
            )}
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem
            label={t('users.districtadmin.username')}
            validateStatus={status}
            help={message}
            required
            type="email"
          >
            <Input
              placeholder={t('users.districtadmin.createda.enterusername')}
              autocomplete="new-password"
              onChange={changeEmail}
              value={email}
            />
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <FormItem label={t('users.districtadmin.password')}>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                  message: t(
                    'users.districtadmin.createda.validations.password'
                  ),
                },
              ],
            })(
              <Input
                placeholder={t('users.districtadmin.createda.enterpassword')}
                type="password"
                autocomplete="new-password"
                data-cy="passwordTextBox"
              />
            )}
          </FormItem>
        </Col>
      </Row>
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
          <Row>
            <Col span={24}>
              <CheckboxLabel
                checked={isPowerTeacher}
                onChange={changePowerTool}
              >
                {t('users.schooladmin.powertools')}
              </CheckboxLabel>
            </Col>
          </Row>
        </>
      )}
      <Row>
        <Col>
          <CheckboxLabel checked={isSuperAdmin} onChange={changeIsSuperAdmin}>
            {t('users.schooladmin.superAdmin')}
          </CheckboxLabel>
        </Col>
      </Row>
      <LeftButtonsContainer>
        <EduButton isGhost onClick={onCancel}>
          {t('users.districtadmin.createda.nocancel')}
        </EduButton>
        <EduButton
          disabled={emailValidation.status === 'error'}
          onClick={onCreateAdmin}
        >
          {t('users.districtadmin.createda.yescreate')}
        </EduButton>
      </LeftButtonsContainer>
    </>
  )
}

export default Form.create()(CreateAdminForm)
