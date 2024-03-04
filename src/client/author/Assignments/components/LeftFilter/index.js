import { lightGrey10 } from '@edulastic/colors'
import { FieldLabel, SelectInputStyled } from '@edulastic/common'
import { IconGroup, IconClass } from '@edulastic/icons'
import { roleuser, folderTypes } from '@edulastic/constants'
import { faArchive } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Select } from 'antd'
import { get, identity, pickBy } from 'lodash'
import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'
import {
  receiveAssignmentsAction,
  receiveAssignmentsSummaryAction,
} from '../../../src/actions/assignments'
import {
  getAssignmentTeacherList,
  getAssignmentTestList,
  getAssignmentTestsSelector,
} from '../../../src/selectors/assignments'
import {
  getGroupList,
  getUserRole,
  getCurrentTerm,
  getUserOrgId,
  isPremiumUserSelector,
} from '../../../src/selectors/user'
import selectsData from '../../../TestPage/components/common/selectsData'
import { FilterContainer } from './styled'
import Folders from '../../../src/components/Folders'
import { setItemsMoveFolderAction } from '../../../src/actions/folder'
import TagFilter from '../../../src/components/common/TagFilter'
import {
  getAllTestTypesMap,
  getNonPremiumTestTypes,
} from '../../../../common/utils/testTypeUtils'
import { shortTestIdKeyLength } from '../../constants'

const { allGrades, allSubjects } = selectsData

export const AssignmentStatus = {
  NOT_OPEN: 'NOT OPEN',
  IN_PROGRESS: 'IN PROGRESS',
  IN_GRADING: 'IN GRADING',
  DONE: 'DONE',
}

class LeftFilter extends React.Component {
  handleChange = (key) => (value) => {
    const {
      loadAssignments,
      onSetFilter,
      filterState,
      isAdvancedView,
      districtId,
      loadAssignmentsSummary,
    } = this.props
    let _value = value
    if (key === 'tags') {
      _value = value.map(({ _id }) => _id)
    }
    let filters = { ...filterState, [key]: _value }

    if (!isAdvancedView) {
      if (key === 'tags') {
        filters = { ...filters, pageNo: 1, testId: '' }
      }
      if (key === 'termId') {
        filters.classId = ''
      }
      loadAssignments({ filters, folderId: filters.folderId })
    } else {
      if (!['testId', 'assignedBy', 'tags'].includes(key)) {
        filters = { ...filters, pageNo: 1, assignedBy: '', testId: '' }
      } else if (key !== 'testId') {
        filters = { ...filters, pageNo: 1, testId: '' }
      } else {
        filters = { ...filters, pageNo: 1 }
      }
      loadAssignmentsSummary({
        folderId: filters.folderId,
        districtId,
        filters: pickBy(filters, identity),
        filtering: true,
      })
    }
    onSetFilter(filters)
  }

  handleSelectFolder = async (folderId) => {
    const {
      filterState,
      districtId,
      loadAssignmentsSummary,
      loadAssignments,
      isAdvancedView,
      onSetFilter,
      currentTerm,
    } = this.props
    const filters = folderId
      ? { ...filterState, folderId }
      : { ...filterState, termId: currentTerm, folderId: '' }

    if (isAdvancedView) {
      loadAssignmentsSummary({
        districtId,
        filters: pickBy(filters, identity),
        filtering: true,
        folderId,
      })
    } else if (folderId) {
      loadAssignments({
        filters,
        folderId,
      })
    } else {
      loadAssignments({
        filters,
      })
    }

    onSetFilter(filters)
  }

  deselectItemsFolder = () => {
    const { setItemsToFolder } = this.props
    setItemsToFolder([])
  }

