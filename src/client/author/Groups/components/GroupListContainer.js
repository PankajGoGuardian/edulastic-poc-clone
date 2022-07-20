import { CheckboxLabel, EduButton, TypeToConfirmModal } from '@edulastic/common'
import { SearchInputStyled } from '@edulastic/common/src/components/InputStyles'
import { LightGreenSpan } from '@edulastic/common/src/components/TypeToConfirmModal/styled'
import { roleuser } from '@edulastic/constants'
// components
import { Spin } from 'antd'
import React, { useState } from 'react'
import {
  StyledFilterDiv,
  TableFilters,
  TabTitle,
} from '../../../admin/Common/StyledComponents'
import {
  LeftFilterDiv,
  MainContainer,
  RightFilterDiv,
  SubHeaderWrapper,
  TableContainer,
} from '../../../common/styled'
import Breadcrumb from '../../src/components/Breadcrumb'
import StudentGroupsTable from './StudentGroupsTable'
import AdminSubHeader from '../../src/components/common/AdminSubHeader/GroupSubHeader'

const menuActive = { mainMenu: 'Groups', subMenu: 'Student-Groups' }

const GroupListContainer = ({
  t,
  match,
  history,
  userRole,
  districtId,
  loading,
  studentGroups,
  showActive,
  setShowActive,
  archiveGroup,
  unarchiveGroup,
  setShowClassCreationModal,
  setCreateClassTypeDetails,
}) => {
  const [searchName, setSearchName] = useState('')
  const [selectedRows, setSelectedRows] = useState([])
  const [archiveModalProps, setArchiveModalProps] = useState({
    visible: false,
    _id: '',
    name: '',
  })

  const resetArchiveModalProps = () =>
    setArchiveModalProps({ visible: false, _id: '', name: '' })

  const handleCreateGroup = () => {
    setShowClassCreationModal(true)
    setCreateClassTypeDetails({ type: 'group', exitPath: match.url })
  }

  const handleEditGroup = (groupId) =>
    history.push({
      pathname: `${match.url}/edit/${groupId}`,
      state: {
        type: 'group',
        exitPath: match.url,
        showPath: `${match.url}/details/${groupId}`,
      },
    })

  const handleShowGroup = (groupId) =>
    history.push({
      pathname: `${match.url}/details/${groupId}`,
      state: {
        type: 'group',
        exitPath: match.url,
        editPath: `${match.url}/edit/${groupId}`,
      },
    })

  /*   const changeActionMode = e => {
      if (e.key === "archiveGroups") {
        if (selectedRows.length > 0) {
          // TODO: update when Actions dropdown is enabled
          // use deleteClassAction(Classes/ducks) to archive selected groups  
        } else {
          notification({ msg: t("group.validation.archiveGroups") });
        }
      }
    } */

  const breadcrumbData = [
    {
      title:
        userRole === roleuser.SCHOOL_ADMIN
          ? 'MANAGE SCHOOL'
          : 'MANAGE DISTRICT',
      to:
        userRole === roleuser.SCHOOL_ADMIN
          ? '/author/classes'
          : '/author/districtprofile',
    },
    {
      title: 'GROUPS',
      to: '',
    },
  ]

  /* const actionMenu = (
    <Menu onClick={changeActionMode}>
      <Menu.Item key="archiveGroups">{t("group.archiveGroups")}</Menu.Item>
    </Menu>
  ) */

  const filteredGroups = studentGroups.filter(({ name }) =>
    name.toLowerCase().startsWith(searchName)
  )

  return (
    <MainContainer>
      <SubHeaderWrapper>
        <Breadcrumb data={breadcrumbData} style={{ position: 'unset' }} />
      </SubHeaderWrapper>
      <AdminSubHeader active={menuActive} history={history} />
      <StyledFilterDiv>
        <TabTitle>{menuActive.subMenu}</TabTitle>
        <TableFilters>
          <LeftFilterDiv width={60}>
            <SearchInputStyled
              placeholder={t('common.searchbyname')}
              onSearch={setSearchName}
              onChange={(e) => setSearchName(e.target.value.toLowerCase())}
              height="34px"
            />
            <EduButton height="34px" type="primary" onClick={handleCreateGroup}>
              {t('group.createGroup')}
            </EduButton>
          </LeftFilterDiv>
          <RightFilterDiv>
            <CheckboxLabel
              checked={showActive}
              onChange={(e) => setShowActive(e.target.checked)}
            >
              {t('group.showActive')}
            </CheckboxLabel>
            {/* <StyledActionDropDown overlay={actionMenu} trigger={["click"]}>
            <Button>
              {t("common.actions")} <Icon type="down" />
            </Button>
          </StyledActionDropDown> */}
          </RightFilterDiv>
        </TableFilters>
      </StyledFilterDiv>

      <TableContainer>
        {loading ? (
          <Spin size="large" />
        ) : (
          <StudentGroupsTable
            t={t}
            data={filteredGroups}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            showActive={showActive}
            handleEditGroup={handleEditGroup}
            handleShowGroup={handleShowGroup}
            setArchiveModalProps={setArchiveModalProps}
          />
        )}
      </TableContainer>

      {showActive ? (
        <TypeToConfirmModal
          modalVisible={archiveModalProps.visible}
          title="Archive Group"
          handleOnOkClick={() =>
            archiveGroup({
              _id: archiveModalProps._id,
              districtId,
              exitPath: match.url,
              isGroup: true,
            })
          }
          wordToBeTyped="ARCHIVE"
          primaryLabel="Are you sure you want to archive the following group?"
          secondaryLabel={
            <p style={{ margin: '5px 0' }}>
              <LightGreenSpan>{archiveModalProps.name}</LightGreenSpan>
            </p>
          }
          closeModal={resetArchiveModalProps}
          okButtonText="Archive"
        />
      ) : (
        <TypeToConfirmModal
          modalVisible={archiveModalProps.visible}
          title="Unarchive Group"
          handleOnOkClick={() =>
            unarchiveGroup({
              groupId: archiveModalProps._id,
              exitPath: match.url,
              isGroup: true,
            })
          }
          wordToBeTyped="UNARCHIVE"
          primaryLabel="Are you sure you want to unarchive the following group?"
          secondaryLabel={
            <p style={{ margin: '5px 0' }}>
              <LightGreenSpan>{archiveModalProps.name}</LightGreenSpan>
            </p>
          }
          closeModal={resetArchiveModalProps}
          okButtonText="Unarchive"
        />
      )}
    </MainContainer>
  )
}
export default GroupListContainer
