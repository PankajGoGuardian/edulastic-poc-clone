import { themeColor } from '@edulastic/colors'
import {
  CheckboxLabel,
  EduButton,
  notification,
  TypeToConfirmModal,
} from '@edulastic/common'
import { SearchInputStyled } from '@edulastic/common/src/components/InputStyles'
import { roleuser } from '@edulastic/constants'
import { IconFilter, IconPencilEdit, IconTrash } from '@edulastic/icons'
import { withNamespaces } from '@edulastic/localization'
import { Icon, Menu } from 'antd'
import { get, debounce, sortBy } from 'lodash'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { GiDominoMask } from 'react-icons/gi'
import { connect } from 'react-redux'
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
  StyledPagination,
  StyledTableButton,
  SubHeaderWrapper,
  TableContainer,
} from '../../../../common/styled'
import { getFullNameFromAsString } from '../../../../common/utils/helpers'
import {
  isProxyUser as isProxyUserSelector,
  updatePowerTeacherAction,
} from '../../../../student/Login/ducks'
import { proxyUser } from '../../../authUtils'
import {
  getSchoolsSelector,
  receiveSchoolsAction,
} from '../../../Schools/ducks'
import Breadcrumb from '../../../src/components/Breadcrumb'
import AdminSubHeader from '../../../src/components/common/AdminSubHeader/UserSubHeader'
import TableFiltersView from '../../../src/components/common/TableFilters'
import {
  getUserId,
  getUserOrgId,
  getUserRole,
  isDistrictAdminSelector,
  isOrganizationDistrictUserSelector,
  isSchoolAdminSelector,
  isSuperAdminSelector,
} from '../../../src/selectors/user'
import {
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
  updateAdminUserAction,
} from '../../ducks'
import CreateSchoolAdminModal from './CreateSchoolAdminModal/CreateSchoolAdminModal'
import EditSchoolAdminModal from './EditSchoolAdminModal/EditSchoolAdminModal'
import { StyledMaskButton, StyledSchoolAdminTable } from './styled'
import styled from 'styled-components'
import {
  isSchoolSearchingSelector,
  searchSchoolByDistrictRequestAction,
  getSchoolsSelector as getSchoolsSelectorFromSignup,
} from '../../../../student/Signup/duck'
import { daPermissionsMap } from '../../../DistrictAdmin/components/DistrictAdminTable/helpers'
import Tags from '../../../src/components/common/Tags'

const menuActive = { mainMenu: 'Users', subMenu: 'School Admin' }

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
  permission: {
    list: [
      { title: 'Select a value', value: undefined, disabled: true },
      ...Object.keys(daPermissionsMap).map((key) => ({
        title: daPermissionsMap[key],
        value: key,
        disabled: false,
      })),
    ],
  },
}

class SchoolAdminTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRowKeys: [],
      createSchoolAdminModalVisible: false,
      editSchoolAdminModaVisible: false,
      editSchoolAdminKey: '',
      deactivateAdminModalVisible: false,
      selectedAdminsForDeactivate: [],

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
    this.filterTextInputRef = [
      React.createRef(),
      React.createRef(),
      React.createRef(),
    ]
  }

  componentDidMount() {
    const { loadSchoolsData, userOrgId } = this.props
    this.loadFilteredList()
    loadSchoolsData({ districtId: userOrgId })
  }

  static getDerivedStateFromProps(nextProps, state) {
    const { adminUsersData: result, isSchoolSearching, getSchools } = nextProps
    const { schoolsState } = state
    const newState = {
      selectedRowKeys: state.selectedRowKeys.filter(
        (rowKey) => !!result[rowKey]
      ),
    }
    if (schoolsState?.fetching !== isSchoolSearching) {
      Object.assign(newState, {
        schoolsState: {
          list: getSchools,
          fetching: isSchoolSearching,
        },
      })
    }
    return newState
  }

  onEditSchoolAdmin = (id) => {
    this.setState({
      editSchoolAdminModaVisible: true,
      editSchoolAdminKey: id,
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

  showCreateSchoolAdminModal = () => {
    this.setState({
      createSchoolAdminModalVisible: true,
    })
  }

  onProxySchoolAdmin = (id) => {
    proxyUser({ userId: id })
  }

  changeActionMode = (e) => {
    const { selectedRowKeys } = this.state
    if (e.key === 'edit user') {
      if (selectedRowKeys.length === 0) {
        notification({ messageKey: 'pleaseSelectUser' })
      } else if (selectedRowKeys.length === 1) {
        this.onEditSchoolAdmin(selectedRowKeys[0])
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
        notification({ messageKey: 'pleaseSelectSchoolsToDelete' })
      }
    } else if (
      e.key === 'enable power tools' ||
      e.key === 'disable power tools'
    ) {
      const enableMode = e.key === 'enable power tools'
      if (selectedRowKeys.length > 0) {
        const { updatePowerTeacher, adminUsersData } = this.props
        const selectedUsersEmailOrUsernames = selectedRowKeys
          .map((id) => {
            const user = adminUsersData[id]?._source
            if (user) {
              return user.email || user.username
            }
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

  closeEditSchoolAdminModal = () => {
    this.setState({
      editSchoolAdminModaVisible: false,
    })
  }

  setPageNo = (page) => {
    this.setState({ currentPage: page }, this.loadFilteredList)
  }

  // -----|-----|-----|-----| ACTIONS RELATED BEGIN |-----|-----|-----|----- //

  createUser = (createReq) => {
    const { userOrgId, createAdminUser } = this.props
    createReq.role = 'school-admin'
    createReq.districtId = userOrgId

    const o = {
      createReq,
      listReq: this.getSearchQuery(),
    }

    createAdminUser(o)
    this.setState({ createSchoolAdminModalVisible: false })
  }

  closeCreateUserModal = () => {
    this.setState({
      createSchoolAdminModalVisible: false,
    })
  }

  confirmDeactivate = () => {
    const { deleteAdminUser } = this.props
    const { selectedAdminsForDeactivate } = this.state

    const o = {
      deleteReq: { userIds: selectedAdminsForDeactivate, role: 'school-admin' },
      listReq: this.getSearchQuery(),
    }

    deleteAdminUser(o)
    this.setState({
      deactivateAdminModalVisible: false,
    })
  }

  _onRefineResultsCB = () => {
    this.setState({ refineButtonActive: !this.state.refineButtonActive })
  }

  // -----|-----|-----|-----| ACTIONS RELATED ENDED |-----|-----|-----|----- //

  // -----|-----|-----|-----| FILTER RELATED BEGIN |-----|-----|-----|----- //

  onChangeSearch = (event) => {
    this.setState({ searchByName: event.currentTarget.value })
  }

  handleSearchName = (value) => {
    this.setState(
      { searchByName: value, currentPage: 1 },
      this.loadFilteredList
    )
  }

  onSearchFilter = (value, event, i) => {
    const _filtersData = this.state.filtersData.map((item, index) => {
      if (index === i) {
        return {
          ...item,
          filterAdded: !!value,
        }
      }
      return item
    })

    // For some unknown reason till now calling blur() synchronously doesnt work.
    this.setState({ filtersData: _filtersData }, () =>
      this.filterTextInputRef[i].current.blur()
    )
  }

  onBlurFilterText = (event, key) => {
    const _filtersData = this.state.filtersData.map((item, index) => {
      if (index === key) {
        return {
          ...item,
          filterAdded: !!event.target.value,
        }
      }
      return item
    })
    this.setState(() => ({ filtersData: _filtersData }), this.loadFilteredList)
  }

  changeStatusValue = (value, key) => {
    const _filtersData = this.state.filtersData.map((item, index) => {
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
    const _filtersData = this.state.filtersData.map((item, index) => {
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
    const _filtersData = this.state.filtersData.map((item, index) => {
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
    const { userOrgId } = this.props
    const { filtersData, searchByName, currentPage } = this.state
    let permissions = ''
    let permissionsToOmit = []
    let { showActive } = this.state
    let institutionId = ''
    const search = {}
    for (const [index, item] of filtersData.entries()) {
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
      } else if (item?.filtersColumn === 'permission') {
        permissions = item?.filterStr
        permissionsToOmit = []
        continue
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
      institutionId,
      role: 'school-admin',
      limit: 25,
      page: currentPage,
      ...(permissions ? { permissions } : { permissionsToOmit }),
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
      createSchoolAdminModalVisible,
      editSchoolAdminModaVisible,
      editSchoolAdminKey,
      deactivateAdminModalVisible,
      selectedAdminsForDeactivate,
      filtersData,
      currentPage,
      refineButtonActive,
    } = this.state

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }

    const {
      userOrgId,
      role,
      adminUsersData: result,
      totalUsers,
      schoolsData,
      updateAdminUser,
      pageNo,
      setPageNo,
      history,
      isProxyUser,
      t,
      isSuperAdmin,
      currentUserId,
      isOrganization,
      isDistrictAdmin,
      isSchoolAdmin,
    } = this.props

    const showPermissionColumn =
      !isOrganization && (isSchoolAdmin || isDistrictAdmin)

    const permissionColumn = {
      title: t('users.schooladmin.permissions'),
      dataIndex: '_source.permissions',
      render: (permissions = []) => {
        if (Array.isArray(permissions)) {
          const sortedPermissions = sortBy(permissions, (p) => p.toLowerCase())
          const mappedPermissions = sortedPermissions
            .map((permission) => daPermissionsMap[permission])
            .filter((x) => x)

          if (mappedPermissions.length) {
            return <Tags tags={mappedPermissions} show={1} />
          }
          return <Tags tags={['Admin']} show={1} />
        }
        return <Tags tags={['Admin']} show={1} />
      },
      width: 200,
    }

    const columns = [
      {
        title: t('users.schooladmin.name'),
        dataIndex: '_source.firstName',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => {
          const prev = get(a, '_source.firstName', '')
          const next = get(b, '_source.firstName', '')
          return next.localeCompare(prev)
        },
        render: (text, record) => {
          const name = getFullNameFromAsString(record._source)
          return name.split(' ').includes('Anonymous') || name.length === 0
            ? '-'
            : name
        },
        width: 200,
      },
      {
        title: t('users.schooladmin.username'),
        dataIndex: '_source.email',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => {
          const prev = get(a, '_source.email', '')
          const next = get(b, '_source.email', '')
          return next.localeCompare(prev)
        },
        width: 200,
      },
      ...(showPermissionColumn ? [permissionColumn] : []),
      {
        title: t('users.schooladmin.sso'),
        dataIndex: '_source.lastSigninSSO',
        render: (sso = 'N/A') => sso,
        width: 100,
      },
      {
        title: t('users.schooladmin.school'),
        dataIndex: '_source.institutionDetails',
        render: (schools = []) =>
          schools.map((school) => school.name).join(', '),
        width: 200,
      },
      {
        dataIndex: '_id',
        render: (id, { _source }) => {
          const name = getFullNameFromAsString(_source)
          const status = get(_source, 'status', '')
          const fullName =
            name.split(' ').includes('Anonymous') || name.length === 0
              ? '-'
              : name
          return (
            <ActionContainer>
              {(role === roleuser.DISTRICT_ADMIN || isSuperAdmin) && (
                <>
                  {status === 1 && !isProxyUser ? (
                    <StyledMaskButton
                      onClick={() => this.onProxySchoolAdmin(id)}
                      title={`Act as ${fullName}`}
                      disabled={currentUserId === id}
                    >
                      <GiDominoMask />
                    </StyledMaskButton>
                  ) : null}
                  <StyledButton
                    onClick={() => this.onEditSchoolAdmin(id)}
                    title="Edit"
                    disabled={currentUserId === id}
                  >
                    <IconPencilEdit color={themeColor} />
                  </StyledButton>
                  <StyledButton
                    onClick={() => this.handleDeactivateAdmin(id)}
                    title="Deactivate"
                    disabled={currentUserId === id}
                  >
                    <IconTrash color={themeColor} />
                  </StyledButton>
                </>
              )}
            </ActionContainer>
          )
        },
        width: 100,
      },
    ]

    const actionMenu = (
      <Menu onClick={this.changeActionMode}>
        <Menu.Item key="edit user">
          {t('users.schooladmin.updateuser')}
        </Menu.Item>
        <Menu.Item key="deactivate user">
          {t('users.schooladmin.deactivateuser')}
        </Menu.Item>
        <Menu.Item key="enable power tools">
          {t('users.schooladmin.enablePowerTools')}
        </Menu.Item>
        <Menu.Item key="disable power tools">
          {t('users.schooladmin.disablePowerTools')}
        </Menu.Item>
      </Menu>
    )
    const breadcrumbData = [
      {
        title: 'MANAGE SCHOOL',
        to: '/author/users/school-admin',
      },
      {
        title: 'USERS',
        to: '',
      },
    ]
    const firstColData = [
      t('users.teacher.school'),
      t('users.schooladmin.username'),
      t('users.schooladmin.email'),
      t('users.schooladmin.status'),
      ...(showPermissionColumn ? [t('users.schooladmin.permission')] : []),
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
                onClick={this.showCreateSchoolAdminModal}
                data-cy="addSchoolAdmin"
              >
                {t('users.schooladmin.createschooladmin')}
              </EduButton>
            </LeftFilterDiv>

            <RightFilterDiv>
              <CheckboxLabel
                checked={this.state.showActive}
                onChange={this.onChangeShowActive}
                disabled={
                  !!filtersData.find((item) => item.filtersColumn === 'status')
                }
              >
                {t('common.showcurrent')}
              </CheckboxLabel>
              {role === roleuser.DISTRICT_ADMIN ? (
                <StyledActionDropDown
                  getPopupContainer={(triggerNode) => triggerNode.parentNode}
                  overlay={actionMenu}
                >
                  <EduButton height="34px" isGhost>
                    {t('common.actions')} <Icon type="down" />
                  </EduButton>
                </StyledActionDropDown>
              ) : null}
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
          <StyledSchoolAdminTable
            rowKey={(record) => record._id}
            rowSelection={rowSelection}
            dataSource={Object.values(result)}
            columns={columns}
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
        {createSchoolAdminModalVisible && (
          <CreateSchoolAdminModal
            modalVisible={createSchoolAdminModalVisible}
            createSchoolAdmin={this.createUser}
            closeModal={this.closeCreateUserModal}
            userOrgId={userOrgId}
            t={t}
          />
        )}
        {editSchoolAdminModaVisible && (
          <EditSchoolAdminModal
            schoolAdminData={result[editSchoolAdminKey]}
            modalVisible={editSchoolAdminModaVisible}
            updateSchoolAdmin={updateAdminUser}
            closeModal={this.closeEditSchoolAdminModal}
            userOrgId={userOrgId}
            schoolsList={schoolsData}
            t={t}
          />
        )}
        {deactivateAdminModalVisible && (
          <TypeToConfirmModal
            modalVisible={deactivateAdminModalVisible}
            title={t('users.schooladmin.deactivatesa.title')}
            handleOnOkClick={this.confirmDeactivate}
            wordToBeTyped="DEACTIVATE"
            primaryLabel={
              t('common.modalConfirmationText1') +
              t('users.schooladmin.deactivatesa.schooladmins')
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
      </MainContainer>
    )
  }
}

const enhance = compose(
  withNamespaces('manageDistrict'),
  connect(
    (state) => ({
      currentUserId: getUserId(state),
      userOrgId: getUserOrgId(state),
      role: getUserRole(state),
      adminUsersData: getAdminUsersDataSelector(state),
      totalUsers: getAdminUsersDataCountSelector(state),
      schoolsData: getSchoolsSelector(state),
      showActiveUsers: getShowActiveUsersSelector(state),
      pageNo: getPageNoSelector(state),
      filters: getFiltersSelector(state),
      isProxyUser: isProxyUserSelector(state),
      isSuperAdmin: isSuperAdminSelector(state),
      isSchoolSearching: isSchoolSearchingSelector(state),
      getSchools: getSchoolsSelectorFromSignup(state),
      isOrganization: isOrganizationDistrictUserSelector(state),
      isDistrictAdmin: isDistrictAdminSelector(state),
      isSchoolAdmin: isSchoolAdminSelector(state),
    }),
    {
      createAdminUser: createAdminUserAction,
      updateAdminUser: updateAdminUserAction,
      deleteAdminUser: deleteAdminUserAction,
      loadAdminData: receiveAdminDataAction,
      setSearchName: setSearchNameAction,
      loadSchoolsData: receiveSchoolsAction,
      setShowActiveUsers: setShowActiveUsersAction,
      setPageNo: setPageNoAction,
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

export default enhance(SchoolAdminTable)

SchoolAdminTable.propTypes = {
  loadAdminData: PropTypes.func.isRequired,
  createAdminUser: PropTypes.func.isRequired,
  updateAdminUser: PropTypes.func.isRequired,
  deleteAdminUser: PropTypes.func.isRequired,
  adminUsersData: PropTypes.object.isRequired,
  userOrgId: PropTypes.string.isRequired,
  loadSchoolsData: PropTypes.func.isRequired,
  pageNo: PropTypes.number.isRequired,
  setPageNo: PropTypes.func.isRequired,
  isSuperAdmin: PropTypes.bool.isRequired,
  isOrganization: PropTypes.bool.isRequired,
  isDistrictAdmin: PropTypes.bool.isRequired,
  isSchoolAdmin: PropTypes.bool.isRequired,
}

const ActionContainer = styled.div`
  white-space: nowrap;
  cursor: default;
`

const StyledButton = styled(StyledTableButton)`
  &[disabled] {
    opacity: 0;
    cursor: not-allowed;
    svg {
      fill: #adb8bf !important;
    }
  }
`