  render() {
    const {
      termsData,
      filterState,
      userRole,
      classList,
      teacherList,
      assignmentTestList = [],
      isAdvancedView,
      teacherTestList = [],
      isPremiumUser,
    } = this.props
    const {
      subject,
      grades,
      termId,
      testTypes,
      classId,
      status,
      testId,
      assignedBy,
      tags = [],
      folderId = '',
    } = filterState
    const testTypeOptions = isPremiumUser
      ? getAllTestTypesMap()
      : getNonPremiumTestTypes()
    const classListByTerm = classList.filter(
      (item) => item.termId === termId || !termId
    )
    const classListActive = classListByTerm.filter((item) => item.active === 1)
    const classListArchive = classListByTerm.filter((item) => item.active === 0)

    return (
      <FilterContainer>
        <FieldLabel>Class Grade</FieldLabel>
        <SelectInputStyled
          showArrow
          data-cy="grades"
          mode="multiple"
          placeholder="All grades"
          value={grades}
          onChange={this.handleChange('grades')}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          margin="0px 0px 15px"
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

        <FieldLabel>Class Subject</FieldLabel>
        <SelectInputStyled
          data-cy="subjects"
          mode="default"
          placeholder="All subjects"
          value={subject}
          onChange={this.handleChange('subject')}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          margin="0px 0px 15px"
        >
          <Select.Option key="all" value="">
            All subjects
          </Select.Option>
          {allSubjects.map(({ value, text }) => (
            <Select.Option key={value} value={value}>
              {text}
            </Select.Option>
          ))}
        </SelectInputStyled>

        {termId && (
          <>
            <FieldLabel>Year</FieldLabel>
            <SelectInputStyled
              data-cy="schoolYear"
              mode="default"
              value={termId}
              onChange={this.handleChange('termId')}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              margin="0px 0px 15px"
            >
              {termsData.map(({ _id, name }) => (
                <Select.Option key={_id} value={_id}>
                  {name}
                </Select.Option>
              ))}
            </SelectInputStyled>
          </>
        )}

        <FieldLabel>Test Type</FieldLabel>
        <SelectInputStyled
          showArrow
          data-cy="filter-testType"
          mode="multiple"
          placeholder="All"
          value={testTypes}
          onChange={this.handleChange('testTypes')}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          margin="0px 0px 15px"
        >
          {Object.keys(testTypeOptions).map((key) => (
            <Select.Option key={key} value={key}>
              {testTypeOptions[key]}
            </Select.Option>
          ))}
        </SelectInputStyled>

        {roleuser.DA_SA_ROLE_ARRAY.includes(userRole) && (
          <>
            <FieldLabel>Teachers</FieldLabel>
            <SelectInputStyled
              data-cy="filter-teachers"
              mode="default"
              showSearch
              placeholder="All Teacher(s)"
              value={assignedBy}
              onChange={this.handleChange('assignedBy')}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              filterOption={(input, option) =>
                option.props.children
                  .toLowerCase()
                  .indexOf(input.toLowerCase()) >= 0
              }
              margin="0px 0px 15px"
            >
              <Select.Option key="" value="">
                All Teacher(s)
              </Select.Option>
              {teacherList?.map(({ _id, name }, index) => (
                <Select.Option key={index} value={_id}>
                  {name}
                </Select.Option>
              ))}
            </SelectInputStyled>
          </>
        )}

        {userRole === 'teacher' && (
          <>
            <FieldLabel>Class</FieldLabel>
            <SelectInputStyled
              data-cy="filter-class"
              showSearch
              optionFilterProp="children"
              mode="default"
              placeholder="All"
              value={classId}
              onChange={this.handleChange('classId')}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              margin="0px 0px 15px"
            >
              <Select.Option key="all" value="">
                All classes
              </Select.Option>
              {classListActive.map((item) => (
                <Select.Option key={item._id} value={item._id}>
                  {item.type === 'custom' ? (
                    <IconGroup
                      width={20}
                      height={19}
                      margin="0 10px -5px 0px"
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
                  {item.name}
                </Select.Option>
              ))}
              {classListArchive.map((item) => (
                <Select.Option key={item._id} value={item._id}>
                  <span style={{ marginRight: '15px' }}>
                    {item.type === 'custom' ? (
                      <IconGroup
                        width={20}
                        height={19}
                        margin="0 10px -5px 0px"
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
                    {item.name}
                  </span>
                  <FontAwesomeIcon icon={faArchive} />
                </Select.Option>
              ))}
            </SelectInputStyled>

            <FieldLabel>Status</FieldLabel>
            <SelectInputStyled
              data-cy="filter-status"
              showSearch
              optionFilterProp="children"
              mode="default"
              placeholder="Select status"
              value={status}
              onChange={this.handleChange('status')}
              getPopupContainer={(triggerNode) => triggerNode.parentNode}
              margin="0px 0px 15px"
            >
              <Select.Option key="all" value="">
                Select Status
              </Select.Option>
              {Object.keys(AssignmentStatus).map((_status) => (
                <Select.Option key={_status} value={AssignmentStatus[_status]}>
                  {AssignmentStatus[_status]}
                </Select.Option>
              ))}
            </SelectInputStyled>
          </>
        )}

        <FieldLabel>Tags</FieldLabel>
        <TagFilter
          margin="0px 0px 15px"
          onChangeField={(type, value) => this.handleChange(type)(value)}
          selectedTagIds={tags}
        />

        <FieldLabel>Test Name / Id</FieldLabel>
        <SelectInputStyled
          data-cy="filter-test-name"
          mode="default"
          showSearch
          placeholder="All Tests"
          value={testId}
          onChange={this.handleChange('testId')}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          filterOption={(input, option) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
              0 ||
            option.props.value
              .slice(-shortTestIdKeyLength)
              .includes(input.toLowerCase())
          }
          margin="0px 0px 15px"
        >
          <Select.Option key={0} value="">
            All Tests
          </Select.Option>
          {roleuser.DA_SA_ROLE_ARRAY.includes(userRole) &&
            assignmentTestList?.map(({ testId: _id, title }, index) => (
              <Select.Option
                title={`${title} (Id: ${_id.slice(-shortTestIdKeyLength)})`}
                key={index}
                value={_id}
              >
                {title}
              </Select.Option>
            ))}
          {userRole === roleuser.TEACHER &&
            teacherTestList.map(({ _id, title }, index) => (
              <Select.Option
                title={`${title} (Id: ${_id.slice(-shortTestIdKeyLength)})`}
                key={index}
                value={_id}
              >
                {title}
              </Select.Option>
            ))}
        </SelectInputStyled>

        <Folders
          showAllItems
          removeItemFromCart={this.deselectItemsFolder}
          isAdvancedView={isAdvancedView}
          onSelectFolder={this.handleSelectFolder}
          folderType={folderTypes.ASSIGNMENT}
          selectedFolderId={folderId}
        />
      </FilterContainer>
    )
  }
}

LeftFilter.propTypes = {
  loadAssignments: PropTypes.func.isRequired,
  loadAssignmentsSummary: PropTypes.func.isRequired,
  districtId: PropTypes.string.isRequired,
  onSetFilter: PropTypes.func.isRequired,
  termsData: PropTypes.array,
  isAdvancedView: PropTypes.bool,
  filterState: PropTypes.object,
}

LeftFilter.defaultProps = {
  filterState: {},
  termsData: [],
  isAdvancedView: false,
}

export default connect(
  (state) => ({
    districtId: getUserOrgId(state),
    termsData: get(state, 'user.user.orgData.terms', []),
    userRole: getUserRole(state),
    classList: getGroupList(state),
    teacherList: getAssignmentTeacherList(state),
    assignmentTestList: getAssignmentTestList(state),
    teacherTestList: getAssignmentTestsSelector(state),
    currentTerm: getCurrentTerm(state),
    isPremiumUser: isPremiumUserSelector(state),
  }),
  {
    setItemsToFolder: setItemsMoveFolderAction,
    loadAssignments: receiveAssignmentsAction,
    loadAssignmentsSummary: receiveAssignmentsSummaryAction,
  }
)(LeftFilter)
