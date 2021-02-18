import React from 'react'
import { Button, Form, Table, Tooltip } from 'antd'
import { StyledFilterSelect } from '../Common/StyledComponents'
import moment from 'moment'
import { FlexContainer } from '@edulastic/common'
import { IconEye, IconTrash } from '@edulastic/icons'
import { themeColor } from '@edulastic/colors'

const MANAGE_SUBSCRIPTION_SEARCH_TYPE = [
  {
    type: 'BULK_LICENSES',
    name: 'Multiple Licenses',
  },
  {
    type: 'TRIAL_PREMIUM',
    name: 'Trial Premium Licenses',
  },
  {
    type: 'TRIAL_SPARKMATH',
    name: 'SparkMath Licenses',
  },
]

const IconStyles = { width: '20px', cursor: 'pointer' }

const LicensesInvoiceTable = ({
  licensesData,
  handleViewLicense,
  handleDeleteLicense,
}) => {
  const columns = [
    {
      title: 'Invoice Id',
      dataIndex: 'invoiceId',
      render: (invoiceId) => <span>{invoiceId}</span>,
      width: 100,
      align: 'center',
    },
    {
      title: 'Organization',
      dataIndex: 'orgName',
      render: (orgName) => <span>{orgName}</span>,
    },
    {
      title: 'Username',
      dataIndex: 'username',
      render: (username) => <span>{username}</span>,
    },
    {
      title: 'Start Date',
      dataIndex: 'startDate',
      render: (startDate) => (
        <span>{moment(startDate).format('DD MMM, YYYY')}</span>
      ),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      render: (endDate) => (
        <span>{moment(endDate).format('DD MMM, YYYY')}</span>
      ),
    },
    {
      title: 'Product Type',
      dataIndex: 'productType',
      render: (productType) => <span>{productType}</span>,
    },
    {
      title: 'Actions',
      dataIndex: 'licenseId',
      width: 100,
      render: (licenseId) => (
        <FlexContainer>
          <Tooltip title="View License">
            <IconEye
              onClick={() => handleViewLicense(licenseId)}
              color={themeColor}
              style={IconStyles}
            />
          </Tooltip>
          <Tooltip title="Delete License">
            <IconTrash
              onClick={() => handleDeleteLicense(licenseId)}
              color={themeColor}
              style={IconStyles}
            />
          </Tooltip>
        </FlexContainer>
      ),
    },
  ]

  return licensesData ? (
    <>
      <h2>The list of active Licenses are :</h2>
      <Table
        columns={columns}
        rowKey={(record) => record._id}
        dataSource={licensesData.map((el, index) => ({ ...el, index }))}
        pagination={false}
        bordered
      />
    </>
  ) : null
}

const SearchFilters = Form.create({
  name: 'searchLicensesByType',
})(
  ({
    form: { getFieldDecorator, validateFields },
    fetchLicensesBySearchType,
  }) => {
    const handleSubmit = (evt) => {
      evt.preventDefault()
      validateFields((err, { searchType }) => {
        if (!err) {
          fetchLicensesBySearchType({
            type: searchType,
            page: 1,
            limit: 20,
          })
        }
      })
    }
    return (
      <Form onSubmit={handleSubmit}>
        <FlexContainer justifyContent="space-between" width="400px">
          <Form.Item style={{ width: '300px' }}>
            {getFieldDecorator('searchType', {
              rules: [{ required: true }],
              initialValue: undefined,
            })(
              <StyledFilterSelect placeholder="Select a filter to search">
                {MANAGE_SUBSCRIPTION_SEARCH_TYPE.map(({ type, name }) => (
                  <StyledFilterSelect.Option key={type}>
                    {name}
                  </StyledFilterSelect.Option>
                ))}
              </StyledFilterSelect>
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Search
            </Button>
          </Form.Item>
        </FlexContainer>
      </Form>
    )
  }
)

const ManageSubscriptionsByLicenses = ({
  fetchLicensesBySearchType,
  handleViewLicense,
  handleDeleteLicense,
}) => {
  const licenseData = [
    {
      invoiceId: 1,
      licenseId: '507c7f79bcf86cd7994f6c0e',
      orgName: 'MultipleSubscriptions HOME SCHOOL DISTRICT',
      username: 'multi-sub-user@edu.uat',
      startDate: '2020-11-23T09:49:27.407Z',
      endDate: '2022-11-23T09:49:27.407Z',
      productType: 'PREMIUM',
    },
    {
      invoiceId: 2,
      licenseId: '507c7f79bcf86cd7994f6c0f',
      orgName: 'MultipleSubscriptions HOME SCHOOL DISTRICT',
      username: 'multi-sub-user@edu.uat',
      startDate: '2020-11-23T09:49:27.407Z',
      endDate: '2022-11-23T09:49:27.407Z',
      productType: 'ITEM_BANK',
    },
  ]
  return (
    <>
      <FlexContainer justifyContent="space-between">
        <SearchFilters fetchLicensesBySearchType={fetchLicensesBySearchType} />
        <Button
          onClick={() => console.log('Add Subscription')} // TODO!
          type="primary"
        >
          Add Subscription
        </Button>
      </FlexContainer>
      <LicensesInvoiceTable
        licensesData={licenseData}
        handleViewLicense={handleViewLicense}
        handleDeleteLicense={handleDeleteLicense}
      />
    </>
  )
}

export default ManageSubscriptionsByLicenses
