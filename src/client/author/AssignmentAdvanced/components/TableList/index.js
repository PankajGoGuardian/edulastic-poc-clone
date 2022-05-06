import React, { useState, useMemo, useEffect } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { groupBy } from 'lodash'
import { Tooltip, Dropdown } from 'antd'
import { Link, withRouter } from 'react-router-dom'
import { withNamespaces } from '@edulastic/localization'
import { test, roleuser } from '@edulastic/constants'
import { EduButton, notification } from '@edulastic/common'
import {
  IconMoreHorizontal,
  IconPresentation,
  IconAddItem,
  IconPieChartIcon,
  IconHourGlass,
} from '@edulastic/icons'
import { greyThemeLight } from '@edulastic/colors'
import ReleaseScoreSettingsModal from '../../../Assignments/components/ReleaseScoreSettingsModal/ReleaseScoreSettingsModal'
import { DeleteAssignmentModal } from '../../../Assignments/components/DeleteAssignmentModal/deleteAssignmentModal'
import {
  Container,
  TableData,
  TypeIcon,
  BtnStatus,
  ActionsWrapper,
  BulkActionsWrapper,
  BulkActionsButtonContainer,
  MoreOption,
  AssessmentTypeWrapper,
  ClassNameCell,
} from './styled'
import { Container as MoreOptionsContainer } from '../../../Assignments/components/ActionMenu/styled'
import { TimedTestIndicator } from '../../../Assignments/components/TableList/styled'
import { getIsProxiedByEAAccountSelector } from '../../../../student/Login/ducks'

export const testTypeToolTip = {
  assessment: 'Class Assessment',
  'common assessment': 'Common Assessment',
  practice: 'Practice Assessment',
}

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
    render: (text = test.type.ASSESSMENT, row) => (
      <AssessmentTypeWrapper>
        <Tooltip placement="bottom" title={testTypeToolTip[text]}>
          <TypeIcon type={text.charAt(0)}>{text.charAt(0)}</TypeIcon>
        </Tooltip>
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
        <Tooltip placement="bottom" title="Express Grader">
          <Link to={`/author/expressgrader/${row.assignmentId}/${row.classId}`}>
            <IconAddItem data-cy="expressGrader" alt="Images" />
          </Link>
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
}) => {
  const [selectedRows, setSelectedRows] = useState([])
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
  })
  const rowData = useMemo(
    () => classList.map((data, index) => convertRowData(data, index)),
    [classList]
  )

  /**
   * Here we are resetting the selected rows to unselect whenever thre is a change in rows.
   * Change in row can occur when we filter the rows based on status of the row.
   */
  useEffect(() => {
    setSelectedRows([])
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
      setSelectedRows(rowData.map(({ key }) => key))
    } else {
      setSelectedRows([])
    }
  }

  const rowSelection = {
    selectedRowKeys: selectedRows.map((key) => key),
    onSelect: (_, __, selectedRowz) => {
      setSelectedRows(selectedRowz.map(({ key }) => key))
    },
    onSelectAll: handleSelectAll,
  }

  const handleBulkAction = (type, releaseScoreResponse) => {
    if (bulkActionStatus) {
      return notification({
        msg:
          'The test is being updated by another user, please wait for a few minutes and try again.',
      })
    }
    let selectedRowsGroupByAssignment = {}
    if (rowData.length > selectedRows.length) {
      const selectedRowsData = rowData.filter((_, i) =>
        selectedRows.includes(i)
      )
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
      <MoreOption onClick={() => setReleaseScoreModalVisibility(true)}>
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
            onClick={() => handleBulkAction('downloadGrades')}
            disabled={isProxiedByEAAccount}
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
            onClick={() => handleBulkAction('downloadResponses')}
            disabled={isProxiedByEAAccount}
          >
            Download Responses
          </MoreOption>
        </div>
      </Tooltip>
      <MoreOption onClick={() => toggleDeleteAssignmentModal(true)}>
        Unassign
      </MoreOption>
    </MoreOptionsContainer>
  )

  const renderBulkActions = () => (
    <BulkActionsWrapper>
      <div>
        <span data-cy="totalSelected">
          {rowData.length > selectedRows.length
            ? selectedRows.length
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
      </BulkActionsButtonContainer>
    </BulkActionsWrapper>
  )

  return (
    <Container>
      {selectedRows.length > 0 && renderBulkActions()}
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
  }))
)

export default enhance(TableList)
