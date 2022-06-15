import {
  CheckboxLabel,
  EduButton,
  notification,
  TypeToConfirmModal,
} from '@edulastic/common'
import { SearchInputStyled } from '@edulastic/common/src/components/InputStyles'
import { IconFilter, IconPencilEdit, IconTrash } from '@edulastic/icons'
import { withNamespaces } from '@edulastic/localization'
import { get, isEmpty } from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { themeColor } from '@edulastic/colors'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import {
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
  SubHeaderWrapper,
  TableContainer,
  StyledTableButton,
} from '../../../../common/styled'
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
} from '../../../SchoolAdmin/ducks'
import Breadcrumb from '../../../src/components/Breadcrumb'
import AdminSubHeader from '../../../src/components/common/AdminSubHeader/UserSubHeader'
import TableFiltersView from '../../../src/components/common/TableFilters'
import {
  getUserId,
  getUserOrgId,
  isSuperAdminSelector,
} from '../../../src/selectors/user'
import CreateDistrictAdminModal from './CreateDistrictAdminModal/CreateDistrictAdminModal'
import EditDistrictAdminModal from './EditDistrictAdminModal/EditDistrictAdminModal'
import { StyledDistrictAdminTable } from './styled'
import { daRoleList } from './helpers'

const menuActive = { mainMenu: 'Users', subMenu: 'District Admin' }

const filterStrDD = {
  status: {
    list: [
      { title: 'Select a value', value: undefined, disabled: true },
      { title: 'Active', value: 1, disabled: false },
      { title: 'Inactive', value: 0, disabled: false },
    ],
    placeholder: 'Select a value',
  },
  role: {
    list: [
      { title: 'Select a value', value: undefined, disabled: true },
      ...daRoleList.map((item) => ({
        title: item.label,
        value: item.value,
        disabled: false,
      })),
    ],
  },
}

class DistrictAdminTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRowKeys: [],
      createDistrictAdminModalVisible: false,
      editDistrictAdminModaVisible: false,
      editDistrictAdminKey: '',
      selectedAdminsForDeactivate: [],
      deactivateAdminModalVisible: false,

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
    }

    const { t, isSuperAdmin, userId } = this.props
    this.columns = [
      {
        title: t('users.districtadmin.name'),
        dataIndex: '_source.firstName',
        render: (_, { _source }) => {
          const firstName = get(_source, 'firstName', '')
          const lastName = get(_source, 'lastName', '')
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
          const prev = get(a, '_source.firstName', '')
          const next = get(b, '_source.firstName', '')
          return next.localeCompare(prev)
        },
        width: 200,
      },
      {
        title: t('users.districtadmin.username'),
        dataIndex: '_source.email',
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => {
          const prev = get(a, '_source.email', '')
          const next = get(b, '_source.email', '')
          return next.localeCompare(prev)
        },
        width: 200,
      },
      {
        title: t('users.districtadmin.role'),
        dataIndex: '_source.permissions',
        render: (permissions = []) => {
          const daRole =
            daRoleList.find((item) => permissions.includes(item.value)) ||
            daRoleList[0]
          return daRole.label
        },
        width: 200,
      },
      {
        title: t('users.districtadmin.sso'),
        dataIndex: '_source.lastSigninSSO',
        render: (sso = 'N/A') => sso,
        width: 200,
      },
      {
        dataIndex: '_id',
        render: (id) => {
          return (
            <ActionContainer>
              {isSuperAdmin && (
                <>
                  <StyledButton
                    onClick={() => this.onEditDistrictAdmin(id)}
                    title="Edit"
                    disabled={userId === id}
                  >
                    <IconPencilEdit color={themeColor} />
                  </StyledButton>
                  <StyledButton
                    onClick={() => this.handleDeactivateAdmin(id)}
                    title="Deactivate"
                    disabled={userId === id}
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

    this.filterTextInputRef = [
      React.createRef(),
      React.createRef(),
      React.createRef(),
    ]
  }

  componentDidMount() {
    this.loadFilteredList()
  }

  static getDerivedStateFromProps(nextProps, state) {
    const { adminUsersData: result } = nextProps
    return {
      selectedRowKeys: state.selectedRowKeys.filter(
        (rowKey) => !!result[rowKey]
      ),
    }
  }

  onEditDistrictAdmin = (key) => {
    this.setState({
      editDistrictAdminModaVisible: true,
      editDistrictAdminKey: key,
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

  showCreateDistrictAdminModal = () => {
    this.setState({
      createDistrictAdminModalVisible: true,
    })
  }

  changeActionMode = (e) => {
    const { selectedRowKeys } = this.state
    const { t } = this.props
    if (e.key === 'edit user') {
      if (selectedRowKeys.length === 0) {
        notification({ msg: t('users.validations.edituser') })
      } else if (selectedRowKeys.length === 1) {
        this.onEditDistrictAdmin(selectedRowKeys[0])
      } else if (selectedRowKeys.length > 1) {
        notification({ msg: t('users.validations.editsingleuser') })
      }
    } else if (e.key === 'deactivate user') {
      if (selectedRowKeys.length > 0) {
        this.setState({
          selectedAdminsForDeactivate: selectedRowKeys,
          deactivateAdminModalVisible: true,
        })
        // deleteDistrictAdmin(selectedDistrictAdminData);
      } else {
        notification({ msg: t('users.validations.deleteuser') })
      }
    }
  }

  closeEditDistrictAdminModal = () => {
    this.setState({
      editDistrictAdminModaVisible: false,
    })
  }

  setPageNo = (page) => {
    this.setState({ currentPage: page }, this.loadFilteredList)
  }

  _onRefineResultsCB = () => {
    const { refineButtonActive } = this.state
    this.setState({ refineButtonActive: !refineButtonActive })
  }

  // -----|-----|-----|-----| ACTIONS RELATED BEGIN |-----|-----|-----|----- //

  createUser = (createReq) => {
    const { userOrgId, createAdminUser } = this.props
    createReq.role = 'district-admin'
    createReq.districtId = userOrgId

    const o = {
      createReq,
      listReq: this.getSearchQuery(),
    }

    createAdminUser(o)
    this.setState({ createDistrictAdminModalVisible: false })
  }

  closeCreateUserModal = () => {
    this.setState({
      createDistrictAdminModalVisible: false,
    })
  }

  confirmDeactivate = () => {
    const { deleteAdminUser } = this.props
    const { selectedAdminsForDeactivate } = this.state

    const o = {
      deleteReq: {
        userIds: selectedAdminsForDeactivate,
        role: 'district-admin',
      },
      listReq: this.getSearchQuery(),
    }

    deleteAdminUser(o)
    this.setState({
      deactivateAdminModalVisible: false,
    })
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
    const _filtersData = this.state?.filtersData.map((item, index) => {
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

  changeFilterText = (e, key) => {
    const _filtersData = this.state.filtersData.map((item, index) => {
      if (index === key) {
        return {
          ...item,
          filterStr: e.target.value,
        }
      }
      return item
    })
    this.setState({ filtersData: _filtersData })
  }

  changeFilterColumn = (value, key) => {
    const _filtersData = this.state.filtersData.map((item, index) => {
      if (key === index) {
        const _item = {
          ...item,
          filtersColumn: value,
        }
        if (value === 'status') _item.filtersValue = 'eq'
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
    if (filtersData.length < 4) {
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
    let { showActive } = this.state

    const search = {}
    let permissions = ''
    let permissionsToOmit = []
    for (const [index, item] of filtersData.entries()) {
      const { filtersColumn, filtersValue, filterStr } = item
      if (filtersColumn !== '' && filtersValue !== '' && filterStr !== '') {
        if (filtersColumn === 'status') {
          showActive = filterStr
          continue
        }
        if (filtersColumn === 'role') {
          if (filterStr === daRoleList[0].value) {
            permissions = ''
            permissionsToOmit = daRoleList.slice(1).map((r) => r.value)
          } else {
            permissions = filterStr
            permissionsToOmit = []
          }
          continue
        }
        if (!search[filtersColumn]) {
          search[filtersColumn] = [{ type: filtersValue, value: filterStr }]
        } else {
          search[filtersColumn].push({ type: filtersValue, value: filterStr })
        }
      }
    }
    if (searchByName) {
      search.name = searchByName
    }

    const queryObj = {
      search,
      districtId: userOrgId,
      role: 'district-admin',
      limit: 25,
      page: currentPage,
      status: showActive ? 1 : 0,
      ...(permissions ? { permissions } : { permissionsToOmit }),
      // uncomment after elastic search is fixed
      // sortField,
      // order
    }
    return queryObj
  }

  loadFilteredList = () => {
    const { loadAdminData } = this.props
    loadAdminData(this.getSearchQuery())
  }

  // -----|-----|-----|-----| FILTER RELATED ENDED |-----|-----|-----|----- //

  render() {
    const {
      selectedRowKeys,
      createDistrictAdminModalVisible,
      editDistrictAdminModaVisible,
      editDistrictAdminKey,
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
      adminUsersData: result,
      totalUsers,
      userOrgId,
      updateAdminUser,
      history,
      pageNo,
      t,
    } = this.props

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
      t('users.districtadmin.username'),
      t('users.districtadmin.email'),
      t('users.districtadmin.status'),
      t('users.districtadmin.role'),
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
                height="36px"
                data-cy="searchByName"
              />
              <EduButton
                type="primary"
                onClick={this.showCreateDistrictAdminModal}
                data-cy="createDistrictAdminButton"
              >
                {t('users.districtadmin.createdistrictadmin')}
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
        />
        <TableContainer>
          <StyledDistrictAdminTable
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
        {createDistrictAdminModalVisible && (
          <CreateDistrictAdminModal
            modalVisible={createDistrictAdminModalVisible}
            createDistrictAdmin={this.createUser}
            closeModal={this.closeCreateUserModal}
            userOrgId={userOrgId}
            t={t}
          />
        )}

        {editDistrictAdminModaVisible && (
          <EditDistrictAdminModal
            districtAdminData={result[editDistrictAdminKey]}
            modalVisible={editDistrictAdminModaVisible}
            updateDistrictAdmin={updateAdminUser}
            closeModal={this.closeEditDistrictAdminModal}
            userOrgId={userOrgId}
            t={t}
          />
        )}
        {deactivateAdminModalVisible && (
          <TypeToConfirmModal
            modalVisible={deactivateAdminModalVisible}
            title={t('users.districtadmin.deactivateda.title')}
            handleOnOkClick={this.confirmDeactivate}
            wordToBeTyped="DEACTIVATE"
            primaryLabel={
              t('common.modalConfirmationText1') +
              t('users.districtadmin.deactivateda.districtadmins')
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
      userId: getUserId(state),
      userOrgId: getUserOrgId(state),
      adminUsersData: getAdminUsersDataSelector(state),
      totalUsers: getAdminUsersDataCountSelector(state),
      showActiveUsers: getShowActiveUsersSelector(state),
      pageNo: getPageNoSelector(state),
      filters: getFiltersSelector(state),
      isSuperAdmin: isSuperAdminSelector(state),
    }),
    {
      createAdminUser: createAdminUserAction,
      updateAdminUser: updateAdminUserAction,
      deleteAdminUser: deleteAdminUserAction,
      loadAdminData: receiveAdminDataAction,
      setSearchName: setSearchNameAction,
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
    }
  )
)

export default enhance(DistrictAdminTable)

DistrictAdminTable.propTypes = {
  loadAdminData: PropTypes.func.isRequired,
  createAdminUser: PropTypes.func.isRequired,
  updateAdminUser: PropTypes.func.isRequired,
  deleteAdminUser: PropTypes.func.isRequired,
  adminUsersData: PropTypes.object.isRequired,
  userOrgId: PropTypes.string.isRequired,
  pageNo: PropTypes.number.isRequired,
  isSuperAdmin: PropTypes.bool.isRequired,
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
