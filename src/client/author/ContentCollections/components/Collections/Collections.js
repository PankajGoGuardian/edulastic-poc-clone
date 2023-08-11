import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Icon, Spin } from 'antd'
import { EduButton, EduIf, SearchInputStyled } from '@edulastic/common'
import ContentSubHeader from '../../../src/components/common/AdminSubHeader/ContentSubHeader'
import { CollectionsTable } from './CollectionsTable'
import { PermissionsTable } from './PermissionsTable'
import {
  LeftFilterDiv,
  MainContainer,
  SubHeaderWrapper,
  TableContainer,
} from '../../../../common/styled'
import Breadcrumb from '../../../src/components/Breadcrumb'
import ImportContentModal from '../Modals/ImportContentModal'
import AddCollectionModal from '../Modals/AddCollectionModal'

import { getUser, getManageTabLabelSelector } from '../../../src/selectors/user'
import {
  batchAddPermissionRequestAction,
  importingLoaderSelector,
  importTestToCollectionRequestAction,
} from '../../ducks'
import {
  StyledFilterDiv,
  TableFilters,
  TabTitle,
} from '../../../../admin/Common/StyledComponents'
import AddPermissionModal from '../Modals/AddPermissionModal'

const menuActive = { mainMenu: 'Content', subMenu: 'Collections' }

const Collections = ({
  history,
  user,
  manageTabLabel,
  importDataToCollection,
  importLoader,
  batchAddPermissionRequest,
}) => {
  const [showPermissionModal, setPermissionModalVisibility] = useState(false)
  const [selectedCollection, setCollection] = useState(null)
  const [showImportModal, setImportModalVisibility] = useState(false)
  const [showAddCollectionModal, setAddCollectionModalVisibility] = useState(
    false
  )
  const [selectedItemBanks, setSelectedItemBanks] = useState([])
  const [searchValue, setSearchValue] = useState('')
  const breadcrumbData = [
    {
      title: manageTabLabel.toUpperCase(),
      to: '/author/districtprofile',
    },
    {
      title: 'CONTENT',
      to: '',
    },
  ]
  const handleImportModalResponse = (data) => {
    importDataToCollection(data)
    setImportModalVisibility(false)
  }

  const closeModel = () => {
    setImportModalVisibility(false)
  }

  const handleCollectionSeach = (e) => {
    setSearchValue(e.target.value)
    setCollection(null)
  }

  const handlePermissionModalResponse = (response) => {
    setPermissionModalVisibility(false)

    const { permissionDetails } = response

    const request = {
      data: {
        itemBanks: selectedItemBanks.map(({ _id: id, name }) => ({
          id,
          name,
        })),
        permissionDetails,
      },
    }

    batchAddPermissionRequest(request)
    setSelectedItemBanks([])
  }

  return (
    <MainContainer>
      <SubHeaderWrapper>
        {user.role !== 'edulastic-admin' && (
          <Breadcrumb data={breadcrumbData} style={{ position: 'unset' }} />
        )}
        <EduButton height="30px" onClick={() => setImportModalVisibility(true)}>
          <Icon type="upload" />
          Import Content
        </EduButton>
        <EduIf condition={selectedItemBanks.length}>
          <EduButton
            height="30px"
            style={{ marginRight: '3%' }}
            onClick={() => setPermissionModalVisibility(true)}
          >
            Add permissions
          </EduButton>
        </EduIf>
      </SubHeaderWrapper>
      <ContentSubHeader active={menuActive} history={history} />
      <StyledFilterDiv>
        <TabTitle>{menuActive.subMenu}</TabTitle>
        <TableFilters>
          <LeftFilterDiv width={70}>
            <SearchInputStyled
              height="34px"
              placeholder="Search by collection name"
              onChange={handleCollectionSeach}
              value={searchValue}
            />
            {user.role !== 'edulastic-admin' && (
              <EduButton
                height="34px"
                onClick={() => setAddCollectionModalVisibility(true)}
              >
                Add Collection
              </EduButton>
            )}
          </LeftFilterDiv>
        </TableFilters>
      </StyledFilterDiv>

      <TableContainer>
        <CollectionsTable
          handlePermissionClick={(data) => setCollection(data)}
          selectedCollection={selectedCollection}
          searchValue={searchValue}
          selectedItemBanks={selectedItemBanks}
          setSelectedItemBanks={setSelectedItemBanks}
        />
        {!!selectedCollection && (
          <PermissionsTable selectedCollection={selectedCollection} />
        )}
      </TableContainer>
      <ImportContentModal
        visible={showImportModal}
        handleResponse={handleImportModalResponse}
        closeModel={closeModel}
      />
      {showAddCollectionModal && (
        <AddCollectionModal
          visible={showAddCollectionModal}
          handleResponse={() => setAddCollectionModalVisibility(false)}
          isEditCollection={false}
        />
      )}
      {importLoader && <Spin size="small" />}
      {showPermissionModal && (
        <AddPermissionModal
          visible={showPermissionModal}
          handleResponse={handlePermissionModalResponse}
          itemBankName={selectedItemBanks.map((s) => s.name).join(', ')}
          selectedPermission={null}
          isEditPermission={false}
        />
      )}
    </MainContainer>
  )
}

export default connect(
  (state) => ({
    user: getUser(state),
    manageTabLabel: getManageTabLabelSelector(state),
    importLoader: importingLoaderSelector(state),
  }),
  {
    importDataToCollection: importTestToCollectionRequestAction,
    batchAddPermissionRequest: batchAddPermissionRequestAction,
  }
)(Collections)
