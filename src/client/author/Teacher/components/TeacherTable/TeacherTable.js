import { themeColor } from '@edulastic/colors'
import {
  CheckboxLabel,
  EduButton,
  notification,
  TypeToConfirmModal,
  SearchInputStyled,
} from '@edulastic/common'
import { IconFilter, IconPencilEdit, IconTrash } from '@edulastic/icons'
import { withNamespaces } from '@edulastic/localization'
import { Icon, Menu } from 'antd'
import { get, isEmpty, debounce } from 'lodash'
import React, { Component } from 'react'
import { GiDominoMask } from 'react-icons/gi'
import { connect } from 'react-redux'
import { Link, withRouter } from 'react-router-dom'
import { compose } from 'redux'
import {
  StyledActionDropDown,
  StyledClassName,
  StyledFilterDiv,
  TableFilters,
  TabTitle,
} from '../../../../admin/Common/StyledComponents'
import {
  LeftFilterDiv,
  MainContainer,
  RightFilterDiv,
  StyledTableButton,
  SubHeaderWrapper,
  StyledPagination,
  TableContainer,
} from '../../../../common/styled'
import {
  isProxyUser as isProxyUserSelector,
  updatePowerTeacherAction,
} from '../../../../student/Login/ducks'
import {
  getSchoolsSelector,
  isSchoolSearchingSelector,
  searchSchoolByDistrictRequestAction,
} from '../../../../student/Signup/duck'
import { proxyUser } from '../../../authUtils'
import { MergeTeachersModal } from '../../../MergeUsers'
import {
  addBulkTeacherAdminAction,
  addFilterAction,
  changeFilterColumnAction,
  changeFilterTypeAction,
  changeFilterValueAction,
  createAdminUserAction,
  deleteAdminUserAction,
  getAdminUsersDataCountSelector,
  getAdminUsersDataSelector,
  getFiltersSelector,
  getPageNoSelector,
  getShowActiveUsersSelector,
  receiveAdminDataAction,
  removeFilterAction,
  setPageNoAction,
  setRoleAction,
  setSearchNameAction,
  setShowActiveUsersAction,
  setTeachersDetailsModalVisibleAction,
  updateAdminUserAction,
} from '../../../SchoolAdmin/ducks'
import Breadcrumb from '../../../src/components/Breadcrumb'
import AdminSubHeader from '../../../src/components/common/AdminSubHeader/UserSubHeader'
import TableFiltersView from '../../../src/components/common/TableFilters'
import { getUserOrgId } from '../../../src/selectors/user'
import StudentsDetailsModal from '../../../Student/components/StudentTable/StudentsDetailsModal/StudentsDetailsModal'
import { getTeachersListSelector } from '../../ducks'
import AddTeacherModal from './AddTeacherModal/AddTeacherModal'
import EditTeacherModal from './EditTeacherModal/EditTeacherModal'
import InviteMultipleTeacherModal from './InviteMultipleTeacherModal/InviteMultipleTeacherModal'
import { StyledMaskButton, StyledTeacherTable } from './styled'

const menuActive = { mainMenu: 'Users', subMenu: 'Teacher' }

const filterStrDD = {
  status: {
    list: [
      { title: 'Select a value', value: undefined, disabled: true },
      { title: 'Active', value: 1, disabled: false },
      { title: 'Inactive', value: 0, disabled: false },
    ],
    placeholder: 'Select a value',
  },
  school: { list: [], placeholder: 'Search and select a school' }, // Added to hide contains filter
}

class TeacherTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRowKeys: [],
      addTeacherModalVisible: false,
      editTeacherModaVisible: false,
      inviteTeacherModalVisible: false,
      editTeacherKey: '',
      selectedAdminsForDeactivate: [],
      deactivateAdminModalVisible: false,
      showMergeTeachersModal: false,
      showActive: true,
      searchByName: '',
      filtersData: [
        {
          filtersColumn: '',
          filtersValue: '',
          filterStr: '',
          filterAdded: false,
        },
      ],
      currentPage: 1,
      refineButtonActive: false,
      schoolsState: {
        list: [],
        fetching: false,
      },
    }
    const { t, isProxyUser } = this.props
    this.columns = [
      {
        title: t('users.teacher.name'),
        render: (_, { _source }) => {
          const firstName = get(_source, 'firstName', '') || ''
          const lastName = get(_source, 'lastName', '') || ''
          return (
            <span>
              {firstName === 'Anonymous' || isEmpty(firstName)
                ? '-'
                : firstName}{' '}
              {lastName}
            </span>
          )
        },
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => {
          const prev = get(a, '_source.firstName', '') || ''
          const next = get(b, '_source.firstName', '') || ''
          return next.localeCompare(prev)
        },
      },
      {
        title: t('users.teacher.username'),
        dataIndex: '_source.email',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => {
          const prev = get(a, '_source.email', '') || ''
          const next = get(b, '_source.email', '') || ''
          return next.localeCompare(prev)
        },
      },
      {
        title: t('users.teacher.sso'),
        dataIndex: '_source.lastSigninSSO',
        render: (sso = 'N/A') => sso,
      },
      {
        title: t('users.teacher.school'),
        dataIndex: '_source.institutionDetails',
        render: (schools = []) =>
          schools.map((school) => school.name).join(', '),
        width: 200,
      },
      {
        title: t('users.teacher.classes'),
        dataIndex: 'classCount',
        align: 'center',
        render: (classCount, record) => {
          const username = get(record, '_source.username', '')
          return (
            <Link
              to={{
                pathname: '/author/class-enrollment',
                state: {
                  filtersColumn: 'username',
                  filtersValue: 'eq',
                  filterStr: username,
                  filterAdded: true,
                },
              }}
            >
              {classCount}
            </Link>
          )
        },
      },
      {
        dataIndex: '_id',
        render: (id, { _source }) => {
          const firstName = get(_source, 'firstName', '')
          const lastName = get(_source, 'lastName', '')
          const status = get(_source, 'status', '')
          const fullName =
            firstName === 'Anonymous' ||
            (isEmpty(firstName) && isEmpty(lastName))
              ? 'Teacher'
              : `${firstName} ${lastName}`
          return (
            <div style={{ whiteSpace: 'nowrap' }}>
              <>
                {status === 1 && !isProxyUser ? (
                  <StyledMaskButton
                    onClick={() => this.onProxyTeacher(id)}
                    title={`Act as ${fullName}`}
                  >
                    <GiDominoMask />
                  </StyledMaskButton>
                ) : null}
                <StyledTableButton
                  onClick={() => this.onEditTeacher(id)}
                  title="Edit"
                >
                  <IconPencilEdit color={themeColor} />
                </StyledTableButton>
                <StyledTableButton
                  onClick={() => this.handleDeactivateAdmin(id)}
                  title="Deactivate"
                >
                  <IconTrash color={themeColor} />
                </StyledTableButton>
              </>
            </div>
          )
        },
      },
    ]

    this.filterTextInputRef = [
      React.createRef(),
      React.createRef(),
      React.createRef(),
    ]
  }

  componentDidMount() {
    const { dataPassedWithRoute } = this.props
    if (!isEmpty(dataPassedWithRoute)) {
      this.setState(
        { filtersData: [{ ...dataPassedWithRoute }] },
        this.loadFilteredList
      )
    } else {
      this.loadFilteredList()
    }
  }

  static getDerivedStateFromProps(nextProps, state) {
    const { adminUsersData: result, isSchoolSearching, getSchools } = nextProps
    const { schoolsState } = state
    const newState = {
      selectedRowKeys: state.selectedRowKeys.filter(
        (rowKey) => !!result[rowKey]
      ),
    }
    if (schoolsState?.fetching != isSchoolSearching) {
      Object.assign(newState, {
        schoolsState: {
          list: getSchools,
          fetching: isSchoolSearching,
        },
        isSchoolSearchInProgress: isSchoolSearching,
      })
    }
    return newState
  }

  onProxyTeacher = (id) => {
    proxyUser({ userId: id })
  }

  onEditTeacher = (key) => {
    this.setState({
      editTeacherModaVisible: true,
      editTeacherKey: key,
    })
  }

  handleDeactivateAdmin = (id) => {
    this.setState({
      selectedAdminsForDeactivate: [id],
      deactivateAdminModalVisible: true,
    })
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  }

  changeActionMode = (e) => {
    const { selectedRowKeys } = this.state
    const { adminUsersData, updatePowerTeacher } = this.props
    if (e.key === 'add teacher') {
      this.setState({ addTeacherModalVisible: true })
    }
    if (e.key === 'merge user') {
      const inactiveUsers = Object.values(adminUsersData).filter(
        (u) => selectedRowKeys.includes(u._id) && u._source.status !== 1
      )
      if (inactiveUsers.length) {
        notification({ messageKey: 'deactivatedUserSelected' })
      } else if (selectedRowKeys.length > 1) {
        this.setState({ showMergeTeachersModal: true })
      } else {
        notification({ type: 'info', messageKey: 'selectTwoOrMoreTeachers' })
      }
    }
    if (e.key === 'edit user') {
      if (selectedRowKeys.length == 0) {
        notification({ messageKey: 'pleaseSelectUser' })
      } else if (selectedRowKeys.length == 1) {
        this.onEditTeacher(selectedRowKeys[0])
      } else if (selectedRowKeys.length > 1) {
        notification({ messageKey: 'pleaseSelectSingleUserToEdit' })
      }
    } else if (e.key === 'deactivate user') {
      if (selectedRowKeys.length > 0) {
        this.setState({
          selectedAdminsForDeactivate: selectedRowKeys,
          deactivateAdminModalVisible: true,
        })
      } else {
        notification({ messageKey: 'pleaseSelectUserToDelete' })
      }
    } else if (
      e.key === 'enable power tools' ||
      e.key === 'disable power tools'
    ) {
      const enableMode = e.key === 'enable power tools'
      if (selectedRowKeys.length > 0) {
        const selectedUsersEmailOrUsernames = selectedRowKeys
          .map((id) => {
            const user = adminUsersData[id]?._source
            if (user) {
              return user.email || user.username
            }
            return null
          })
          .filter((u) => !!u)
        updatePowerTeacher({
          usernames: selectedUsersEmailOrUsernames,
          enable: enableMode,
        })
      } else {
        notification({
          messageKey: `pleaseSelectUserTo${
            enableMode ? 'Enable' : 'Disable'
          }PowerTools`,
        })
      }
    }
  }

  closeEditTeacherModal = () => {
    this.setState({
      editTeacherModaVisible: false,
    })
  }

  showInviteTeacherModal = () => {
    this.setState({
      inviteTeacherModalVisible: true,
    })
  }

  closeInviteTeacherModal = () => {
    this.setState({
      inviteTeacherModalVisible: false,
    })
  }

  // -----|-----|-----|-----| ACTIONS RELATED BEGIN |-----|-----|-----|----- //

  sendInvite = (obj) => {
    const { addTeachers } = this.props
    const o = {
      addReq: obj,
      listReq: this.getSearchQuery(),
    }
    addTeachers(o)
  }

  createUser = (createReq) => {
    const { userOrgId, createAdminUser } = this.props
    createReq.role = 'teacher'
    createReq.districtId = userOrgId

    const o = {
      createReq,
      listReq: this.getSearchQuery(),
    }

    createAdminUser(o)
    this.setState({ addTeacherModalVisible: false })
  }

  closeAddUserModal = () => {
    this.setState({
      addTeacherModalVisible: false,
    })
  }

  onCloseMergeTeachersModal = () => {
    this.setState({ showMergeTeachersModal: false })
  }

  onSubmitMergeTeachersModal = () => {
    this.handleSearchName(' ')
    this.onCloseMergeTeachersModal()
  }

  confirmDeactivate = () => {
    const { deleteAdminUser } = this.props
    const { selectedAdminsForDeactivate } = this.state

    const o = {
      deleteReq: { userIds: selectedAdminsForDeactivate, role: 'teacher' },
      listReq: this.getSearchQuery(),
    }

    deleteAdminUser(o)
    this.setState({
      deactivateAdminModalVisible: false,
    })
  }

  setPageNo = (page) =>
    this.setState({ currentPage: page }, this.loadFilteredList)

  _onRefineResultsCB = () => {
    const { refineButtonActive } = this.state
    this.setState({ refineButtonActive: !refineButtonActive })
  }

  // -----|-----|-----|-----| ACTIONS RELATED ENDED |-----|-----|-----|----- //

  // -----|-----|-----|-----| FILTER RELATED BEGIN |-----|-----|-----|----- //

  onChangeSearch = (event) =>
    this.setState({ searchByName: event.currentTarget.value })

  handleSearchName = (value) =>
    this.setState(
      { searchByName: value, currentPage: 1 },
      this.loadFilteredList
    )

  onSearchFilter = (value, event, i) => {
    const { filtersData } = this.state
    const _filtersData = filtersData.map((item, index) => {
      if (index === i) {
        return {
          ...item,
          filterAdded: !!value,
        }
      }
      return item
    })

    // For some unknown reason till now calling blur() synchronously doesnt work.
    this.setState({ currentPage: 1, filtersData: _filtersData }, () =>
      this.filterTextInputRef[i].current.blur()
    )
  }

  onBlurFilterText = (event, key) => {
    const { filtersData } = this.state
    const _filtersData = filtersData.map((item, index) => {
      if (index === key) {
        return {
          ...item,
          filterAdded: !!event.target.value,
        }
      }
      return item
    })
    this.setState(
      () => ({ currentPage: 1, filtersData: _filtersData }),
      this.loadFilteredList
    )
  }

  changeStatusValue = (value, key) => {
    const { filtersData } = this.state
    const _filtersData = filtersData.map((item, index) => {
      if (index === key) {
        return {
          ...item,
          filterStr: value,
          filterAdded: value !== '',
        }
      }
      return item
    })

    this.setState({ filtersData: _filtersData }, () =>
      this.loadFilteredList(key)
    )
  }

  changeFilterText = (e, key, callApi) => {
    const _filtersData = this.state.filtersData.map((item, index) => {
      const val = e?.target ? e.target?.value : e?.key
      const updatedFilterData = {
        ...item,
        filterStr: val,
      }
      if (callApi) {
        Object.assign(updatedFilterData, {
          filterAdded: val !== '',
        })
      }
      if (index === key) {
        return updatedFilterData
      }
      return item
    })
    this.setState(
      { filtersData: _filtersData },
      callApi ? this.loadFilteredList : null
    )
  }

  changeFilterColumn = (value, key) => {
    const { filtersData } = this.state
    const _filtersData = filtersData.map((item, index) => {
      if (key === index) {
        const _item = {
          ...item,
          filterStr: '',
          filtersColumn: value,
        }
        if (value === 'status' || value === 'school') _item.filtersValue = 'eq'
        return _item
      }
      return item
    })
    this.setState({ filtersData: _filtersData }, this.loadFilteredList)
  }

  changeFilterValue = (value, key) => {
    const { filtersData } = this.state
    const _filtersData = filtersData.map((item, index) => {
      if (index === key) {
        return {
          ...item,
          filtersValue: value,
        }
      }
      return item
    })
    this.setState({ filtersData: _filtersData }, this.loadFilteredList)
  }

  onChangeShowActive = (e) => {
    this.setState({ showActive: e.target.checked }, this.loadFilteredList)
  }

  addFilter = () => {
    const { filtersData } = this.state
    if (filtersData.length < 3) {
      this.setState({
        filtersData: [
          ...filtersData,
          {
            filtersColumn: '',
            filtersValue: '',
            filterStr: '',
            prevFilterStr: '',
            filterAdded: false,
          },
        ],
      })
    }
  }

  removeFilter = (e, key) => {
    const { filtersData } = this.state
    let newFiltersData = []
    if (filtersData.length === 1) {
      newFiltersData.push({
        filterAdded: false,
        filtersColumn: '',
        filtersValue: '',
        filterStr: '',
      })
    } else {
      newFiltersData = filtersData.filter((item, index) => index != key)
    }
    this.setState({ filtersData: newFiltersData }, this.loadFilteredList)
  }

  getSearchQuery = () => {
    const { userOrgId, location = {} } = this.props
    const { filtersData, searchByName, currentPage } = this.state
    let { showActive } = this.state
    let institutionId = location.institutionId ? location.institutionId : ''
    const search = {}
    for (const [, item] of filtersData.entries()) {
      if (item?.filtersColumn === 'school') {
        if (
          institutionId &&
          item?.filterStr &&
          institutionId.indexOf('item?.filterStr') < 0
        ) {
          institutionId = `${institutionId},${item?.filterStr}`
        } else if (item?.filterStr) {
          institutionId = item?.filterStr
        }
      } else {
        const { filtersColumn, filtersValue, filterStr } = item
        if (filtersColumn !== '' && filtersValue !== '' && filterStr !== '') {
          if (filtersColumn === 'status') {
            showActive = filterStr
            continue
          }
          if (!search[filtersColumn]) {
            search[filtersColumn] = [{ type: filtersValue, value: filterStr }]
          } else {
            search[filtersColumn].push({ type: filtersValue, value: filterStr })
          }
        }
      }
    }

    if (searchByName) {
      search.name = searchByName
    }

    const queryObj = {
      search,
      districtId: userOrgId,
      role: 'teacher',
      page: currentPage,
      limit: 25,
      institutionId,
      // uncomment after elastic search is fixed
      // sortField,
      // order
    }

    queryObj.status = 0

    if (showActive) {
      queryObj.status = 1
    }
    return queryObj
  }

  loadFilteredList = () => {
    const { loadAdminData } = this.props
    loadAdminData(this.getSearchQuery())
  }

  closeTeachersDetailModal = () => {
    const { setTeachersDetailsModalVisible } = this.props
    setTeachersDetailsModalVisible(false)
  }

  fetchSchool = debounce((value) => {
    const { userOrgId: districtId, getSchoolsWithinDistrict } = this.props
    getSchoolsWithinDistrict({
      districtId,
      limit: 25,
      page: 1,
      sortField: 'name',
      order: 'asc',
      search: { name: [{ type: 'cont', value }] },
    })
  }, 500)

  // -----|-----|-----|-----| FILTER RELATED ENDED |-----|-----|-----|----- //

  render() {
    const {
      selectedRowKeys,
      addTeacherModalVisible,
      editTeacherModaVisible,
      inviteTeacherModalVisible,
      editTeacherKey,
      deactivateAdminModalVisible,
      selectedAdminsForDeactivate,
      showMergeTeachersModal,
      filtersData,
      refineButtonActive,
      showActive,
      currentPage,
    } = this.state

    const {
      adminUsersData: result,
      userOrgId,
      updateAdminUser,
      teacherDetailsModalVisible,
      history,
      pageNo,
      totalUsers,
      t,
    } = this.props
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }

    const actionMenu = (
      <Menu onClick={this.changeActionMode}>
        <Menu.Item key="add teacher">{t('users.teacher.addteacher')}</Menu.Item>
        <Menu.Item key="edit user">{t('users.teacher.updateuser')}</Menu.Item>
        {/* TODO: Enable merge user when required */}
        {/* <Menu.Item key="merge user">{t("users.teacher.mergeuser")}</Menu.Item> */}
        <Menu.Item key="deactivate user">
          {t('users.teacher.deactivateuser')}
        </Menu.Item>
        <Menu.Item key="enable power tools">
          {t('users.teacher.enablePowerTools')}
        </Menu.Item>
        <Menu.Item key="disable power tools">
          {t('users.teacher.disablePowerTools')}
        </Menu.Item>
      </Menu>
    )
    const breadcrumbData = [
      {
        title: 'MANAGE DISTRICT',
        to: '/author/districtprofile',
      },
      {
        title: 'USERS',
        to: '',
      },
    ]

    const firstColData = [
      t('users.teacher.school'),
      t('users.student.username'),
      t('users.student.email'),
      t('users.student.status'),
    ]

    return (
      <MainContainer>
        <SubHeaderWrapper>
          <Breadcrumb data={breadcrumbData} style={{ position: 'unset' }} />
        </SubHeaderWrapper>
        <AdminSubHeader active={menuActive} history={history} />
        <StyledFilterDiv>
          <TabTitle>{menuActive.subMenu}</TabTitle>
          <TableFilters>
            <LeftFilterDiv width={55}>
              <EduButton
                isBlue={refineButtonActive}
                isGhost={!refineButtonActive}
                onClick={this._onRefineResultsCB}
                IconBtn
                height="34px"
                mr="10px"
              >
                <IconFilter />
              </EduButton>
              <SearchInputStyled
                placeholder={t('common.searchbyname')}
                onSearch={this.handleSearchName}
                onChange={this.onChangeSearch}
                height="34px"
                data-cy="searchByName"
              />
              <EduButton
                height="34px"
                type="primary"
                onClick={this.showInviteTeacherModal}
              >
                {t('users.teacher.inviteteachers')}
              </EduButton>
            </LeftFilterDiv>

            <RightFilterDiv>
              <CheckboxLabel
                checked={showActive}
                onChange={this.onChangeShowActive}
                disabled={
                  !!filtersData.find((item) => item.filtersColumn === 'status')
                }
              >
                {t('common.showcurrent')}
              </CheckboxLabel>
              <StyledActionDropDown
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                overlay={actionMenu}
              >
                <EduButton height="34px" isGhost>
                  {t('common.actions')} <Icon type="down" />
                </EduButton>
              </StyledActionDropDown>
            </RightFilterDiv>
          </TableFilters>
        </StyledFilterDiv>
        <TableFiltersView
          filtersData={filtersData}
          filterStrDD={filterStrDD}
          showFilters={refineButtonActive}
          filterRef={this.filterTextInputRef}
          handleFilterColumn={this.changeFilterColumn}
          handleFilterValue={this.changeFilterValue}
          handleFilterText={this.changeFilterText}
          handleSearchFilter={this.onSearchFilter}
          handleBlurFilterText={this.onBlurFilterText}
          handleStatusValue={this.changeStatusValue}
          handleAddFilter={this.addFilter}
          handleRemoveFilter={this.removeFilter}
          firstColData={firstColData}
          schoolsState={this.state.schoolsState}
          fetchSchool={this.fetchSchool}
        />
        <TableContainer>
          <StyledTeacherTable
            rowKey={(record) => record._id}
            rowSelection={rowSelection}
            dataSource={Object.values(result)}
            columns={this.columns}
            pagination={false}
          />
          <StyledPagination
            defaultCurrent={1}
            current={currentPage}
            pageSize={25}
            total={totalUsers}
            onChange={(page) => this.setPageNo(page)}
            hideOnSinglePage
          />
        </TableContainer>
        {inviteTeacherModalVisible && (
          <InviteMultipleTeacherModal
            modalVisible={inviteTeacherModalVisible}
            closeModal={this.closeInviteTeacherModal}
            addTeachers={this.sendInvite}
            userOrgId={userOrgId}
            t={t}
          />
        )}
        {editTeacherModaVisible && (
          <EditTeacherModal
            modalVisible={editTeacherModaVisible}
            userOrgId={userOrgId}
            data={result[editTeacherKey]}
            editTeacher={updateAdminUser}
            closeModal={this.closeEditTeacherModal}
            t={t}
          />
        )}
        {addTeacherModalVisible && (
          <AddTeacherModal
            modalVisible={addTeacherModalVisible}
            addTeacher={this.createUser}
            editTeacher={updateAdminUser}
            closeModal={this.closeAddUserModal}
            userOrgId={userOrgId}
            t={t}
          />
        )}
        {deactivateAdminModalVisible && (
          <TypeToConfirmModal
            modalVisible={deactivateAdminModalVisible}
            title={t('users.teacher.deactivateTeacher.title')}
            handleOnOkClick={this.confirmDeactivate}
            wordToBeTyped="DEACTIVATE"
            primaryLabel={
              t('users.teacher.deactivateTeacher.text') +
              t('common.modalConfirmationText1') +
              t('users.teacher.deactivateTeacher.teachers')
            }
            secondaryLabel={selectedAdminsForDeactivate.map((id) => {
              const { _source: { firstName, lastName } = {} } = result[id]
              return (
                <StyledClassName key={id}>
                  {firstName} {lastName}
                </StyledClassName>
              )
            })}
            closeModal={() =>
              this.setState({
                deactivateAdminModalVisible: false,
              })
            }
          />
        )}
        {/* eslint-disabled-next-line jsx-a11y/aria-role */}
        {teacherDetailsModalVisible && (
          <StudentsDetailsModal
            modalVisible={teacherDetailsModalVisible}
            closeModal={this.closeTeachersDetailModal}
            role="teacher"
            title="Teacher Details"
          />
        )}
        <MergeTeachersModal
          visible={showMergeTeachersModal}
          userIds={selectedRowKeys}
          onSubmit={this.onSubmitMergeTeachersModal}
          onCancel={this.onCloseMergeTeachersModal}
        />
      </MainContainer>
    )
  }
}

