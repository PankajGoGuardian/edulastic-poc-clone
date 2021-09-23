import React, { useState } from 'react'
import { Form, Button as AntdButton, Select, Input, Checkbox } from 'antd'
import moment from 'moment'
import { IconAddItems, IconTrash } from '@edulastic/icons'
import { notification } from '@edulastic/common'
import { grades } from '@edulastic/constants'
import {
  HeadingSpan,
  OrSeparator,
} from '../Common/StyledComponents/upgradePlan'
import DatesNotesFormItem from '../Common/Form/DatesNotesFormItem'
import { SUBJECTS_LIST, CLEVER_DISTRICT_ID_REGEX } from '../Data'
import { useUpdateEffect } from '../Common/Utils'
import { Button, Table } from '../Common/StyledComponents'

const { Option } = Select
const { Column } = Table
const { GRADES_LIST } = grades

const ManageSubscriptionByUserSegments = Form.create({
  name: 'searchUsersByEmailIdsForm',
})(
  ({
    form: { getFieldDecorator, validateFields, setFieldsValue, setFields },
    manageUserSegmentsData: { partialPremiumData = {}, gradeSubject },
    upgradePartialPremiumUserAction,
    setGradeSubjectValue,
    addGradeSubjectRow,
    deleteGradeSubjectRow,
    getSubscriptionAction,
  }) => {
    const {
      subType = 'partial_premium',
      districtId,
      schoolId,
      notes,
      subscription,
    } = partialPremiumData
    const { subStartDate, subEndDate, adminPremium } =
      subscription || partialPremiumData
    const [districtIdInput, setDistrictId] = useState()
    const [schoolIdInput, setSchoolId] = useState()
    const handleSubmit = (evt) => {
      validateFields(
        (
          err,
          {
            adminPremium: adminPremiumValue,
            districtId: districtIdValue,
            schoolId: schoolIdValue,
            subStartDate: startDate,
            subEndDate: endDate,
            ...rest
          }
        ) => {
          if (districtIdValue || schoolIdValue) {
            if (
              districtIdInput !== districtIdValue ||
              schoolIdValue !== schoolIdInput
            )
              getSubscriptionAction({
                districtId: districtIdValue,
                schoolId: schoolIdValue,
              })
            setDistrictId(districtIdValue)
            setSchoolId(schoolIdValue)
          }
          if (!err) {
            if (
              (districtIdValue && schoolIdValue) ||
              (!districtIdValue && !schoolIdValue)
            ) {
              const errorMessage = 'either district or school id is required'
              setFields({
                districtId: {
                  value: districtIdValue,
                  errors: [new Error(errorMessage)],
                },
                schoolId: {
                  value: schoolIdValue,
                  errors: [new Error(errorMessage)],
                },
              })
            } else if (gradeSubject[0].grade && gradeSubject[0].subject) {
              const subscriptionData = {
                adminPremium: adminPremiumValue,
                subType,
                subStartDate: startDate.valueOf(),
                subEndDate: endDate.valueOf(),
                ...rest,
                gradeSubject,
              }
              if (districtIdValue) {
                schoolIdValue = ['all']
                Object.assign(subscriptionData, {
                  districtId: districtIdValue,
                  schoolIds: ['all'],
                })
              } else {
                Object.assign(subscriptionData, {
                  schoolIds: [schoolIdValue],
                })
              }
              upgradePartialPremiumUserAction(subscriptionData)
              setDistrictId(null)
              setSchoolId(null)
            } else {
              notification({ messageKey: 'selectGradeAndSubject' })
            }
          }
        }
      )
      evt?.preventDefault?.()
    }

    useUpdateEffect(() => {
      setFieldsValue({
        districtId,
        schoolId,
        subStartDate: moment(subStartDate),
        subEndDate: moment(subEndDate),
        notes,
        adminPremium,
      })
    }, [districtId, schoolId, subStartDate, subEndDate, notes, adminPremium])

    const renderGrade = (item, _, index) => (
      <Select
        value={item.grade}
        placeholder="Please select"
        onChange={(value) =>
          setGradeSubjectValue({
            type: 'grade',
            value,
            index,
          })
        }
      >
        {GRADES_LIST.map((grade) => (
          <Option
            key={grade.value}
            value={grade.value}
            disabled={grade.value === 'All' && item.subject === 'All'}
          >
            {grade.label}
          </Option>
        ))}
      </Select>
    )

    const renderSubject = (item, _, index) => (
      <Select
        value={item.subject}
        placeholder="Please select"
        onChange={(value) =>
          setGradeSubjectValue({
            type: 'subject',
            value,
            index,
          })
        }
      >
        {SUBJECTS_LIST.map((subject) => (
          <Option
            key={subject}
            value={subject}
            disabled={subject === 'All' && item.grade === 'All'}
          >
            {subject}
          </Option>
        ))}
      </Select>
    )
    return (
      <Form onSubmit={handleSubmit} labelAlign="left" labelCol={{ span: 3 }}>
        <Form.Item label={<HeadingSpan>District ID</HeadingSpan>}>
          {getFieldDecorator('districtId', {
            rules: [
              {
                message: 'Please enter valid District ID',
                pattern: CLEVER_DISTRICT_ID_REGEX,
              },
            ],
            initialValue: '',
          })(
            <Input.Search
              onSearch={handleSubmit}
              placeholder="District ID"
              style={{ width: 300 }}
            />
          )}
        </Form.Item>
        <OrSeparator>-Or-</OrSeparator>
        <Form.Item label={<HeadingSpan>School ID</HeadingSpan>}>
          {getFieldDecorator('schoolId', {
            rules: [
              {
                message: 'Please enter valid School ID',
                pattern: CLEVER_DISTRICT_ID_REGEX,
              },
            ],
            initialValue: '',
          })(
            <Input.Search
              onSearch={handleSubmit}
              placeholder="School ID"
              style={{ width: 300 }}
            />
          )}
        </Form.Item>
        <Table
          bordered
          rowKey={(record, index) => `${record.subject}${index}`}
          dataSource={gradeSubject}
          pagination={false}
        >
          <Column title="Grade" key="grade" render={renderGrade} />
          <Column
            title="Subject"
            key="edulasticSubject"
            render={renderSubject}
          />
          <Column
            title="Start Date"
            render={() => (
              <span>{moment(subStartDate).format('DD MMM, YYYY')}</span>
            )}
          />
          <Column
            title="End Date"
            render={() => (
              <span>{moment(subEndDate).format('DD MMM, YYYY')}</span>
            )}
          />
          <Column title="Notes" render={() => <span>{notes}</span>} />
          <Column
            title={
              <Button
                title="Add a row"
                aria-label="Add a Row"
                noStyle
                onClick={(e) => {
                  if (e) {
                    e.preventDefault()
                    e.stopPropagation()
                  }
                  addGradeSubjectRow()
                }}
              >
                <IconAddItems />
              </Button>
            }
            key="deleteRow"
            render={(item, _, index) => (
              <Button
                title={`Delete ${item.subject}`}
                aria-label={`Delete ${item.subject}`}
                noStyle
                onClick={() => deleteGradeSubjectRow(index)}
              >
                <IconTrash />
              </Button>
            )}
          />
        </Table>
        <DatesNotesFormItem getFieldDecorator={getFieldDecorator} />
        <Form.Item>
          {getFieldDecorator('adminPremium', { valuePropName: 'checked' })(
            <Checkbox>
              <strong>Upgrade DAs</strong>
            </Checkbox>
          )}
        </Form.Item>
        <Form.Item>
          <AntdButton type="primary" htmlType="submit">
            Upgrade to premium
          </AntdButton>
        </Form.Item>
      </Form>
    )
  }
)

export default ManageSubscriptionByUserSegments
