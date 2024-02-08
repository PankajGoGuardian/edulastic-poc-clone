import React, { useCallback } from 'react'
import { Form, Input, DatePicker, Checkbox } from 'antd'
import styled from 'styled-components'
import moment from 'moment'

import { red } from '@edulastic/colors'
import { EduIf } from '@edulastic/common'
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
  initialTutorMeAuthToken,
  initialTutorMeAuthTokenCheck,
  getFieldValue,
}) => {
  const tutorMeStartDate = getFieldValue('tutorMeStartDate')
  const tutorMeEndDate = getFieldValue('tutorMeEndDate')
  const tutorMeAuthToken = getFieldValue('tutorMeAuthToken')
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
  const authKeyFormLayout = {
    ...formLayout,
    wrapperCol: { span: 12 },
  }
  return (
    <>
      <Form.Item
        label={<HeadingSpan>TutorMe Start Date</HeadingSpan>}
        {...formLayout}
      >
        {getFieldDecorator('tutorMeStartDate', {
          rules: [
            {
              required: !!tutorMeEndDate || !!tutorMeAuthToken,
              message: 'TutorMe Start Date is required',
            },
          ],
          initialValue: initialTutorMeStartDate,
        })(
          <DatePicker
            data-cy="tutorMeStartDate"
            disabledDate={disabledStartDate}
          />
        )}
      </Form.Item>
      <Form.Item
        label={<HeadingSpan>TutorMe End Date</HeadingSpan>}
        {...formLayout}
      >
        {getFieldDecorator('tutorMeEndDate', {
          rules: [
            {
              required: !!tutorMeStartDate || !!tutorMeAuthToken,
              message: 'TutorMe End Date is required',
            },
          ],
          initialValue: initialTutorMeEndDate,
        })(
          <DatePicker data-cy="tutorMeEndDate" disabledDate={disabledEndDate} />
        )}
      </Form.Item>
      <Form.Item
        label={<HeadingSpan>TutorMe Auth Key</HeadingSpan>}
        {...authKeyFormLayout}
        style={{ marginBottom: '0px' }}
      >
        {getFieldDecorator('tutorMeAuthToken', {
          rules: [
            {
              required: !!tutorMeStartDate || !!tutorMeEndDate,
              max: 100,
              message: 'TutorMe Authentication Key is required',
            },
          ],
          initialValue: initialTutorMeAuthToken,
          type: 'string',
        })(
          <Input
            data-cy="tutorMeAuthToken"
            placeholder="Paste Authentication Key here. Ensure the key is accurate for these org(s) / user(s)."
          />
        )}
      </Form.Item>
      <Form.Item label={<span />} colon={false} {...authKeyFormLayout}>
        {getFieldDecorator('tutorMeAuthTokenCheck', {
          valuePropName: 'checked',
          initialValue: initialTutorMeAuthTokenCheck,
        })(
          <Checkbox disabled={!tutorMeAuthToken}>
            <EduIf
              condition={
                !!tutorMeStartDate ||
                !!initialTutorMeEndDate ||
                !!tutorMeAuthToken
              }
            >
              <span style={{ color: red }}>*</span>
            </EduIf>
            <span>{`I've double checked this key is intended for these org(s) / user(s)`}</span>
          </Checkbox>
        )}
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
  initialTutorMeAuthToken,
  initialTutorMeAuthTokenCheck,
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
        initialTutorMeAuthToken={initialTutorMeAuthToken}
        initialTutorMeAuthTokenCheck={initialTutorMeAuthTokenCheck}
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
