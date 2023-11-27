import React, { useState, useEffect } from 'react'
import { Form, Button, DatePicker, Input, Select, Row, Checkbox } from 'antd'
import moment from 'moment'

import { notification } from '@edulastic/common'
import { IconEdit } from '@edulastic/icons'

import DatesNotesFormItem from '../Common/Form/DatesNotesFormItem'
import SearchDistrictByIdName from '../Common/Form/SearchDistrictByIdName'
import { Table, Button as CustomButton } from '../Common/StyledComponents'
import { renderSubscriptionType } from '../Common/SubTypeTag'
import { HeadingSpan, ValueSpan } from '../Common/StyledComponents/upgradePlan'
import { SUBSCRIPTION_TYPE_CONFIG } from '../Data'

const { Column } = Table
const { Option } = Select

const SearchSchoolByIdRadioOptions = {
  SCHOOL_ID: 'schoolId',
  DISTRICT_ID: 'districtId',
  SCHOOL_NAME_ID: 'name',
  get list() {
    return [
      {
        id: this.SCHOOL_ID,
        label: 'Search by School ID',
      },
      {
        id: this.DISTRICT_ID,
        label: 'Search by District ID',
      },
      {
        id: this.SCHOOL_NAME_ID,
        label: 'Search by School name',
      },
    ]
  },
}

const SubscriptionButtonConfig = {
  free: {
    label: 'Upgrade',
    subTypeToBeSent: 'enterprise',
  },
  premium: {
    label: 'Revoke',
    subTypeToBeSent: 'free',
  },
  partial_premium: {
    label: 'Edit',
    subTypeToBeSent: 'enterprise',
  },
  enterprise: {
    label: 'Revoke',
    subTypeToBeSent: 'free',
  },
}

const SearchSchoolsByIdForm = Form.create({ name: 'searchSchoolsByIdForm' })(
  ({
    form: { getFieldDecorator, validateFields },
    searchSchoolsByIdAction,
  }) => {
    const searchSchoolsById = (evt) => {
      evt.preventDefault()
      validateFields((err, { districtSearchOption, districtSearchValue }) => {
        const commonProps = { getSubscription: true }
        if (!err) {
          // here if search by school name is chosen, the data parameters to be sent are different
          if (
            districtSearchOption === SearchSchoolByIdRadioOptions.SCHOOL_NAME_ID
          ) {
            searchSchoolsByIdAction({
              searchText: districtSearchValue,
              fields: [districtSearchOption],
              ...commonProps,
            })
          } else {
            searchSchoolsByIdAction({
              [districtSearchOption]: districtSearchValue,
              ...commonProps,
            })
          }
        }
      })
    }

    return (
      <SearchDistrictByIdName
        getFieldDecorator={getFieldDecorator}
        handleSubmit={searchSchoolsById}
        listOfRadioOptions={SearchSchoolByIdRadioOptions.list}
        placeholder="Search Schools..."
      />
    )
  }
)

