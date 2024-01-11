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
import { IconFilter, IconPencilEdit, IconTrash } from '@edulastic/icons'
import { withNamespaces } from '@edulastic/localization'
import { Col, Icon, Menu, Row, Select } from 'antd'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
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
  StyledPagination,
  SubHeaderWrapper,
  TableContainer,
} from '../../../../common/styled'
import { receiveAdminDataAction } from '../../../SchoolAdmin/ducks'
import Breadcrumb from '../../../src/components/Breadcrumb'
import AdminSubHeader from '../../../src/components/common/AdminSubHeader/AdministratorSubHeader'
import { FilterWrapper } from '../../../src/components/common/TableFilters/styled'
import { getUserOrgId, getUserRole } from '../../../src/selectors/user'
import {
  createCourseAction,
  deactivateCourseAction,
  getCourseListSelector,
  receiveCourseListAction,
  resetUploadModalStatusAction,
  setSelectedRowKeysAction,
  setShowActiveStatusAction,
  updateCourseAction,
} from '../../ducks'
import AddCourseModal from './AddCourseModal/AddCourseModal'
import EditCourseModal from './EditCourseModal/EditCourseModal'
import {
  StyledCoursesTable,
  StyledHeaderColumn,
  StyledSortIcon,
  StyledSortIconDiv,
} from './styled'
import UploadCourseModal from './UploadCourseModal'

const Option = Select.Option

class CoursesTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: [],
      addCourseModalVisible: false,
      editCourseModalVisible: false,
      uploadCourseModalVisible: false,
      editCourseKey: '',
      searchByName: '',
      filtersData: [
        {
          filtersColumn: '',
          filtersValue: '',
          filterStr: '',
          filterAdded: false,
        },
      ],
      sortedInfo: {
        columnKey: 'name',
        order: 'asc',
      },
      currentPage: 1,
      showActive: true,
      searchData: {},
      deactivateCourseModalVisible: false,
      refineButtonActive: false,
    }
    this.filterTextInputRef = [
      React.createRef(),
      React.createRef(),
      React.createRef(),
    ]
  }

  componentDidMount() {
    const { userOrgId, loadCourseListData, loadAdminData, role } = this.props
    loadCourseListData({
      districtId: userOrgId,
      page: 1,
      limit: 25,
      sortField: 'name',
      order: 'asc',
      search: {},
      active: 1,
    })

    // get all sa admin from current school

    role === roleuser.SCHOOL_ADMIN &&
      loadAdminData({
        districtId: userOrgId,
        role: 'school-admin',
        limit: 25,
      })

    this.setState({
      searchData: {
        districtId: userOrgId,
        page: 1,
        limit: 25,
        sortField: 'name',
        order: 'asc',
        search: {},
        active: 1,
      },
    })
  }

  static getDerivedStateFromProps(nextProps) {
    return {
      dataSource: nextProps.courseList,
      selectedRowKeys: nextProps.selectedRowKeys,
      schoolAdmins: nextProps.schoolAdmins,
    }
  }

  onHeaderCell = (colName) => {
    const { sortedInfo } = this.state
    if (sortedInfo.columnKey === colName) {
      if (sortedInfo.order === 'asc') {
        sortedInfo.order = 'desc'
      } else if (sortedInfo.order === 'desc') {
        sortedInfo.order = 'asc'
      }
    } else {
      sortedInfo.columnKey = colName
      sortedInfo.order = 'asc'
    }
    this.setState({ sortedInfo }, this.loadFilteredList)
  }

  onEditCourse = (key) => {
    this.setState({
      editCourseModalVisible: true,
      editCourseKey: key,
    })
  }

  confirmDeactivate = () => {
    const { selectedRowKeys } = this.state
    const { deactivateCourse } = this.props
    const selectedCourses = selectedRowKeys.map((id) => ({
      id,
    }))
    deactivateCourse(selectedCourses)
    this.setState({
      deactivateCourseModalVisible: false,
    })
  }

  onSelectChange = (selectedRowKeys) => {
    this.props.setSelectedRowKeys(selectedRowKeys)
  }

  showAddCourseModal = () => {
    this.setState({
      addCourseModalVisible: true,
    })
  }

  changeActionMode = (e) => {
    const { selectedRowKeys } = this.state

    if (e.key === 'upload csv') {
      this.setState({ uploadCourseModalVisible: true })
    } else if (e.key === 'edit course') {
      if (selectedRowKeys.length == 0) {
        notification({ messageKey: 'pleaseSelectCourseEdit' })
      } else if (selectedRowKeys.length == 1) {
        this.onEditCourse(selectedRowKeys[0])
      } else if (selectedRowKeys.length > 1) {
        notification({ messageKey: 'pleaseSelectSingleCourseEdit' })
      }
    } else if (e.key === 'deactivate course') {
      if (selectedRowKeys.length > 0) {
        this.setState({
          deactivateCourseModalVisible: true,
        })
      } else {
        notification({ messageKey: 'pleaseSelectCourseToDelete' })
      }
    }
  }

  addCourse = (addCourseData) => {
    const { userOrgId, createCourse } = this.props
    addCourseData.districtId = userOrgId
    createCourse(addCourseData)
    this.setState({ addCourseModalVisible: false })
  }

  closeAddCourseModal = () => {
    this.setState({
      addCourseModalVisible: false,
    })
  }

  updateCourse = (updatedCourseData) => {
    const { updateCourse, userOrgId } = this.props
    const {
      dataSource,
      editCourseKey,
      filtersData,
      sortedInfo,
      searchByName,
      currentPage,
      showActive,
    } = this.state
    const selectedSourceKey = dataSource.filter(
      (item) => item.key == editCourseKey
    )

    const search = {}

    if (searchByName.length > 0) {
      search.name = { type: 'cont', value: searchByName }
    }

    for (let i = 0; i < filtersData.length; i++) {
      if (
        filtersData[i].filtersColumn !== '' &&
        filtersData[i].filtersValue !== '' &&
        filtersData[i].filterStr !== ''
      ) {
        search[filtersData[i].filtersColumn] = {
          type: filtersData[i].filtersValue,
          value: filtersData[i].filterStr,
        }
      }
    }

    const loadListJsonData = {
      districtId: userOrgId,
      limit: 25,
      page: currentPage,
      sortField: sortedInfo.columnKey,
      order: sortedInfo.order,
      search,
    }

    if (showActive) loadListJsonData.active = 1

    updateCourse({
      updateData: {
        courseId: selectedSourceKey[0]._id,
        data: updatedCourseData,
      },
      searchData: loadListJsonData,
    })

    this.setState({
      editCourseModalVisible: false,
    })
  }

  closeEditCourseModal = () => {
    this.setState({
      editCourseModalVisible: false,
    })
  }

  changePagination = (pageNumber) => {
    this.setState({ currentPage: pageNumber }, this.loadFilteredList)
  }

  onChangeShowActive = (e) => {
    this.setState({ showActive: e.target.checked }, this.loadFilteredList)
  }

  closeUploadCourseModal = () => {
    this.setState({ uploadCourseModalVisible: false })
    this.props.resetUploadModal()
  }

  renderCourseNames() {
    const { dataSource, selectedRowKeys } = this.state
    const selectedCourses = dataSource.filter((item) =>
      selectedRowKeys.includes(item._id)
    )
    return selectedCourses.map((_course) => {
      const { id, name, number } = _course
      return (
        <StyledClassName key={id}>
          {name} {number}
        </StyledClassName>
      )
    })
  }

  deactivateSingleCourse = ({ _id }) => {
    this.props.setSelectedRowKeys([_id])
    this.setState({
      deactivateCourseModalVisible: true,
    })
  }

  onCancelConfirmModal = () => {
    this.setState({
      deactivateCourseModalVisible: false,
    })
  }

  _onRefineResultsCB = () => {
    this.setState({ refineButtonActive: !this.state.refineButtonActive })
  }

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
        return { ...item, filterAdded: !!value }
      }
      return item
    })

    // For some unknown reason till now calling blur() synchronously doesnt work.
    this.setState({ filtersData: _filtersData }, () =>
      this.filterTextInputRef[i].current.blur()
    )
  }

  onBlurFilterText = (e, key) => {
    const _filtersData = this.state.filtersData.map((item, index) => {
      if (index === key) {
        return {
          ...item,
          filterStr: e.target.value,
          filterAdded: true,
        }
      }
      return item
    })
    this.setState({ filtersData: _filtersData }, this.loadFilteredList)
  }

  changeStatusValue = (value, key) => {
    const filtersData = [...this.state.filtersData]
    filtersData[key].filterStr = value
    this.setState({ filtersData }, this.loadFilteredList)
  }

  changeFilterText = (e, key) => {
    const _filtersData = this.state.filtersData.map((item, index) => {
      if (index === key) {
        return { ...item, filterStr: e.target.value }
      }
      return item
    })
    this.setState({ filtersData: _filtersData })
  }

  changeFilterColumn = (value, key) => {
    const filtersData = [...this.state.filtersData]
    filtersData[key].filtersColumn = value
    if (value === 'status') filtersData[key].filtersValue = 'eq'
    this.setState({ filtersData }, this.loadFilteredList)
  }

  changeFilterValue = (value, key) => {
    const filtersData = [...this.state.filtersData]
    filtersData[key].filtersValue = value
    this.setState({ filtersData }, this.loadFilteredList)
  }

  addFilter = (e, key) => {
    const { filtersData } = this.state
    if (filtersData.length < 3) {
      const _filtersData = filtersData.map((item, index) => {
        if (index === key) {
          return {
            ...item,
            filterAdded: true,
          }
        }
        return item
      })

      _filtersData.push({
        filterAdded: false,
        filtersColumn: '',
        filtersValue: '',
        filterStr: '',
      })
      this.setState({ filtersData: _filtersData })
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
    const {
      filtersData,
      sortedInfo,
      searchByName,
      currentPage,
      showActive,
    } = this.state
    const { userOrgId } = this.props

    const search = {}

    if (searchByName.length > 0) {
      search.name = [{ type: 'cont', value: searchByName }]
    }

    for (let i = 0; i < filtersData.length; i++) {
      const { filtersColumn, filtersValue, filterStr } = filtersData[i]
      if (filtersColumn !== '' && filtersValue !== '' && filterStr !== '') {
        if (!search[filtersColumn]) {
          search[filtersColumn] = [{ type: filtersValue, value: filterStr }]
        } else {
          search[filtersColumn].push({ type: filtersValue, value: filterStr })
        }
      }
    }

    const loadListJsonData = {
      search,
      districtId: userOrgId,
      limit: 25,
      page: currentPage,
      sortField: sortedInfo.columnKey,
      order: sortedInfo.order,
    }
    if (showActive) {
      loadListJsonData.active = 1
    }

    // TO DO: remove this line after further investigation
    this.setState({ searchData: loadListJsonData })

    return loadListJsonData
  }

  loadFilteredList() {
    const { loadCourseListData } = this.props
    loadCourseListData(this.getSearchQuery())
  }
  // -----|-----|-----|-----| FILTER RELATED ENDED |-----|-----|-----|----- //

  render() {
    const {
      dataSource,
      selectedRowKeys,
      addCourseModalVisible,
      editCourseModalVisible,
      uploadCourseModalVisible,
      editCourseKey,
      filtersData,
      sortedInfo,
      currentPage,
      showActive,
      searchData,
      deactivateCourseModalVisible,
      refineButtonActive,
    } = this.state

    const {
      totalCourseCount,
      userOrgId,
      role,
      t,
      schoolAdmins = {},
      menuActive,
      count,
      history,
    } = this.props
    const isSchoolAdmin = role === roleuser.SCHOOL_ADMIN
    const schoolAdminIds = isSchoolAdmin ? Object.keys(schoolAdmins) : []
    const columnsInfo = [
      {
        title: (
          <StyledHeaderColumn>
            <p>{t('course.name')}</p>
            <StyledSortIconDiv>
              <StyledSortIcon
                type="caret-up"
                colorValue={
                  sortedInfo.columnKey === 'name' && sortedInfo.order === 'asc'
                }
              />
              <StyledSortIcon
                type="caret-down"
                colorValue={
                  sortedInfo.columnKey === 'name' && sortedInfo.order === 'desc'
                }
              />
            </StyledSortIconDiv>
          </StyledHeaderColumn>
        ),
        dataIndex: 'name',
        editable: true,
        width: 200,
        onHeaderCell: () => ({
          onClick: () => {
            this.onHeaderCell('name')
          },
        }),
      },
      {
        title: (
          <StyledHeaderColumn>
            <p>{t('course.number')}</p>
            <StyledSortIconDiv>
              <StyledSortIcon
                type="caret-up"
                colorValue={
                  sortedInfo.columnKey === 'number' &&
                  sortedInfo.order === 'asc'
                }
              />
              <StyledSortIcon
                type="caret-down"
                colorValue={
                  sortedInfo.columnKey === 'number' &&
                  sortedInfo.order === 'desc'
                }
              />
            </StyledSortIconDiv>
          </StyledHeaderColumn>
        ),
        dataIndex: 'number',
        editable: true,
        width: 200,
        onHeaderCell: () => ({
          onClick: () => {
            this.onHeaderCell('number')
          },
        }),
      },
      {
        title: (
          <StyledHeaderColumn>
            <p>{t('course.classes')}</p>
          </StyledHeaderColumn>
        ),
        dataIndex: 'classCount',
        editable: true,
        width: 100,
        align: 'center',
        render: (classCount, record) => {
          const courseName = get(record, 'name', '')
          return (
            <Link
              to={{
                pathname: '/author/classes',
                state: {
                  filtersColumn: 'courses',
                  filtersValue: 'eq',
                  filterStr: courseName,
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
        dataIndex: 'operation',
        width: 100,
        render: (text, record) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            {!(
              isSchoolAdmin &&
              schoolAdminIds.indexOf(record.createdBy._id) === -1
            ) &&
              !!record.active && (
                <>
                  <StyledTableButton
                    onClick={() => this.onEditCourse(record.key)}
                    title="Edit"
                  >
                    <IconPencilEdit color={themeColor} />
                  </StyledTableButton>
                  <StyledTableButton
                    onClick={() => this.deactivateSingleCourse(record)}
                    title="Deactivate"
                  >
                    <IconTrash color={themeColor} />
                  </StyledTableButton>
                </>
              )}
          </div>
        ),
      },
    ]

    const breadcrumbData = [
      {
        title:
          role === roleuser.SCHOOL_ADMIN ? 'MANAGE SCHOOL' : 'MANAGE DISTRICT',
        to:
          role === roleuser.SCHOOL_ADMIN
            ? '/author/Courses'
            : '/author/districtprofile',
      },
      {
        title: 'COURSES',
        to: '',
      },
    ]

    const columns = columnsInfo.map((col) => ({
      ...col,
    }))

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: (data) => ({
        disabled:
          isSchoolAdmin &&
          schoolAdminIds.indexOf(data.createdBy._id) === -1 &&
          !!data.active,
      }),
    }

    const selectedCourse = dataSource.filter(
      (item) => item.key == editCourseKey
    )

    const actionMenu = (
      <Menu onClick={this.changeActionMode}>
        <Menu.Item key="upload csv">{t('course.uploadcourse')}</Menu.Item>
        <Menu.Item key="edit course">{t('course.editcourse')}</Menu.Item>
        <Menu.Item key="deactivate course">
          {t('course.deactivatecourse')}
        </Menu.Item>
      </Menu>
    )

    const SearchRows = []
    for (let i = 0; i < filtersData.length; i++) {
      const isFilterTextDisable =
        filtersData[i].filtersColumn === '' ||
        filtersData[i].filtersValue === ''
      const isAddFilterDisable =
        filtersData[i].filtersColumn === '' ||
        filtersData[i].filtersValue === '' ||
        filtersData[i].filterStr === '' ||
        !filtersData[i].filterAdded

      SearchRows.push(
        <Row
          gutter={20}
          style={{ marginBottom: '5px' }}
          key={`${filtersData[i].filtersColumn}${i}`}
        >
          <Col span={6}>
            <SelectInputStyled
              placeholder={t('common.selectcolumn')}
              onChange={(e) => this.changeFilterColumn(e, i)}
              defaultValue={filtersData[i].filtersColumn}
              value={filtersData[i].filtersColumn}
              height="32px"
            >
              <Option value="">{t('common.selectcolumn')}</Option>
              <Option value="name">{t('course.coursename')}</Option>
              <Option value="number">{t('course.coursenumber')}</Option>
            </SelectInputStyled>
          </Col>
          <Col span={6}>
            <SelectInputStyled
              placeholder={t('common.selectvalue')}
              onChange={(e) => this.changeFilterValue(e, i)}
              value={filtersData[i].filtersValue}
              height="32px"
            >
              <Option value="">{t('common.selectvalue')}</Option>
              <Option value="eq">{t('common.equals')}</Option>
              <Option value="cont">{t('common.contains')}</Option>
            </SelectInputStyled>
          </Col>
          <Col span={6}>
            <SearchInputStyled
              placeholder={t('common.entertext')}
              onChange={(e) => this.changeFilterText(e, i)}
              onSearch={(v, e) => this.onSearchFilter(v, e, i)}
              onBlur={(e) => this.onBlurFilterText(e, i)}
              disabled={isFilterTextDisable}
              value={filtersData[i].filterStr}
              ref={this.filterTextInputRef[i]}
              height="32px"
            />
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
        </Row>
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
                height="34px"
                type="primary"
                onClick={this.showAddCourseModal}
                data-cy="createNewCourseButton"
              >
                {t('course.createcourse')}
              </EduButton>
            </LeftFilterDiv>
            <RightFilterDiv>
              <CheckboxLabel
                defaultChecked={showActive}
                onChange={this.onChangeShowActive}
              >
                {t('course.showactivecourse')}
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
        <FilterWrapper showFilters={refineButtonActive}>
          {SearchRows}
        </FilterWrapper>
        <TableContainer>
          <StyledCoursesTable
            rowSelection={rowSelection}
            dataSource={dataSource}
            columns={columns}
            pagination={false}
          />
          <StyledPagination
            current={currentPage}
            defaultCurrent={1}
            pageSize={25}
            total={totalCourseCount}
            onChange={this.changePagination}
            hideOnSinglePage
          />
        </TableContainer>
        {editCourseModalVisible && editCourseKey != '' && (
          <EditCourseModal
            courseData={selectedCourse[0]}
            modalVisible={editCourseModalVisible}
            saveCourse={this.updateCourse}
            closeModal={this.closeEditCourseModal}
            userOrgId={userOrgId}
            t={t}
          />
        )}
        {addCourseModalVisible && (
          <AddCourseModal
            modalVisible={addCourseModalVisible}
            addCourse={this.addCourse}
            closeModal={this.closeAddCourseModal}
            userOrgId={userOrgId}
            t={t}
          />
        )}
        {uploadCourseModalVisible && (
          <UploadCourseModal
            modalVisible={uploadCourseModalVisible}
            closeModal={this.closeUploadCourseModal}
            searchData={searchData}
            t={t}
          />
        )}

        <TypeToConfirmModal
          modalVisible={deactivateCourseModalVisible}
          title={t('course.deactivatecoursemodal.title')}
          handleOnOkClick={this.confirmDeactivate}
          wordToBeTyped="DEACTIVATE"
          primaryLabel={t('course.deactivatecoursemodal.confirmtext')}
          secondaryLabel={this.renderCourseNames()}
          closeModal={() =>
            this.setState({
              deactivateCourseModalVisible: false,
            })
          }
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
      courseList: getCourseListSelector(state),
      selectedRowKeys: get(state, ['coursesReducer', 'selectedRowKeys'], []),
      totalCourseCount: get(state, ['coursesReducer', 'totalCourseCount'], 0),
      role: getUserRole(state),
      schoolAdmins: get(state, ['schoolAdminReducer', 'data', 'result'], []),
    }),
    {
      createCourse: createCourseAction,
      updateCourse: updateCourseAction,
      deactivateCourse: deactivateCourseAction,
      loadCourseListData: receiveCourseListAction,
      setSelectedRowKeys: setSelectedRowKeysAction,
      setShowActiveStatus: setShowActiveStatusAction,
      loadAdminData: receiveAdminDataAction,
      resetUploadModal: resetUploadModalStatusAction,
    }
  )
)

export default enhance(CoursesTable)

CoursesTable.propTypes = {
  userOrgId: PropTypes.string.isRequired,
  courseList: PropTypes.array.isRequired,
  loadCourseListData: PropTypes.func.isRequired,
  loadAdminData: PropTypes.func.isRequired,
  createCourse: PropTypes.func.isRequired,
  updateCourse: PropTypes.func.isRequired,
  deactivateCourse: PropTypes.func.isRequired,
  setSelectedRowKeys: PropTypes.func.isRequired,
  resetUploadModal: PropTypes.func.isRequired,
}
