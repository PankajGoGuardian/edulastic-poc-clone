import {
  CheckboxLabel,
  EduButton,
  notification,
  TypeToConfirmModal,
  SearchInputStyled,
} from '@edulastic/common'
import { IconFilter, IconPencilEdit, IconTrash } from '@edulastic/icons'
import { withNamespaces } from '@edulastic/localization'
import { get, isEmpty } from 'lodash'
import React, { Component } from 'react'
import { GiDominoMask } from 'react-icons/gi'
import { connect } from 'react-redux'
import { compose } from 'redux'
import {
  StyledClassName,
  StyledFilterDiv,
  TableFilters,
  TabTitle,
} from '../../../admin/Common/StyledComponents'
import {
  LeftFilterDiv,
  MainContainer,
  RightFilterDiv,
  StyledTableButton,
  SubHeaderWrapper,
  TableContainer,
} from '../../../common/styled'
import { isProxyUser as isProxyUserSelector } from '../../../student/Login/ducks'
import { proxyUser } from '../../authUtils'
import { StyledContentAuthorTable } from '../../ContentAuthor/components/styled'
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
} from '../../SchoolAdmin/ducks'
import Breadcrumb from '../../src/components/Breadcrumb'
import AdminSubHeader from '../../src/components/common/AdminSubHeader/UserSubHeader'
import TableFiltersView from '../../src/components/common/TableFilters'
import {
  getUserId,
  getUserOrgId,
  isSuperAdminSelector,
} from '../../src/selectors/user'
import CreateContentAuthorModal from './CreateContentAuthorModal'
import EditContentAuthorModal from './EditContentAuthorModal'
import styled from 'styled-components'
import { themeColor } from '@edulastic/colors'

const menuActive = { mainMenu: 'Users', subMenu: 'Content Approvers' }

const filterStrDD = {
  status: {
    list: [
      { title: 'Select a value', value: undefined, disabled: true },
      { title: 'Active', value: 1, disabled: false },
      { title: 'Inactive', value: 0, disabled: false },
    ],
    placeholder: 'Select a value',
  },
}

class ContentAuthorTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRowKeys: [],
      createContentApproverModalVisible: false,
      editContentApproverModaVisible: false,
      editContentApproverKey: '',
      selectedApproverForDeactivate: [],
      deactivateApproverModalVisible: false,

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
    const { currentUserId, t, isProxyUser, isSuperAdmin } = this.props
    this.columns = [
      {
        title: t('users.contentApprover.name'),
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
        title: t('users.contentApprover.email'),
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
        title: t('users.contentApprover.sso'),
        dataIndex: '_source.lastSigninSSO',
        render: (sso = 'N/A') => sso,
        width: 200,
      },
      {
        dataIndex: '_id',
        render: (id, { _source }) => {
          if (isProxyUser) return null
          const firstName = get(_source, 'firstName', '')
          const lastName = get(_source, 'lastName', '')
          const status = get(_source, 'status', '')
          const fullName =
            firstName === 'Anonymous' ||
            (isEmpty(firstName) && isEmpty(lastName))
              ? 'Content Approver'
              : `${firstName} ${lastName}`
          return (
            <ActionContainer>
              {isSuperAdmin && (
                <>
                  {status === 1 ? (
                    <StyledTableButton
                      onClick={() => this.onProxyContentApprover(id)}
                      title={`Act as ${fullName}`}
                    >
                      <GiDominoMask />
                    </StyledTableButton>
                  ) : null}
                  <StyledButton
                    onClick={() => this.onEditContentApprover(id)}
                    title="Edit"
                    disabled={currentUserId === id}
                  >
                    <IconPencilEdit color={themeColor} />
                  </StyledButton>
                  <StyledButton
                    onClick={() => this.handleDeactivateContentApprover(id)}
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
        width: 80,
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
    const { contentApproverData: result } = nextProps
    return {
      selectedRowKeys: state.selectedRowKeys.filter(
        (rowKey) => !!result[rowKey]
      ),
    }
  }

  onProxyContentApprover = (id) => {
    proxyUser({ userId: id })
  }

  onEditContentApprover = (key) => {
    this.setState({
      editContentApproverModaVisible: true,
      editContentApproverKey: key,
    })
  }

  handleDeactivateContentApprover = (id) => {
    this.setState({
      selectedApproverForDeactivate: [id],
      deactivateApproverModalVisible: true,
    })
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  }

  showCreateContentApproverModal = () => {
    this.setState({
      createContentApproverModalVisible: true,
    })
  }

  changeActionMode = (e) => {
    const { selectedRowKeys } = this.state
    const { t } = this.props
    if (e.key === 'edit user') {
      if (selectedRowKeys.length === 0) {
        notification({ msg: t('users.validations.edituser') })
      } else if (selectedRowKeys.length === 1) {
        this.onEditContentApprover(selectedRowKeys[0])
      } else if (selectedRowKeys.length > 1) {
        notification({ msg: t('users.validations.editsingleuser') })
      }
    } else if (e.key === 'deactivate user') {
      if (selectedRowKeys.length > 0) {
        this.setState({
          selectedApproverForDeactivate: selectedRowKeys,
          deactivateApproverModalVisible: true,
        })
        // deleteDistrictAdmin(selectedDistrictAdminData);
      } else {
        notification({ msg: t('users.validations.deleteuser') })
      }
    }
  }

  closeEditContentApproverModal = () => {
    this.setState({
      editContentApproverModaVisible: false,
    })
  }

  setPageNo = (page) => {
    this.setState({ currentPage: page }, this.loadFilteredList)
  }

  _onRefineResultsCB = () => {
    this.setState({ refineButtonActive: !this.state.refineButtonActive })
  }

  // -----|-----|-----|-----| ACTIONS RELATED BEGIN |-----|-----|-----|----- //

  createUser = (createReq) => {
    const { userOrgId, createContentApproverUser } = this.props
    createReq.role = 'district-admin'
    createReq.permissions = ['curator']
    createReq.districtId = userOrgId
    createReq.isPowerTeacher = true

    const o = {
      createReq,
      listReq: this.getSearchQuery(),
    }

    createContentApproverUser(o)
    this.setState({ createContentApproverModalVisible: false })
  }

  closeCreateUserModal = () => {
    this.setState({
      createContentApproverModalVisible: false,
    })
  }

  confirmDeactivate = () => {
    const { deleteContentApproverUser } = this.props
    const { selectedApproverForDeactivate } = this.state

    const o = {
      deleteReq: {
        userIds: selectedApproverForDeactivate,
        role: 'content-approver',
      },
      listReq: this.getSearchQuery(),
    }

    deleteContentApproverUser(o)
    this.setState({
      deactivateApproverModalVisible: false,
    })
  }

  // -----|-----|-----|-----| ACTIONS RELATED ENDED |-----|-----|-----|----- //

  // -----|-----|-----|-----| FILTER RELATED BEGIN |-----|-----|-----|----- //

  onChangeSearch = (event) => {
    this.setState({ searchByName: event.currentTarget.value })
  }

  handleSearchName = (value) => {
    this.setState({ searchByName: value }, this.loadFilteredList)
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
    let { showActive } = this.state

    const search = {}
    for (const [index, item] of filtersData.entries()) {
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
    if (searchByName) {
      search.name = searchByName
    }

    const queryObj = {
      search,
      districtId: userOrgId,
      role: '',
      limit: 25,
      page: currentPage,
      permissions: 'curator',
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
    const { loadContentApproverData } = this.props
    loadContentApproverData(this.getSearchQuery())
  }

  // -----|-----|-----|-----| FILTER RELATED ENDED |-----|-----|-----|----- //

  render() {
    const {
      selectedRowKeys,
      createContentApproverModalVisible,
      editContentApproverModaVisible,
      editContentApproverKey,
      deactivateApproverModalVisible,
      selectedApproverForDeactivate,
      filtersData,
      refineButtonActive,
    } = this.state

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }

    const {
      contentApproverData: result,
      userOrgId,
      updateContentApproverUser,
      history,
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
      t('users.contentApprover.username'),
      t('users.contentApprover.email'),
      t('users.contentApprover.status'),
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
                type="primary"
                height="34px"
                onClick={this.showCreateContentApproverModal}
                data-cy="addContentApproverButton"
              >
                {t('users.contentApprover.createContentAuthor')}
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
          <StyledContentAuthorTable
            rowKey={(record) => record._id}
            rowSelection={rowSelection}
            dataSource={Object.values(result)}
            columns={this.columns}
            pagination={{ pageSize: 25, hideOnSinglePage: true }}
          />
          {/* use below pagination when API is paginated
          <StyledPagination
            defaultCurrent={1}
            current={currentPage}
            pageSize={25}
            total={totalUsers}
            onChange={page => this.setPageNo(page)}
            hideOnSinglePage
          /> */}
        </TableContainer>
        {createContentApproverModalVisible && (
          <CreateContentAuthorModal
            modalVisible={createContentApproverModalVisible}
            createContentApprover={this.createUser}
            closeModal={this.closeCreateUserModal}
            userOrgId={userOrgId}
            t={t}
          />
        )}

        {editContentApproverModaVisible && (
          <EditContentAuthorModal
            contentApproverData={result[editContentApproverKey]}
            modalVisible={editContentApproverModaVisible}
            updateContentApprover={updateContentApproverUser}
            closeModal={this.closeEditContentApproverModal}
            userOrgId={userOrgId}
            t={t}
          />
        )}
        {deactivateApproverModalVisible && (
          <TypeToConfirmModal
            modalVisible={deactivateApproverModalVisible}
            title="Deactivate Content Approver(s)"
            handleOnOkClick={this.confirmDeactivate}
            wordToBeTyped="DEACTIVATE"
            primaryLabel="Are you sure you want to deactivate the following content approver(s)?"
            secondaryLabel={selectedApproverForDeactivate.map((id) => {
              const { _source: { firstName, lastName } = {} } = result[id]
              return (
                <StyledClassName key={id}>
                  {firstName} {lastName}
                </StyledClassName>
              )
            })}
            closeModal={() =>
              this.setState({
                deactivateApproverModalVisible: false,
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
      contentApproverData: getAdminUsersDataSelector(state),
      totalUsers: getAdminUsersDataCountSelector(state),
      showActiveUsers: getShowActiveUsersSelector(state),
      pageNo: getPageNoSelector(state),
      filters: getFiltersSelector(state),
      isProxyUser: isProxyUserSelector(state),
      isSuperAdmin: isSuperAdminSelector(state),
    }),
    {
      createContentApproverUser: createAdminUserAction,
      updateContentApproverUser: updateAdminUserAction,
      deleteContentApproverUser: deleteAdminUserAction,
      loadContentApproverData: receiveAdminDataAction,
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

export default enhance(ContentAuthorTable)

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