const SchoolsTable = Form.create({ name: 'bulkSubscribeForm' })(
  ({
    form: { getFieldDecorator, validateFields, getFieldValue, setFieldsValue },
    searchedSchoolsData,
    bulkSchoolsSubscribeAction,
    changeTab,
    manageByUserSegmentTabKey,
    setPartialPremiumDataAction,
    currentEditableRow,
    updateCurrentEditableRow,
    editableRowFieldValues: {
      subType: editedSubType = 'free',
      subStartDate: editedStartDate,
      subEndDate: editedEndDate,
      notes: editedNotes,
      adminPremium: editedAdminPremium,
      tutorMeStartDate: editedTutorMeStartDate,
      tutorMeEndDate: editedTutorMeEndDate,
    },
    setEditableRowFieldValues,
  }) => {
    const [selectedSchools, setSelectedSchools] = useState([])
    const [firstSchoolSubType, setSelectedSchoolSubType] = useState('')
    const bulkSelectedSubType = getFieldValue('subType')
    const submitCtaText =
      firstSchoolSubType && bulkSelectedSubType
        ? `Bulk ${SUBSCRIPTION_TYPE_CONFIG[firstSchoolSubType][bulkSelectedSubType].label}`
        : 'Apply Changes'

    useEffect(() => {
      setFieldsValue({
        subType: firstSchoolSubType,
      })
    }, [firstSchoolSubType])

    const handleSubmit = (evt) => {
      validateFields(
        (
          err,
          {
            subStartDate,
            subEndDate,
            notes,
            subType,
            adminPremium,
            customerSuccessManager,
            opportunityId,
            licenceCount,
            tutorMeStartDate,
            tutorMeEndDate,
          }
        ) => {
          if (!err) {
            bulkSchoolsSubscribeAction({
              subStartDate: subStartDate.valueOf(),
              subEndDate: subEndDate.valueOf(),
              notes,
              schoolIds: selectedSchools,
              subType,
              ...(subType === 'partial_premium' ? { adminPremium } : {}),
              customerSuccessManager,
              opportunityId,
              licenceCount,
              tutorMeStartDate: tutorMeStartDate?.valueOf(),
              tutorMeEndDate: tutorMeEndDate?.valueOf(),
            })
          }
        }
      )
      evt.preventDefault()
    }

    const rowSelection = {
      selectedRowKeys: selectedSchools,
      onChange: (selectedSchoolsArray, record) => {
        if (!selectedSchoolsArray.length) {
          // if length is zero, i.e. all rows are unselected, state set back to default - ""
          setSelectedSchoolSubType('')
        } else if (selectedSchoolsArray.length === 1) {
          // if a row is selected for the first time, state set to rowType, so that only identical subType rows
          // can be selected
          const {
            subscription: { subType = 'free' },
          } = record[0]
          setSelectedSchoolSubType(subType)
        }
        setSelectedSchools(selectedSchoolsArray)
      },
      getCheckboxProps: ({ schoolId, subscription: { subType = 'free' } }) => ({
        // if a certain subType is selected, all other subType rows are disabled
        disabled: !!(firstSchoolSubType && subType !== firstSchoolSubType),
        name: schoolId,
      }),
    }

    const renderActions = (subType = 'free', record) => {
      const { schoolId, subscription = {} } = record

      const handleClick = (subTypeParam) => {
        const currentTimeInMilliSec = new Date().getTime()
        // validate both TutorMe Start & End date are set/unset
        if (!editedTutorMeEndDate !== !editedTutorMeStartDate) {
          const msg = editedTutorMeStartDate
            ? 'TutorMe End Date required!'
            : 'TutorMe Start Date required!'
          notification({ msg })
        } else {
          bulkSchoolsSubscribeAction({
            subStartDate: editedStartDate || currentTimeInMilliSec,
            subEndDate: editedEndDate || currentTimeInMilliSec,
            notes: editedNotes,
            schoolIds: [schoolId],
            subType: subTypeParam,
            adminPremium: editedAdminPremium,
            tutorMeStartDate: editedTutorMeStartDate,
            tutorMeEndDate: editedTutorMeEndDate,
          })
        }
      }

      const handleEditClick = () => {
        if (subType === 'partial_premium') {
          // if partial premium, we move user to a new tab with the data preserved
          setPartialPremiumDataAction(record)
          changeTab(manageByUserSegmentTabKey)
        } else {
          const {
            subEndDate,
            subStartDate,
            notes,
            adminPremium,
            tutorMeStartDate,
            tutorMeEndDate,
          } = subscription
          updateCurrentEditableRow({
            schoolId,
            subEndDate,
            subStartDate,
            notes,
            subType,
            adminPremium,
            tutorMeStartDate,
            tutorMeEndDate,
          })
        }
      }
      return schoolId === currentEditableRow ? (
        <>
          <Button onClick={() => handleClick(editedSubType)}>
            {editedSubType === subType
              ? 'Update'
              : SubscriptionButtonConfig[subType].label}
          </Button>
          <Button onClick={updateCurrentEditableRow}>Cancel</Button>
        </>
      ) : (
        <CustomButton
          aria-label="Edit"
          title="Edit"
          onClick={handleEditClick}
          noStyle
        >
          <IconEdit />
        </CustomButton>
      )
    }

    const renderStartDate = (date, record) =>
      record.schoolId === currentEditableRow ? (
        <DatePicker
          value={moment(editedStartDate)}
          onChange={(startDate) =>
            setEditableRowFieldValues({
              fieldName: 'subStartDate',
              value: startDate.valueOf(),
            })
          }
        />
      ) : (
        moment(date).format('YYYY-MM-DD')
      )

    const renderEndDate = (date, record) =>
      record.schoolId === currentEditableRow ? (
        <DatePicker
          value={moment(editedEndDate)}
          onChange={(endDate) =>
            setEditableRowFieldValues({
              fieldName: 'subEndDate',
              value: endDate?.valueOf(),
            })
          }
        />
      ) : (
        moment(date).format('YYYY-MM-DD')
      )

    const renderTutorMeStartDate = (date, record) =>
      record.schoolId === currentEditableRow ? (
        <DatePicker
          value={editedTutorMeStartDate && moment(editedTutorMeStartDate)}
          onChange={(_tutorMeStartDate) =>
            setEditableRowFieldValues({
              fieldName: 'tutorMeStartDate',
              value: _tutorMeStartDate?.valueOf(),
            })
          }
          disabledDate={(val) =>
            !!editedTutorMeEndDate &&
            val > moment(editedTutorMeEndDate).startOf('day')
          }
        />
      ) : (
        date && moment(date).format('YYYY-MM-DD')
      )

    const renderTutorMeEndDate = (date, record) =>
      record.schoolId === currentEditableRow ? (
        <DatePicker
          value={editedTutorMeEndDate && moment(editedTutorMeEndDate)}
          onChange={(_tutorMeEndDate) =>
            setEditableRowFieldValues({
              fieldName: 'tutorMeEndDate',
              value: _tutorMeEndDate?.valueOf(),
            })
          }
          disabledDate={(val) =>
            !!editedTutorMeStartDate &&
            val < moment(editedTutorMeStartDate).startOf('day')
          }
        />
      ) : (
        date && moment(date).format('YYYY-MM-DD')
      )

    const renderNotes = (note, record) =>
      record.schoolId === currentEditableRow ? (
        <Input.TextArea
          value={editedNotes}
          onChange={(evt) =>
            setEditableRowFieldValues({
              fieldName: 'notes',
              value: evt.target.value,
            })
          }
        />
      ) : (
        note
      )

    const renderSubscription = (subscription, record) =>
      record.schoolId === currentEditableRow ? (
        <Select
          style={{ width: '100%' }}
          value={editedSubType || 'free'}
          onChange={(value) =>
            setEditableRowFieldValues({
              fieldName: 'subType',
              value,
            })
          }
        >
          <Option value="free">Free</Option>
          <Option value="enterprise">Enterprise</Option>
        </Select>
      ) : (
        renderSubscriptionType(subscription)
      )

    const renderUpgradeDA = (adminPremium, record) =>
      record.schoolId === currentEditableRow ? (
        <Checkbox
          value={editedAdminPremium}
          onChange={(evt) =>
            setEditableRowFieldValues({
              fieldName: 'adminPremium',
              value: evt.target.value,
            })
          }
        />
      ) : adminPremium ? (
        'Yes'
      ) : (
        'No'
      )

    const noOfSelectedSchools = selectedSchools.length

    return (
      <>
        <Table
          rowKey={(record) => record.schoolId}
          dataSource={Object.values(searchedSchoolsData)}
          pagination={false}
          rowSelection={rowSelection}
          bordered
          scroll={{ x: '100%', y: 300 }}
        >
          <Column title="School Id" dataIndex="schoolId" key="_id" />
          <Column title="School Name" dataIndex="schoolName" key="schoolName" />
          <Column title="District Id" dataIndex="districtId" key="districtId" />
          <Column
            title="District Name"
            dataIndex="districtName"
            key="districtName"
          />
          <Column
            title="Start Date"
            dataIndex="subscription.subStartDate"
            key="startDate"
            render={renderStartDate}
          />
          <Column
            title="End Date"
            dataIndex="subscription.subEndDate"
            key="endDate"
            render={renderEndDate}
          />
          {/* TODO: uncomment when TutorMe SDK is ready, ref. https://goguardian.atlassian.net/browse/EV-40804 */}
          {/* <Column
            title="TutorMe Start Date"
            dataIndex="subscription.tutorMeStartDate"
            key="tutorMeStartDate"
            render={renderTutorMeStartDate}
          />
          <Column
            title="TutorMe End Date"
            dataIndex="subscription.tutorMeEndDate"
            key="tutorMeEndDate"
            render={renderTutorMeEndDate}
          /> */}
          <Column
            title="Notes"
            dataIndex="subscription.notes"
            key="notes"
            render={renderNotes}
          />
          <Column
            title="Upgrade DA"
            dataIndex="subscription.adminPremium"
            key="adminPremium"
            width="100px"
            render={renderUpgradeDA}
          />
          <Column
            title="Plan"
            dataIndex="subscription"
            key="plan"
            render={renderSubscription}
          />
          <Column
            title="Action"
            dataIndex="subscription.subType"
            key="action"
            render={renderActions}
          />
        </Table>
        {noOfSelectedSchools ? `${noOfSelectedSchools} Selected` : null}
        <Row style={{ margin: '15px 0 15px' }}>
          <HeadingSpan>Bulk Selected Plan:</HeadingSpan>
          <ValueSpan>{firstSchoolSubType}</ValueSpan>
        </Row>
        <BulkSubscribeForm
          firstSchoolSubType={firstSchoolSubType}
          disabled={!selectedSchools.length}
          handleSubmit={handleSubmit}
          getFieldDecorator={getFieldDecorator}
          getFieldValue={getFieldValue}
          ctaText={submitCtaText}
        />
      </>
    )
  }
)

