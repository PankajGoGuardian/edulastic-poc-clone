import React, { useState } from 'react'
import { Form, Button as AntdButton, Select, Input, Checkbox } from 'antd'
import moment from 'moment'
import { IconAddItems, IconTrash } from '@edulastic/icons'
import { FlexContainer, notification } from '@edulastic/common'
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
    revokePartialPremiumSubscriptionAction,
  }) => {
    const {
      subType = 'partial_premium',
      districtId,
      schoolId,
      notes,
      subscription,
    } = partialPremiumData
    const {
      subStartDate,
      subEndDate,
      adminPremium,
      customerSuccessManager,
      opportunityId,
      licenceCount,
      _id: subscriptionId,
    } = subscription || partialPremiumData
    const [districtIdInput, setDistrictId] = useState()
    const [schoolIdInput, setSchoolId] = useState()

    const handleSearch = (e) => {
      e?.preventDefault?.()
      validateFields(
        ['schoolId', 'districtId'],
        (err, { districtId: districtIdValue, schoolId: schoolIdValue }) => {
          if (
            !err &&
            ((districtIdValue && schoolIdValue) ||
              (!districtIdValue && !schoolIdValue))
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
          }
          if (districtIdValue || schoolIdValue) {
            getSubscriptionAction({
              districtId: districtIdValue,
              schoolId: schoolIdValue,
            })
            setSchoolId(schoolIdValue)
            setDistrictId(districtIdValue)
          }
        }
      )
    }

    const handleRevoke = (e) => {
      e?.preventDefault?.()
      revokePartialPremiumSubscriptionAction({
        subscriptionId,
        districtId: schoolId ? undefined : districtId,
        schoolId: schoolId,
      })
      if (districtId || schoolId) {
        setSchoolId(schoolId)
        setDistrictId(districtId)
      }
    }

    const handleSubmit = (evt) => {
      evt?.preventDefault?.()
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
                adminPremium:
                  subType === 'partial_premium'
                    ? adminPremiumValue || false
                    : undefined,
                subType,
                subStartDate: startDate.valueOf(),
                subEndDate: endDate.valueOf(),
                ...rest,
                gradeSubject,
              }
              if (districtIdValue) {
                Object.assign(subscriptionData, {
                  districtId: districtIdValue,
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
        }
      )
    }

    useUpdateEffect(() => {
      const data = {
        subStartDate: moment(subStartDate),
        subEndDate: moment(subEndDate),
        notes,
        adminPremium,
        customerSuccessManager,
        opportunityId,
        licenceCount,
      }
      if (schoolId) {
        Object.assign(data, { schoolId })
      } else {
        Object.assign(data, { districtId, schoolId })
      }
      setFieldsValue(data)
    }, [
      districtId,
      schoolId,
      subStartDate,
      subEndDate,
      notes,
      adminPremium,
      customerSuccessManager,
      opportunityId,
      licenceCount,
    ])

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
              onSearch={handleSearch}
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
              onSearch={handleSearch}
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
          <Column
            title="Org Type"
            key="orgType"
            render={() => (
              <strong>
                {schoolId ? 'SCHOOL' : districtId ? 'DISTRICT' : '-'}
              </strong>
            )}
          />
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
        <DatesNotesFormItem getFieldDecorator={getFieldDecorator}>
          <Form.Item label={<HeadingSpan>CS Manager</HeadingSpan>}>
            {getFieldDecorator('customerSuccessManager')(
              <Input
                placeholder="Customer Success Manager Name"
                style={{ width: 300 }}
              />
            )}
          </Form.Item>

          <Form.Item label={<HeadingSpan>Opportunity Id</HeadingSpan>}>
            {getFieldDecorator('opportunityId')(
              <Input placeholder="Opportunity Id" style={{ width: 300 }} />
            )}
          </Form.Item>

          <Form.Item label={<HeadingSpan>License Count</HeadingSpan>}>
            {getFieldDecorator('licenceCount')(
              <Input placeholder="License Count" style={{ width: 300 }} />
            )}
          </Form.Item>
        </DatesNotesFormItem>

        <Form.Item>
          {getFieldDecorator('adminPremium', { valuePropName: 'checked' })(
            <Checkbox>
              <strong>Upgrade DAs</strong>
            </Checkbox>
          )}
        </Form.Item>
        <FlexContainer
          width="265px"
          justifyContent="space-between"
          alignItems="center"
        >
          <Form.Item>
            <AntdButton type="primary" htmlType="submit">
              Upgrade to premium
            </AntdButton>
          </Form.Item>
          <Form.Item>
            <AntdButton
              disabled={!subStartDate && !subEndDate}
              type="primary"
              htmlType="button"
              onClick={handleRevoke}
            >
              Revoke
            </AntdButton>
          </Form.Item>
        </FlexContainer>
      </Form>
    )
  }
)

export default ManageSubscriptionByUserSegments
