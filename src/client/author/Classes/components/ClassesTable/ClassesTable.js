import { themeColor } from '@edulastic/colors'
import {
  CheckboxLabel,
  EduButton,
  notification,
  SelectInputStyled,
} from '@edulastic/common'
import { SearchInputStyled } from '@edulastic/common/src/components/InputStyles'
import { roleuser } from '@edulastic/constants'
import { IconNotes, IconPencilEdit, IconTrash } from '@edulastic/icons'
import { withNamespaces } from '@edulastic/localization'
import { Col, Icon, Menu, Row, Select } from 'antd'
import { cloneDeep, get, isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { compose } from 'redux'
import {
  StyledActionDropDown,
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
  StyledTableButton,
  SubHeaderWrapper,
  TableContainer,
} from '../../../../common/styled'
import {
  getCoursesForDistrictSelector,
  receiveSearchCourseAction,
} from '../../../Courses/ducks'
import UpdateCoTeacher from '../../../ManageClass/components/ClassDetails/UpdateCoTeacher/UpdateCoTeacher'
import {
  getSchoolsSelector,
  receiveSchoolsAction,
} from '../../../Schools/ducks'
import Breadcrumb from '../../../src/components/Breadcrumb'
import {
  getUser,
  getUserFeatures,
  getUserOrgId,
  getUserRole,
} from '../../../src/selectors/user'
import {
  getTeachersListSelector,
  receiveTeachersListAction,
} from '../../../Teacher/ducks'
import {
  addNewTagAction,
  getAllTagsAction,
  getAllTagsSelector,
} from '../../../TestPage/ducks'
import {
  bulkUpdateClassesAction,
  createClassAction,
  deleteClassAction,
  getBulkEditSelector,
  getClassListSelector,
  receiveClassListAction,
  setBulkEditModeAction,
  setBulkEditUpdateViewAction,
  setBulkEditVisibilityAction,
  updateClassAction,
} from '../../ducks'
import AddClassModal from './AddClassModal/AddClassModal'
import ArchiveClassModal from './ArchiveClassModal/ArchiveClassModal'
import BulkEditModal from './BulkEditModal'
import EditClassModal from './EditClassModal/EditClassModal'
import { ClassTable, TeacherSpan } from './styled'
import {
  getManageCoTeacherModalVisibleStateSelector,
  showUpdateCoTeacherModalAction,
} from '../../../ManageClass/ducks'

const { Option } = Select

const gradeOptions = []
gradeOptions.push({ title: 'Kindergarten', value: 'K', disabled: false })
gradeOptions.push({ title: 'PreKindergarten', value: 'TK', disabled: false })
for (let i = 1; i <= 12; i++)
  gradeOptions.push({ title: `Grade ${i}`, value: `${i}`, disabled: false })
gradeOptions.push({ title: 'Other', value: 'O', disabled: false })

const filterStrDD = {
  subjects: {
    list: [
      { title: 'Select a subject', value: '', disabled: true },
      { title: 'Mathematics', value: 'Mathematics', disabled: false },
      { title: 'ELA', value: 'ELA', disabled: false },
      { title: 'Science', value: 'Science', disabled: false },
      { title: 'Social Studies', value: 'Social Studies', disabled: false },
      { title: 'Computer Science', value: 'Computer Science', disabled: false },
      { title: 'Other Subjects', value: 'Other Subjects', disabled: false },
    ],
    placeholder: 'Select a subject',
  },
  grades: { list: gradeOptions, placeholder: 'Select a grade' },
  active: {
    list: [
      { title: 'Active', value: 1, disabled: false },
      { title: 'Archived', value: 0, disabled: false },
    ],
    placeholder: 'Select a value',
  },
}

class ClassesTable extends Component {
  constructor(props) {
    super(props)
    this.state = {
      dataSource: {},
      selectedRowKeys: [],
      addClassModalVisible: false,
      editClassModalVisible: false,
      archiveClassModalVisible: false,
      editClassKey: '',
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
      selectedArchiveClasses: [],
      showActive: true,
      refineButtonActive: false,
    }
    this.filterTextInputRef = [
      React.createRef(),
      React.createRef(),
      React.createRef(),
    ]
  }

  componentDidMount() {
    const { getAllTags, dataPassedWithRoute } = this.props
    if (!isEmpty(dataPassedWithRoute)) {
      this.setState(
        { filtersData: [{ ...dataPassedWithRoute }] },
        this.loadFilteredList
      )
    } else {
      this.loadFilteredList()
    }

    getAllTags({ type: 'group' })
  }

  // onHeaderCell = colName => {
  //   const { filtersData, sortedInfo, searchByName, currentPage } = this.state;
  //   if (sortedInfo.columnKey === colName) {
  //     if (sortedInfo.order === "asc") {
  //       sortedInfo.order = "desc";
  //     } else if (sortedInfo.order === "desc") {
  //       sortedInfo.order = "asc";
  //     }
  //   } else {
  //     sortedInfo.columnKey = colName;
  //     sortedInfo.order = sortedInfo.columnKey === "status" ? "desc" : "asc";
  //   }
  //   this.setState({ sortedInfo });
  //   this.loadFilteredList(filtersData, sortedInfo, searchByName, currentPage);
  // };

  static getDerivedStateFromProps(nextProps) {
    return {
      dataSource: nextProps.classList,
    }
  }

  onEditClass = (key) => {
    const { loadSchoolsData, userOrgId, loadTeachersListData } = this.props
    loadSchoolsData({
      districtId: userOrgId,
    })
    loadTeachersListData({
      districtId: userOrgId,
      role: 'teacher',
      limit: 10000,
    })
    this.setState({
      editClassModalVisible: true,
      editClassKey: key,
    })
  }

  onArchiveClass = () => {
    const { selectedRowKeys } = this.state

    this.setState({
      selectedArchiveClasses: selectedRowKeys,
      archiveClassModalVisible: true,
    })
  }

  onManageCoTeachers = () => {
    const { showUpdateCoTeacherModal } = this.props
    showUpdateCoTeacherModal(true)
  }

  handleDelete = (key) => {
    // const dataSource = [...this.state.dataSource];
    this.setState({
      selectedArchiveClasses: [key],
      archiveClassModalVisible: true,
    })
  }

  handleBulkEdit = () => {
    const { setBulkEditVisibility } = this.props
    setBulkEditVisibility(true)
  }

  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  }

  showAddClassModal = () => {
    this.setState({
      addClassModalVisible: true,
    })
  }

  afterSetState = (key) => {
    const { filtersData } = this.state
    const { filtersColumn, filtersValue, filterStr } = filtersData[key]
    if (
      // (filtersData[key].filterAdded || key === 2) &&
      filtersColumn &&
      filtersValue &&
      filterStr !== '' // here because 0 can be a value too for "active" select
    ) {
      // const { sortedInfo, searchByName, currentPage } = this.state;
      this.loadFilteredList()
    }
  }

  changePagination = (pageNumber) => {
    this.setState({ currentPage: pageNumber }, this.loadFilteredList)
  }

  onChangeShowActive = (e) => {
    this.setState(
      { showActive: e.target.checked, currentPage: 1 },
      this.loadFilteredList
    )
  }

  changeActionMode = (e) => {
    const { selectedRowKeys } = this.state
    const { t } = this.props
    if (e.key === 'edit class') {
      if (selectedRowKeys.length == 0) {
        notification({ msg: t('class.validations.editclass') })
      } else if (selectedRowKeys.length == 1) {
        this.onEditClass(selectedRowKeys[0])
      } else if (selectedRowKeys.length > 1) {
        notification({ msg: t('class.validations.singleeditclass') })
      }
    } else if (e.key === 'archive selected class') {
      if (selectedRowKeys.length > 0) this.onArchiveClass()
      else notification({ msg: t('class.validations.archiveclass') })
    } else if (e.key === 'manage co teachers') {
      if (selectedRowKeys.length === 1) this.onManageCoTeachers()
      else if (selectedRowKeys.length > 1)
        notification({ msg: t('class.validations.selectmultipleclass') })
      else notification({ msg: t('class.validations.selectoneclass') })
    } else if (e.key === 'bulk edit') {
      if (!selectedRowKeys.length) {
        notification({ type: 'warn', msg: t('class.validations.selectclass') })
      } else {
        const { setBulkEditVisibility } = this.props
        setBulkEditVisibility(true)
      }
    }
  }

  addClass = (addClassData) => {
    const { userOrgId, createClass } = this.props
    addClassData.districtId = userOrgId
    addClassData.parent = {
      id: addClassData?.owners?.[0],
    }
    createClass(addClassData)
    this.setState({ addClassModalVisible: false })
  }

  closeAddClassModal = () => {
    this.setState({
      addClassModalVisible: false,
    })
  }

  updateClass = (updatedClassData) => {
    const { updateClass } = this.props
    const { editClassKey } = this.state
    // const sameRow = dataSource.filter(item => item.key === editClassKey);

    updateClass({ groupId: editClassKey, body: updatedClassData })

    this.setState({
      editClassModalVisible: false,
    })
  }

  closeEditClassModal = () => {
    this.setState({
      editClassModalVisible: false,
    })
  }

  archiveClass = () => {
    const { selectedArchiveClasses } = this.state
    const { userOrgId: districtId, deleteClass, userDetails } = this.props

    this.setState({
      /* here selectedRowKeys is set back to [],
      since all the previously selected rows would have been deleted, */
      // by the api call
      selectedRowKeys: [],
      archiveClassModalVisible: false,
    })

    const o = {
      data: {
        groupIds: selectedArchiveClasses,
        districtId,
        institutionIds: userDetails.institutionIds,
      },
      searchQuery: this.getSearchQuery(),
    }

    deleteClass(o)
  }

  closeArchiveModal = () => {
    this.setState({ archiveClassModalVisible: false })
  }

  handleCloseModal = (keys) => {
    const { showUpdateCoTeacherModal } = this.props
    if (keys === 'manage co-teacher') showUpdateCoTeacherModal(false)
  }

  _bulkUpdateClasses = (obj) => {
    const { bulkUpdateClasses } = this.props
    const _obj = {
      data: obj,
      searchQuery: this.getSearchQuery(),
    }
    bulkUpdateClasses(_obj)
  }

  _onRefineResultsCB = () => {
    const { refineButtonActive } = this.state
    this.setState({ refineButtonActive: !refineButtonActive })
  }

  // -----|-----|-----|-----| FILTER RELATED BEGIN |-----|-----|-----|----- //

  onChangeSearch = (event) => {
    this.setState({ searchByName: event.currentTarget.value })
  }

  handleSearchName = (value) => {
    this.setState({ searchByName: value }, this.loadFilteredList)
  }

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
    this.setState({ filtersData: _filtersData }, () =>
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
    this.setState(() => ({ filtersData: _filtersData }), this.loadFilteredList)
  }

  changeStatusValue = (value, key) => {
    const { filtersData } = this.state
    const _filtersData = filtersData.map((item, index) => {
      if (index === key) {
        return {
          ...item,
          filterStr: value,
          filterAdded: !!value,
        }
      }
      return item
    })

    this.setState({ filtersData: _filtersData }, () => this.afterSetState(key))
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

  changeFilterColumn = (value, key) => {
    const { filtersData } = this.state
    // here we need to use cloneDeep since a simple spread operator mutates the state
    const _filtersData = cloneDeep(filtersData)
    _filtersData[key].filtersColumn = value

    if (value === 'subjects' || value === 'grades' || value === 'active')
      _filtersData[key].filtersValue = 'eq'
    // this is done so that we dont have multiple set states and we can avoid two renders
    this.setState({ filtersData }, () => this.afterSetState(key))
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

    this.setState({ filtersData: _filtersData }, () => this.afterSetState(key))
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
    let newFiltersData = []
    if (filtersData.length === 1) {
      newFiltersData.push({
        filterAdded: false,
        filtersColumn: '',
        filtersValue: '',
        filterStr: '',
      })
    } else {
      newFiltersData = filtersData.filter((item, index) => index !== key)
    }
    /* here we check if the filter we are removing is the active filter,
    then we enable the checkbox back */
    this.setState({ filtersData: newFiltersData }, this.loadFilteredList)
  }

  getSearchQuery = () => {
    const { userOrgId, userDetails } = this.props
    const { role, institutionIds } = userDetails
    const { filtersData, searchByName, currentPage, showActive } = this.state
    const search = { type: ['class'] }

    if (searchByName.length > 0) {
      search.name = searchByName
    }

    if (!filtersData.find((item) => item.filtersColumn === 'active')) {
      if (showActive) {
        search.active = [1]
      }
    }

    for (let i = 0; i < filtersData.length; i++) {
      const { filtersColumn, filtersValue, filterStr } = filtersData[i]
      if (
        filtersColumn &&
        filtersValue &&
        filterStr !== '' // here because 0 can be a value too for "active" select
      ) {
        if (
          filtersColumn === 'grades' ||
          filtersColumn === 'subjects' ||
          filtersColumn === 'active'
        ) {
          if (!search[filtersColumn]) {
            search[filtersColumn] = [filterStr]
          } else {
            search[filtersColumn].push(filterStr)
          }
        } else if (!search[filtersColumn]) {
          search[filtersColumn] = [{ type: filtersValue, value: filterStr }]
        } else {
          search[filtersColumn].push({ type: filtersValue, value: filterStr })
        }
      }
    }
    if (role === 'school-admin') {
      Object.assign(search, { institutionIds })
    }
    return {
      search,
      districtId: userOrgId,
      limit: 25,
      page: currentPage,
    }
  }

  loadFilteredList = () => {
    const { loadClassListData } = this.props
    loadClassListData(this.getSearchQuery())
  }
  // -----|-----|-----|-----| FILTER RELATED ENDED |-----|-----|-----|----- //

  render() {
    const {
      dataSource,
      selectedRowKeys,
      addClassModalVisible,
      editClassModalVisible,
      filtersData,
      archiveClassModalVisible,
      editClassKey,
      currentPage,
      selectedArchiveClasses,
      showActive,
      refineButtonActive,
    } = this.state

    const {
      userOrgId,
      searchCourseList,
      coursesForDistrictList,
      totalClassCount,
      schoolsData,
      teacherList,
      bulkEditData,
      setBulkEditVisibility,
      setBulkEditMode,
      setBulkEditUpdateView,
      allTagsData,
      addNewTag,
      role,
      t,
      features,
      manageCoTeacherModalVisible,
    } = this.props

    let columnsData = [
      {
        title: t('class.name'),
        dataIndex: '_source.name',
        editable: true,
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a._source.name.localeCompare(b._source.name),
        render: (name) => <span>{name}</span>,
        width: 300,
      },
      {
        title: t('grades'),
        dataIndex: '_source.grades',
        editable: true,
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) =>
          a._source.grades
            .join(', ')
            .localeCompare(b._source.grades.join(', ')),
        render: (grades) => <span>{grades.join(', ')}</span>,
        width: 150,
      },
      {
        title: t('class.subject'),
        dataIndex: '_source.subject',
        editable: true,
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a._source.subject.localeCompare(b._source.subject),
        render: (subject) => <span>{subject}</span>,
        width: 250,
      },
      {
        title: t('class.code'),
        dataIndex: '_source.code',
        editable: true,
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a._source.code.localeCompare(b._source.code),
        render: (code) => <span>{code}</span>,
        width: 200,
      },
    ]
    if (features.selectCourse) {
      columnsData.push({
        title: t('class.course'),
        dataIndex: '_source.course',
        editable: true,
        render: (course) => <span>{course ? course.name : '-'}</span>,
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => {
          const prev = get(a, '_source.course.name', '')
          const next = get(b, '_source.course.name', '')
          return next.localeCompare(prev)
        },
        width: 200,
      })
    }
    columnsData = [
      ...columnsData,
      {
        title: t('class.teacher'),
        dataIndex: '_source.owners',
        editable: true,
        render: (owners = []) => {
          const teachers = owners.map((owner, index) => (
            <TeacherSpan key={`${owner.id}${index}`}>{owner.name}</TeacherSpan>
          ))
          return <>{teachers}</>
        },
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) =>
          a._source.owners[0].name.localeCompare(b._source.owners[0].name),
      },
      {
        title: t('class.student'),
        dataIndex: '_source.studentCount',
        editable: true,
        sortDirections: ['descend', 'ascend'],
        align: 'center',
        sorter: (a, b) =>
          (a._source.studentCount || 0) - (b._source.studentCount || 0),
        render: (_, record) => {
          const studentCount = get(record, '_source.studentCount', 0)
          const classCode = get(record, '_source.code', '')
          return (
            <Link
              to={{
                pathname: '/author/class-enrollment',
                state: {
                  filtersColumn: 'code',
                  filtersValue: 'eq',
                  filterStr: classCode,
                  filterAdded: true,
                  role: roleuser.STUDENT,
                },
              }}
            >
              {studentCount}
            </Link>
          )
        },
      },
      {
        title: t('Status'),
        dataIndex: '_source.active',
        editable: true,
        render: (active) => <span>{active ? 'Active' : 'Archived'}</span>,
        sortDirections: ['descend', 'ascend'],
        sorter: (a, b) => a._source.active - b._source.active,
        width: 200,
      },
      {
        dataIndex: '_id',
        render: (id) => (
          <div style={{ whiteSpace: 'nowrap' }}>
            <StyledTableButton
              onClick={() => this.onEditClass(id)}
              title="Edit"
            >
              <IconPencilEdit color={themeColor} />
            </StyledTableButton>
            <StyledTableButton
              onClick={() => this.handleDelete(id)}
              title="Archive"
            >
              <IconTrash color={themeColor} />
            </StyledTableButton>
            <StyledTableButton onClick={this.handleBulkEdit} title="Bulk edit">
              <IconNotes color={themeColor} />
            </StyledTableButton>
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
            ? '/author/Classes'
            : '/author/districtprofile',
      },
      {
        title: 'CLASSES',
        to: '',
      },
    ]

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }

    const selectedClass = dataSource[editClassKey]
    const actionMenu = (
      <Menu onClick={this.changeActionMode}>
        <Menu.Item key="edit class">{t('class.editclass')}</Menu.Item>
        <Menu.Item key="archive selected class">
          {t('class.archiveclass')}
        </Menu.Item>
        <Menu.Item key="bulk edit">{t('class.bulkedit')}</Menu.Item>
        <Menu.Item key="manage co teachers">
          {t('class.managecoteachers')}
        </Menu.Item>
      </Menu>
    )

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
      if (
        filtersColumn === 'subjects' ||
        filtersColumn === 'grades' ||
        filtersColumn === 'active'
      ) {
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
        <Row gutter={20} style={{ marginbottom: '5px' }}>
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
              <Option value="codes">{t('class.code')}</Option>
              <Option value="courses">{t('class.course')}</Option>
              <Option value="teachers">{t('class.teacher')}</Option>
              <Option value="grades">{t('class.grade')}</Option>
              <Option value="subjects">{t('class.subject')}</Option>
              <Option value="institutionNames">{t('class.schoolname')}</Option>
              <Option value="active">{t('class.status')}</Option>
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
            {filterStrDD[filtersColumn] ? (
              <SelectInputStyled
                placeholder={filterStrDD[filtersColumn].placeholder}
                onChange={(e) => this.changeStatusValue(e, i)}
                disabled={isFilterTextDisable}
                value={filterStr}
                height="32px"
              >
                {filterStrDD[filtersColumn].list.map((item) => (
                  <Option value={item.value} disabled={item.disabled}>
                    {item.title}
                  </Option>
                ))}
              </SelectInputStyled>
            ) : (
              <SearchInputStyled
                placeholder={t('common.entertext')}
                onChange={(e) => this.changeFilterText(e, i)}
                onSearch={(v, e) => this.onSearchFilter(v, e, i)}
                onBlur={(e) => this.onBlurFilterText(e, i)}
                disabled={isFilterTextDisable}
                value={filterStr}
                ref={this.filterTextInputRef[i]}
                height="32px"
              />
            )}
          </Col>
          <Col span={6} style={{ display: 'flex' }}>
            {i < 2 && (
              <EduButton
                type="primary"
                width="50%"
                height="32px"
                onClick={(e) => this.addFilter(e, i)}
                disabled={isAddFilterDisable || i < filtersData.length - 1}
              >
                {t('common.addfilter')}
              </EduButton>
            )}
            {((filtersData.length === 1 && filtersData[0].filterAdded) ||
              filtersData.length > 1) && (
              <EduButton
                width="50%"
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
    }
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

        {refineButtonActive && <FilterWrapper>{SearchRows}</FilterWrapper>}

        <StyledFilterDiv>
          <LeftFilterDiv width={60}>
            <SearchInputStyled
              placeholder={t('common.searchbyname')}
              onSearch={this.handleSearchName}
              onChange={this.onChangeSearch}
              height="36px"
            />
            <EduButton type="primary" onClick={this.showAddClassModal}>
              {t('class.createnewclass')}
            </EduButton>
          </LeftFilterDiv>

          <RightFilterDiv width={35}>
            <CheckboxLabel
              checked={this.state.showActive}
              disabled={
                !!filtersData.find((item) => item.filtersColumn === 'active')
              }
              value={showActive}
              onChange={this.onChangeShowActive}
            >
              {t('class.showactiveclass')}
            </CheckboxLabel>
            <StyledActionDropDown
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              overlay={actionMenu}
              trigger={['click']}
            >
              <EduButton isGhost>
                {t('common.actions')} <Icon type="down" />
              </EduButton>
            </StyledActionDropDown>
          </RightFilterDiv>
        </StyledFilterDiv>
        <TableContainer>
          <ClassTable
            rowKey={(record) => record._id}
            rowSelection={rowSelection}
            dataSource={Object.values(dataSource)}
            columns={columnsData}
            pagination={false}
          />
          <StyledPagination
            defaultCurrent={1}
            current={currentPage}
            pageSize={25}
            total={totalClassCount}
            onChange={this.changePagination}
            hideOnSinglePage
          />
        </TableContainer>
        {editClassModalVisible && (
          <EditClassModal
            selClassData={selectedClass}
            modalVisible={editClassModalVisible}
            saveClass={this.updateClass}
            closeModal={this.closeEditClassModal}
            schoolsData={schoolsData}
            teacherList={teacherList}
            userOrgId={userOrgId}
            searchCourseList={searchCourseList}
            coursesForDistrictList={coursesForDistrictList}
            allTagsData={allTagsData}
            addNewTag={addNewTag}
            t={t}
          />
        )}

        {addClassModalVisible && (
          <AddClassModal
            modalVisible={addClassModalVisible}
            addClass={this.addClass}
            closeModal={this.closeAddClassModal}
            userOrgId={userOrgId}
            searchCourseList={searchCourseList}
            coursesForDistrictList={coursesForDistrictList}
            allTagsData={allTagsData}
            addNewTag={addNewTag}
            t={t}
          />
        )}

        {archiveClassModalVisible && (
          <ArchiveClassModal
            modalVisible={archiveClassModalVisible}
            archiveClass={this.archiveClass}
            closeModal={this.closeArchiveModal}
            classNames={selectedArchiveClasses.map((id) => {
              const { _source = {} } = dataSource[id]
              return <StyledClassName key={id}>{_source.name}</StyledClassName>
            })}
            t={t}
          />
        )}

        {manageCoTeacherModalVisible && (
          <UpdateCoTeacher
            isOpen={manageCoTeacherModalVisible}
            selectedClass={dataSource[selectedRowKeys]}
            handleCancel={() => this.handleCloseModal('manage co-teacher')}
          />
        )}

        <BulkEditModal
          bulkEditData={bulkEditData}
          districtId={userOrgId}
          onCloseModal={() => setBulkEditVisibility(false)}
          setBulkEditMode={setBulkEditMode}
          setBulkEditUpdateView={setBulkEditUpdateView}
          selectedIds={selectedRowKeys}
          selectedClasses={selectedRowKeys.map((_id) => dataSource[_id])}
          bulkUpdateClasses={this._bulkUpdateClasses}
          searchCourseList={searchCourseList}
          coursesForDistrictList={coursesForDistrictList}
          allTagsData={allTagsData}
          t={t}
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
      classList: getClassListSelector(state),
      coursesForDistrictList: getCoursesForDistrictSelector(state),
      totalClassCount: get(state, ['classesReducer', 'totalClassCount'], 0),
      teacherList: getTeachersListSelector(state),
      schoolsData: getSchoolsSelector(state),
      bulkEditData: getBulkEditSelector(state),
      allTagsData: getAllTagsSelector(state, 'group'),
      features: getUserFeatures(state),
      role: getUserRole(state),
      manageCoTeacherModalVisible: getManageCoTeacherModalVisibleStateSelector(
        state
      ),
    }),
    {
      createClass: createClassAction,
      updateClass: updateClassAction,
      deleteClass: deleteClassAction,
      loadClassListData: receiveClassListAction,
      searchCourseList: receiveSearchCourseAction,
      loadSchoolsData: receiveSchoolsAction,
      loadTeachersListData: receiveTeachersListAction,
      setBulkEditVisibility: setBulkEditVisibilityAction,
      setBulkEditMode: setBulkEditModeAction,
      setBulkEditUpdateView: setBulkEditUpdateViewAction,
      bulkUpdateClasses: bulkUpdateClassesAction,
      getAllTags: getAllTagsAction,
      addNewTag: addNewTagAction,
      showUpdateCoTeacherModal: showUpdateCoTeacherModalAction,
    }
  )
)

export default enhance(ClassesTable)

ClassesTable.propTypes = {
  classList: PropTypes.object.isRequired,
  loadClassListData: PropTypes.func.isRequired,
  createClass: PropTypes.func.isRequired,
  updateClass: PropTypes.func.isRequired,
  deleteClass: PropTypes.func.isRequired,
  userOrgId: PropTypes.string.isRequired,
  searchCourseList: PropTypes.func.isRequired,
  coursesForDistrictList: PropTypes.array.isRequired,
  loadSchoolsData: PropTypes.func.isRequired,
  loadTeachersListData: PropTypes.func.isRequired,
  setBulkEditVisibility: PropTypes.func.isRequired,
  setBulkEditMode: PropTypes.func.isRequired,
  setBulkEditUpdateView: PropTypes.func.isRequired,
  bulkUpdateClasses: PropTypes.func.isRequired,
}