const BulkSubscribeForm = ({
  handleSubmit,
  getFieldDecorator,
  getFieldValue,
  ctaText,
  disabled,
  firstSchoolSubType,
}) => (
  <Form labelAlign="left" labelCol={{ span: 3 }} onSubmit={handleSubmit}>
    <Form.Item
      label={<HeadingSpan>Change Plan</HeadingSpan>}
      labelAlign="left"
      labelCol={{ span: 4 }}
    >
      {getFieldDecorator('subType', {
        valuePropName: 'value',
        rules: [{ required: true }],
        initialValue: 'free',
      })(
        <Select style={{ width: 120 }}>
          <Option value="free">Free</Option>
          <Option value="enterprise">Enterprise</Option>
          <Option
            value="partial_premium"
            disabled={firstSchoolSubType !== 'partial_premium'}
          >
            Partial Premium
          </Option>
        </Select>
      )}
    </Form.Item>
    <DatesNotesFormItem
      getFieldDecorator={getFieldDecorator}
      getFieldValue={getFieldValue}
      // TODO: uncomment when TutorMe SDK is ready, ref. https://goguardian.atlassian.net/browse/EV-40804
      // showTutorMeFormItems
    >
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
      {getFieldDecorator('adminPremium', {
        valuePropName: 'checked',
      })(
        <Checkbox disabled={firstSchoolSubType !== 'partial_premium'}>
          <strong>Upgrade DAs</strong>
        </Checkbox>
      )}
    </Form.Item>
    <Form.Item>
      <Button disabled={disabled} type="primary" htmlType="submit">
        {ctaText}
      </Button>
    </Form.Item>
  </Form>
)

export default function ManageSubscriptionBySchool({
  manageSchoolData: {
    searchedSchoolsData,
    currentEditableRow,
    editableRowFieldValues,
  },
  searchSchoolsByIdAction,
  bulkSchoolsSubscribeAction,
  changeTab,
  manageByUserSegmentTabKey,
  setPartialPremiumDataAction,
  updateCurrentEditableRow,
  setEditableRowFieldValues,
}) {
  return (
    <>
      <SearchSchoolsByIdForm
        searchSchoolsByIdAction={searchSchoolsByIdAction}
      />
      <SchoolsTable
        currentEditableRow={currentEditableRow}
        searchedSchoolsData={searchedSchoolsData}
        bulkSchoolsSubscribeAction={bulkSchoolsSubscribeAction}
        changeTab={changeTab}
        manageByUserSegmentTabKey={manageByUserSegmentTabKey}
        setPartialPremiumDataAction={setPartialPremiumDataAction}
        updateCurrentEditableRow={updateCurrentEditableRow}
        editableRowFieldValues={editableRowFieldValues}
        setEditableRowFieldValues={setEditableRowFieldValues}
      />
    </>
  )
}
