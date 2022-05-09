import { schoolApi } from '@edulastic/api'
import {
  CustomModalStyled,
  EduButton,
  TextInputStyled,
} from '@edulastic/common'
import { Col, Form, Row, Tooltip } from 'antd'
import React, { Component } from 'react'
import { ButtonsContainer, ModalFormItem } from '../../../../../common/styled'
import { StyledSpin, StyledSpinContainer } from './styled'

class EditSchoolModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      nameValidate: {
        value: this.props.schoolData.name,
        validateStatus: 'success',
        validateMsg: '',
      },
      isValuesChanged: false,
      showSpin: false,
      checkSchoolExist: { totalSchools: 0, data: [] },
    }
    this.onUpdateSchool = this.onUpdateSchool.bind(this)
  }

  onUpdateSchool = async () => {
    const { nameValidate } = this.state
    let checkSchoolExist = { ...this.state.checkSchoolExist }

    if (
      nameValidate.validateStatus === 'success' &&
      nameValidate.value.length > 0
    ) {
      this.setState({ showSpin: true })
      checkSchoolExist = await schoolApi.getSchools({
        districtId: this.props.userOrgId,
        search: {
          name: [
            {
              type: 'eq',
              value: nameValidate.value,
            },
          ],
        },
      })
      this.setState({ showSpin: false, checkSchoolExist })

      if (
        checkSchoolExist.totalSchools > 0 &&
        checkSchoolExist.data[0]._id !== this.props.schoolData._id
      ) {
        this.setState({
          nameValidate: {
            value: nameValidate.value,
            validateStatus: 'error',
            validateMsg: 'School name already exists',
          },
        })
      }
    } else if (nameValidate.value.length == 0) {
      this.setState({
        nameValidate: {
          value: nameValidate.value,
          validateStatus: 'error',
          validateMsg: 'Please input school name',
        },
      })
    }

    this.props.form.validateFields((err, row) => {
      if (!err) {
        if (
          checkSchoolExist.totalSchools > 0 &&
          checkSchoolExist.data[0]._id !== this.props.schoolData._id
        )
          return
        row.key = this.props.schoolData.key
        this.props.updateSchool(row)
      }
    })
  }

  onCloseModal = () => {
    this.props.closeModal()
  }

  checkIsValueUpdated = (e, fieldName) => {
    let values
    this.props.form.validateFields((err, val) => {
      values = val
    })
    const { schoolData } = this.props
    values[fieldName] = e.target.value
    const { name, address, zip, city, state } = values
    if (
      schoolData.name !== name.trim() ||
      schoolData.address !== address.trim() ||
      schoolData.zip !== zip.trim() ||
      schoolData.city !== city.trim() ||
      schoolData.state !== state.trim()
    ) {
      this.setState({ isValuesChanged: true })
      return
    }
    this.setState({ isValuesChanged: false })
  }

  changeSchoolName = (e) => {
    if (e.target.value.length == 0) {
      this.setState({
        nameValidate: {
          value: e.target.value,
          validateStatus: 'error',
          validateMsg: 'Please input school name',
        },
        checkSchoolExist: { totalSchools: 0, data: [] },
      })
    } else {
      this.checkIsValueUpdated(e, 'name')
      this.setState({
        nameValidate: {
          value: e.target.value,
          validateStatus: 'success',
          validateMsg: '',
        },
        checkSchoolExist: { totalSchools: 0, data: [] },
      })
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { modalVisible, schoolData, t } = this.props
    const { nameValidate, showSpin, isValuesChanged } = this.state

    return (
      <CustomModalStyled
        visible={modalVisible}
        title={t('school.editschool')}
        onOk={this.onUpdateSchool}
        onCancel={this.onCloseModal}
        maskClosable={false}
        centered
        footer={[
          <ButtonsContainer>
            <EduButton isGhost onClick={this.onCloseModal}>
              {t('common.cancel')}
            </EduButton>
            <Tooltip
              title={
                !isValuesChanged ? 'No change to update.' : 'Update School'
              }
            >
              <div>
                <EduButton
                  onClick={this.onUpdateSchool}
                  disabled={showSpin || !isValuesChanged}
                >
                  {t('school.updateschool')}
                </EduButton>
              </div>
            </Tooltip>
          </ButtonsContainer>,
        ]}
      >
        <Row>
          <Col span={24}>
            <ModalFormItem
              label={t('school.name')}
              validateStatus={nameValidate.validateStatus}
              help={nameValidate.validateMsg}
              required
            >
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: t('school.validations.name'),
                  },
                ],
                initialValue: schoolData.name,
              })(
                <TextInputStyled
                  placeholder={t('school.components.createschool.name')}
                  onChange={this.changeSchoolName}
                  maxLength={128}
                />
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t('school.address')}>
              {getFieldDecorator('address', {
                initialValue: schoolData.address,
              })(
                <TextInputStyled
                  placeholder={t('school.components.createschool.address')}
                  onChange={(e) => this.checkIsValueUpdated(e, 'address')}
                />
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem label={t('school.city')}>
              {getFieldDecorator('city', {
                initialValue: schoolData.city,
              })(
                <TextInputStyled
                  placeholder={t('school.components.createschool.city')}
                  onChange={(e) => this.checkIsValueUpdated(e, 'city')}
                />
              )}
            </ModalFormItem>
          </Col>
        </Row>
        <Row gutter={20}>
          <Col span={12}>
            <ModalFormItem label={t('school.zip')}>
              {getFieldDecorator('zip', {
                rules: [
                  {
                    required: true,
                    message: t('school.validations.zip'),
                  },
                ],
                initialValue: schoolData.zip,
              })(
                <TextInputStyled
                  placeholder={t('school.components.createschool.zip')}
                  onChange={(e) => this.checkIsValueUpdated(e, 'zip')}
                />
              )}
            </ModalFormItem>
          </Col>
          <Col span={12}>
            <ModalFormItem label={t('school.state')}>
              {getFieldDecorator('state', {
                initialValue: schoolData.state,
              })(
                <TextInputStyled
                  placeholder={t('school.components.createschool.state')}
                  onChange={(e) => this.checkIsValueUpdated(e, 'state')}
                />
              )}
            </ModalFormItem>
          </Col>
        </Row>
        {showSpin && (
          <StyledSpinContainer>
            <StyledSpin size="large" />
          </StyledSpinContainer>
        )}
      </CustomModalStyled>
    )
  }
}

const EditSchoolModalForm = Form.create()(EditSchoolModal)
export default EditSchoolModalForm
