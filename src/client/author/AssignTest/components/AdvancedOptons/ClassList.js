import React from 'react'
import PropTypes from 'prop-types'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Select } from 'antd'
import { EduIf, SelectInputStyled } from '@edulastic/common'
import { IconGroup, IconClass, IconClose } from '@edulastic/icons'
import { lightGrey10, tagTextColor } from '@edulastic/colors'
import { testTypes as testTypesConstants } from '@edulastic/constants'
import { get, curry, isEmpty, find, uniq, debounce, isArray } from 'lodash'
import { receiveClassListAction } from '../../../Classes/ducks'
import {
  getAssignedClassesByIdSelector,
  getClassListSelector,
} from '../../duck'
import {
  getUserOrgId,
  getSchoolsByUserRoleSelector,
} from '../../../src/selectors/user'
import { receiveSchoolsAction } from '../../../Schools/ducks'
import {
  receiveCourseListAction,
  getAggregateCourseListSelector,
  getCourseLoadingState,
} from '../../../Courses/ducks'
import {
  ClassListFilter,
  StyledRowLabel,
  StyledTable,
  ClassListContainer,
  TableContainer,
  InfoSection,
  AdvancedSearchTagContainer,
  AdvancedSearchTag,
} from './styled-components'
import selectsData from '../../../TestPage/components/common/selectsData'
import {
  getTestSelector,
  getAllTagsAction,
  getAllTagsSelector,
} from '../../../TestPage/ducks'
import Tags from '../../../src/components/common/Tags'
import { setSearchTermsFilterAction } from '../../../TestPage/components/Assign/ducks'
import {
  setIsAllClassSelectedAction,
  getIsAdvancedSearchSelectedSelector,
  setAdvancedSearchFilterAction,
  setIsAdvancedSearchSelectedAction,
  getIsAllClassSelectedSelector,
} from '../../../AdvanceSearch/ducks'
import { sortGrades } from '../../../TestPage/utils'

const { allGrades, allSubjects } = selectsData

const findTeacherName = (row) => {
  const { owners = [], primaryTeacherId, parent } = row
  const { id: teacherId } = parent || {}
  const teacher = find(
    owners,
    (owner) => owner.id === (primaryTeacherId || teacherId)
  )
  return teacher ? teacher.name : owners.length ? owners[0].name : ''
}

const formatGrades = (grades) => {
  if (isArray(grades)) {
    return sortGrades(grades).toString()
  }
  return grades || ''
}

const convertTableData = (row) => ({
  key: row._id,
  className: row.name,
  teacher: findTeacherName(row),
  subject: row.subject,
  grades: formatGrades(row.grades),
  type: row.type,
  tags: row.tags,
})

