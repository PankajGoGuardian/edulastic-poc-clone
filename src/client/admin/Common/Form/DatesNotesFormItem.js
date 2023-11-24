import React, { useCallback } from 'react'
import { Form, Input, DatePicker } from 'antd'
import styled from 'styled-components'
import moment from 'moment'

import { HeadingSpan } from '../StyledComponents/upgradePlan'
import { subscriptionAdditionalDetails } from '../../Data'

const { TextArea } = Input
const CharacterLimitSpan = styled.span`
  font-size: 12px;
  font-style: italic;
  position: absolute;
  bottom: 100%;
  right: 0;
`

const OuterDiv = styled.div`
  position: relative;
  width: 70%;
  margin-top: 20px;
`

const DatesFormItem = ({
  getFieldDecorator,
  initialStartDate,
  initialEndDate,
}) => {
  const disabledDate = useCallback((val) => val < moment().startOf('day'), [])
  const formLayout = { labelCol: { span: 3 }, labelAlign: 'left' }
  return (
    <>
      <Form.Item label={<HeadingSpan>Start Date</HeadingSpan>} {...formLayout}>
        {getFieldDecorator('subStartDate', {
          rules: [{ required: true }],
          initialValue: initialStartDate,
        })(<DatePicker disabledDate={disabledDate} />)}
      </Form.Item>
      <Form.Item label={<HeadingSpan>End Date</HeadingSpan>} {...formLayout}>
        {getFieldDecorator('subEndDate', {
          rules: [{ required: true }],
          initialValue: initialEndDate,
        })(<DatePicker disabledDate={disabledDate} />)}
      </Form.Item>
    </>
  )
}

DatesFormItem.defaultProps = {
  initialStartDate: moment(),
  initialEndDate: moment().add(365, 'days'),
}

const AdditionalDetailsFormItems = ({ getFieldDecorator }) => {
  const formLayout = {
    labelCol: { span: 3 },
    labelAlign: 'left',
    wrapperCol: { span: 5 },
  }
  const children = subscriptionAdditionalDetails.map((element) => (
    <Form.Item
      label={<HeadingSpan>{element.label}</HeadingSpan>}
      {...formLayout}
    >
      {getFieldDecorator(element.fieldName, {
        type: element.type,
      })(<Input placeholder={element.placeholder} />)}
    </Form.Item>
  ))
  return children
}

const TutorMeFormItems = ({
  getFieldDecorator,
  initialTutorMeStartDate,
  initialTutorMeEndDate,
  getFieldValue,
}) => {
  const tutorMeStartDate = getFieldValue('tutorMeStartDate')
  const tutorMeEndDate = getFieldValue('tutorMeEndDate')
  const disabledStartDate = useCallback(
    (val) => !!tutorMeEndDate && val > moment(tutorMeEndDate).startOf('day'),
    [tutorMeEndDate]
  )
  const disabledEndDate = useCallback(
    (val) =>
      !!tutorMeStartDate && val < moment(tutorMeStartDate).startOf('day'),
    [tutorMeStartDate]
  )
  const formLayout = {
    labelCol: { span: 3 },
    labelAlign: 'left',
    wrapperCol: { span: 5 },
  }
  return (
    <>
      <Form.Item
        label={<HeadingSpan>TutorMe Start Date</HeadingSpan>}
        {...formLayout}
      >
        {getFieldDecorator('tutorMeStartDate', {
          rules: [{ required: !!tutorMeEndDate }],
          initialValue: initialTutorMeStartDate,
        })(<DatePicker disabledDate={disabledStartDate} />)}
      </Form.Item>
      <Form.Item
        label={<HeadingSpan>TutorMe End Date</HeadingSpan>}
        {...formLayout}
      >
        {getFieldDecorator('tutorMeEndDate', {
          rules: [{ required: !!tutorMeStartDate }],
          initialValue: initialTutorMeEndDate,
        })(<DatePicker disabledDate={disabledEndDate} />)}
      </Form.Item>
    </>
  )
}

const NotesFormItem = ({
  getFieldDecorator,
  notesFieldName,
  initialValue,
  placeholder,
}) => {
  const max = 200
  return (
    <OuterDiv>
      <CharacterLimitSpan>{`${max} chars`}</CharacterLimitSpan>
      <Form.Item>
        {getFieldDecorator(notesFieldName, {
          rules: [{ required: true, max }],
          initialValue,
        })(<TextArea data-cy="addNotes" rows={2} placeholder={placeholder} />)}
      </Form.Item>
    </OuterDiv>
  )
}

NotesFormItem.defaultProps = {
  notesFieldName: 'notes',
  initialValue: '',
  placeholder: 'Add Notes*',
}

const DatesNotesFormItem = ({
  getFieldDecorator,
  getFieldValue,
  initialStartDate,
  initialEndDate,
  initialTutorMeStartDate,
  initialTutorMeEndDate,
  notesFieldName,
  initialValue,
  placeholder,
  showAdditionalDetails,
  showTutorMeFormItems,
  children,
}) => (
  <>
    <DatesFormItem
      getFieldDecorator={getFieldDecorator}
      initialStartDate={initialStartDate}
      initialEndDate={initialEndDate}
    />
    {showAdditionalDetails ? (
      <AdditionalDetailsFormItems getFieldDecorator={getFieldDecorator} />
    ) : null}
    {showTutorMeFormItems ? (
      <TutorMeFormItems
        getFieldDecorator={getFieldDecorator}
        initialTutorMeStartDate={initialTutorMeStartDate}
        initialTutorMeEndDate={initialTutorMeEndDate}
        getFieldValue={getFieldValue}
      />
    ) : null}

    {children}

    <NotesFormItem
      getFieldDecorator={getFieldDecorator}
      notesFieldName={notesFieldName}
      initialValue={initialValue}
      placeholder={placeholder}
    />
  </>
)

DatesNotesFormItem.defaultProps = {
  ...NotesFormItem.defaultProps,
  ...DatesFormItem.defaultProps,
  showAdditionalDetails: false,
  showTutorMeFormItems: false,
}

export { DatesFormItem, NotesFormItem }

export default DatesNotesFormItem
