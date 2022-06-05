import React, { useState, useEffect, useRef } from 'react'
import { Row as AntdRow, Col, Form, Select, Button, AutoComplete } from 'antd'
import moment from 'moment'
import styled from 'styled-components'
import SearchDistrictByIdName from '../Common/Form/SearchDistrictByIdName'
import DatesNotesFormItem from '../Common/Form/DatesNotesFormItem'
import {
  HeadingSpan,
  ValueSpan,
  PermissionSelect,
  PermissionSaveBtn,
} from '../Common/StyledComponents/upgradePlan'
import { getDate, useUpdateEffect } from '../Common/Utils'
import { SUBSCRIPTION_TYPE_CONFIG } from '../Data'

const { Option } = Select
const { Option: AutocompleteOption } = AutoComplete
const Row = styled(AntdRow)`
  margin: 10px 0px;
`

const ManageDistrictSearchForm = Form.create({
  name: 'manageDistrictSearchForm',
})(
  ({
    form: { getFieldDecorator, validateFields },
    loading,
    getDistrictDataAction,
    listOfDistricts,
    selectDistrictAction,
  }) => {
    const searchDistrictData = (evt) => {
      evt.preventDefault()
      validateFields((err, { districtSearchOption, districtSearchValue }) => {
        if (!err) {
          getDistrictDataAction({
            [districtSearchOption]: districtSearchValue,
          })
        }
      })
    }
    const onDistrictSelect = (value, option) =>
      selectDistrictAction(option.props.index)

    // here index is passed as a prop and when the user selects district from the list of
    // districts retreived, the selected district is set with the index
    const dataSource = listOfDistricts.map(({ _source = {} }, index) => (
      <AutocompleteOption key={_source.name} index={index}>
        {_source.name}
      </AutocompleteOption>
    ))
    return (
      <SearchDistrictByIdName
        getFieldDecorator={getFieldDecorator}
        handleSubmit={searchDistrictData}
        autocomplete
        onSelect={onDistrictSelect}
        dataSource={dataSource}
        loading={loading}
        filterOption={false}
      />
    )
  }
)

