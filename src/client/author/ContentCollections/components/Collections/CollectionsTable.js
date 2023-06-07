import React, { useState, useEffect } from 'react'
import { get, isEqual, escapeRegExp } from 'lodash'
import { connect } from 'react-redux'
import { Icon, Tooltip } from 'antd'
import { themeColor } from '@edulastic/colors'
import { IconPencilEdit } from '@edulastic/icons'
import { roleuser } from '@edulastic/constants'
import {
  CollectionTableContainer,
  PermissionsButton,
  StyledScollBar,
  StyledTable,
  BackArrowButton,
  StatusText,
  EditPencilBtn,
} from '../../styled'
import AddCollectionModal from '../Modals/AddCollectionModal'
import {
  fetchCollectionListRequestAction,
  getFetchCollectionListStateSelector,
  getCollectionListSelector,
} from '../../ducks'
import { getUserRole, getUserOrgId } from '../../../src/selectors/user'

import { caluculateOffset } from '../../util'

const CollectionsTable = ({
  selectedCollection,
  handlePermissionClick,
  fetchCollectionListRequest,
  fetchCollectionListState,
  collectionList,
  searchValue,
  userRole,
  userDistrictId,
}) => {
  const [showAddCollectionModal, setAddCollectionModalVisibility] = useState(
    false
  )
  const [editCollectionData, setEditCollectionData] = useState(null)
  const [filteredCollectionList, setFilteredCollectionList] = useState([])
  const [tableMaxHeight, setTableMaxHeight] = useState(200)
  const [collectionTableRef, setCollectionTableRef] = useState(null)

  useEffect(() => {
    fetchCollectionListRequest()
  }, [])

  useEffect(() => {
    if (collectionTableRef) {
      const offsetTopValue = caluculateOffset(collectionTableRef._container)
      const _tableMaxHeight = window.innerHeight - offsetTopValue - 40
      setTableMaxHeight(_tableMaxHeight)
    }
  }, [collectionTableRef?._container?.offsetTop])

  useEffect(() => {
    if (searchValue) {
      const filteredCollections = collectionList.filter((c) => {
        const isPresent = c.name.search(
          new RegExp(escapeRegExp(searchValue), 'i')
        )
        if (isPresent < 0) return false
        return true
      })
      setFilteredCollectionList(filteredCollections)
    }
  }, [searchValue, collectionList])

  const getExtraColumns = () => {
    if (selectedCollection) {
      return []
    }

    return [
      {
        title: 'Owner',
        dataIndex: 'owner',
        key: 'owner',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => {
          const prev = get(a, 'owner', '')
          const next = get(b, 'owner', '')
          return next.localeCompare(prev)
        },
      },
      {
        title: 'Items',
        dataIndex: 'stats.items',
        key: 'items',
        align: 'center',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => {
          const prev = get(a, 'stats.items', '')
          const next = get(b, 'stats.items', '')
          return prev - next
        },
      },
      {
        title: 'Test',
        dataIndex: 'stats.test',
        key: 'test',
        align: 'center',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => {
          const prev = get(a, 'stats.test', '')
          const next = get(b, 'stats.test', '')
          return prev - next
        },
      },
      {
        title: 'Playlists',
        dataIndex: 'stats.playList',
        key: 'playList',
        align: 'center',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => {
          const prev = get(a, 'stats.playList', '')
          const next = get(b, 'stats.playList', '')
          return prev - next
        },
      },
    ]
  }

  const columns = [
    {
      title: 'Collection Name',
      dataIndex: 'name',
      key: 'name',
      ...(selectedCollection ? { width: '150px' } : {}),
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => {
        const prev = get(a, 'name', '')
        const next = get(b, 'name', '')
        return next.localeCompare(prev)
      },
      render: (value, collection) => {
        const textTooltip = (
          <div>
            <p style={{ paddingBottom: '5px' }}>{value}</p>
            <p>{collection.description}</p>
          </div>
        )
        return (
          <>
            <Tooltip placement="right" title={textTooltip}>
              {value}
            </Tooltip>
          </>
        )
      },
    },
    ...getExtraColumns(),
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      width: 120,
      render: (value) => {
        if (value == 1) return <StatusText color="green">ACTIVE</StatusText>
        if (value == 2) return <StatusText color="red">EXPIRED</StatusText>
        return <StatusText color="red">DISABLE</StatusText>
      },
    },
    {
      title: selectedCollection ? '' : 'Permissions',
      key: 'permissions',
      width: selectedCollection ? 30 : 250,
      align: 'right',
      render: (_, record) =>
        selectedCollection ? (
          selectedCollection.bankId === record._id ? (
            <BackArrowButton onClick={() => handlePermissionClick(null)}>
              <Icon type="arrow-left" />
            </BackArrowButton>
          ) : null
        ) : (
          <>
            <PermissionsButton
              data-cy="permission-button"
              onClick={() =>
                handlePermissionClick({
                  itemBankName: record.name,
                  bankId: record._id,
                  buckets: record.buckets,
                  districtId: record.districtId,
                  itemBankType: record.type,
                })
              }
            >
              <span>Permissions</span>
            </PermissionsButton>
            <EditPencilBtn>
              {userRole !== roleuser.EDULASTIC_ADMIN &&
                record.districtId === userDistrictId && (
                  <span
                    onClick={() => {
                      setEditCollectionData(record)
                      setAddCollectionModalVisibility(true)
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <IconPencilEdit color={themeColor} />
                  </span>
                )}
            </EditPencilBtn>
          </>
        ),
    },
  ]

  const handleCollectionModalResponse = () => {
    setAddCollectionModalVisibility(false)
    if (editCollectionData) setEditCollectionData(null)
  }

  return (
    <CollectionTableContainer isCollectionSelected={!!selectedCollection}>
      <StyledScollBar
        table="collectionTable"
        maxHeight={tableMaxHeight}
        option={{
          suppressScrollX: true,
        }}
        ref={(ref) => {
          if (!isEqual(ref, collectionTableRef)) setCollectionTableRef(ref)
        }}
      >
        <StyledTable
          dataSource={searchValue ? filteredCollectionList : collectionList}
          columns={columns}
          pagination={false}
          loading={fetchCollectionListState}
        />
      </StyledScollBar>

      {showAddCollectionModal && (
        <AddCollectionModal
          visible={showAddCollectionModal}
          handleResponse={handleCollectionModalResponse}
          isEditCollection={!!editCollectionData}
          editCollectionData={editCollectionData}
          searchValue={searchValue}
        />
      )}
    </CollectionTableContainer>
  )
}

const CollectionsTableComponent = connect(
  (state) => ({
    fetchCollectionListState: getFetchCollectionListStateSelector(state),
    collectionList: getCollectionListSelector(state),
    userRole: getUserRole(state),
    userDistrictId: getUserOrgId(state),
  }),
  { fetchCollectionListRequest: fetchCollectionListRequestAction }
)(CollectionsTable)

export { CollectionsTableComponent as CollectionsTable }
