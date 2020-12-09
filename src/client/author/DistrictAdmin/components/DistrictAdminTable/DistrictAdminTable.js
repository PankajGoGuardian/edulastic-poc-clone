import {
  CheckboxLabel,
  EduButton,
  notification,
  SelectInputStyled,
  TypeToConfirmModal,
} from '@edulastic/common'
import { SearchInputStyled } from '@edulastic/common/src/components/InputStyles'
import { withNamespaces } from '@edulastic/localization'
import Col from "antd/es/col";
import Icon from "antd/es/icon";
import Row from "antd/es/row";
import Select from "antd/es/select";
import { get, isEmpty } from 'lodash'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import {
  StyledClassName,
  StyledFilterDiv,
} from '../../../../admin/Common/StyledComponents'
import {
  FilterWrapper,
  LeftFilterDiv,
  MainContainer,
  RightFilterDiv,
  StyledButton,
  StyledPagination,
  SubHeaderWrapper,
  TableContainer,
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
import { getUserOrgId } from '../../../src/selectors/user'
import CreateDistrictAdminModal from './CreateDistrictAdminModal/CreateDistrictAdminModal'
import EditDistrictAdminModal from './EditDistrictAdminModal/EditDistrictAdminModal'
import { StyledDistrictAdminTable } from './styled'

const menuActive = { mainMenu: 'Users', subMenu: 'District Admin' }

const { Option } = Select

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
    const { t } = this.props
    this.columns = [
      {
        title: t('users.districtadmin.name'),
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
        title: t('users.districtadmin.sso'),
        dataIndex: '_source.lastSigninSSO',
        render: (sso = 'N/A') => sso,
        width: 200,
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
    this.setState({ refineButtonActive: !this.state.refineButtonActive })
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
      role: 'district-admin',
      limit: 25,
      page: currentPage,
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

    return (
      <MainContainer>
        <SubHeaderWrapper>
          <Breadcrumb data={breadcrumbData} style={{ position: 'unset' }} />
          <StyledButton
            type="default"
            shape="round"
            icon="filter"
            onClick={this._onRefineResultsCB}
          >
            {t('common.refineresults')}
            <Icon type={refineButtonActive ? 'up' : 'down'} />
          </StyledButton>
        </SubHeaderWrapper>
        <AdminSubHeader active={menuActive} history={history} />

        {refineButtonActive && (
          <FilterWrapper>
            {filtersData.map((item, i) => {
              const {
                filtersColumn,
                filtersValue,
                filterStr,
                filterAdded,
              } = item
              const isFilterTextDisable =
                filtersColumn === '' || filtersValue === ''
              const isAddFilterDisable =
                filtersColumn === '' ||
                filtersValue === '' ||
                filterStr === '' ||
                !filterAdded

              return (
                <Row gutter={20} style={{ marginBottom: '5px' }} key={i}>
                  <Col span={6}>
                    <SelectInputStyled
                      placeholder={t('common.selectcolumn')}
                      onChange={(e) => this.changeFilterColumn(e, i)}
                      value={filtersColumn || undefined}
                      height="32px"
                    >
                      <Option value="other" disabled>
                        {t('common.selectcolumn')}
                      </Option>
                      <Option value="username">
                        {t('users.districtadmin.username')}
                      </Option>
                      <Option value="email">
                        {t('users.districtadmin.email')}
                      </Option>
                      <Option value="status">
                        {t('users.districtadmin.status')}
                      </Option>
                    </SelectInputStyled>
                  </Col>
                  <Col span={6}>
                    <SelectInputStyled
                      placeholder={t('common.selectvalue')}
                      onChange={(e) => this.changeFilterValue(e, i)}
                      value={filtersValue || undefined}
                      height="32px"
                    >
                      <Option value="" disabled>
                        {t('common.selectvalue')}
                      </Option>
                      <Option value="eq">{t('common.equals')}</Option>
                      {!filterStrDD[filtersColumn] ? (
                        <Option value="cont">{t('common.contains')}</Option>
                      ) : null}
                    </SelectInputStyled>
                  </Col>
                  <Col span={6}>
                    {!filterStrDD[filtersColumn] ? (
                      <SearchInputStyled
                        placeholder={t('common.entertext')}
                        onChange={(e) => this.changeFilterText(e, i)}
                        onSearch={(v, e) => this.onSearchFilter(v, e, i)}
                        onBlur={(e) => this.onBlurFilterText(e, i)}
                        value={filterStr || undefined}
                        disabled={isFilterTextDisable}
                        ref={this.filterTextInputRef[i]}
                        height="32px"
                      />
                    ) : (
                      <SelectInputStyled
                        placeholder={filterStrDD[filtersColumn].placeholder}
                        onChange={(v) => this.changeStatusValue(v, i)}
                        value={filterStr !== '' ? filterStr : undefined}
                        height="32px"
                      >
                        {filterStrDD[filtersColumn].list.map((item) => (
                          <Option
                            key={item.title}
                            value={item.value}
                            disabled={item.disabled}
                          >
                            {item.title}
                          </Option>
                        ))}
                      </SelectInputStyled>
                    )}
                  </Col>
                  <Col span={6} style={{ display: 'flex' }}>
                    {i < 2 && (
                      <EduButton
                        type="primary"
                        onClick={(e) => this.addFilter(e, i)}
                        disabled={
                          isAddFilterDisable || i < filtersData.length - 1
                        }
                        height="32px"
                      >
                        {t('common.addfilter')}
                      </EduButton>
                    )}
                    {((filtersData.length === 1 &&
                      filtersData[0].filterAdded) ||
                      filtersData.length > 1) && (
                      <EduButton
                        height="32px"
                        type="primary"
                        onClick={(e) => this.removeFilter(e, i)}
                      >
                        {t('common.removefilter')}
                      </EduButton>
                    )}
                  </Col>
                </Row>
              )
            })}
          </FilterWrapper>
        )}

        <StyledFilterDiv>
          <LeftFilterDiv width={60}>
            <SearchInputStyled
              placeholder={t('common.searchbyname')}
              onSearch={this.handleSearchName}
              onChange={this.onChangeSearch}
              height="36px"
            />
            <EduButton
              type="primary"
              onClick={this.showCreateDistrictAdminModal}
            >
              {t('users.districtadmin.createdistrictadmin')}
            </EduButton>
          </LeftFilterDiv>
          <RightFilterDiv width={35}>
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
        </StyledFilterDiv>
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
            title="Deactivate"
            handleOnOkClick={this.confirmDeactivate}
            wordToBeTyped="DEACTIVATE"
            primaryLabel="Are you sure you want to deactivate the following district admin(s)?"
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
      userOrgId: getUserOrgId(state),
      adminUsersData: getAdminUsersDataSelector(state),
      totalUsers: getAdminUsersDataCountSelector(state),
      showActiveUsers: getShowActiveUsersSelector(state),
      pageNo: getPageNoSelector(state),
      filters: getFiltersSelector(state),
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

// DistrictAdminTable.propTypes = {
//   districtAdminData: PropTypes.array.isRequired,
//   loadDistrictAdminData: PropTypes.func.isRequired,
//   createDistrictAdmin: PropTypes.func.isRequired,
//   updateDistrictAdmin: PropTypes.func.isRequired,
//   deleteDistrictAdmin: PropTypes.func.isRequired,
//   setSearchName: PropTypes.func.isRequired,
//   setFilters: PropTypes.func.isRequired,
//   userOrgId: PropTypes.string.isRequired
// };