const enhance = compose(
  withNamespaces('manageDistrict'),
  connect(
    (state) => ({
      userOrgId: getUserOrgId(state),
      teachersList: getTeachersListSelector(state),
      adminUsersData: getAdminUsersDataSelector(state),
      totalUsers: getAdminUsersDataCountSelector(state),
      showActiveUsers: getShowActiveUsersSelector(state),
      pageNo: getPageNoSelector(state),
      filters: getFiltersSelector(state),
      teacherDetailsModalVisible: get(
        state,
        ['schoolAdminReducer', 'teacherDetailsModalVisible'],
        false
      ),
      isProxyUser: isProxyUserSelector(state),
      isSchoolSearching: isSchoolSearchingSelector(state),
      getSchools: getSchoolsSelector(state),
    }),
    {
      createAdminUser: createAdminUserAction,
      updateAdminUser: updateAdminUserAction,
      deleteAdminUser: deleteAdminUserAction,
      loadAdminData: receiveAdminDataAction,
      setSearchName: setSearchNameAction,
      setShowActiveUsers: setShowActiveUsersAction,
      setPageNo: setPageNoAction,
      addTeachers: addBulkTeacherAdminAction,
      setTeachersDetailsModalVisible: setTeachersDetailsModalVisibleAction,
      /**
       * Action to set the filter Column.
       * @param {string} str1 The previous value held by the select.
       * @param {string} str2 The new value that is to be set in the select
       */
      changeFilterColumn: changeFilterColumnAction,
      changeFilterType: changeFilterTypeAction,
      changeFilterValue: changeFilterValueAction,
      addFilter: addFilterAction,
      removeFilter: removeFilterAction,
      setRole: setRoleAction,
      updatePowerTeacher: updatePowerTeacherAction,
      getSchoolsWithinDistrict: searchSchoolByDistrictRequestAction,
    }
  )
)

export default enhance(withRouter(TeacherTable))

// TeacherTable.propTypes = {
//   teachersList: PropTypes.array.isRequired,
//   loadTeachersListData: PropTypes.func.isRequired,
//   createTeacher: PropTypes.func.isRequired,
//   updateTeacher: PropTypes.func.isRequired,
//   deleteTeachers: PropTypes.func.isRequired,
//   setSearchName: PropTypes.func.isRequired,
//   setFilters: PropTypes.func.isRequired,
//   userOrgId: PropTypes.string.isRequired
// };
