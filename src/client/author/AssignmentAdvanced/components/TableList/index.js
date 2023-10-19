import React, { useState, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { groupBy } from 'lodash'
import { Tooltip, Dropdown } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import { withNamespaces } from '@edulastic/localization'
import {
  testTypes as testTypesConstants,
  test as testConst,
  roleuser,
} from '@edulastic/constants'
import { EduButton, notification, TestTypeIcon, EduIf } from '@edulastic/common'
import {
  IconMoreHorizontal,
  IconPresentation,
  IconAddItem,
  IconPieChartIcon,
  IconHourGlass,
  IconInfo,
} from '@edulastic/icons'
import { greyThemeLight, lightGreen4, green } from '@edulastic/colors'
import ReleaseScoreSettingsModal from '../../../Assignments/components/ReleaseScoreSettingsModal/ReleaseScoreSettingsModal'
import { DeleteAssignmentModal } from '../../../Assignments/components/DeleteAssignmentModal/deleteAssignmentModal'
import {
  Container,
  TableData,
  BtnStatus,
  ActionsWrapper,
  BulkActionsWrapper,
  BulkActionsButtonContainer,
  MoreOption,
  AssessmentTypeWrapper,
  ClassNameCell,
  StyledLink,
} from './styled'
import { InfoMessage } from '../../../../common/styled'
import { Container as MoreOptionsContainer } from '../../../Assignments/components/ActionMenu/styled'
import { TimedTestIndicator } from '../../../Assignments/components/TableList/styled'
import { getIsProxiedByEAAccountSelector } from '../../../../student/Login/ducks'
import { getAllTestTypesMap } from '../../../../common/utils/testTypeUtils'
import { getHasRandomQuestionselector } from '../../../src/selectors/assignments'

const { ATTEMPT_WINDOW_TYPE } = testConst

export const testTypeToolTip = getAllTestTypesMap()

const missingSelectionTostMessage = 'Please select atleast one class'

const columns = [
  {
    title: 'Class',
    dataIndex: 'class',
    sortDirections: ['descend', 'ascend'],
    sorter: (a, b) =>
      a.class.localeCompare(b.class, 'en', { ignorePunctuation: true }),
    width: '30%',
    align: 'left',
    render: (text, { teacherName, institutionName }) => (
      <ClassNameCell>
        <span data-cy={text}>{text}</span>
        <span className="schoolName">
          {teacherName}
          {institutionName ? ` / ${institutionName}` : ''}
        </span>
      </ClassNameCell>
    ),
  },
  {
    title: 'Type',
    dataIndex: 'type',
    sortDirections: ['descend', 'ascend'],
    sorter: (a, b) =>
      a.type.localeCompare(b.type, 'en', { ignorePunctuation: true }),
    width: '6%',
    render: (
      text = testTypesConstants.TEST_TYPES_VALUES_MAP.ASSESSMENT,
      row
    ) => (
      <AssessmentTypeWrapper>
        <TestTypeIcon
          toolTipTitle={testTypeToolTip[text]}
          toolTipPlacement="bottom"
          testType={text}
        />
        {row.timedAssignment && (
          <Tooltip
            placement="right"
            title={
              <span> Time Limit: {row.allowedTime / (60 * 1000)} min</span>
            }
          >
            <TimedTestIndicator data-cy="type" type="p">
              <IconHourGlass color={greyThemeLight} />
            </TimedTestIndicator>
          </Tooltip>
        )}
      </AssessmentTypeWrapper>
    ),
  },
  {
    title: 'Assigned by',
    dataIndex: 'assigned',
    sortDirections: ['descend', 'ascend'],
    sorter: (a, b) =>
      a.assigned.localeCompare(b.assigned, 'en', { ignorePunctuation: true }),
    width: '20%',
    render: (text) => <div> {text} </div>,
  },
  {
    title: 'Status',
    dataIndex: 'status',
    sortDirections: ['descend', 'ascend'],
    sorter: (a, b) =>
      a.status.localeCompare(b.status, 'en', { ignorePunctuation: true }),
    width: '10%',
    render: (text) => (text ? <BtnStatus status={text}>{text}</BtnStatus> : ''),
  },
  {
    title: 'Submitted',
    dataIndex: 'submitted',
    sortDirections: ['descend', 'ascend'],
    sorter: (a, b) =>
      parseInt(a.submitted.split('/')[0], 10) -
      parseInt(b.submitted.split('/')[0], 10),
    width: '8%',
    render: (text) => <div> {text} </div>,
  },
  {
    title: 'Graded',
    dataIndex: 'graded',
    sortDirections: ['descend', 'ascend'],
    sorter: (a, b) => a.graded - b.graded,
    width: '8%',
    render: (text) => <div> {text} </div>,
  },
  {
    title: '',
    dataIndex: 'action',
    width: '8%',
    render: (_, row) => (
      <ActionsWrapper
        data-cy="PresentationIcon"
        onClick={(e) => e.stopPropagation()}
      >
        <Tooltip placement="bottom" title="Live Class Board">
          <Link to={`/author/classboard/${row.assignmentId}/${row.classId}`}>
            <IconPresentation data-cy="lcb" alt="Images" />
          </Link>
        </Tooltip>
        <Tooltip
          placement="bottom"
          title={
            row.hasRandomQuestions
              ? row.t('common.randomItemsDisableMessage')
              : 'Express Grader'
          }
        >
          <StyledLink
            disabled={row.hasRandomQuestions}
            onClick={() =>
              row.hasRandomQuestions
                ? notification({
                    type: 'warn',
                    msg: row.t('common.randomItemsDisableMessage'),
                  })
                : row.history.push(
                    `/author/expressgrader/${row.assignmentId}/${row.classId}`
                  )
            }
          >
            <IconAddItem data-cy="expressGrader" alt="Images" />
          </StyledLink>
        </Tooltip>
        <Tooltip placement="bottom" title="Reports">
          <Link
            to={`/author/standardsBasedReport/${row.assignmentId}/${row.classId}`}
          >
            <IconPieChartIcon data-cy="reports" alt="Images" />
          </Link>
        </Tooltip>
      </ActionsWrapper>
    ),
  },
]
const TableList = ({
  classList = [],
  bulkOpenAssignmentRequest,
  bulkCloseAssignmentRequest,
  bulkPauseAssignmentRequest,
  bulkMarkAsDoneAssignmentRequest,
  bulkReleaseScoreAssignmentRequest,
  bulkUnassignAssignmentRequest,
  bulkDownloadGradesAndResponsesRequest,
  testType,
  testName,
  toggleDeleteAssignmentModal,
  isLoadingAssignments,
  bulkActionStatus,
  isHeaderAction,
  history,
  userSchoolsList = [],
  userRole,
  pageNo,
  totalAssignmentsClasses,
  handlePagination,
  filterStatus,
  isProxiedByEAAccount,
  hasRandomQuestions = false,
  t,
  totalSelectedRowData = [],
  handleSelectedRows,
}) => {
  const [selectedAllRows, setSelectedAllRows] = useState(false)
  const [showReleaseScoreModal, setReleaseScoreModalVisibility] = useState(
    false
  )
  let showSchoolName = true
  if (userRole === roleuser.SCHOOL_ADMIN && userSchoolsList.length < 2) {
    showSchoolName = false
  }
  const convertRowData = (data, index) => ({
    class: data.name,
    type: data.testType,
    status:
      data.isPaused && data.status !== 'DONE'
        ? `${data.status} (PAUSED)`
        : data.status,
    assigned: data.assignedBy.name,
    submitted: `${data.inGradingNumber + data.gradedNumber}/${
      data.assignedCount
    }`,
    graded: data.gradedNumber,
    action: '',
    assignmentId: data.assignmentId,
    classId: data._id,
    key: index,
    timedAssignment: data.timedAssignment,
    allowedTime: data.allowedTime,
    institutionName: showSchoolName ? data.institutionName : false,
    teacherName: data.teacherName || '',
    history,
    hasRandomQuestions,
    t,
  })
  const rowData = useMemo(
    () => classList.map((data, index) => convertRowData(data, index)),
    [classList]
  )

  const attemptWindowNotification = useMemo(() => {
    if (!classList || classList.length === 0) return ''

    const classListAttemptWindow = classList.filter((c) => {
      return c.attemptWindow
    })

    if (classListAttemptWindow.length === 0) {
      const attemptWindow = classList[0].defaultAttemptWindow
      if (!attemptWindow) return ''

      let start
      let end
      if (attemptWindow.startTime) start = attemptWindow.startTime
      if (attemptWindow.endTime) end = attemptWindow.endTime

      if (attemptWindow.type === ATTEMPT_WINDOW_TYPE.DEFAULT) return ''

      const text = `Student can attempt between `
      const res =
        attemptWindow.type === ATTEMPT_WINDOW_TYPE.WEEKDAYS
          ? text.concat(`Weekdays (Mon to Fri) ${start} to ${end}`)
          : text.concat(
              `${start} to ${end} on ${attemptWindow.days.join(', ')}`
            )
      return res
    }

    return 'Please refer to Live Class Board for student attempt window details'
  }, [classList])

  /**
   * Here we are resetting the selected rows to unselect whenever thre is a change in rows.
   * Change in row can occur when we filter the rows based on status of the row.
   */

  const getSelectedRowsInCurrentPage = (
    currentPageData,
    totalData,
    field1,
    field2
  ) => {
    return (
      currentPageData.filter((currentItem) =>
        totalData.some(
          (selected) =>
            currentItem[field1] === selected[field1] &&
            currentItem[field2] === selected[field2]
        )
      ) || []
    ).map(({ key }) => key)
  }
  const selectedRowKeys = useMemo(
    () =>
      getSelectedRowsInCurrentPage(
        rowData,
        totalSelectedRowData,
        'classId',
        'assignmentId'
      ),
    [totalSelectedRowData, rowData]
  )
  useEffect(() => {
    setSelectedAllRows(false)
  }, [rowData])

  let showPagination = false
  if (totalAssignmentsClasses > 100) {
    showPagination = {
      pageSize: 100,
      total: totalAssignmentsClasses || 0,
      current: pageNo || 1,
    }
  }

  const handleSelectAll = (selected) => {
    if (selected) {
      handleSelectedRows(rowData, selected)
      setSelectedAllRows(true)
    } else {
      handleSelectedRows([], selected)
      setSelectedAllRows(false)
    }
  }

  const rowSelection = {
    selectedRowKeys,
    onSelect: (record, selected, selectedRowz) => {
      handleSelectedRows(selectedRowz, selected, record)
    },
    onSelectAll: handleSelectAll,
    hideDefaultSelections: true,
    selections: [
      {
        key: 'all-data',
        text: 'Select All Data',
        onSelect: () => {
          handleSelectedRows(rowData, true)
          setSelectedAllRows(true)
        },
      },
      {
        key: 'current-page-data',
        text: 'Current Page Data',
        onSelect: () => {
          handleSelectedRows(rowData)
        },
      },
    ],
  }

  const handleBulkAction = (type, releaseScoreResponse) => {
    if (totalSelectedRowData.length === 0) {
      return notification({
        msg: missingSelectionTostMessage,
      })
    }

    if (bulkActionStatus) {
      return notification({
        msg:
          'The test is being updated by another user, please wait for a few minutes and try again.',
      })
    }
    let selectedRowsGroupByAssignment = {}
    if (!selectedAllRows) {
      const selectedRowsData = totalSelectedRowData
      selectedRowsGroupByAssignment = groupBy(selectedRowsData, 'assignmentId')
      for (const [key, value] of Object.entries(
        selectedRowsGroupByAssignment
      )) {
        const classIds = value.map((d) => d.classId)
        selectedRowsGroupByAssignment[key] = classIds
      }
    }
    const payload = {
      data: selectedRowsGroupByAssignment,
      testId: classList[0].testId,
      testType,
      status: filterStatus,
    }
    if (type === 'open') bulkOpenAssignmentRequest(payload)
    else if (type === 'close') bulkCloseAssignmentRequest(payload)
    else if (type === 'pause') bulkPauseAssignmentRequest(payload)
    else if (type === 'markAsDone') bulkMarkAsDoneAssignmentRequest(payload)
    else if (type === 'releaseScore') {
      payload.data = {
        assignmentGroups: payload.data,
        releaseScore: releaseScoreResponse,
      }
      bulkReleaseScoreAssignmentRequest(payload)
    } else if (type === 'unassign') bulkUnassignAssignmentRequest(payload)
    else {
      payload.testName = testName
      if (type === 'downloadResponses') {
        payload.isResponseRequired = true
      }
      bulkDownloadGradesAndResponsesRequest(payload)
    }
  }

  const onUpdateReleaseScoreSettings = (releaseScoreResponse) => {
    setReleaseScoreModalVisibility(false)
    handleBulkAction('releaseScore', releaseScoreResponse)
  }

  const moreOptions = () => (
    <MoreOptionsContainer>
      <MoreOption
        onClick={() => {
          if (totalSelectedRowData.length === 0) {
            return notification({
              msg: missingSelectionTostMessage,
            })
          }
          setReleaseScoreModalVisibility(true)
        }}
        data-cy="releaseScore"
      >
        Release Score
      </MoreOption>
      <Tooltip
        title={
          isProxiedByEAAccount
            ? 'Bulk action disabled for EA proxy accounts.'
            : ''
        }
        placement="right"
      >
        <div>
          <MoreOption
            onClick={() => {
              if (!isProxiedByEAAccount) handleBulkAction('downloadGrades')
            }}
            disabled={isProxiedByEAAccount}
            data-cy="downloadGrades"
          >
            Download Grades
          </MoreOption>
        </div>
      </Tooltip>
      <Tooltip
        title={
          isProxiedByEAAccount
            ? 'Bulk action disabled for EA proxy accounts.'
            : ''
        }
        placement="right"
      >
        <div>
          <MoreOption
            onClick={() => {
              if (!isProxiedByEAAccount) handleBulkAction('downloadResponses')
            }}
            disabled={isProxiedByEAAccount}
            data-cy="downloadResponses"
          >
            Download Responses
          </MoreOption>
        </div>
      </Tooltip>
      <MoreOption
        onClick={() => {
          if (totalSelectedRowData.length === 0) {
            return notification({
              msg: missingSelectionTostMessage,
            })
          }
          toggleDeleteAssignmentModal(true)
        }}
        data-cy="unassign"
      >
        Unassign
      </MoreOption>
    </MoreOptionsContainer>
  )

  const renderBulkActions = () => (
    <BulkActionsWrapper>
      <div>
        <span data-cy="totalSelected">
          {!selectedAllRows
            ? totalSelectedRowData.length
            : totalAssignmentsClasses}
        </span>
        <span>Class(es) Selected</span>
      </div>
      <BulkActionsButtonContainer>
        <EduButton
          data-cy="openButton"
          height="30px"
          isGhost
          btnType="primary"
          onClick={() => handleBulkAction('open')}
        >
          Open
        </EduButton>
        <EduButton
          data-cy="pauseButton"
          height="30px"
          isGhost
          btnType="primary"
          onClick={() => handleBulkAction('pause')}
        >
          Pause
        </EduButton>
        <EduButton
          data-cy="closeButton"
          height="30px"
          isGhost
          btnType="primary"
          onClick={() => handleBulkAction('close')}
        >
          Close
        </EduButton>
        <EduButton
          data-cy="doneButton"
          height="30px"
          isGhost
          btnType="primary"
          onClick={() => handleBulkAction('markAsDone')}
        >
          Mark as Done
        </EduButton>
        <Dropdown
          overlay={moreOptions()}
          placement="bottomLeft"
          trigger={['hover']}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
        >
          <EduButton
            data-cy="moreButton"
            height="30px"
            isGhost
            btnType="primary"
          >
            <IconMoreHorizontal /> More
          </EduButton>
        </Dropdown>
        <EduIf condition={attemptWindowNotification}>
          <InfoMessage color={lightGreen4} style={{ 'margin-left': '22.5%' }}>
            <IconInfo fill={green} height={10} /> {attemptWindowNotification}
          </InfoMessage>
        </EduIf>
      </BulkActionsButtonContainer>
    </BulkActionsWrapper>
  )

  return (
    <Container>
      {renderBulkActions()}
      <TableData
        columns={columns}
        dataSource={rowData}
        pagination={showPagination}
        onChange={(pagination) => handlePagination(pagination?.current || 1)}
        rowSelection={rowSelection}
        loading={isLoadingAssignments}
        onRow={(row) => ({
          onClick: () =>
            history.push(
              `/author/classboard/${row.assignmentId}/${row.classId}`
            ),
        })}
      />
      <ReleaseScoreSettingsModal
        showReleaseGradeSettings={showReleaseScoreModal}
        onCloseReleaseScoreSettings={() =>
          setReleaseScoreModalVisibility(false)
        }
        updateReleaseScoreSettings={onUpdateReleaseScoreSettings}
      />
      {!isHeaderAction && (
        <DeleteAssignmentModal
          handleUnassignAssignments={() => {
            toggleDeleteAssignmentModal(false)
            handleBulkAction('unassign')
          }}
          advancedAssignments
        />
      )}
    </Container>
  )
}

TableList.propTypes = {
  classList: PropTypes.array.isRequired,
}

const enhance = compose(
  withRouter,
  withNamespaces('assignmentCard'),
  connect((state) => ({
    isProxiedByEAAccount: getIsProxiedByEAAccountSelector(state),
    hasRandomQuestions: getHasRandomQuestionselector(state),
  }))
)

export default enhance(TableList)
