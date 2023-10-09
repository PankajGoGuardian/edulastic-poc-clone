import { userApi, manageSubscriptionsApi } from '@edulastic/api'
import { themeColor } from '@edulastic/colors'
import {
  CustomModalStyled,
  EduButton,
  FlexContainer,
  notification,
} from '@edulastic/common'
import { IconEye, IconTrash } from '@edulastic/icons'
import loadable from '@loadable/component'
import { Pagination, Table, Tooltip } from 'antd'
import { debounce } from 'lodash'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import connect from 'react-redux/lib/connect/connect'
import styled from 'styled-components'
import {
  getDistrictListSelector,
  getFetchOrganizationStateSelector,
  searchOrgaizationRequestAction,
} from '../../author/ContentCollections/ducks'
import { getUsersSelector } from '../../author/ManageSubscription/ducks'
import ArchiveLicenseModal from './ArchiveLicenseModal'
import { manageSubscriptionsByLicenses } from './ducks'
import SearchFilters from './ManageSubsSearchFilters'

const ManageSubscription = loadable(() =>
  import('../../author/ManageSubscription')
)
const SubsLicenseViewModal = loadable(() => import('./SubsLicenseViewModal'))
const AddSubscriptionModal = loadable(() => import('./AddSubscriptionModal'))

const IconStyles = { width: '20px', cursor: 'pointer' }

const paginationStyles = { margin: '15px auto' }

const SORT_ORDER = {
  ascend: 'asc',
  descend: 'desc',
}

