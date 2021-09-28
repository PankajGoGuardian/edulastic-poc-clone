import { EduButton, SearchInputStyled } from '@edulastic/common'
import { roleuser } from '@edulastic/constants'
import { withNamespaces } from '@edulastic/localization'
import { Tooltip } from 'antd'
import { debounce, get } from 'lodash'
import PropTypes from 'prop-types'
import React, { useEffect, useMemo, useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withTheme } from 'styled-components'
import {
  StyledFilterDiv,
  TabTitle,
  TableFilters,
} from '../../../../admin/Common/StyledComponents'
import {
  LeftFilterDiv,
  MainContainer,
  RightFilterDiv,
  SubHeaderWrapper,
  TableContainer,
} from '../../../../common/styled'
import {
  fetchCollectionListRequestAction,
  getCollectionListSelector,
} from '../../../ContentCollections/ducks'
import Breadcrumb from '../../../src/components/Breadcrumb'
import ContentSubHeader from '../../../src/components/common/AdminSubHeader/ContentSubHeader'
import {
  createBucketAction,
  receiveBucketsAction,
  updateBucketAction,
} from '../../ducks'
import CreateBucketModalForm from './CreateBucketModal'
import {
  StyledContentBucketsTable,
  StyledIconCheck,
  StyledIconClose,
  Owner,
  StyledIconPencilEdit,
} from './styled'
import { getUserOrgId } from '../../../src/selectors/user'

const menuActive = { mainMenu: 'Content', subMenu: 'Buckets' }
const breadcrumbData = [
  {
    title: 'MANAGE DISTRICT',
    to: '/author/districtprofile',
  },
  {
    title: 'CONTENT',
    to: '',
  },
]

