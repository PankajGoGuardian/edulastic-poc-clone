import { themeColor } from '@edulastic/colors'
import {
  CheckboxLabel,
  EduButton,
  notification,
  TypeToConfirmModal,
} from '@edulastic/common'
import {
  SearchInputStyled,
  SelectInputStyled,
} from '@edulastic/common/src/components/InputStyles'
import { roleuser } from '@edulastic/constants'
import { IconFilter, IconTrash } from '@edulastic/icons'
import { withNamespaces } from '@edulastic/localization'
import { Col, Icon, Menu, Select } from 'antd'
import { get, identity, isEmpty, omit, pick, pickBy, uniqBy } from 'lodash'
import moment from 'moment'
import React from 'react'
import { connect } from 'react-redux'
import withRouter from 'react-router/withRouter'
import { compose } from 'redux'
import {
  StyledActionDropDown,
  StyledClassName,
  StyledFilterDiv,
  TableFilters,
  TabTitle,
} from '../../../../admin/Common/StyledComponents'
import { StyledRow } from '../../../../admin/Common/StyledComponents/settingsContent'
import {
  LeftFilterDiv,
  MainContainer,
  RightFilterDiv,
  StyledPagination,
  StyledTableButton,
  SubHeaderWrapper,
  TableContainer,
} from '../../../../common/styled'
import { getFullNameFromString } from '../../../../common/utils/helpers'
import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'
import AddToGroupModal from '../../../Reports/common/components/Popups/AddToGroupModal'
import {
  createAdminUserAction,
  deleteAdminUserAction,
  removeUserEnrollmentsAction,
} from '../../../SchoolAdmin/ducks'
import Breadcrumb from '../../../src/components/Breadcrumb'
import AdminSubHeader from '../../../src/components/common/AdminSubHeader/AdministratorSubHeader'
import { FilterWrapper } from '../../../src/components/common/TableFilters/styled'
import {
  currentDistrictInstitutionIds,
  getUser,
  getUserOrgId,
  getUserRole,
  isPremiumUserSelector,
} from '../../../src/selectors/user'
import {
  AddStudentsToOtherClassModal,
  AddStudentsToOtherClassModal as MoveUsersToOtherClassModal,
} from '../../../Student/components/StudentTable/AddStudentToOtherClass'
import {
  addStudentsToOtherClassAction,
  fetchClassDetailsUsingCodeAction,
  getAddStudentsToOtherClassSelector,
  getValidatedClassDetails,
  moveUsersToOtherClassAction,
} from '../../../Student/ducks'
import {
  getClassEnrollmentUsersCountSelector,
  getClassEnrollmentUsersSelector,
  requestEnrolExistingUserToClassAction,
} from '../../ducks'
import { AddNewUserModal } from '../Common/AddNewUser'
import { StyledTable } from './styled'
import ResetPwd from '../../../ManageClass/components/ClassDetails/ResetPwd/ResetPwd'
import {
  getTestSettings,
  receiveTestSettingAction,
} from '../../../TestSetting/ducks'

const { Option } = Select

class ClassEnrollmentTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRowKeys: [],
      filtersData: [
        {
          filtersColumn: '',
          filtersValue: '',
          filterStr: '',
          filterAdded: false,
        },
      ],
      currentPage: 1,
      addUserFormModalVisible: false,
      removeStudentsModalVisible: false,
      resetPasswordModalVisible: false,
      selectedUserIds: [],
      selectedUsersInfo: [],
      addStudentsModalVisible: false,
      moveUsersModalVisible: false,
      refineButtonActive: false,
      showAddToGroupModal: false,
      showActive: true,
    }
  }

  componentDidMount() {
    const {
      dataPassedWithRoute,
      userOrgId,
      userRole,
      loadTestSetting,
      schoolId,
    } = this.props
    if (!isEmpty(dataPassedWithRoute)) {
      this.setState(
        { filtersData: [{ ...dataPassedWithRoute }] },
        this.loadClassEnrollmentList
      )
    } else {
      this.loadClassEnrollmentList()
    }
    if (userRole === 'school-admin') {
      loadTestSetting({ orgType: 'institution', orgId: schoolId })
    } else {
      loadTestSetting({ orgType: 'district', orgId: userOrgId })
    }
  }

  renderUserNames() {
    const { selectedUsersInfo } = this.state
    return selectedUsersInfo.map((item) => {
      const username = get(item, 'user.username')
      const id = get(item, 'user._id')
      return <StyledClassName key={id}>{username}</StyledClassName>
    })
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    const { classEnrollmentData } = this.props
    const selectedUserIds = selectedRows.map((item) => item.id)
    const selectedUsersInfo = classEnrollmentData.filter((data) => {
      const code = get(data, 'group.code')
      const userId = get(data, 'user._id')
      const recordMatch = selectedRows.find(
        (r) => r.code === code && r.id === userId
      )
      if (recordMatch) return true
      return false
    })
    this.setState({ selectedRowKeys, selectedUserIds, selectedUsersInfo })
  }

  changeActionMode = (e) => {
    const { selectedRowKeys, selectedUsersInfo } = this.state
    const isInstructor = selectedUsersInfo.some(
      (user) => user.role === 'teacher'
    )
    const areUsersOfDifferentClasses =
      uniqBy(selectedUsersInfo, 'group.code').length > 1
    if (e.key === 'remove students') {
      if (selectedRowKeys.length == 0) {
        notification({ messageKey: 'selectOneOrMoreStudentToRemoved' })
      } else if (selectedRowKeys.length > 0) {
        if (isInstructor) {
          notification({ messageKey: 'selectOnlyStudents' })
        } else {
          this.setState({
            removeStudentsModalVisible: true,
          })
        }
      }
    } else if (e.key === 'resetPassword') {
      if (selectedRowKeys.length === 0) {
        notification({ messageKey: 'atLeastOneStudentToResetPassword' })
      } else {
        this.setState({ resetPasswordModalVisible: true })
      }
    } else if (e.key === 'move users') {
      if (selectedRowKeys.length == 0) {
        notification({ messageKey: 'youHaveNotSelectedAnyUsers' })
      } else if (areUsersOfDifferentClasses) {
        notification({ messageKey: 'youCanOnlyMoveUsersOfSameClass' })
      } else if (selectedRowKeys.length >= 1) {
        this.setState({ moveUsersModalVisible: true })
      }
    } else if (e.key === 'add students to other class') {
      if (selectedRowKeys.length == 0) {
        notification({ messageKey: 'selectOneOrMoreStudentAdd' })
      } else if (selectedRowKeys.length > 0) {
        if (isInstructor) {
          notification({ messageKey: 'onlyStudentsCanBeAdded' })
        } else {
          this.setState({ addStudentsModalVisible: true })
        }
      }
    } else if (e.key === 'add to student group') {
      if (selectedRowKeys.length < 1) {
        notification({ messageKey: 'selectOneOrMoreStudentsForGroup' })
      } else {
        this.setState({ showAddToGroupModal: true })
      }
    }
  }

  saveFormRef = (node) => {
    this.formRef = node
  }

  // -----|-----|-----|-----| ACTIONS RELATED BEGIN |-----|-----|-----|----- //
  addNewUser = (userInfo = {}) => {
    // user info will be empty if user does not exists
    const { requestEnrolExistingUserToClass } = this.props
    if (userInfo._id) {
      const {
        getValidatedClass: { groupInfo },
      } = this.props
      const student = {
        classCode: groupInfo?.code,
        studentIds: [userInfo._id],
        districtId: groupInfo?.districtId,
      }
      requestEnrolExistingUserToClass(student)
      this.onCloseAddNewUserModal()
      return null
    }

    if (this.formRef) {
      const { userOrgId: districtId, createAdminUser } = this.props
      const { form } = this.formRef.props
      form.validateFields((err, values) => {
        if (!err) {
          const { fullName, role } = values
          const name = getFullNameFromString(fullName)
          values.firstName = name.firstName
          values.middleName = name.middleName
          values.lastName = name.lastName

          const contactEmails = get(values, 'contactEmails')

          if (role === 'teacher') {
            const institutionIds = []
            for (let i = 0; i < values.institutionIds.length; i++) {
              institutionIds.push(values.institutionIds[i].key)
            }
          }

          if (contactEmails) {
            values.contactEmails = [contactEmails]
          }
          if (values.dob) {
            values.dob = moment(values.dob).format('x')
          }
          const accommodations = pick(values, [
            'tts',
            'stt',
            'ir',
            'preferredLanguage',
            'extraTimeOnTest',
          ])
          const accommodationsData = pickBy(accommodations, identity)
          let data = pickBy(values, identity)
          data = omit(data, [
            'confirmPassword',
            'fullName',
            'tts',
            'stt',
            'ir',
            'preferredLanguage',
            'extraTimeOnTest',
          ])
          if (Object.keys(accommodationsData).length) {
            data = {
              ...data,
              accommodations: accommodationsData,
            }
          }
          const o = {
            createReq: data,
            listReq: {
              districtId,
              limit: 25,
              page: 1,
            },
            classEnrollmentPage: true,
          }
          createAdminUser(o)
          this.onCloseAddNewUserModal()
        }
      })
    }
  }

  confirmDeactivate = () => {
    const { removeUserEnrollments } = this.props
    const { selectedUsersInfo } = this.state
    const deleteGroupData = selectedUsersInfo.reduce((acc, data) => {
      acc[data.group._id] =
        acc[data.group._id] && Array.isArray(acc[data.group._id])
          ? acc[data.group._id].push(data)
          : [data]
      return acc
    }, {})
    const formatData = []
    Object.entries(deleteGroupData).forEach(([key, value]) => {
      formatData.push({
        groupId: key,
        students: value
          ?.filter?.((o) => o.role === 'student')
          ?.map?.((o) => o.user._id),
        teachers: value
          ?.filter?.((o) => o.role === 'teacher')
          ?.map?.((o) => o.user._id),
      })
    })
    const o = {
      deleteReq: formatData,
      listReq: this.getSearchQuery(),
      classEnrollmentPage: true,
    }
    removeUserEnrollments(o)
    this.setState({
      removeStudentsModalVisible: false,
      selectedRowKeys: [],
      selectedUserIds: [],
      selectedUsersInfo: [],
    })
  }

  onCancelRemoveStudentsModal = () => {
    this.setState({
      removeStudentsModalVisible: false,
      selectedRowKeys: [],
      selectedUserIds: [],
      selectedUsersInfo: [],
    })
  }

  onCloseAddNewUserModal = () => {
    const { resetClassDetails } = this.props
    resetClassDetails()
    this.setState({
      addUserFormModalVisible: false,
    })
  }

  onOpenaddNewUserModal = () => {
    this.setState({
      addUserFormModalVisible: true,
    })
  }

  onCloseAddStudentsToOtherClassModal = () => {
    const { resetClassDetails } = this.props
    this.setState({ addStudentsModalVisible: false })
    resetClassDetails()
  }

  onCloseMoveUsersToOtherClassModal = () => {
    const { resetClassDetails } = this.props
    this.setState({ moveUsersModalVisible: false })
    resetClassDetails()
  }

  handleDeactivateUser = (record) => {
    const { id, role, code } = record
    const { classEnrollmentData } = this.props
    const selectedUsersInfo = classEnrollmentData.filter((data) => {
      const _classCode = get(data, 'group.code')
      const userId = get(data, 'user._id')
      return _classCode === code && userId === id
    })
    if (role === 'teacher') {
      notification({ messageKey: 'pleaseSelectOnlyStudent' })
    } else {
      this.setState({
        selectedUserIds: [id],
        selectedUsersInfo,
        removeStudentsModalVisible: true,
      })
    }
  }

  setPageNo = (page) => {
    this.setState({ currentPage: page }, this.loadClassEnrollmentList)
  }

  // -----|-----|-----|-----| ACTIONS RELATED ENDED |-----|-----|-----|----- //

  // -----|-----|-----|-----| FILTER RELATED BEGIN |-----|-----|-----|----- //
  changeFilterColumn = (value, key) => {
    const { filtersData } = this.state
    const _filtersData = filtersData.map((item, index) => {
      if (key === index) {
        const _item = {
          ...item,
          filtersColumn: value,
        }
        if (value === 'role') _item.filtersValue = 'eq'
        return _item
      }
      return item
    })
    this.setState({ filtersData: _filtersData }, this.loadClassEnrollmentList)
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

    this.setState({ filtersData: _filtersData }, this.loadClassEnrollmentList)
  }

  changeRoleValue = (value, key) => {
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

    this.setState({ filtersData: _filtersData }, this.loadClassEnrollmentList)
  }

  changeFilterText = (e, key) => {
    const { filtersData } = this.state
    const _filtersData = filtersData.map((item, index) => {
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

  addFilter = () => {
    const { filtersData } = this.state
    if (filtersData.length < 3) {
      this.setState((state) => ({
        filtersData: [
          ...state.filtersData,
          {
            filtersColumn: '',
            filtersValue: '',
            filterStr: '',
            filterAdded: false,
          },
        ],
      }))
    }
  }

  removeFilter = (e, key) => {
    const { filtersData } = this.state
    let newFiltersData
    if (filtersData.length === 1) {
      newFiltersData = [
        {
          filterAdded: false,
          filtersColumn: '',
          filtersValue: '',
          filterStr: '',
        },
      ]
    } else {
      newFiltersData = filtersData.filter((item, index) => index !== key)
    }
    this.setState({ filtersData: newFiltersData }, this.loadClassEnrollmentList)
  }

  loadClassEnrollmentList = () => {
    const { receiveClassEnrollmentList } = this.props
    receiveClassEnrollmentList(this.getSearchQuery())
  }

  getSearchQuery = () => {
    const { userOrgId: districtId, userDetails, institutionIds } = this.props
    const {
      filtersData = [],
      searchByName,
      currentPage,
      showActive = true,
    } = this.state

    const { role = '' } = filtersData?.[0] || {}

    const search = {}
    for (const [, item] of filtersData.entries()) {
      const { filtersColumn, filtersValue, filterStr } = item
      if (filtersColumn !== '' && filtersValue !== '' && filterStr !== '') {
        if (!search[filtersColumn]) {
          search[filtersColumn] = [{ type: filtersValue, value: filterStr }]
        } else {
          search[filtersColumn].push({ type: filtersValue, value: filterStr })
        }
      }
    }

    const filtersColumnWithRole = filtersData.some(
      ({ filtersColumn }) => filtersColumn === 'role'
    )

    // location.state.role
    if (!filtersColumnWithRole && role) {
      search.role = [
        {
          type: 'eq',
          value: role,
        },
      ]
    }

    if (searchByName) {
      search.name = [{ type: 'cont', value: searchByName }]
    }
    const data = {
      search,
      districtId,
      limit: 25,
      page: currentPage,
      // uncomment after elastic search is fixed
      // sortField,
      // order
    }
    if (showActive) Object.assign(data, { status: 1 })
    if (userDetails) {
      Object.assign(data, { institutionIds })
    }
    return data
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
    this.setState(
      () => ({ filtersData: _filtersData }),
      this.loadClassEnrollmentList
    )
  }

  onChangeSearch = (event) => {
    this.setState({ searchByName: event.currentTarget.value })
  }

  handleSearchName = (value) => {
    this.setState({ searchByName: value }, this.loadClassEnrollmentList)
  }

  _onRefineResultsCB = () => {
    const { refineButtonActive } = this.state
    this.setState({ refineButtonActive: !refineButtonActive })
  }

  onChangeShowActive = (e) => {
    this.setState(
      { showActive: e.target.checked },
      this.loadClassEnrollmentList
    )
  }

  // -----|-----|-----|-----| FILTER RELATED ENDED |-----|-----|-----|----- //

  render() {
    const {
      filtersData,
      selectedRowKeys,
      removeStudentsModalVisible,
      addUserFormModalVisible,
      selectedUserIds,
      selectedUsersInfo,
      addStudentsModalVisible,
      moveUsersModalVisible,
      currentPage,
      refineButtonActive,
      showAddToGroupModal,
      showActive,
      resetPasswordModalVisible,
    } = this.state
    const {
      fetchClassDetailsUsingCode,
      validatedClassDetails,
      classEnrollmentData,
      addStudentsToOtherClassData,
      putStudentsToOtherClass,
      userOrgId,
      moveUsersToOtherClass,
      resetClassDetails,
      totalUsers,
      userRole,
      t,
      location,
      enableStudentGroups,
      menuActive,
      count,
      history,
      isPremium,
      districtTestSettings,
    } = this.props

    const tableDataSource = classEnrollmentData.map((item) => {
      const key = `${get(item, 'user._id')} ${get(item, 'group.code', '')}`
      const id = get(item, 'user._id')
      const role = get(item, 'role', '')
      const code = get(item, 'group.code', '')
      const name = get(item, 'group.name', '')
      const classId = get(item, 'group._id', '')
      const firstName = get(item, 'user.firstName', '')
      const middleName = get(item, 'user.middleName', '')
      const lastName = get(item, 'user.lastName', '')
      const username = get(item, 'user.username', '')
      const obj = {
        key,
        id,
        role,
        code,
        name,
        fullName: [firstName, middleName, lastName].join(' '),
        username,
        firstName,
        lastName,
        classId,
      }
      return obj
    })

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }

    const actionMenu = (
      <Menu onClick={this.changeActionMode}>
        <Menu.Item key="remove students">
          {t('classenrollment.removestudents')}
        </Menu.Item>
        <Menu.Item key="resetPassword">
          {t('classenrollment.resetPassword')}
        </Menu.Item>
        <Menu.Item key="move users">{t('classenrollment.moveusers')}</Menu.Item>
        <Menu.Item key="add students to other class">
          {t('classenrollment.addstdstoanotherclass')}
        </Menu.Item>
        {enableStudentGroups && (
          <Menu.Item key="add to student group">
            {t('classenrollment.addToStudentGroup')}
          </Menu.Item>
        )}
      </Menu>
    )

    const columnsData = [
      {
        title: t('classenrollment.classname'),
        dataIndex: 'name',
        sorter: (a, b) => a.name.localeCompare(b.name),
        width: 200,
      },
      {
        title: t('classenrollment.classcode'),
        dataIndex: 'code',
        sorter: (a, b) => a.code.localeCompare(b.code),
        width: 200,
      },
      {
        title: t('classenrollment.fullname'),
        dataIndex: 'fullName',
        sorter: (a, b) => a.fullName.localeCompare(b.fullName),
        width: 200,
      },
      {
        title: t('classenrollment.username'),
        dataIndex: 'username',
        sorter: (a, b) => a.username.localeCompare(b.username),
        width: 200,
      },
      {
        title: t('classenrollment.role'),
        dataIndex: 'role',
        sorter: (a, b) => a.role.localeCompare(b.role),
        width: 200,
      },
      {
        dataIndex: 'id',
        render: (_, record) => (
          <StyledTableButton
            key={record.key}
            onClick={() => this.handleDeactivateUser(record)}
            title="Deactivate"
          >
            <IconTrash color={themeColor} />
          </StyledTableButton>
        ),
        textWrap: 'word-break',
        width: 100,
      },
    ]

    const breadcrumbData = [
      {
        title:
          userRole === roleuser.SCHOOL_ADMIN
            ? 'MANAGE SCHOOL'
            : 'MANAGE DISTRICT',
        to:
          userRole === roleuser.SCHOOL_ADMIN
            ? '/author/class-enrollment'
            : '/author/districtprofile',
      },
      {
        title: 'CLASS ENROLLMENT',
        to: '',
      },
    ]

    const roleFilterOptions = ['Teacher', 'Student']
    const SearchRows = []
    for (let i = 0; i < filtersData.length; i++) {
      const {
        filtersColumn,
        filtersValue,
        filterStr,
        filterAdded,
      } = filtersData[i]
      const isFilterTextDisable = filtersColumn === '' || filtersValue === ''
      const isAddFilterDisable =
        filtersColumn === '' ||
        filtersValue === '' ||
        filterStr === '' ||
        !filterAdded

      const optValues = []
      if (filtersColumn === 'role') {
        optValues.push(<Option value="eq">{t('common.equals')}</Option>)
      } else {
        optValues.push(
          <Option value="" disabled>
            {t('common.selectvalue')}
          </Option>
        )
        optValues.push(<Option value="eq">{t('common.equals')}</Option>)
        optValues.push(<Option value="cont">{t('common.contains')}</Option>)
      }

      SearchRows.push(
        <StyledRow gutter={20} mb="5px">
          <Col span={6}>
            <SelectInputStyled
              placeholder={t('common.selectcolumn')}
              onChange={(e) => this.changeFilterColumn(e, i)}
              value={filtersColumn}
              height="32px"
            >
              <Option value="" disabled>
                {t('common.selectcolumn')}
              </Option>
              <Option value="code">{t('classenrollment.classcode')}</Option>
              <Option value="fullName">{t('classenrollment.fullname')}</Option>
              <Option value="username">{t('classenrollment.username')}</Option>
              <Option value="role">{t('classenrollment.role')}</Option>
            </SelectInputStyled>
          </Col>
          <Col span={6}>
            <SelectInputStyled
              placeholder={t('common.selectvalue')}
              onChange={(e) => this.changeFilterValue(e, i)}
              value={filtersValue}
              height="32px"
            >
              {optValues}
            </SelectInputStyled>
          </Col>
          <Col span={6}>
            {filtersColumn === 'role' ? (
              <SelectInputStyled
                placeholder={t('common.selectvalue')}
                onChange={(v) => this.changeRoleValue(v, i)}
                disabled={isFilterTextDisable}
                value={filterStr}
                height="32px"
              >
                {roleFilterOptions.map((item) => (
                  <Option key={item} value={item.toLowerCase()}>
                    {item}
                  </Option>
                ))}
              </SelectInputStyled>
            ) : (
              <SearchInputStyled
                placeholder={t('common.entertext')}
                onChange={(e) => this.changeFilterText(e, i)}
                onBlur={(e) => this.onBlurFilterText(e, i)}
                disabled={isFilterTextDisable}
                value={filterStr}
                height="32px"
              />
            )}
          </Col>
          <Col span={6} style={{ display: 'flex' }}>
            {i < 2 && (
              <EduButton
                type="primary"
                onClick={(e) => this.addFilter(e, i)}
                disabled={isAddFilterDisable || i < filtersData.length - 1}
                height="32px"
                width="50%"
              >
                {t('common.addfilter')}
              </EduButton>
            )}
            {((filtersData.length === 1 && filtersData[0].filterAdded) ||
              filtersData.length > 1) && (
              <EduButton
                height="32px"
                width="50%"
                type="primary"
                onClick={(e) => this.removeFilter(e, i)}
              >
                {t('common.removefilter')}
              </EduButton>
            )}
          </Col>
        </StyledRow>
      )
    }

    return (
      <MainContainer>
        <SubHeaderWrapper>
          <Breadcrumb data={breadcrumbData} style={{ position: 'unset' }} />
        </SubHeaderWrapper>
        <AdminSubHeader count={count} active={menuActive} history={history} />

        <StyledFilterDiv>
          <TabTitle>{menuActive.subMenu}</TabTitle>
          <TableFilters>
            <LeftFilterDiv width={50}>
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
                height="34px"
                type="primary"
                onClick={this.onOpenaddNewUserModal}
              >
                {t('classenrollment.addnewuser')}
              </EduButton>
            </LeftFilterDiv>

            <RightFilterDiv>
              <CheckboxLabel
                defaultChecked={showActive}
                onChange={this.onChangeShowActive}
              >
                {t('classenrollment.showactiveenrollments')}
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

        <FilterWrapper showFilters={refineButtonActive}>
          {SearchRows}
        </FilterWrapper>

        <TableContainer>
          <StyledTable
            rowSelection={rowSelection}
            dataSource={tableDataSource}
            columns={columnsData}
            pagination={false}
          />
          <StyledPagination
            defaultCurrent={1}
            current={currentPage}
            pageSize={25}
            total={totalUsers}
            hideOnSinglePage
            onChange={(page) => this.setPageNo(page)}
          />
        </TableContainer>

        <TypeToConfirmModal
          modalVisible={removeStudentsModalVisible}
          title={t('classenrollment.removestudents')}
          handleOnOkClick={this.confirmDeactivate}
          wordToBeTyped="DEACTIVATE"
          primaryLabel={t('classenrollment.confirmtext')}
          secondaryLabel={this.renderUserNames()}
          closeModal={() =>
            this.setState({
              removeStudentsModalVisible: false,
            })
          }
        />

        <AddNewUserModal
          showModal={addUserFormModalVisible}
          formTitle={t('classenrollment.addnewuser')}
          closeModal={this.onCloseAddNewUserModal}
          addNewUser={this.addNewUser}
          fetchClassDetailsUsingCode={fetchClassDetailsUsingCode}
          validatedClassDetails={validatedClassDetails}
          wrappedComponentRef={this.saveFormRef}
          userOrgId={userOrgId}
          resetClassDetails={resetClassDetails}
          location={location}
          isPremium={isPremium}
          enableSpeechToText={districtTestSettings.enableSpeechToText}
        />

        <AddStudentsToOtherClassModal
          {...addStudentsToOtherClassData}
          showModal={addStudentsModalVisible}
          titleText={t('classenrollment.addstdstoanotherclass')}
          buttonText={t('classenrollment.addstds')}
          handleSubmit={(classCode) =>
            putStudentsToOtherClass({ classCode, userDetails: selectedUserIds })
          }
          onCloseModal={this.onCloseAddStudentsToOtherClassModal}
          fetchClassDetailsUsingCode={fetchClassDetailsUsingCode}
          t={t}
        />
        <MoveUsersToOtherClassModal
          {...addStudentsToOtherClassData}
          showModal={moveUsersModalVisible}
          titleText={t('classenrollment.movetoanotherclass')}
          buttonText={t('classenrollment.moveusers')}
          handleSubmit={(destinationClassCode) =>
            moveUsersToOtherClass({
              districtId: userOrgId,
              destinationClassCode,
              sourceClassCode: selectedUsersInfo[0].group.code,
              userDetails: selectedUserIds,
            })
          }
          onCloseModal={this.onCloseMoveUsersToOtherClassModal}
          fetchClassDetailsUsingCode={fetchClassDetailsUsingCode}
          selectedUsersInfo={selectedUsersInfo}
          askUserConfirmation
          t={t}
        />
        {showAddToGroupModal && (
          <FeaturesSwitch
            inputFeatures="studentGroups"
            actionOnInaccessible="hidden"
          >
            <AddToGroupModal
              groupType="custom"
              visible={showAddToGroupModal}
              onCancel={() => this.setState({ showAddToGroupModal: false })}
              checkedStudents={uniqBy(
                selectedUsersInfo.map(({ user }) => ({ ...user })),
                '_id'
              )}
            />
          </FeaturesSwitch>
        )}
        <ResetPwd
          isOpen={resetPasswordModalVisible}
          handleCancel={() =>
            this.setState({ resetPasswordModalVisible: false })
          }
          resetPasswordUserIds={selectedUsersInfo?.map(
            (info) => info?.user?._id
          )}
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
      userDetails: getUser(state),
      isPremium: isPremiumUserSelector(state),
      institutionIds: currentDistrictInstitutionIds(state),
      classEnrollmentData: getClassEnrollmentUsersSelector(state),
      addStudentsToOtherClassData: getAddStudentsToOtherClassSelector(state),
      totalUsers: getClassEnrollmentUsersCountSelector(state),
      userRole: getUserRole(state),
      getValidatedClass: getValidatedClassDetails(state),
      enableStudentGroups: get(state, 'user.user.features.studentGroups'),
      districtTestSettings: getTestSettings(state),
      schoolId: get(state, 'user.saSettingsSchool'),
    }),
    {
      createAdminUser: createAdminUserAction,
      deleteAdminUser: deleteAdminUserAction,
      removeUserEnrollments: removeUserEnrollmentsAction,
      putStudentsToOtherClass: addStudentsToOtherClassAction,
      fetchClassDetailsUsingCode: fetchClassDetailsUsingCodeAction,
      moveUsersToOtherClass: moveUsersToOtherClassAction,
      requestEnrolExistingUserToClass: requestEnrolExistingUserToClassAction,
      loadTestSetting: receiveTestSettingAction,
    }
  )
)

export default enhance(withRouter(ClassEnrollmentTable))
