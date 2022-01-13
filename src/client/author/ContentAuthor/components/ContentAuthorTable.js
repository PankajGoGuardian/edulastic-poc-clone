import {
  CheckboxLabel,
  EduButton,
  notification,
  SearchInputStyled,
  TypeToConfirmModal,
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
  StyledPagination,
  StyledTableButton,
  SubHeaderWrapper,
  TableContainer,
} from '../../../common/styled'
import { isProxyUser as isProxyUserSelector } from '../../../student/Login/ducks'
import { proxyUser } from '../../authUtils'
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
import { StyledContentAuthorTable } from './styled'
import styled from 'styled-components'
import { themeColor } from '@edulastic/colors'

const menuActive = { mainMenu: 'Users', subMenu: 'Content Authors' }

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
      createContentAuthorModalVisible: false,
      editContentAuthorModaVisible: false,
      editContentAuthorKey: '',
      selectedAuthorsForDeactivate: [],
      deactivateAuthorsModalVisible: false,

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
        title: t('users.contentAuthor.name'),
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
        title: t('users.contentAuthor.email'),
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
        title: t('users.contentAuthor.sso'),
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
              ? 'Content Author'
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
                    onClick={() => this.onEditContentAuthor(id)}
                    title="Edit"
                    disabled={currentUserId === id}
                  >
                    <IconPencilEdit color={themeColor} />
                  </StyledButton>
                  <StyledButton
                    onClick={() => this.handleDeactivateAuthor(id)}
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
    const { contentAuthorData: result } = nextProps
    return {
      selectedRowKeys: state.selectedRowKeys.filter(
        (rowKey) => !!result[rowKey]
      ),
    }
  }

  onProxyContentAuthor = (id) => {
    proxyUser({ userId: id })
  }

  onEditContentAuthor = (key) => {
    this.setState({
      editContentAuthorModaVisible: true,
      editContentAuthorKey: key,
    })
  }

  handleDeactivateAuthor = (id) => {
    this.setState({
      selectedAuthorsForDeactivate: [id],
      deactivateAuthorsModalVisible: true,
    })
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  }

  showCreateContentAuthorModal = () => {
    this.setState({
      createContentAuthorModalVisible: true,
    })
  }

  changeActionMode = (e) => {
    const { selectedRowKeys } = this.state
    const { t } = this.props
    if (e.key === 'edit user') {
      if (selectedRowKeys.length === 0) {
        notification({ msg: t('users.validations.edituser') })
      } else if (selectedRowKeys.length === 1) {
        this.onEditContentAuthor(selectedRowKeys[0])
      } else if (selectedRowKeys.length > 1) {
        notification({ msg: t('users.validations.editsingleuser') })
      }
    } else if (e.key === 'deactivate user') {
      if (selectedRowKeys.length > 0) {
        this.setState({
          selectedAuthorsForDeactivate: selectedRowKeys,
          deactivateAuthorsModalVisible: true,
        })
        // deleteContentAuthor(selectedContentAuthorData);
      } else {
        notification({ msg: t('users.validations.deleteuser') })
      }
    }
  }

  closeEditContentAuthorModal = () => {
    this.setState({
      editContentAuthorModaVisible: false,
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
    const { userOrgId, createContentAuthorUser } = this.props
    createReq.role = 'teacher'
    createReq.permissions = ['author']
    createReq.districtId = userOrgId
    createReq.isPowerTeacher = true

    const o = {
      createReq,
      listReq: this.getSearchQuery(),
    }

    createContentAuthorUser(o)
    this.setState({ createContentAuthorModalVisible: false })
  }

  closeCreateUserModal = () => {
    this.setState({
      createContentAuthorModalVisible: false,
    })
  }

  confirmDeactivate = () => {
    const { deleteContentAuthorUser } = this.props
    const { selectedAuthorsForDeactivate } = this.state

    const o = {
      deleteReq: {
        userIds: selectedAuthorsForDeactivate,
        role: 'content-author',
      },
      listReq: this.getSearchQuery(),
    }

    deleteContentAuthorUser(o)
    this.setState({
      deactivateAuthorsModalVisible: false,
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
      permissions: 'author',
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
    const { loadContentAuthorData } = this.props
    loadContentAuthorData(this.getSearchQuery())
  }

  // -----|-----|-----|-----| FILTER RELATED ENDED |-----|-----|-----|----- //

  render() {
    const {
      selectedRowKeys,
      createContentAuthorModalVisible,
      editContentAuthorModaVisible,
      editContentAuthorKey,
      deactivateAuthorsModalVisible,
      selectedAuthorsForDeactivate,
      filtersData,
      currentPage,
      refineButtonActive,
    } = this.state

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }

    const {
      contentAuthorData: result,
      totalUsers,
      userOrgId,
      updateContentAuthorUser,
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
      t('users.contentAuthor.username'),
      t('users.contentAuthor.email'),
      t('users.contentAuthor.status'),
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
              />
              <EduButton
                type="primary"
                height="34px"
                onClick={this.showCreateContentAuthorModal}
              >
                {t('users.contentAuthor.createContentAuthor')}
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
        {createContentAuthorModalVisible && (
          <CreateContentAuthorModal
            modalVisible={createContentAuthorModalVisible}
            createContentAuthor={this.createUser}
            closeModal={this.closeCreateUserModal}
            userOrgId={userOrgId}
            t={t}
          />
        )}
        {editContentAuthorModaVisible && (
          <EditContentAuthorModal
            contentAuthorData={result[editContentAuthorKey]}
            modalVisible={editContentAuthorModaVisible}
            updateContentAuthor={updateContentAuthorUser}
            closeModal={this.closeEditContentAuthorModal}
            userOrgId={userOrgId}
            t={t}
          />
        )}
        {deactivateAuthorsModalVisible && (
          <TypeToConfirmModal
            modalVisible={deactivateAuthorsModalVisible}
            title="Deactivate"
            handleOnOkClick={this.confirmDeactivate}
            wordToBeTyped="DEACTIVATE"
            primaryLabel="Are you sure you want to deactivate the following content author(s)?"
            secondaryLabel={selectedAuthorsForDeactivate.map((id) => {
              const { _source: { firstName, lastName } = {} } = result[id]
              return (
                <StyledClassName key={id}>
                  {firstName} {lastName}
                </StyledClassName>
              )
            })}
            closeModal={() =>
              this.setState({
                deactivateAuthorsModalVisible: false,
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
      contentAuthorData: getAdminUsersDataSelector(state),
      totalUsers: getAdminUsersDataCountSelector(state),
      showActiveUsers: getShowActiveUsersSelector(state),
      pageNo: getPageNoSelector(state),
      filters: getFiltersSelector(state),
      isProxyUser: isProxyUserSelector(state),
      isSuperAdmin: isSuperAdminSelector(state),
    }),
    {
      createContentAuthorUser: createAdminUserAction,
      updateContentAuthorUser: updateAdminUserAction,
      deleteContentAuthorUser: deleteAdminUserAction,
      loadContentAuthorData: receiveAdminDataAction,
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