const ContentBucketsTable = ({
  loadBuckets,
  createBucket,
  updateBucket,
  buckets,
  history,
  theme,
  collections,
  fetchCollectionListRequest,
  user,
  t,
  orgId,
}) => {
  const [upsertModalVisibility, setUpsertModalVisibility] = useState(false)
  const [editableBucketId, setEditableBucketId] = useState('')
  const [searchName, setSearchName] = useState('')

  useEffect(() => {
    loadBuckets()
  }, [])

  const toggleCreateBucketModal = () => {
    if (!upsertModalVisibility) {
      fetchCollectionListRequest({
        pageNo: 1,
        recordsPerPage: 20,
        searchString: '',
      })
    } else {
      setEditableBucketId('')
    }
    setUpsertModalVisibility(!upsertModalVisibility)
  }

  const onEditBucket = (key) => {
    setEditableBucketId(key)
    toggleCreateBucketModal()
  }

  const editableBucket = useMemo(
    () => buckets.find((bucket) => bucket._id === editableBucketId),
    [buckets, editableBucketId]
  )

  const handleCreateBucket = (data) => {
    if (data._id) {
      data = { ...data, owner: editableBucket.owner }
      updateBucket(data)
    } else {
      data = {
        ...data,
        owner: [user.firstName, user.lastName].filter((n) => n).join(' '),
      }
      createBucket(data)
    }
    toggleCreateBucketModal()
  }

  const handleSearchName = (value) => setSearchName(value.trim())
  const filteredBuckets = () => {
    if (searchName) {
      return buckets.filter((bucket) =>
        bucket.name.toLowerCase().includes(searchName.toLowerCase())
      )
    }
    return buckets
  }

  const onCollectionSearch = debounce((value) => {
    if (value.trim().length >= 3)
      fetchCollectionListRequest({
        pageNo: 1,
        recordsPerPage: 20,
        searchString: value,
      })
  }, 500)

  const columns = [
    {
      title: t('content.buckets.tableHeader.name'),
      dataIndex: 'name',
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => {
        const prev = get(a, 'name', '')
        const next = get(b, 'name', '')
        return next.localeCompare(prev)
      },
      className: 'column-align-left',
      width: 300,
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
    {
      title: t('content.buckets.tableHeader.collectionName'),
      dataIndex: 'collection.name',
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => {
        const prev = `${get(a, 'name', '')}${get(a, 'name', '')}`
        const next = `${get(b, 'name', '')}${get(b, 'name', '')}`
        return next.localeCompare(prev)
      },
      className: 'column-align-left',
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
    {
      title: t('content.buckets.tableHeader.owner'),
      dataIndex: 'owner',
      render: (owner = '-') => {
        return (
          <Tooltip placement="right" title={owner}>
            <Owner>{owner}</Owner>
          </Tooltip>
        )
      },
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => {
        const prev = get(a, 'owner', '')
        const next = get(b, 'owner', '')
        return next.localeCompare(prev)
      },
      className: 'column-align-left',
    },
    {
      title: t('content.buckets.tableHeader.cloneItem'),
      dataIndex: 'canDuplicateItem',
      render: (cloneItem = false) =>
        cloneItem ? (
          <StyledIconCheck color={theme.checkColor} />
        ) : (
          <StyledIconClose color={theme.closeColor} />
        ),
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => {
        const prev = get(a, 'canDuplicateItem', false)
        const next = get(b, 'canDuplicateItem', false)
        return next - prev
      },
    },
    {
      title: t('content.buckets.tableHeader.cloneTest'),
      dataIndex: 'canDuplicateTest',
      render: (cloneTest = false) =>
        cloneTest ? (
          <StyledIconCheck color={theme.checkColor} />
        ) : (
          <StyledIconClose color={theme.closeColor} />
        ),
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => {
        const prev = get(a, 'canDuplicateTest', false)
        const next = get(b, 'canDuplicateTest', false)
        return next - prev
      },
    },
    {
      title: t('content.buckets.tableHeader.clonePlaylist'),
      dataIndex: 'canDuplicatePlayList',
      render: (clonePlaylist = false) =>
        clonePlaylist ? (
          <StyledIconCheck color={theme.checkColor} />
        ) : (
          <StyledIconClose color={theme.closeColor} />
        ),
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => {
        const prev = get(a, 'canDuplicatePlayList', false)
        const next = get(b, 'canDuplicatePlayList', false)
        return next - prev
      },
    },
    {
      title: t('content.buckets.tableHeader.itemVisibility'),
      dataIndex: 'isItemVisible',
      render: (itemVisibility = false) =>
        itemVisibility ? (
          <StyledIconCheck color={theme.checkColor} />
        ) : (
          <StyledIconClose color={theme.closeColor} />
        ),
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => {
        const prev = get(a, 'isItemVisible', false)
        const next = get(b, 'isItemVisible', false)
        return next - prev
      },
    },
    {
      title: t('content.buckets.tableHeader.testVisibility'),
      dataIndex: 'isTestVisible',
      render: (testVisibility = false) =>
        testVisibility ? (
          <StyledIconCheck color={theme.checkColor} />
        ) : (
          <StyledIconClose color={theme.closeColor} />
        ),
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => {
        const prev = get(a, 'isTestVisible', false)
        const next = get(b, 'isTestVisible', false)
        return next > prev
      },
    },
    {
      title: t('content.buckets.tableHeader.items'),
      dataIndex: 'items',
      render: (items = 0) => items,
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => {
        const prev = get(a, 'items', '')
        const next = get(b, 'items', '')
        return prev - next
      },
    },
    {
      title: t('content.buckets.tableHeader.test'),
      dataIndex: 'test',
      render: (test = 0) => test,
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => {
        const prev = get(a, 'test', '')
        const next = get(b, 'test', '')
        return prev - next
      },
    },
    {
      title: t('content.buckets.tableHeader.playlist'),
      dataIndex: 'playlist',
      render: (playlist = 0) => playlist,
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => {
        const prev = get(a, 'playlist', '')
        const next = get(b, 'playlist', '')
        return prev - next
      },
    },
    {
      title: t('content.buckets.tableHeader.status'),
      dataIndex: 'status',
      render: (status = '-') => (
        <span
          style={{
            color: status === 0 ? theme.closeColor : theme.checkColor,
            fontSize: '9px',
          }}
        >
          {status === 0 ? 'Disable' : 'Active'}
        </span>
      ),
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => {
        const prev = get(a, 'status', '')
        const next = get(b, 'status', '')
        return next.localeCompare(prev)
      },
      className: 'status-column',
    },
    {
      dataIndex: '_id',
      render: (id, record) => {
        if (
          record.collection.districtId === orgId &&
          user.role !== roleuser.EDULASTIC_ADMIN
        )
          return (
            <StyledIconPencilEdit
              color={theme.themeColor}
              onClick={() => onEditBucket(id)}
            />
          )
        return null
      },
    },
  ]

  const filteredCollections = collections
  if (
    editableBucket &&
    !filteredCollections.find((fc) => fc._id === editableBucket.collection._id)
  ) {
    filteredCollections.push(editableBucket.collection)
  }

  return (
    <MainContainer>
      <SubHeaderWrapper>
        {user.role !== roleuser.EDULASTIC_ADMIN && (
          <Breadcrumb data={breadcrumbData} style={{ position: 'unset' }} />
        )}
      </SubHeaderWrapper>
      <ContentSubHeader active={menuActive} history={history} />

      <StyledFilterDiv>
        <TabTitle>{menuActive.subMenu}</TabTitle>
        <TableFilters>
          <LeftFilterDiv
            width={user.role === roleuser.EDULASTIC_ADMIN ? 100 : 55}
          >
            <SearchInputStyled
              placeholder={t('common.searchbyname')}
              onSearch={handleSearchName}
              marginRight={user.role === roleuser.EDULASTIC_ADMIN ? 0 : 20}
              height="36px"
            />
          </LeftFilterDiv>
          {user.role !== roleuser.EDULASTIC_ADMIN && (
            <RightFilterDiv>
              <EduButton type="primary" onClick={toggleCreateBucketModal}>
                {t('content.buckets.createBuckets')}
              </EduButton>
            </RightFilterDiv>
          )}
        </TableFilters>
      </StyledFilterDiv>
      <TableContainer>
        <StyledContentBucketsTable
          rowKey={(record) => record._id}
          dataSource={filteredBuckets()}
          columns={columns}
          pagination={false}
        />
      </TableContainer>
      {upsertModalVisibility && (
        <CreateBucketModalForm
          t={t}
          closeModal={toggleCreateBucketModal}
          createBucket={handleCreateBucket}
          bucket={editableBucket || {}}
          collections={filteredCollections}
          onCollectionSearch={onCollectionSearch}
        />
      )}
    </MainContainer>
  )
}

const enhance = compose(
  withNamespaces('manageDistrict'),
  connect(
    (state) => ({
      buckets: get(state, ['bucketReducer', 'data'], []),
      collections: getCollectionListSelector(state),
      user: get(state, ['user', 'user'], {}),
      orgId: getUserOrgId(state),
    }),
    {
      loadBuckets: receiveBucketsAction,
      createBucket: createBucketAction,
      updateBucket: updateBucketAction,
      fetchCollectionListRequest: fetchCollectionListRequestAction,
    }
  )
)

export default enhance(withTheme(ContentBucketsTable))

ContentBucketsTable.propTypes = {
  loadBuckets: PropTypes.func.isRequired,
  createBucket: PropTypes.func.isRequired,
  updateBucket: PropTypes.func.isRequired,
  buckets: PropTypes.arrayOf(PropTypes.object).isRequired,
  history: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
}