const ManageDistrictPrimaryForm = Form.create({
  name: 'manageDistrictPrimaryForm',
})(
  ({
    form: { getFieldDecorator, validateFields, setFieldsValue, getFieldsValue },
    selectedDistrict,
    upgradeDistrictSubscriptionAction,
    saveOrgPermissions,
  }) => {
    // here button state will change according to subType from the data received
    const [ctaSubscriptionState, setCtaSubscriptionState] = useState(
      'Apply Changes'
    )
    const [orgPermission, setOrgPermission] = useState('')

    const { _source = {}, _id: districtId, subscription = {} } =
      selectedDistrict || {}
    const { location = {} } = _source
    const {
      subType = 'free',
      subStartDate,
      subEndDate,
      notes,
      customerSuccessManager,
      opportunityId,
      licenceCount,
      _id: subscriptionId,
    } = subscription
    const { subType: currentSubType = 'free' } = getFieldsValue(['subType'])

    const savedDate = useRef()

    // here once component is mounted, the current date is calculated just once, and stored in a ref
    useEffect(() => {
      savedDate.current = getDate()
    }, [])

    // when a district is searched, the form fields are populated according to the data received
    useUpdateEffect(() => {
      setFieldsValue({
        subType,
        subStartDate: moment(subStartDate || savedDate.current.currentDate),
        subEndDate: moment(subEndDate || savedDate.current.oneYearDate),
        notes,
        customerSuccessManager,
        opportunityId,
        licenceCount,
      })
    }, [
      subType,
      subStartDate,
      subEndDate,
      notes,
      customerSuccessManager,
      opportunityId,
      licenceCount,
    ])

    useUpdateEffect(() => {
      if (currentSubType !== subType) {
        setCtaSubscriptionState(
          SUBSCRIPTION_TYPE_CONFIG[subType][currentSubType].label
        )
      } else {
        setCtaSubscriptionState('Apply Changes')
      }
    }, [currentSubType, subType])

    const handleSubmit = (evt) => {
      validateFields(
        (err, { subStartDate: startDate, subEndDate: endDate, ...rest }) => {
          if (!err) {
            if (currentSubType === 'free' && subType !== 'free') {
              Object.assign(rest, {
                status: 0,
                isUpdate: true,
                subscriptionId,
              })
            }
            upgradeDistrictSubscriptionAction({
              districtId,
              subStartDate: startDate.valueOf(),
              subEndDate: endDate.valueOf(),
              ...rest,
            })
          }
        }
      )
      evt.preventDefault()
    }

    return (
      <Form onSubmit={handleSubmit} labelAlign="left">
        <Row>
          <HeadingSpan>District ID:</HeadingSpan>
          <ValueSpan>{districtId}</ValueSpan>
        </Row>
        <Row>
          <HeadingSpan>Existing Plan:</HeadingSpan>
          <ValueSpan>{subType}</ValueSpan>
        </Row>
        <Row>
          <HeadingSpan>District Name:</HeadingSpan>
          <ValueSpan>{_source.name}</ValueSpan>
        </Row>
        <Row>
          <HeadingSpan>Short Name:</HeadingSpan>
          <ValueSpan>{_source.name}</ValueSpan>
        </Row>
        <Row>
          <Col span={5}>
            <HeadingSpan>City:</HeadingSpan>
            <ValueSpan>{location?.city || '-'}</ValueSpan>
          </Col>
          <Col span={5}>
            <HeadingSpan>State:</HeadingSpan>
            <ValueSpan>{location?.state || '-'}</ValueSpan>
          </Col>
          <Col span={5}>
            <HeadingSpan>Zipcode:</HeadingSpan>
            <ValueSpan>{location?.zip || '-'}</ValueSpan>
          </Col>
        </Row>
        <Form.Item
          label={<HeadingSpan>Org Permission</HeadingSpan>}
          labelCol={{ span: 3 }}
        >
          <PermissionSelect
            style={{ width: 140 }}
            onChange={(value) => setOrgPermission(value)}
            value={orgPermission}
          >
            <Option value="school-district">School District</Option>
            <Option value="publisher">Publisher</Option>
            <Option value="both">Both</Option>
          </PermissionSelect>
          <PermissionSaveBtn
            type="primary"
            onClick={() =>
              saveOrgPermissions({
                permissions: orgPermission,
                districtId,
              })
            }
            disabled={!orgPermission || !districtId}
          >
            Save
          </PermissionSaveBtn>
        </Form.Item>
        <Form.Item
          label={<HeadingSpan>Change Plan</HeadingSpan>}
          labelCol={{ span: 3 }}
        >
          {getFieldDecorator('subType', {
            valuePropName: 'value',
            rules: [{ required: true }],
          })(
            <Select style={{ width: 120 }} data-cy="change-plan-select">
              <Option value="free" data-cy="free">
                Free
              </Option>
              <Option value="enterprise" data-cy="enterprise">
                Enterprise
              </Option>
            </Select>
          )}
        </Form.Item>
        <DatesNotesFormItem
          getFieldDecorator={getFieldDecorator}
          showAdditionalDetails
        />
        <Form.Item>
          <Button data-cy="submit-btn" type="primary" htmlType="submit">
            {ctaSubscriptionState}
          </Button>
        </Form.Item>
      </Form>
    )
  }
)

export default function ManageSubscriptionByDistrict({
  getDistrictDataAction,
  districtData: { loading, listOfDistricts, selectedDistrict },
  upgradeDistrictSubscriptionAction,
  selectDistrictAction,
  saveOrgPermissions,
}) {
  return (
    <>
      <ManageDistrictSearchForm
        loading={loading}
        getDistrictDataAction={getDistrictDataAction}
        listOfDistricts={listOfDistricts}
        selectDistrictAction={selectDistrictAction}
      />
      <ManageDistrictPrimaryForm
        selectedDistrict={selectedDistrict}
        upgradeDistrictSubscriptionAction={upgradeDistrictSubscriptionAction}
        saveOrgPermissions={saveOrgPermissions}
      />
    </>
  )
}
