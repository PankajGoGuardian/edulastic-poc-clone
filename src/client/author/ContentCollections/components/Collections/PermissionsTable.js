import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Tabs, Tooltip } from 'antd'
import { get, isEqual, debounce } from 'lodash'
import moment from 'moment'
import { themeColor } from '@edulastic/colors'
import { IconPencilEdit } from '@edulastic/icons'
import { roleuser } from '@edulastic/constants'
import { EduButton, SearchInputStyled } from '@edulastic/common'
import { ContentBucketTable } from './ContentBucketsTable'
import {
  PermissionTableContainer,
  HeadingContainer,
  StyledTab,
  StyledTable,
  StyledScollBar,
  StatusText,
  DeletePermissionButton,
} from '../../styled'
import AddPermissionModal from '../Modals/AddPermissionModal'
import {
  getFetchPermissionsStateSelector,
  getPermissionsSelector,
  addPermissionRequestAction,
  fetchPermissionsRequestAction,
  editPermissionRequestAction,
  deletePermissionRequestAction,
  getPermissionsTotalCountSelector,
} from '../../ducks'
import { getUserRole, getUserOrgId } from '../../../src/selectors/user'

import { caluculateOffset } from '../../util'
import {
  TableFilters,
  TabTitle,
} from '../../../../admin/Common/StyledComponents'
import { LeftFilterDiv } from '../../../../common/styled'

const { TabPane } = Tabs

