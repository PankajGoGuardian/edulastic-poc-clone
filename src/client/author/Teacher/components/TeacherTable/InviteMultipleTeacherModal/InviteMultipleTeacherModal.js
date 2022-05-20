import { CustomModalStyled, EduButton } from '@edulastic/common'
import { Col, Form, Row } from 'antd'
import React, { Component } from 'react'
import { ButtonsContainer, ModalFormItem } from '../../../../../common/styled'
import { PlaceHolderText, StyledTextArea, TextWrapper } from './styled'

class InviteMultipleTeacherModal extends Component {
  constructor(props) {
    super(props)
    this.state = { placeHolderVisible: true }
  }

  onInviteTeachers = () => {
    const { addTeachers, userOrgId: districtId, closeModal } = this.props

    this.props.form.validateFields((err, row) => {
      if (!err) {
        const { teachersList } = row
        const userDetails = teachersList
          .split(/;|\n/)
          .map((x) => x.trim())
          .filter((_o) => _o.length)
        addTeachers({ districtId, userDetails })
        closeModal()
      }
    })
  }

  onCloseModal = () => {
    this.props.closeModal()
  }

  handleChangeTextArea = (e) => {
    if (e.target.value.length > 0) this.setState({ placeHolderVisible: false })
    else this.setState({ placeHolderVisible: true })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { modalVisible, t } = this.props
    const { placeHolderVisible } = this.state
    return (
      <CustomModalStyled
        visible={modalVisible}
        title={t('users.teacher.inviteteacher.title')}
        onOk={this.onInviteTeachers}
        onCancel={this.onCloseModal}
        maskClosable={false}
        centered
        footer={[
          <ButtonsContainer>
            <EduButton isGhost onClick={this.onCloseModal}>
              {t('users.teacher.inviteteacher.nocancel')}
            </EduButton>
            <EduButton onClick={this.onInviteTeachers}>
              {t('users.teacher.inviteteacher.yesadd')}
            </EduButton>
          </ButtonsContainer>,
        ]}
      >
        <Row>
          <TextWrapper span={24}>
            {t('users.teacher.inviteteacher.text1')}
            <br />
            {t('users.teacher.inviteteacher.text2')}
          </TextWrapper>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem>
              <PlaceHolderText visible={placeHolderVisible}>
                Enter email like...
                <br />
                john.doe@yourschool.com
                <br />
                john.doe@yourschool.com
                <br />
                ...
              </PlaceHolderText>
              {getFieldDecorator('teachersList', {
                rules: [
                  {
                    required: true,
                    message: 'Please input Teacher Email',
                  },
                ],
              })(
                <StyledTextArea
                  data-testid="text-area"
                  row={10}
                  onChange={this.handleChangeTextArea}
                />
              )}
            </ModalFormItem>
          </Col>
        </Row>
      </CustomModalStyled>
    )
  }
}

const InviteMultipleTeacherModalForm = Form.create()(InviteMultipleTeacherModal)
export default InviteMultipleTeacherModalForm