class ClassList extends React.Component {
  static propTypes = {
    loadCourseListData: PropTypes.func.isRequired,
    loadSchoolsData: PropTypes.func.isRequired,
    loadClassListData: PropTypes.func.isRequired,
    userOrgId: PropTypes.string.isRequired,
    schools: PropTypes.array.isRequired,
    courseList: PropTypes.array.isRequired,
    classList: PropTypes.array.isRequired,
    selectedClasses: PropTypes.array.isRequired,
    selectClass: PropTypes.func.isRequired,
    test: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      classType: 'all',
      searchTerms: {
        institutionIds: [],
        subjects: [],
        grades: [],
        active: [1],
        tags: [],
      },
      filterClassIds: [],
    }
  }

  componentDidMount() {
    const {
      schools,
      test,
      loadSchoolsData,
      loadCourseListData,
      userOrgId,
      getAllTags,
      courseList,
    } = this.props

    if (isEmpty(schools)) {
      loadSchoolsData({ districtId: userOrgId })
    }
    if (isEmpty(courseList)) {
      loadCourseListData({
        limit: 25,
        page: 1,
        districtId: userOrgId,
        active: 1,
        aggregate: true,
        includes: ['name'],
        search: {
          name: [{ type: 'cont', value: '' }],
        },
      })
    }

    getAllTags({ type: 'group' })

    const { subjects = [], grades = [] } = test
    this.setState(
      (prevState) => ({
        ...prevState,
        searchTerms: {
          ...prevState.searchTerms,
          grades,
          subjects,
        },
      }),
      this.loadClassList
    )
  }

  componentDidUpdate(prevProps) {
    const {
      test,
      testType,
      classList,
      selectedClasses,
      isAllClassSelected: isAllClassSelectedProp,
      setIsAllClassSelected,
    } = this.props
    const { filterClassIds } = this.state
    if (prevProps.test._id !== test._id) {
      const { subjects = [], grades = [] } = test
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState(
        (prevState) => ({
          ...prevState,
          searchTerms: {
            ...prevState.searchTerms,
            grades,
            subjects,
          },
        }),
        this.loadClassList
      ) // eslint-disable-line
    }
    if (
      prevProps.testType !== testType &&
      testTypesConstants.TEST_TYPES.COMMON.includes(testType) &&
      filterClassIds.length
    ) {
      this.setState({ filterClassIds: [] }) // eslint-disable-line
    }

    const isAllSelected =
      !!selectedClasses?.length &&
      classList.every(({ _id }) => selectedClasses?.includes(_id))
    if (isAllClassSelectedProp !== isAllSelected) {
      setIsAllClassSelected(isAllSelected)
    }
  }

  loadClassList = () => {
    const { loadClassListData, userOrgId, setSearchTermsFilter } = this.props
    const { searchTerms, classType } = this.state
    setSearchTermsFilter({ ...searchTerms, classType })
    loadClassListData({
      districtId: userOrgId,
      queryType: 'OR',
      search: searchTerms,
      page: 1,
      limit: 4000,
      includes: [
        'name',
        'studentCount',
        'subject',
        'grades',
        'termId',
        'type',
        'tags',
        'description',
        'owners',
        'primaryTeacherId',
        'parent',
        'institutionId',
      ],
    })
  }

  changeFilter = (key, value) => {
    const { searchTerms } = this.state
    searchTerms[key] =
      key === 'courseIds' ? value.flatMap((v) => v.split('_')) : value
    this.setState({ searchTerms }, this.loadClassList)
  }

  handleClassTypeFilter = (key) => {
    const {
      selectClass,
      classList,
      selectedClasses,
      setSearchTermsFilter,
    } = this.props
    const { searchTerms } = this.state
    const _selectedClasses = classList
      .filter(
        (item) =>
          (key === 'all' || item.type === key) &&
          selectedClasses.includes(item._id)
      )
      .map((item) => item._id)
    selectClass('class', _selectedClasses, classList)
    this.setState({ classType: key })
    setSearchTermsFilter({ ...searchTerms, classType: key })
  }

  handleSelectAll = (checked) => {
    const { selectClass, classList, assignedClassesById, testType } = this.props
    const { filterClassIds, classType } = this.state
    let filterclassList = []
    if (checked) {
      const selectedClasses = classList
        .filter(
          (item) =>
            (classType === 'all' || item.type === classType) &&
            !assignedClassesById[testType][item._id]
        )
        .map((item) => item._id)
      selectClass('class', selectedClasses, classList)
      filterclassList = selectedClasses
    } else {
      selectClass('class', [], classList)
    }
    if (filterClassIds.length) {
      this.setState({ filterClassIds: filterclassList })
    }
  }

  handleClassSelectFromDropDown = (value) => {
    const { classList, selectClass } = this.props
    this.setState({ classType: 'all', filterClassIds: value }, () =>
      selectClass('class', value, classList)
    )
  }

  courseSearch = (searchString) => {
    const { loadCourseListData, userOrgId } = this.props
    const q = {
      limit: 25,
      page: 1,
      districtId: userOrgId,
      active: 1,
      aggregate: true,
      includes: ['name'],
      search: {
        name: [{ type: 'cont', value: searchString }],
      },
    }
    loadCourseListData(q)
  }

  handleCourseSearch = debounce(this.courseSearch, 200)

  removeAdvanceSearch = () => {
    const {
      setAdvancedSearchFilter,
      setIsAdvancedSearchSelected,
      selectClass,
      classList,
    } = this.props
    setIsAdvancedSearchSelected(false)
    setAdvancedSearchFilter({})
    this.loadClassList()
    selectClass('class', [], classList)
  }

  render() {
    const {
      classList,
      schools,
      courseList,
      selectClass,
      selectedClasses,
      tagList,
      assignedClassesById,
      testType,
      isCoursesLoading,
      isAdvancedSearchSelected,
      setShowAdvanceSearchModal,
    } = this.props
    const { searchTerms, classType, filterClassIds } = this.state
    const tableData = classList
      .filter((item) => {
        if (!filterClassIds.length)
          return classType === 'all' || item.type === classType
        return filterClassIds.includes(item._id)
      })
      .map((item) => convertTableData(item))

    const changeField = curry(this.changeFilter)

    const rowSelection = {
      selectedRowKeys: selectedClasses,
      hideDefaultSelections: true,
      onSelect: (_, __, selectedRows) => {
        if (selectClass) {
          const selectedClassIds = selectedRows.map((item) => item.key)
          selectClass('class', selectedClassIds, classList)
          if (filterClassIds.length)
            this.setState({ filterClassIds: selectedClassIds })
        }
      },
      onSelectAll: this.handleSelectAll,
      getCheckboxProps: (record) => {
        if (record && record.key && assignedClassesById[testType][record.key]) {
          return {
            disabled: true,
          }
        }
      },
    }

    const selectableClassList = classList?.filter(
      ({ _id }) => !Object.keys(assignedClassesById[testType]).includes(_id)
    )
    const totalSchoolsCount =
      uniq(
        selectableClassList
          ?.map(({ institutionId }) => institutionId)
          ?.filter((i) => !!i)
      )?.length || 0

    const totalStudentsCount =
      selectableClassList?.reduce(
        (acc, curr) => acc + (curr.studentCount || 0),
        0
      ) || 0

    const selectedClassData = classList?.filter(({ _id }) =>
      selectedClasses.includes(_id)
    )
    const schoolsCount =
      uniq(
        selectedClassData
          ?.map(({ institutionId }) => institutionId)
          ?.filter((i) => !!i)
      )?.length || 0
    const classesCount =
      selectedClassData?.filter(
        ({ type }) => classType === 'all' || type === classType
      )?.length || 0
    const studentsCount =
      selectedClassData?.reduce(
        (acc, curr) => acc + (curr.studentCount || 0),
        0
      ) || 0

    const columns = [
      {
        title: 'CLASS NAME',
        width: '25%',
        dataIndex: 'className',
        key: 'className',
        sorter: (a, b) => a.className.localeCompare(b.className),
        sortDirections: ['descend', 'ascend'],
        render: (className, row) => (
          <div>
            {row.type === 'custom' ? (
              <IconGroup
                width={20}
                height={19}
                margin="0 10px 0 0px"
                color={lightGrey10}
              />
            ) : (
              <IconClass
                width={13}
                height={14}
                margin="0 10px 0 0px"
                color={lightGrey10}
              />
            )}
            <span data-cy="className">{className}</span>
            <Tags
              data-cy="tags"
              tags={row.tags}
              show={1}
              key="tags"
              isGrayTags
            />
          </div>
        ),
      },
      {
        title: 'TEACHER',
        width: '25%',
        dataIndex: 'teacher',
        key: 'teacher',
        sorter: (a, b) => a.teacher.localeCompare(b.teacher),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'SUBJECT',
        width: '25%',
        key: 'subject',
        dataIndex: 'subject',
        sorter: (a, b) => a.subject.localeCompare(b.subject),
        sortDirections: ['descend', 'ascend'],
      },
      {
        title: 'GRADES',
        width: '15%',
        key: 'grades',
        dataIndex: 'grades',
        sorter: (a, b) => `${a.grades}`.localeCompare(`${b.grades}`),
        sortDirections: ['descend', 'ascend'],
      },
    ]

    return (
      <ClassListContainer>
        <ClassListFilter>
          <StyledRowLabel>
            <div>School </div>
            <SelectInputStyled
              disabled={isAdvancedSearchSelected}
              data-cy="schoolSelect"
              mode="multiple"
              placeholder="All School"
              showSearch
              filterOption={(input, option) =>
                option.props?.children
                  ?.toLowerCase()
                  ?.indexOf(input.toLowerCase()) >= 0
              }
              onChange={changeField('institutionIds')}
              value={searchTerms.institutionIds}
              tagsEllipsis
            >
              {schools.map(({ _id, name }) => (
                <Select.Option key={_id} value={_id}>
                  {name}
                </Select.Option>
              ))}
            </SelectInputStyled>
          </StyledRowLabel>

          <StyledRowLabel>
            Grades
            <SelectInputStyled
              disabled={isAdvancedSearchSelected}
              mode="multiple"
              value={searchTerms.grades}
              placeholder="All grades"
              onChange={changeField('grades')}
              showSearch
              filterOption={(input, option) =>
                option.props?.children
                  ?.toLowerCase()
                  ?.indexOf(input.toLowerCase()) >= 0
              }
              data-cy="class-grades-filter"
            >
              {allGrades.map(
                ({ value, text, isContentGrade }) =>
                  !isContentGrade && (
                    <Select.Option key={value} value={value}>
                      {text}
                    </Select.Option>
                  )
              )}
            </SelectInputStyled>
          </StyledRowLabel>

          <StyledRowLabel>
            Subject
            <SelectInputStyled
              disabled={isAdvancedSearchSelected}
              mode="multiple"
              value={searchTerms.subjects}
              placeholder="All subjects"
              onChange={changeField('subjects')}
              showSearch
              filterOption={(input, option) =>
                option.props?.children
                  ?.toLowerCase()
                  ?.indexOf(input.toLowerCase()) >= 0
              }
              data-cy="class-subject-filter"
            >
              {allSubjects.map(({ value, text }) => (
                <Select.Option key={value} value={value}>
                  {text}
                </Select.Option>
              ))}
            </SelectInputStyled>
          </StyledRowLabel>

          <StyledRowLabel>
            Course
            <SelectInputStyled
              disabled={isAdvancedSearchSelected}
              data-cy="selectCourses"
              mode="multiple"
              placeholder="All Course"
              onChange={changeField('courseIds')}
              autoClearSearchValue={false}
              showSearch
              tagsEllipsis
              onSearch={this.handleCourseSearch}
              onFocus={() => this.handleCourseSearch('')}
              filterOption={false}
              defaultActiveFirstOption={false}
              loading={isCoursesLoading}
            >
              {courseList.map(({ _id, name }) => (
                <Select.Option key={_id} value={_id}>
                  {name}
                </Select.Option>
              ))}
            </SelectInputStyled>
          </StyledRowLabel>

          <StyledRowLabel>
            Show Class/Groups
            <SelectInputStyled
              data-cy="showClassGroup"
              placeholder="All"
              onChange={this.handleClassTypeFilter}
              showSearch
              value={classType}
              disabled={filterClassIds.length || isAdvancedSearchSelected}
              filterOption={(input, option) =>
                option.props?.children
                  ?.toLowerCase()
                  ?.indexOf(input.toLowerCase()) >= 0
              }
            >
              {[
                { name: 'All', value: 'all' },
                { name: 'Classes', value: 'class' },
                { name: 'Student Groups', value: 'custom' },
              ].map(({ name, value }) => (
                <Select.Option key={name} value={value}>
                  {name}
                </Select.Option>
              ))}
            </SelectInputStyled>
          </StyledRowLabel>

          <StyledRowLabel>
            Search Class/Groups
            <SelectInputStyled
              disabled={isAdvancedSearchSelected}
              placeholder="Search by name of class or group"
              onChange={this.handleClassSelectFromDropDown}
              mode="multiple"
              showSearch
              filterOption={(input, option) =>
                option.props?.children
                  ?.toLowerCase()
                  ?.indexOf(input.toLowerCase()) >= 0
              }
              value={filterClassIds}
              data-cy="selectClass"
              tagsEllipsis
            >
              {classList.map(({ name, _id }) => (
                <Select.Option
                  key={name}
                  value={_id}
                  disabled={assignedClassesById[testType][_id]}
                >
                  {name}
                </Select.Option>
              ))}
            </SelectInputStyled>
          </StyledRowLabel>

          <StyledRowLabel>
            Tags
            <SelectInputStyled
              disabled={isAdvancedSearchSelected}
              mode="multiple"
              data-cy="tagSelect"
              value={searchTerms.tags}
              placeholder="All Tags"
              onChange={changeField('tags')}
              showSearch
              filterOption={(input, option) =>
                option.props?.children
                  ?.toLowerCase()
                  ?.indexOf(input.toLowerCase()) >= 0
              }
            >
              {tagList.map(({ _id, tagName }) => (
                <Select.Option key={_id} value={_id}>
                  {tagName}
                </Select.Option>
              ))}
            </SelectInputStyled>
          </StyledRowLabel>
        </ClassListFilter>

        <TableContainer>
          <EduIf condition={isAdvancedSearchSelected}>
            <AdvancedSearchTagContainer>
              <AdvancedSearchTag
                onClick={() => {
                  setShowAdvanceSearchModal(true)
                }}
                data-cy="advancedSearchTag"
              >
                ADVANCED SEARCH
              </AdvancedSearchTag>
              <IconClose
                height={7}
                width={7}
                style={{ cursor: 'pointer' }}
                onClick={this.removeAdvanceSearch}
                color={tagTextColor}
                data-cy="advancedSearchTagRemoveButton"
              />
            </AdvancedSearchTagContainer>
          </EduIf>
          <InfoSection>
            <div data-cy="schoolSearchInfo">
              <span>School(s)</span>
              <span>
                <span>{schoolsCount}/</span>
                <span>{totalSchoolsCount}</span>
              </span>
            </div>
            <div data-cy="classSearchInfo">
              <span>Class(es)</span>
              <span>
                <span>{classesCount}/</span>
                <span>{selectableClassList.length}</span>
              </span>
            </div>
            <div data-cy="studentSearchInfo">
              <span>Student(s)</span>
              <span>
                <span>{studentsCount}/</span>
                <span>{totalStudentsCount}</span>
              </span>
            </div>
          </InfoSection>
          <StyledTable
            rowSelection={rowSelection}
            columns={columns}
            dataSource={tableData}
            pagination={{ pageSize: 20 }}
          />
        </TableContainer>
      </ClassListContainer>
    )
  }
}

const enhance = compose(
  withRouter,
  connect(
    (state) => ({
      termsData: get(state, 'user.user.orgData.terms', []),
      classList: getClassListSelector(state),
      userOrgId: getUserOrgId(state),
      schools: getSchoolsByUserRoleSelector(state),
      courseList: getAggregateCourseListSelector(state),
      test: getTestSelector(state),
      tagList: getAllTagsSelector(state, 'group'),
      assignedClassesById: getAssignedClassesByIdSelector(state),
      isCoursesLoading: getCourseLoadingState(state),
      isAdvancedSearchSelected: getIsAdvancedSearchSelectedSelector(state),
      isAllClassSelected: getIsAllClassSelectedSelector(state),
    }),
    {
      loadClassListData: receiveClassListAction,
      loadSchoolsData: receiveSchoolsAction,
      loadCourseListData: receiveCourseListAction,
      getAllTags: getAllTagsAction,
      setSearchTermsFilter: setSearchTermsFilterAction,
      setIsAllClassSelected: setIsAllClassSelectedAction,
      setIsAdvancedSearchSelected: setIsAdvancedSearchSelectedAction,
      setAdvancedSearchFilter: setAdvancedSearchFilterAction,
    }
  )
)

export default enhance(ClassList)
