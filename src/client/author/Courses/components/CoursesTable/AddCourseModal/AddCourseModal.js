import {
  CustomModalStyled,
  EduButton,
  FieldLabel,
  TextInputStyled,
} from '@edulastic/common'
import { Col, Form, Row } from 'antd'
import { get } from 'lodash'
import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { ButtonsContainer, ModalFormItem } from '../../../../../common/styled'
import { StyledSpin, StyledSpinContainer } from './styled'

class AddCourseModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      nameValidate: {
        value: '',
        validateStatus: 'success',
        validateMsg: '',
      },
      showSpin: false,
      numberValidate: {
        value: '',
        validateStatus: 'success',
        validateMsg: '',
      },
    }
  }

  onAddCourse = async () => {
    const { nameValidate, numberValidate } = this.state

    if (nameValidate.value.length == 0) {
      this.setState({
        nameValidate: {
          value: nameValidate.value,
          validateMsg: 'Please input course name',
          validateStatus: 'error',
        },
      })
    }

    if (numberValidate.value.length == 0) {
      this.setState({
        numberValidate: {
          value: numberValidate.value,
          validateMsg: 'Please input course number',
          validateStatus: 'error',
        },
      })
    }

    // check if name is exist
    if (
      nameValidate.validateStatus === 'success' &&
      nameValidate.value.length > 0 &&
      numberValidate.validateStatus === 'success' &&
      numberValidate.value.length > 0
    ) {
      this.props.addCourse({
        name: nameValidate.value,
        number: numberValidate.value,
      })
    }
  }

  onCloseModal = () => {
    this.props.closeModal()
  }

  handleCourseName = (e) => {
    if (e.target.value.length == 0) {
      this.setState({
        nameValidate: {
          value: e.target.value,
          validateStatus: 'error',
          validateMsg: 'Please input course name',
        },
      })
    } else {
      this.setState({
        nameValidate: {
          value: e.target.value,
          validateStatus: 'success',
          validateMsg: '',
        },
      })
    }

    const numberValidate = { ...this.state.numberValidate }
    if (numberValidate.value.length > 0) {
      this.setState({
        numberValidate: {
          value: numberValidate.value,
          validateStatus: 'success',
          validateMsg: '',
        },
      })
    }
  }

  handleCourseNumber = (e) => {
    if (e.target.value.length == 0) {
      this.setState({
        numberValidate: {
          value: e.target.value,
          validateStatus: 'error',
          validateMsg: 'Please input course number',
        },
      })
    } else {
      this.setState({
        numberValidate: {
          value: e.target.value,
          validateStatus: 'success',
          validateMsg: '',
        },
      })
    }

    const nameValidate = { ...this.state.nameValidate }
    if (nameValidate.value.length > 0) {
      this.setState({
        nameValidate: {
          value: nameValidate.value,
          validateStatus: 'success',
          validateMsg: '',
        },
      })
    }
  }

  render() {
    const { modalVisible, t } = this.props
    const { nameValidate, numberValidate, showSpin } = this.state

    return (
      <CustomModalStyled
        visible={modalVisible}
        title={t('course.addcourse')}
        onOk={this.onAddCourse}
        onCancel={this.onCloseModal}
        maskClosable={false}
        centered
        footer={[
          <ButtonsContainer>
            <EduButton
              isGhost
              onClick={this.onCloseModal}
              data-cy="addCourseCancelButton"
            >
              {t('common.cancel')}
            </EduButton>
            <EduButton
              data-cy="addCourseConfirmButton"
              onClick={this.onAddCourse}
            >
              {t('common.add')}
            </EduButton>
          </ButtonsContainer>,
        ]}
      >
        <Row>
          <Col span={24}>
            <ModalFormItem
              name="name"
              validateStatus={nameValidate.validateStatus}
              help={nameValidate.validateMsg}
              required
            >
              <FieldLabel>{t('course.coursename')}</FieldLabel>
              <TextInputStyled
                placeholder={t('course.coursename')}
                onChange={this.handleCourseName}
                data-cy="courseName"
              />
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem
              name="number"
              validateStatus={numberValidate.validateStatus}
              help={numberValidate.validateMsg}
              required
            >
              <FieldLabel>{t('course.coursenumber')}</FieldLabel>
              <TextInputStyled
                placeholder={t('course.coursenumber')}
                onChange={this.handleCourseNumber}
                data-cy="courseNumber"
              />
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

const AddCourseModalForm = Form.create()(AddCourseModal)

const enhance = compose(
  connect((state) => ({
    dataSource: get(state, ['coursesReducer', 'data'], []),
  }))
)

export default enhance(AddCourseModalForm)
