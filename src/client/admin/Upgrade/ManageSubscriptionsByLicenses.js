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
import React, { useState, useEffect } from 'react'
import connect from 'react-redux/lib/connect/connect'
import styled from 'styled-components'
import {
  getDistrictListSelector,
  getFetchOrganizationStateSelector,
  searchOrgaizationRequestAction,
} from '../../author/ContentCollections/ducks'
import ArchiveLicenseModal from './ArchiveLicenseModal'
import { manageSubscriptionsByLicenses } from './ducks'

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
    type: 'TRIAL_LICENSES',
    name: 'Trial Premium & Trial SparkMath Licenses',
  },
]

const IconStyles = { width: '20px', cursor: 'pointer' }

const paginationStyles = { margin: '15px auto' }

const LicensesInvoiceTable = ({
  licensesData,
  handleViewLicense,
  openArchiveAlert,
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
      dataIndex: 'licenseIds',
      width: 100,
      render: (licenseIds, row) => (
        <FlexContainer>
          <Tooltip title="View License">
            <IconEye
              onClick={() =>
                handleViewLicense(licenseIds, row.districtId, row.userId)
              }
              color={themeColor}
              style={IconStyles}
            />
          </Tooltip>
          <Tooltip title="Delete License">
            <IconTrash
              onClick={() => openArchiveAlert(licenseIds)}
              color={themeColor}
              style={IconStyles}
            />
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
            limit: 10,
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
          <Form.Item style={{ width: '350px' }}>
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
  extendTrialLicense,
  isFetchingOrganization,
  districtList,
  searchRequest,
  deleteLicense,
  addSubscription,
  fetchProducts,
}) => {
  const { licenses = [], count = 0, searchType, products } = manageLicensesData
  const [page, setPage] = useState(1)
  const [isVisible, setVisible] = useState(false)
  const [showArchiveAlert, setShowArchiveAlert] = useState(false)
  const [archiveLicenseIds, setArchiveLicenseIds] = useState([])
  const [currentLicenseIds, setCurrentLicenseIds] = useState()
  const [currentDistrictId, setCurrentDistrictId] = useState()
  const [currentUserId, setCurrentUserId] = useState()
  const [currentLicense, setCurrentLicense] = useState({})
  const [showAddSubscriptionModal, setShowAddSubscriptionModal] = useState(
    false
  )
  const [showLicenseViewModal, setShowLicenseViewModal] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  const handlePageChange = (pageNo) => {
    setPage(pageNo)
    fetchLicensesBySearchType({
      type: searchType,
      page: pageNo,
      limit: 10,
    })
  }
  const handleViewLicense = (licenseIds, districtId, userId) => {
    setCurrentLicenseIds(licenseIds)
    setCurrentDistrictId(districtId)
    setCurrentUserId(userId)
    if (searchType === 'TRIAL_LICENSES') {
      const getCurrentLicense = licenses.find((license) =>
        licenseIds.includes(license.licenseIds?.[0])
      )
      setCurrentLicense(getCurrentLicense)
      setShowLicenseViewModal(true)
    } else {
      setVisible(true)
    }
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

  const handleDeleteLicense = () => {
    deleteLicense({
      licenseIds: archiveLicenseIds,
      search: {
        type: searchType,
        page,
        limit: 10,
      },
    })
    setShowArchiveAlert(false)
  }

  const openArchiveAlert = (licenseIds) => {
    setArchiveLicenseIds(licenseIds)
    setShowArchiveAlert(true)
  }

  const closeArchiveAlert = () => {
    setShowArchiveAlert(false)
  }

  return (
    <>
      <ManageSubscriptinModal
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
          districtId={currentDistrictId}
          licenseOwnerId={currentUserId}
        />
      </ManageSubscriptinModal>

      {showArchiveAlert && (
        <ArchiveLicenseModal
          showArchiveAlert={showArchiveAlert}
          closeArchiveAlert={closeArchiveAlert}
          handleDeleteLicense={handleDeleteLicense}
        />
      )}
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
        handleDeleteLicense={handleDeleteLicense}
        openArchiveAlert={openArchiveAlert}
      />
      <Pagination
        hideOnSinglePage
        pageSize={20}
        onChange={handlePageChange}
        current={page}
        total={count}
        style={paginationStyles}
      />
      {searchType === 'TRIAL_LICENSES' && showLicenseViewModal && (
        <SubsLicenseViewModal
          isVisible={showLicenseViewModal}
          closeModal={closeViewLicenseModal}
          extendTrialEndDate={extendTrialLicense}
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
          addSubscription={addSubscription}
          products={products}
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
  {
    searchRequest: searchOrgaizationRequestAction,
    deleteLicense: manageSubscriptionsByLicenses.actions.deleteLicense,
    fetchProducts: manageSubscriptionsByLicenses.actions.fetchProducts,
    addSubscription: manageSubscriptionsByLicenses.actions.addSubscription,
  }
)(ManageSubscriptionsByLicenses)

const ManageSubscriptinModal = styled(CustomModalStyled)`
  min-width: 100%;
  padding-bottom: 0px;
  top: 0px;
  .ant-modal-content {
    border-radius: 0px;
    min-height: 100vh;
  }
`
