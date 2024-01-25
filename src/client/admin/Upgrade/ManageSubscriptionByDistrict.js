import { userPermissions } from '@edulastic/constants'
import { Row as AntdRow, AutoComplete, Button, Col, Form, Select } from 'antd'
import moment from 'moment'
import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { EMPTY_ARRAY } from '@edulastic/constants/reportUtils/common'
import DatesNotesFormItem from '../Common/Form/DatesNotesFormItem'
import SearchDistrictByIdName from '../Common/Form/SearchDistrictByIdName'
import {
  HeadingSpan,
  PermissionSaveBtn,
  PermissionSelect,
  ValueSpan,
} from '../Common/StyledComponents/upgradePlan'
import {
  getDate,
  getTutorMeSubscription,
  updateDataStudioPermission,
  useUpdateEffect,
} from '../Common/Utils'
import { SUBSCRIPTION_TYPE_CONFIG } from '../Data'
import {
  ADDITIONAL_SUBSCRIPTION_TYPES,
  DISTRICT_SUBSCRIPTION_OPTIONS,
  SUBSCRIPTION_STATUS,
  SUBSCRIPTION_TYPES,
} from '../Common/constants/subscription'

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
    setSearchData,
  }) => {
    const searchDistrictData = (evt) => {
      evt.preventDefault()
      validateFields((err, { districtSearchOption, districtSearchValue }) => {
        if (!err) {
          const searchData = { [districtSearchOption]: districtSearchValue }
          setSearchData(searchData)
          getDistrictDataAction(searchData)
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
    form: { getFieldDecorator, validateFields, setFieldsValue, getFieldValue },
    selectedDistrict,
    upgradeDistrictSubscriptionAction,
    saveOrgPermissions,
    searchData,
  }) => {
    // here button state will change according to subType from the data received
    const [ctaSubscriptionState, setCtaSubscriptionState] = useState(
      'Apply Changes'
    )
    const [orgPermission, setOrgPermission] = useState('')

    const { _source = {}, _id: districtId, subscription = {} } =
      selectedDistrict || {}
    const {
      location = {},
      permissions = [],
      permissionsExpiry = [],
      name,
    } = _source
    const {
      subType = 'free',
      subStartDate,
      subEndDate,
      notes,
      customerSuccessManager,
      opportunityId,
      licenceCount,
      additionalSubscriptions = EMPTY_ARRAY,
      _id: subscriptionId,
    } = subscription
    const currentSubType =
      getFieldValue('subType') || SUBSCRIPTION_TYPES.free.subType

    const savedDate = useRef()

    const getSubTypeLabel = (_subType, _permissions) => {
      let label = _subType || SUBSCRIPTION_TYPES.free.subType
      if (
        (_permissions || []).includes(userPermissions.DATA_WAREHOUSE_REPORTS)
      ) {
        if (_subType === SUBSCRIPTION_TYPES.free.subType) {
          label = SUBSCRIPTION_TYPES.dataStudio.label
        } else if (_subType === SUBSCRIPTION_TYPES.enterprise.subType) {
          label = SUBSCRIPTION_TYPES.enterprisePlusDataStudio.label
        }
      }

      return label
    }

    // here once component is mounted, the current date is calculated just once, and stored in a ref
    useEffect(() => {
      savedDate.current = getDate()
    }, [])

    // when a district is searched, the form fields are populated according to the data received
    useUpdateEffect(() => {
      let _subType = subType || SUBSCRIPTION_TYPES.free.subType
      if (
        (permissions || []).includes(userPermissions.DATA_WAREHOUSE_REPORTS)
      ) {
        if (subType === SUBSCRIPTION_TYPES.free.subType) {
          _subType = SUBSCRIPTION_TYPES.dataStudio.subType
        } else if (subType === SUBSCRIPTION_TYPES.enterprise.subType) {
          _subType = SUBSCRIPTION_TYPES.enterprisePlusDataStudio.subType
        }
      }
      const {
        startDate: tutorMeStartDate,
        endDate: tutorMeEndDate,
      } = getTutorMeSubscription({ additionalSubscriptions })
      setFieldsValue({
        subType: _subType,
        subStartDate: moment(subStartDate || savedDate.current.currentDate),
        subEndDate: moment(subEndDate || savedDate.current.oneYearDate),
        notes,
        customerSuccessManager,
        opportunityId,
        licenceCount,
        tutorMeStartDate: tutorMeStartDate && moment(tutorMeStartDate),
        tutorMeEndDate: tutorMeEndDate && moment(tutorMeEndDate),
      })
    }, [
      subType,
      subStartDate,
      subEndDate,
      notes,
      customerSuccessManager,
      opportunityId,
      licenceCount,
      selectedDistrict,
      additionalSubscriptions,
    ])

    useUpdateEffect(() => {
      if (currentSubType !== subType) {
        setCtaSubscriptionState(
          SUBSCRIPTION_TYPE_CONFIG?.[subType]?.[currentSubType]?.label
        )
      } else {
        setCtaSubscriptionState('Apply Changes')
      }
    }, [currentSubType, subType])

    const handleSubmit = (evt) => {
      validateFields(
        (
          err,
          {
            subStartDate: startDate,
            subEndDate: endDate,
            tutorMeStartDate,
            tutorMeEndDate,
            ...rest
          }
        ) => {
          if (!err) {
            const _isDataStudio =
              currentSubType === SUBSCRIPTION_TYPES.dataStudio.subType
            const _isEnterprisePlusDataStudio =
              currentSubType ===
              SUBSCRIPTION_TYPES.enterprisePlusDataStudio.subType

            const enableDataStudio =
              _isDataStudio || _isEnterprisePlusDataStudio
            const dataStudio = updateDataStudioPermission({
              isDataStudio: enableDataStudio,
              permissions: permissions || [],
              permissionsExpiry: permissionsExpiry || [],
              perStartDate: startDate.valueOf(),
              perEndDate: endDate.valueOf(),
            })

            dataStudio.districtId = districtId

            const seedDsData = {
              districtData: [
                {
                  districtId,
                  name,
                  status: enableDataStudio,
                },
              ],
            }

            if (_isDataStudio) {
              Object.assign(rest, {
                subType: SUBSCRIPTION_TYPES.free.subType,
              })
            } else if (_isEnterprisePlusDataStudio) {
              Object.assign(rest, {
                subType: SUBSCRIPTION_TYPES.enterprise.subType,
              })
            }

            const changedToFree =
              currentSubType === SUBSCRIPTION_TYPES.free.subType &&
              subType !== SUBSCRIPTION_TYPES.free.subType

            // filter out add on subscriptions with empty startDate/endDate
            const nextAdditionalSubscriptions = [
              {
                type: ADDITIONAL_SUBSCRIPTION_TYPES.TUTORME,
                startDate: tutorMeStartDate?.valueOf(),
                endDate: tutorMeEndDate?.valueOf(),
              },
            ].filter((s) => s.startDate && s.endDate)

            // keep subscription active if additionalSubscriptions are present
            if (
              (changedToFree || (_isDataStudio && subscriptionId)) &&
              !nextAdditionalSubscriptions.length
            ) {
              Object.assign(rest, {
                isUpdate: true,
                subscriptionId,
                status: SUBSCRIPTION_STATUS.ARCHIVED,
              })
            }

            upgradeDistrictSubscriptionAction({
              districtId,
              subStartDate: startDate.valueOf(),
              subEndDate: endDate.valueOf(),
              ...rest,
              dataStudio,
              seedDsData,
              searchData,
              additionalSubscriptions: nextAdditionalSubscriptions,
            })
          }
        }
      )
      evt.preventDefault()
    }

    const savePermissions = () => {
      const relevantPermissions = ['school-district', 'publisher']
      const _permissions = [...(permissions || [])].filter(
        (item) => !relevantPermissions.includes(item)
      )
      const permissionsToAdd =
        orgPermission === 'both' ? relevantPermissions : [orgPermission]

      permissionsToAdd.forEach((permission) => {
        _permissions.push(permission)
      })

      saveOrgPermissions({
        permissions: _permissions,
        districtId,
      })
    }

    return (
      <Form onSubmit={handleSubmit} labelAlign="left">
        <Row>
          <HeadingSpan>District ID:</HeadingSpan>
          <ValueSpan>{districtId}</ValueSpan>
        </Row>
        <Row>
          <HeadingSpan>Existing Plan:</HeadingSpan>
          <ValueSpan>{getSubTypeLabel(subType, permissions)}</ValueSpan>
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
            onClick={savePermissions}
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
            <Select style={{ width: 250 }} data-cy="change-plan-select">
              {DISTRICT_SUBSCRIPTION_OPTIONS.map(({ key, label, value }) => (
                <Option value={value} data-cy={key} key={key}>
                  {label}
                </Option>
              ))}
            </Select>
          )}
        </Form.Item>
        <DatesNotesFormItem
          getFieldDecorator={getFieldDecorator}
          getFieldValue={getFieldValue}
          showAdditionalDetails
          showTutorMeFormItems
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
  const [searchData, setSearchData] = useState()

  return (
    <>
      <ManageDistrictSearchForm
        loading={loading}
        getDistrictDataAction={getDistrictDataAction}
        listOfDistricts={listOfDistricts}
        selectDistrictAction={selectDistrictAction}
        setSearchData={setSearchData}
      />
      <ManageDistrictPrimaryForm
        searchData={searchData}
        selectedDistrict={selectedDistrict}
        upgradeDistrictSubscriptionAction={upgradeDistrictSubscriptionAction}
        saveOrgPermissions={saveOrgPermissions}
      />
    </>
  )
}