const PermissionsTable = ({
  selectedCollection,
  isFetchingPermissions,
  permissions,
  fetchPermissionsRequest,
  addPermissionRequest,
  editPermissionRequest,
  deletePermissionRequest,
  userRole,
  userDistrictId,
  permissionsTotalCount,
}) => {
  const [showPermissionModal, setPermissionModalVisibility] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState(null)
  const [tableMaxHeight, setTableMaxHeight] = useState(200)
  const [permissionTableRef, setPermissionTableRef] = useState(null)
  const [paginationData, setPaginationData] = useState({
    pageNo: 1,
    recordsPerPage: 25,
    searchString: '',
  })

  useEffect(() => {
    fetchPermissionsRequest({ _id: selectedCollection.bankId, paginationData })
  }, [selectedCollection])

  useEffect(() => {
    if (permissionTableRef) {
      const _tableMaxHeight =
        window.innerHeight -
        caluculateOffset(permissionTableRef._container) -
        40
      setTableMaxHeight(_tableMaxHeight)
    }
  }, [permissionTableRef?._container?.offsetTop])

  const handleEditPermission = (permission) => {
    setSelectedPermission(permission)
    setPermissionModalVisibility(true)
  }

  const handleDeactivatePermission = (id) => {
    deletePermissionRequest({ bankId: selectedCollection.bankId, id })
  }

  const columns = [
    {
      title: 'Organization',
      dataIndex: 'orgName',
      key: 'orgName',
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => {
        const prev = get(a, 'orgName', '')
        const next = get(b, 'orgName', '')
        return next?.localeCompare(prev)
      },
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (_, record) => record.role.join(' / '),
    },
    {
      title: 'Start',
      dataIndex: 'startDate',
      key: 'startDate',
      align: 'center',
      render: (value) => (value && moment(value).format('Do MMM, YYYY')) || '-',
      defaultSortOrder: 'descend',
      sorter: (a, b) => {
        const prev = get(a, 'startDate', 0)
        const next = get(b, 'startDate', 0)
        return prev - next
      },
    },
    {
      title: 'End',
      dataIndex: 'endDate',
      key: 'endDate',
      align: 'center',
      render: (value) => (value && moment(value).format('Do MMM, YYYY')) || '-',
      sorter: (a, b) => {
        const prev = get(a, 'endDate', 0)
        const next = get(b, 'endDate', 0)
        return prev - next
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (value, record) => {
        if (record?.endDate <= moment().valueOf())
          return <StatusText color="red">Expired</StatusText>
        if (value) return <StatusText color="green">Active</StatusText>
        return <StatusText color="red">Revoked</StatusText>
      },
    },
    {
      title: '',
      key: 'actions',
      width: '50px',
      render: (_, record) => {
        if (
          userRole === roleuser.EDULASTIC_ADMIN ||
          selectedCollection.districtId === userDistrictId
        )
          return (
            <div>
              <Tooltip placement="topLeft" title="Edit Permission">
                <span
                  style={{ cursor: 'pointer', marginLeft: '6px' }}
                  onClick={() => handleEditPermission(record)}
                >
                  <IconPencilEdit color={themeColor} />
                </span>
              </Tooltip>
              <Tooltip placement="topRight" title="Remove Permission">
                <DeletePermissionButton
                  data-cy={`delete_${record.orgName}`}
                  className="delete-button"
                  onClick={() => handleDeactivatePermission(record._id)}
                >
                  <i className="fa fa-trash-o" aria-hidden="true" />
                </DeletePermissionButton>
              </Tooltip>
            </div>
          )
        return null
      },
    },
  ]

  const handlePermissionModalResponse = (response) => {
    setPermissionModalVisibility(false)
    if (response) {
      const data = {
        bankId: selectedCollection.bankId,
        collectionName: selectedCollection.itemBankName,
        data: response,
      }
      if (selectedPermission) {
        editPermissionRequest({
          data: { ...data, id: selectedPermission._id },
          paginationData,
        })
      } else {
        addPermissionRequest({ data, paginationData })
      }
    }
    setSelectedPermission(null)
  }

  const handlePermissionSearch = debounce((searchString) => {
    const _paginationData = {
      ...paginationData,
      pageNo: 1,
      searchString,
    }
    setPaginationData(_paginationData)
    fetchPermissionsRequest({
      _id: selectedCollection.bankId,
      paginationData: _paginationData,
    })
  }, 400)

  const handlePermissionTableChange = (pagination) => {
    if (pagination) {
      const _paginationData = {
        ...paginationData,
        pageNo: pagination.current,
      }
      setPaginationData(_paginationData)
      fetchPermissionsRequest({
        _id: selectedCollection.bankId,
        paginationData: _paginationData,
      })
    }
  }

  return (
    <PermissionTableContainer>
      <StyledTab defaultActiveKey="1">
        <TabPane tab="PERMISSIONS" key="1">
          <HeadingContainer className="heading-container">
            <TabTitle>Permissions</TabTitle>
            <TableFilters>
              <LeftFilterDiv width={80}>
                <SearchInputStyled
                  height="34px"
                  placeholder="Search for District, School or User"
                  data-cy="searchForDistrictSchoolOrUser"
                  onChange={(e) => {
                    handlePermissionSearch(e?.target?.value)
                  }}
                />
                <EduButton
                  isGhost
                  height="34px"
                  onClick={() => setPermissionModalVisibility(true)}
                >
                  Add Permission
                </EduButton>
              </LeftFilterDiv>
            </TableFilters>
          </HeadingContainer>
          <StyledScollBar
            table="permissionTable"
            ref={(ref) => {
              if (!isEqual(ref, permissionTableRef)) setPermissionTableRef(ref)
            }}
            maxHeight={tableMaxHeight}
          >
            <StyledTable
              loading={isFetchingPermissions}
              dataSource={permissions}
              columns={columns}
              pagination={{
                pageSize: paginationData.recordsPerPage,
                total: permissionsTotalCount,
                current: paginationData.pageNo,
              }}
              onChange={handlePermissionTableChange}
            />
          </StyledScollBar>
        </TabPane>
        <TabPane tab="CONTENT BUCKETS" key="2">
          <HeadingContainer>
            <TabTitle>Content Buckets</TabTitle>
          </HeadingContainer>
          <ContentBucketTable buckets={selectedCollection.buckets} />
        </TabPane>
      </StyledTab>
      {showPermissionModal && (
        <AddPermissionModal
          visible={showPermissionModal}
          handleResponse={handlePermissionModalResponse}
          itemBankName={selectedCollection.itemBankName}
          selectedPermission={selectedPermission}
          isEditPermission={!!selectedPermission}
        />
      )}
    </PermissionTableContainer>
  )
}
const PermissionsTableComponent = connect(
  (state) => ({
    isFetchingPermissions: getFetchPermissionsStateSelector(state),
    permissions: getPermissionsSelector(state),
    userRole: getUserRole(state),
    userDistrictId: getUserOrgId(state),
    permissionsTotalCount: getPermissionsTotalCountSelector(state),
  }),
  {
    fetchPermissionsRequest: fetchPermissionsRequestAction,
    addPermissionRequest: addPermissionRequestAction,
    editPermissionRequest: editPermissionRequestAction,
    deletePermissionRequest: deletePermissionRequestAction,
  }
)(PermissionsTable)
export { PermissionsTableComponent as PermissionsTable }
