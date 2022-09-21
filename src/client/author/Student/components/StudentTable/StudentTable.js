import { themeColor } from '@edulastic/colors'
import {
  CheckboxLabel,
  EduButton,
  notification,
  TypeToConfirmModal,
} from '@edulastic/common'
import { SearchInputStyled } from '@edulastic/common/src/components/InputStyles'
import { IconFilter, IconPencilEdit, IconTrash } from '@edulastic/icons'
import { withNamespaces } from '@edulastic/localization'
import { Icon, Menu } from 'antd'
import { get, identity, isEmpty, pickBy, unset, debounce } from 'lodash'
import * as moment from 'moment'
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
import { UserFormModal as EditStudentFormModal } from '../../../../common/components/UserFormModal/UserFormModal'
import {
  LeftFilterDiv,
  MainContainer,
  RightFilterDiv,
  StyledTableButton,
  SubHeaderWrapper,
  StyledPagination,
  TableContainer,
} from '../../../../common/styled'
import { getFullNameFromString } from '../../../../common/utils/helpers'
import {
  getUserFeatures,
  isProxyUser as isProxyUserSelector,
} from '../../../../student/Login/ducks'
import {
  getSchoolsSelector,
  isSchoolSearchingSelector,
  searchSchoolByDistrictRequestAction,
} from '../../../../student/Signup/duck'
import { proxyUser } from '../../../authUtils'
import { receiveClassListAction } from '../../../Classes/ducks'
import {
  getPolicies,
  receiveDistrictPolicyAction,
  receiveSchoolPolicyAction,
} from '../../../DistrictPolicy/ducks'
import { getFormattedName } from '../../../Gradebook/transformers'
import AddStudentModal from '../../../ManageClass/components/ClassDetails/AddStudent/AddStudentModal'
import { MergeStudentsModal } from '../../../MergeUsers'
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
import { receiveSchoolsAction } from '../../../Schools/ducks'
import Breadcrumb from '../../../src/components/Breadcrumb'
import AdminSubHeader from '../../../src/components/common/AdminSubHeader/UserSubHeader'
import TableFiltersView from '../../../src/components/common/TableFilters'
import { getUserOrgId, getUserRole } from '../../../src/selectors/user'
import {
  addMultiStudentsRequestAction,
  addStudentsToOtherClassAction,
  fetchClassDetailsUsingCodeAction,
  getAddStudentsToOtherClassSelector,
  getValidatedClassDetails,
  resetFetchedClassDetailsAction,
  setAddStudentsToOtherClassVisiblityAction,
  setMultiStudentsProviderAction,
  setStudentsDetailsModalVisibleAction,
} from '../../ducks'
import { AddStudentsToOtherClassModal } from './AddStudentToOtherClass'
import InviteMultipleStudentModal from './InviteMultipleStudentModal/InviteMultipleStudentModal'
import StudentsDetailsModal from './StudentsDetailsModal/StudentsDetailsModal'
import { StyledMaskButton, StyledStudentTable } from './styled'

const menuActive = { mainMenu: 'Users', subMenu: 'Student' }

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

class StudentTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRowKeys: [],
      addStudentModalVisible: false,
      editStudentModaVisible: false,
      inviteStudentModalVisible: false,
      editStudentKey: '',
      selectedAdminsForDeactivate: [],
      deactivateAdminModalVisible: false,
      showMergeStudentsModal: false,
      showActive: true,
      searchByName: '',
      currentPage: 1,
      filtersData: [
        {
          filtersColumn: '',
          filtersValue: '',
          filterStr: '',
          filterAdded: false,
        },
      ],
      refineButtonActive: false,
      schoolsState: {
        list: [],
        fetching: false,
      },
    }
    const { t, isProxyUser } = this.props
    this.columns = [
      {
        title: t('users.student.name'),
        render: (_, { _source }) => {
          const firstName = get(_source, 'firstName', '') || ''
          const lastName = get(_source, 'lastName', '') || ''
          const middleName = get(_source, 'middleName', '') || ''
          const fullName = getFormattedName(firstName, middleName, lastName)
          return <span>{fullName}</span>
        },
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => {
          const prev = get(a, '_source.firstName', '') || ''
          const next = get(b, '_source.firstName', '') || ''
          return next.localeCompare(prev)
        },
      },
      {
        title: t('users.student.username'),
        dataIndex: '_source.username',
        render: (text, record) =>
          record._source.username || record._source.email,
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => {
          const prev = get(a, '_source.username', '') || ''
          const next = get(b, '_source.username', '') || ''
          return next.localeCompare(prev)
        },
      },
      {
        title: t('users.student.sso'),
        dataIndex: '_source.lastSigninSSO',
        render: (sso = 'N/A') => sso,
      },
      {
        title: t('users.student.school'),
        dataIndex: '_source.institutionDetails',
        render: (schools = []) => schools.map((school) => school.name),
        width: 250,
      },
      {
        title: t('users.student.classes'),
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
          const middleName = get(_source, 'middleName', '') || ''
          const fullName = getFormattedName(firstName, middleName, lastName)
          const status = get(_source, 'status', '')
          return (
            <div style={{ whiteSpace: 'nowrap' }}>
              {status === 1 && !isProxyUser ? (
                <StyledMaskButton
                  onClick={() => this.onProxyStudent(id)}
                  title={`Act as ${fullName}`}
                >
                  <GiDominoMask />
                </StyledMaskButton>
              ) : null}
              <StyledTableButton
                onClick={() => this.onEditStudent(id)}
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
    const {
      dataPassedWithRoute,
      loadSchoolPolicy,
      role,
      loadDistrictPolicy,
      schoolId,
      userOrgId,
    } = this.props
    if (role === 'school-admin') {
      loadSchoolPolicy(schoolId)
    } else {
      loadDistrictPolicy({ orgId: userOrgId, orgType: 'district' })
    }
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
      })
    }
    return newState
  }

  onProxyStudent = (id) => {
    proxyUser({ userId: id })
  }

  onEditStudent = (key) => {
    this.setState({
      editStudentModaVisible: true,
      editStudentKey: key,
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

  showAddStudentModal = () => {
    this.setState({
      addStudentModalVisible: true,
    })
  }

  changeActionMode = (e) => {
    const { selectedRowKeys } = this.state
    const {
      adminUsersData,
      setAddStudentsToOtherClassVisiblity,
      t,
    } = this.props
    if (e.key === 'add student') {
      this.setState({ addStudentModalVisible: true })
    }
    if (e.key === 'merge user') {
      const inactiveUsers = Object.values(adminUsersData).filter(
        (u) => selectedRowKeys.includes(u._id) && u._source.status !== 1
      )
      if (inactiveUsers.length) {
        notification({ messageKey: 'deactivatedUserSelected' })
      } else if (selectedRowKeys.length > 1) {
        this.setState({ showMergeStudentsModal: true })
      } else {
        notification({ type: 'info', messageKey: 'SelectTwoOrMoreStudents' })
      }
    }
    if (e.key === 'edit user') {
      if (selectedRowKeys.length === 0) {
        notification({ msg: t('users.validations.edituser') })
      } else if (selectedRowKeys.length === 1) {
        this.onEditStudent(selectedRowKeys[0])
      } else if (selectedRowKeys.length > 1) {
        notification({ msg: t('users.validations.editsingleuser') })
      }
    } else if (e.key === 'deactivate user') {
      if (selectedRowKeys.length > 0) {
        this.setState({
          selectedAdminsForDeactivate: selectedRowKeys,
          deactivateAdminModalVisible: true,
        })
      } else {
        notification({ msg: t('users.validations.deleteuser') })
      }
    } else if (e.key === 'addStudentsToAnotherClass') {
      if (selectedRowKeys.length) {
        setAddStudentsToOtherClassVisiblity(true)
      } else {
        notification({ messageKey: 'pleaseSelectAtleastOneUser' })
      }
    }
  }

  closeEditStudentModal = () => {
    this.setState({
      editStudentModaVisible: false,
    })
  }

  showInviteStudentModal = () => {
    this.setState({
      inviteStudentModalVisible: true,
    })
  }

  closeInviteStudentModal = () => {
    this.setState({
      inviteStudentModalVisible: false,
    })
  }

  closeStudentsDetailModal = () => {
    this.props.setStudentsDetailsModalVisible(false)
  }

  saveFormRef = (node) => {
    this.formRef = node
  }

  setPageNo = (page) => {
    this.setState({ currentPage: page }, this.loadFilteredList)
  }

  // -----|-----|-----|-----| ACTIONS RELATED BEGIN |-----|-----|-----|----- //

  sendInvite = (inviteStudentList) => {
    this.setState({
      inviteStudentModalVisible: false,
    })
    const { addMultiStudents, userOrgId } = this.props

    const o = {
      addReq: { districtId: userOrgId, data: inviteStudentList },
      listReq: this.getSearchQuery(),
    }

    addMultiStudents(o)
  }

  createUser = () => {
    if (this.formRef) {
      const { createAdminUser } = this.props
      const { form } = this.formRef.props
      form.validateFields((err, values) => {
        if (!err) {
          const { fullName } = values

          const name = getFullNameFromString(fullName)
          values.firstName = name.firstName
          values.middleName = name.middleName
          values.lastName = name.lastName

          const contactEmails = get(values, 'contactEmails')
          if (contactEmails) {
            values.contactEmails = [contactEmails]
          }

          if (values.dob) {
            values.dob = moment(values.dob).format('x')
          }
          unset(values, ['confirmPassword'])
          unset(values, ['fullName'])

          const o = {
            createReq: pickBy(values, identity),
            listReq: this.getSearchQuery(),
          }

          createAdminUser(o)
          this.setState({ addStudentModalVisible: false })
        }
      })
    }
  }

  closeAddUserModal = () => {
    this.setState({
      addStudentModalVisible: false,
    })
  }

  onCloseMergeStudentsModal = () => {
    this.setState({ showMergeStudentsModal: false })
  }

  onSubmitMergeStudentsModal = () => {
    this.handleSearchName(' ')
    this.onCloseMergeStudentsModal()
  }

  confirmDeactivate = () => {
    const { deleteAdminUser } = this.props
    const { selectedAdminsForDeactivate } = this.state

    const o = {
      deleteReq: { userIds: selectedAdminsForDeactivate, role: 'student' },
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
    const { location = {} } = this.props;
    location.institutionId = '';
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
          filterStr: "",
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
    const { userOrgId, location = {} } = this.props
    const { filtersData, searchByName, currentPage } = this.state
    let { showActive } = this.state
    let institutionId = ''
    const search = {}
    for (const [index, item] of filtersData.entries()) {
      if(item?.filtersColumn === 'school'){
        if (
          institutionId &&
          item?.filterStr &&
          institutionId.indexOf('item?.filterStr') < 0
        ) {
          institutionId = `${institutionId},${item?.filterStr}`
        } else if(item?.filterStr){
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
      institutionId,
      role: 'student',
      limit: 25,
      page: currentPage,
      // uncomment after elastic search is fixed
      // sortField,
      // order
    }

    if (location.institutionId) {
      queryObj.institutionId = location.institutionId
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

  setPageNo = (page) => {
    this.setState({ currentPage: page }, this.loadFilteredList)
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
      addStudentModalVisible,
      editStudentModaVisible,
      inviteStudentModalVisible,
      editStudentKey,
      deactivateAdminModalVisible,
      selectedAdminsForDeactivate,
      showMergeStudentsModal,
      filtersData,
      refineButtonActive,
      currentPage,
    } = this.state

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }

    const {
      adminUsersData: result,
      userOrgId,
      updateAdminUser,
      studentDetailsModalVisible,
      addStudentsToOtherClassData,
      setAddStudentsToOtherClassVisiblity,
      putStudentsToOtherClass,
      fetchClassDetailsUsingCode,
      features,
      setProvider,
      validatedClassDetails,
      resetClassDetails,
      history,
      policy,
      totalUsers,
      pageNo,
      t,
    } = this.props

    const actionMenu = (
      <Menu onClick={this.changeActionMode}>
        <Menu.Item key="add student">{t('users.student.addstudent')}</Menu.Item>
        <Menu.Item key="edit user">{t('users.student.updateuser')}</Menu.Item>
        <Menu.Item key="merge user">{t('users.student.mergeuser')}</Menu.Item>
        <Menu.Item key="deactivate user">
          {t('users.student.deactivateuser')}
        </Menu.Item>
        <Menu.Item key="addStudentsToAnotherClass">
          {t('users.student.addstudentootherclass')}
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
                onClick={this.showInviteStudentModal}
              >
                + Add Multiple Students
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
              <StyledActionDropDown
                getPopupContainer={(triggerNode) => triggerNode.parentNode}
                overlay={actionMenu}
                trigger={['click']}
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
          <StyledStudentTable
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
        {inviteStudentModalVisible && (
          <InviteMultipleStudentModal
            modalVisible={inviteStudentModalVisible}
            inviteStudents={this.sendInvite}
            closeModal={this.closeInviteStudentModal}
            features={features}
            setProvider={setProvider}
            t={t}
            policy={policy}
          />
        )}

        {editStudentModaVisible && (
          <EditStudentFormModal
            showModal={editStudentModaVisible}
            role="student"
            formTitle="Update User"
            showAdditionalFields
            userOrgId={userOrgId}
            modalData={result[editStudentKey]}
            modalFunc={updateAdminUser}
            closeModal={this.closeEditStudentModal}
            buttonText="Yes, Update"
            isStudentEdit
          />
        )}
        {addStudentModalVisible && (
          <AddStudentModal
            handleAdd={this.createUser}
            handleCancel={this.closeAddUserModal}
            isOpen={addStudentModalVisible}
            submitted={false}
            wrappedComponentRef={this.saveFormRef}
            showClassCodeField
            fetchClassDetailsUsingCode={fetchClassDetailsUsingCode}
            showTtsField
            validatedClassDetails={validatedClassDetails}
            resetClassDetails={resetClassDetails}
          />
        )}
        {studentDetailsModalVisible && (
          <StudentsDetailsModal
            modalVisible={studentDetailsModalVisible}
            closeModal={this.closeStudentsDetailModal}
            role="student"
            title={t('users.student.studentdetail.title')}
          />
        )}
        {deactivateAdminModalVisible && (
          <TypeToConfirmModal
            modalVisible={deactivateAdminModalVisible}
            title={t('users.student.deactivatestudent.title')}
            handleOnOkClick={this.confirmDeactivate}
            wordToBeTyped="DEACTIVATE"
            primaryLabel={t('users.student.deactivatestudent.confirmText')}
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
        <AddStudentsToOtherClassModal
          titleText={t('users.student.addstudentootherclass')}
          buttonText={t('users.student.addstudents')}
          {...addStudentsToOtherClassData}
          handleSubmit={(classCode) =>
            putStudentsToOtherClass({ classCode, userDetails: selectedRowKeys })
          }
          onCloseModal={() => setAddStudentsToOtherClassVisiblity(false)}
          fetchClassDetailsUsingCode={fetchClassDetailsUsingCode}
          t={t}
        />
        <MergeStudentsModal
          visible={showMergeStudentsModal}
          userIds={selectedRowKeys}
          onSubmit={this.onSubmitMergeStudentsModal}
          onCancel={this.onCloseMergeStudentsModal}
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
      // schoolsData: getSchoolsSelector(state),
      // classList: get(state, ["classesReducer", "data"], []),
      studentDetailsModalVisible: get(
        state,
        ['studentReducer', 'studentDetailsModalVisible'],
        false
      ),
      adminUsersData: getAdminUsersDataSelector(state),
      totalUsers: getAdminUsersDataCountSelector(state),
      showActiveUsers: getShowActiveUsersSelector(state),
      pageNo: getPageNoSelector(state),
      filters: getFiltersSelector(state),
      addStudentsToOtherClassData: getAddStudentsToOtherClassSelector(state),
      features: getUserFeatures(state),
      validatedClassDetails: getValidatedClassDetails(state),
      policy: getPolicies(state),
      schoolId: get(state, 'user.saSettingsSchool'),
      role: getUserRole(state),
      isProxyUser: isProxyUserSelector(state),
      isSchoolSearching: isSchoolSearchingSelector(state),
      getSchools: getSchoolsSelector(state),
    }),
    {
      loadSchoolsData: receiveSchoolsAction,
      loadClassList: receiveClassListAction,
      addMultiStudents: addMultiStudentsRequestAction,
      setStudentsDetailsModalVisible: setStudentsDetailsModalVisibleAction,
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
      setAddStudentsToOtherClassVisiblity: setAddStudentsToOtherClassVisiblityAction,
      putStudentsToOtherClass: addStudentsToOtherClassAction,
      fetchClassDetailsUsingCode: fetchClassDetailsUsingCodeAction,
      setProvider: setMultiStudentsProviderAction,
      resetClassDetails: resetFetchedClassDetailsAction,
      loadSchoolPolicy: receiveSchoolPolicyAction,
      loadDistrictPolicy: receiveDistrictPolicyAction,
      getSchoolsWithinDistrict: searchSchoolByDistrictRequestAction,
    }
  )
)

export default enhance(withRouter(StudentTable))