const LicensesInvoiceTable = ({
  licensesData,
  handleViewLicense,
  openArchiveAlert,
  searchType,
  fetchLicensesBySearchType,
  setPage,
  districtId,
  setSortingData,
}) => {
  const onChange = (pagination, filters, sorter) => {
    setSortingData(() => ({
      sortBy: sorter.field,
      sortOrder: SORT_ORDER[sorter.order],
    }))
    fetchLicensesBySearchType({
      type: searchType,
      page: 1,
      limit: 10,
      sortOrder: SORT_ORDER[sorter.order],
      sortBy: sorter.field,
      districtId,
    })
    setPage(1)
  }

  const columns = [
    {
      title: 'Serial No',
      dataIndex: 'serialNo',
      render: (serialNo) => <span>{serialNo}</span>,
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
      sorter: true,
      render: (startDate) => (
        <span>{moment(startDate).format('DD MMM, YYYY')}</span>
      ),
    },
    {
      title: 'End Date',
      dataIndex: 'endDate',
      sorter: true,
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
              data-cy={`${row.username}-viewLicense`}
              onClick={() =>
                handleViewLicense(licenseIds, row.districtId, row.userId)
              }
              color={themeColor}
              style={IconStyles}
            />
          </Tooltip>
          <Tooltip title="Delete License">
            <IconTrash
              data-cy={`${row.username}-deleteLicense`}
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
        rowKey={(record) => `${record.serialNo}-${searchType}`}
        dataSource={licensesData.map((el, index) => ({ ...el, index }))}
        pagination={false}
        bordered
        onChange={onChange}
      />
    </>
  ) : null
}

const sanitizeSearchResult = (users = []) => {
  const result =
    users.map((x) => {
      const { _source = {} } = x
      return {
        username: _source.username,
        userId: x._id,
      }
    }) || []
  return result
}

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
  const [
    allLicensedUserInSelectedDistrict,
    setAllLicensedUserInSelectedDistrict,
  ] = useState([])
  const [usersList, setUsersList] = useState([])
  const [isFetchingUsers, setIsFetchingUsers] = useState(false)
  const [fieldData, setFieldData] = useState({
    districtId: '',
    districtName: '',
    orgType: 'user',
    managerEmail: [],
    subStartDate: moment().valueOf(),
    subEndDate: moment().add(365, 'days').valueOf(),
    customerSuccessManager: '',
    opportunityId: '',
    notes: '',
  })

  const [sortingData, setSortingData] = useState({
    sortBy: '',
    sortOrder: '',
  })

  useEffect(() => {
    fetchProducts()
    fetchLicensesBySearchType({
      type: 'BULK_LICENSES',
      page: 1,
      limit: 10,
    })
  }, [])

  useEffect(() => {
    const fetchLicensedUserInDistrict = async () => {
      try {
        const licensensedUsersInDistrict = await manageSubscriptionsApi.getAllLicensedUserInDistrict(
          {
            districtId: fieldData.districtId,
            type: searchType,
          }
        )
        const sanitizedUserData = licensensedUsersInDistrict.map((o) => ({
          userId: o._id,
          username: o.email,
        }))
        setAllLicensedUserInSelectedDistrict(sanitizedUserData)
        setUsersList(sanitizedUserData)
      } catch (e) {
        setAllLicensedUserInSelectedDistrict([])
        setUsersList([])
      }
    }
    if (fieldData.districtId) {
      fetchLicensedUserInDistrict()
    }
  }, [fieldData.districtId])

  const fetchUsers = async (searchString) => {
    try {
      if (!searchString) {
        setUsersList(allLicensedUserInSelectedDistrict)
        return
      }
      const searchData = {
        districtId: fieldData?.districtId,
        search: {
          email: [{ type: 'cont', value: searchString }],
        },
        limit: 25,
        page: 1,
        role: 'teacher',
        status: 1,
      }
      const { result } = await userApi.fetchUsers(searchData)
      const _users = sanitizeSearchResult(result)
      setUsersList(_users)
    } catch (e) {
      setUsersList([])
      console.warn(e)
    } finally {
      setIsFetchingUsers(false)
    }
  }

  const handleUsersFetch = debounce(fetchUsers, 800)

  const handleUsersSearch = (searchString) => {
    setIsFetchingUsers(true)
    handleUsersFetch(searchString)
  }

  const handlePageChange = (pageNo) => {
    setPage(pageNo)
    fetchLicensesBySearchType({
      type: searchType,
      page: pageNo,
      limit: 10,
      sortOrder: sortingData.sortOrder,
      sortBy: sortingData.sortBy,
      districtId: fieldData.districtId,
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

  const handleSelectDistrict = (value, option) => {
    const { value: districtId, name: districtName } = option?.props || {}

    // resetting all the org fields as we are changing the organization(district)
    setFieldData({
      ...fieldData,
      districtId,
      districtName,
      managerEmail: [],
    })
  }

  const handleSearch = (searchString, _searchType, size) => {
    if (!fieldData.districtId && _searchType !== 'DISTRICT')
      return notification({ messageKey: 'pleaseSelectDistrict' })
    const data = {
      orgType: _searchType,
      searchString,
    }
    if (size) {
      data.size = size
    }
    if (_searchType !== 'DISTRICT') data.districtId = fieldData.districtId
    searchRequest(data)
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
          setPage={setPage}
          usersList={usersList}
          setUsersList={setUsersList}
          isFetchingOrganization={isFetchingOrganization}
          districtList={districtList}
          handleSelectDistrict={handleSelectDistrict}
          handleSearch={handleSearch}
          fieldData={fieldData}
          handleUsersSearch={handleUsersSearch}
          isFetchingUsers={isFetchingUsers}
        />
        <EduButton
          data-cy="addSubscriptionButton"
          isBlue
          onClick={handleAddSubscription}
        >
          Add Subscription
        </EduButton>
      </FlexContainer>
      <LicensesInvoiceTable
        licensesData={licenses}
        handleViewLicense={handleViewLicense}
        handleDeleteLicense={handleDeleteLicense}
        openArchiveAlert={openArchiveAlert}
        searchType={searchType}
        fetchLicensesBySearchType={fetchLicensesBySearchType}
        setPage={setPage}
        districtId={fieldData.districtId}
        setSortingData={setSortingData}
      />
      <Pagination
        hideOnSinglePage
        pageSize={10}
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
          handleSelectDistrict={handleSelectDistrict}
          handleSearch={handleSearch}
          fieldData={fieldData}
          setFieldData={setFieldData}
        />
      )}
    </>
  )
}

export default connect(
  (state) => ({
    districtList: getDistrictListSelector(state),
    isFetchingOrganization: getFetchOrganizationStateSelector(state),
    users: getUsersSelector(state),
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
