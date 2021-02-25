import { themeColor } from '@edulastic/colors'
import {
  CustomModalStyled,
  EduButton,
  FlexContainer,
  SelectInputStyled,
} from '@edulastic/common'
import { IconEye, IconTrash } from '@edulastic/icons'
import loadable from '@loadable/component'
import { Form, Pagination, Table, Tooltip } from 'antd'
import moment from 'moment'
import React, { useState } from 'react'
import connect from 'react-redux/lib/connect/connect'
import {
  getDistrictListSelector,
  getFetchOrganizationStateSelector,
  searchOrgaizationRequestAction,
} from '../../author/ContentCollections/ducks'

const ManageSubscription = loadable(() =>
  import('../../author/ManageSubscription')
)
const SubsLicenseViewModal = loadable(() => import('./SubsLicenseViewModal'))
const AddSubscriptionModal = loadable(() => import('./AddSubscriptionModal'))

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

const LicensesInvoiceTable = ({ licensesData, handleViewLicense }) => {
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
            <IconTrash color={themeColor} style={IconStyles} />
          </Tooltip>
        </FlexContainer>
      ),
    },
  ]

  return licensesData.length ? (
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
    setSearchType,
  }) => {
    // TODO: replace submit btn click handler with onChange handler
    const handleSubmit = (evt) => {
      evt.preventDefault()
      validateFields((err, { searchType }) => {
        if (!err) {
          setSearchType(searchType)
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
        <FlexContainer
          justifyContent="space-between"
          alignItems="center"
          width="400px"
        >
          <Form.Item style={{ width: '300px' }}>
            {getFieldDecorator('searchType', {
              rules: [{ required: true }],
              initialValue: MANAGE_SUBSCRIPTION_SEARCH_TYPE[0].type,
            })(
              <SelectInputStyled
                height="36px"
                placeholder="Select a filter to search"
              >
                {MANAGE_SUBSCRIPTION_SEARCH_TYPE.map(({ type, name }) => (
                  <SelectInputStyled.Option key={type}>
                    {name}
                  </SelectInputStyled.Option>
                ))}
              </SelectInputStyled>
            )}
          </Form.Item>
          <Form.Item>
            <EduButton isBlue htmlType="submit">
              Search
            </EduButton>
          </Form.Item>
        </FlexContainer>
      </Form>
    )
  }
)

const ManageSubscriptionsByLicenses = ({
  fetchLicensesBySearchType,
  manageLicensesData,
  setSearchType,
  upgradeUserSubscriptionAction,
  isFetchingOrganization,
  districtList,
  searchRequest,
}) => {
  const { licenses = [], count = 0, searchType } = manageLicensesData
  const [page, setPage] = useState(1)
  const [isVisible, setVisible] = useState(false)
  const [currentLicenseIds, setCurrentLicenseIds] = useState()
  const [currentLicense, setCurrentLicense] = useState({})
  const [showAddSubscriptionModal, setShowAddSubscriptionModal] = useState(
    false
  )
  const [showLicenseViewModal, setShowLicenseViewModal] = useState(false)
  const handlePageChange = (pageNo) => {
    setPage(pageNo)
    fetchLicensesBySearchType({
      type: searchType,
      page: pageNo,
      limit: 20,
    })
  }
  const handleViewLicense = (licenseId) => {
    setCurrentLicenseIds([licenseId])
    setVisible(true)
    const getCurrentLicense = licenses.find(
      (license) => license.licenseId === licenseId
    )
    setCurrentLicense(getCurrentLicense)
    setShowLicenseViewModal(true)
  }
  const closeViewLicenseModal = () => {
    setShowLicenseViewModal(false)
  }
  const handleAddSubscription = () => {
    setShowAddSubscriptionModal(true)
  }
  const closeAddSubscriptionModal = () => {
    setShowAddSubscriptionModal(false)
  }

  return (
    <>
      <CustomModalStyled
        visible={isVisible}
        title="Manage Subscription"
        onCancel={() => setVisible(false)}
        fullscreen
        destroyOnClose
        footer={null}
      >
        <ManageSubscription
          isEdulasticAdminView
          licenseIds={currentLicenseIds}
        />
      </CustomModalStyled>
      <FlexContainer justifyContent="space-between">
        <SearchFilters
          fetchLicensesBySearchType={fetchLicensesBySearchType}
          setSearchType={setSearchType}
        />
        <EduButton isBlue onClick={handleAddSubscription}>
          Add Subscription
        </EduButton>
      </FlexContainer>
      <LicensesInvoiceTable
        licensesData={licenses}
        handleViewLicense={handleViewLicense}
      />
      <Pagination
        hideOnSinglePage
        pageSize={20}
        onChange={handlePageChange}
        current={page}
        total={count}
      />
      {searchType === 'TRIAL_PREMIUM' && showLicenseViewModal && (
        <SubsLicenseViewModal
          isVisible={showLicenseViewModal}
          closeModal={closeViewLicenseModal}
          extendTrialEndDate={upgradeUserSubscriptionAction}
          currentLicense={currentLicense}
        />
      )}
      {showAddSubscriptionModal && (
        <AddSubscriptionModal
          isVisible={showAddSubscriptionModal}
          closeModal={closeAddSubscriptionModal}
          isFetchingOrganization={isFetchingOrganization}
          districtList={districtList}
          searchRequest={searchRequest}
        />
      )}
    </>
  )
}

export default connect(
  (state) => ({
    districtList: getDistrictListSelector(state),
    isFetchingOrganization: getFetchOrganizationStateSelector(state),
  }),
  { searchRequest: searchOrgaizationRequestAction }
)(ManageSubscriptionsByLicenses)
