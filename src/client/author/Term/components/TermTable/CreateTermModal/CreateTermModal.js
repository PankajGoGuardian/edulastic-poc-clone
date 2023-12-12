import {
  CustomModalStyled,
  DatePickerStyled,
  EduButton,
  FieldLabel,
  TextInputStyled,
} from '@edulastic/common'
import { Col, Form, Row } from 'antd'
import * as moment from 'moment'
import React from 'react'
import { ModalFormItem } from './styled'

class CreateTermModal extends React.Component {
  constructor(props) {
    super(props)

    const dataSource = [...this.props.dataSource]
    let startDate
    let endDate
    let defaultSchoolYear

    if (dataSource.length > 0) {
      startDate = moment(dataSource[0].endDate)
        .utc()
        .add(1, 'day')
        .set('hour', 0)
        .set('minute', 0)
        .set('second', 0)
        .set('millisecond', 0)
      endDate = moment(dataSource[0].endDate)
        .utc()
        .add(1, 'years')
        .set('hour', 23)
        .set('minute', 59)
        .set('second', 59)
        .set('millisecond', 999)
      defaultSchoolYear = `${startDate.format('YYYY')}-${endDate.format(
        'YYYY'
      )}`
    } else {
      startDate = moment(new Date())
        .utc()
        .add(1, 'day')
        .set('hour', 0)
        .set('minute', 0)
        .set('second', 0)
        .set('millisecond', 0)
      endDate = moment(new Date())
        .utc()
        .add(1, 'years')
        .set('hour', 23)
        .set('minute', 59)
        .set('second', 59)
        .set('millisecond', 999)
      defaultSchoolYear = `${startDate.format('YYYY')}-${endDate.format(
        'YYYY'
      )}`
    }

    this.state = {
      startDate,
      endDate,
      defaultSchoolYear,
    }
  }

  handleStartDateChange = (value) => {
    this.setState({ startDate: value })
  }

  handleEndDateChange = (value) => {
    this.setState({ endDate: value })
  }

  onCreateTerm = () => {
    this.props.form.validateFields((err, row) => {
      if (!err) {
        if (row.startDate.valueOf() > row.endDate.valueOf()) return
        this.props.createTerm(row)
      }
    })
  }

  onCloseModal = () => {
    this.props.closeModal()
  }

  checkSchoolNameUnique = (rule, value, callback) => {
    const sameSchoolNameRow = this.props.dataSource.filter(
      (item) => item.name === value
    )
    if (sameSchoolNameRow.length <= 0) {
      callback()
      return
    }
    callback('School name should be unique.')
  }

  disableEndDate = (endValue) => {
    const { startDate } = this.state
    const toDayDate = moment(new Date(), 'DD MMM YYYY')
    toDayDate.set({ hour: 0, minute: 0, second: 0, millisecond: 0 })

    if (startDate >= endValue.valueOf()) return true
    if (toDayDate.valueOf() > endValue.valueOf()) return true
    return false
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { modalVisible } = this.props
    const { startDate, endDate, defaultSchoolYear } = this.state

    return (
      <CustomModalStyled
        visible={modalVisible}
        title="Create School Year"
        onOk={this.onCreateTerm}
        onCancel={this.onCloseModal}
        maskClosable={false}
        centered
        footer={[
          <EduButton isGhost key="back" onClick={this.onCloseModal}>
            No, Cancel
          </EduButton>,
          <EduButton type="primary" key="submit" onClick={this.onCreateTerm}>
            Yes, Create {'>'}
          </EduButton>,
        ]}
      >
        <Row>
          <Col span={24}>
            <ModalFormItem>
              <FieldLabel>School Year Name</FieldLabel>
              {getFieldDecorator('name', {
                rules: [
                  {
                    required: true,
                    message: 'Please input School Year Name',
                  },
                  { validator: this.checkSchoolNameUnique },
                ],
                initialValue: defaultSchoolYear,
              })(<TextInputStyled placeholder="Enter School Year Name" />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem>
              <FieldLabel>Start Date</FieldLabel>
              {getFieldDecorator('startDate', {
                initialValue: startDate,
              })(<DatePickerStyled format="DD MMM YYYY" disabled />)}
            </ModalFormItem>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <ModalFormItem>
              <FieldLabel>End Date</FieldLabel>
              {getFieldDecorator('endDate', {
                rules: [{ required: true, message: 'Please Select End Date' }],
                initialValue: endDate,
              })(
                <DatePickerStyled
                  format="DD MMM YYYY"
                  onChange={this.handleEndDateChange}
                  disabledDate={this.disableEndDate}
                />
              )}
            </ModalFormItem>
          </Col>
        </Row>
      </CustomModalStyled>
    )
  }
}

const CreateTermModalForm = Form.create()(CreateTermModal)
export default CreateTermModalForm
