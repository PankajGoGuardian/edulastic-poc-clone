import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { get, isEmpty, uniqBy } from 'lodash'
import { Link, withRouter } from 'react-router-dom'
import { Dropdown, Tooltip, Spin, Menu } from 'antd'
import { withNamespaces } from '@edulastic/localization'
import {
  test as testConstants,
  testTypes as testTypesConstants,
  roleuser,
} from '@edulastic/constants'
import {
  IconPresentation,
  IconAddItem,
  IconPieChartIcon,
  IconHourGlass,
} from '@edulastic/icons'

import {
  FlexContainer,
  withWindowSizes,
  EduButton,
  CheckboxLabel,
  TestTypeIcon,
} from '@edulastic/common'
import { greyThemeDark3 } from '@edulastic/colors'
import {
  TEST_TYPES_VALUES_MAP,
  TEST_TYPE_LABELS,
} from '@edulastic/constants/const/testTypes'

import arrowUpIcon from '../../assets/arrow-up.svg'
import ActionMenu from '../ActionMenu/ActionMenu'
import AnalyzeLink from '../AnalyzeLink/AnalyzeLink'
import {
  getItemsInFolders,
  getSelectedItems,
} from '../../../src/selectors/folder'
import FeaturesSwitch from '../../../../features/components/FeaturesSwitch'

import {
  toggleRemoveItemsFolderAction,
  toggleMoveItemsFolderAction,
  setItemsMoveFolderAction,
} from '../../../src/actions/folder'

import {
  Container,
  TableData,
  TestThumbnail,
  AssignmentTD,
  IconArrowDown,
  ExpandDivdier,
  StatusLabel,
  ActionDiv,
  GreyFont,
  ExpandedTable,
  ActionsWrapper,
  TitleCase,
  TimedTestIndicator,
  TypeWrapper,
  IndicatorText,
} from './styled'
import NoDataNotification from '../../../../common/components/NoDataNotification'
import WithDisableMessage from '../../../src/components/common/ToggleDisable'
import {
  getUserIdSelector,
  getUserRole,
  getGroupList,
  isPremiumUserSelector,
} from '../../../src/selectors/user'
import { getAssignmentTestsSelector } from '../../../src/selectors/assignments'
import { canEditTest, assignmentStatus } from '../../utils'
import { bulkDownloadGradesAndResponsesAction } from '../../../AssignmentAdvanced/ducks'
import {
  getIsProxiedByEAAccountSelector,
  isDemoPlaygroundUser,
} from '../../../../student/Login/ducks'
import { shortTestIdKeyLength } from '../../constants'
import PremiumPopover from '../../../../features/components/PremiumPopover'

const convertTableData = (
  data,
  assignments = [],
  index,
  userId,
  itemsInFolders
) => ({
  name: data.title,
  thumbnail: data.thumbnail,
  key: index.toString(),
  rowIndex: index.toString(),
  itemId: data._id,
  class: assignments.length,
  assigned: '',
  status: 'status',
  submitted: `${
    assignments
      .map((item) => (item.submittedCount || 0) + (item.gradedCount || 0))
      .reduce((t, c) => t + c, 0) || 0
  } of ${assignments
    .map((item) => item.totalNumber || 0)
    .reduce((t, c) => t + c, 0)}`,
  graded: `${
    assignments.map((item) => item.gradedCount).reduce((t, c) => t + c, 0) || 0
  }`,
  isInFolder: itemsInFolders.includes(data._id),
  action: '',
  classId: assignments[0]?.classId,
  currentAssignment: assignments[0],
  showViewSummary: assignments.some(
    (item) => item.gradedCount || item.submittedCount
  ),
  testType: data.testType,
  hasRandomQuestions: data.hasRandomQuestions,
  assignmentVisibility: assignments.map(
    (item) =>
      item.testContentVisibility || testConstants.testContentVisibility.ALWAYS
  ),
  canEdit: canEditTest(data, userId),
  hasAdminAssignments: assignments.some(
    (item) =>
      item.assignedBy.role === roleuser.SCHOOL_ADMIN ||
      item.assignedBy.role === roleuser.DISTRICT_ADMIN
  ),
  assignedBy: uniqBy(
    assignments.map((item) => item.assignedBy),
    '_id'
  ),
})

const convertExpandTableData = (data, testItem, index) => ({
  name: testItem.title,
  key: index,
  assignmentId: data._id,
  class: data.className,
  assigned: data.assignedBy.name,
  status: assignmentStatus(data.status, data.isPaused, data.startDate),
  submitted: `${(data.submittedCount || 0) + (data.gradedCount || 0)} of ${
    data.totalNumber || 0
  }`,
  graded: data.gradedCount,
  action: '',
  classId: data.classId,
  testType: data.testType,
  timedAssignment: data.timedAssignment && data.allowedTime,
  hasRandomQuestions: testItem.hasRandomQuestions,
})

const TableList = ({
  assignmentsByTestId = {},
  tests = [],
  onOpenReleaseScoreSettings,
  history,
  t,
  loading,
  toggleEditModal,
  itemsInFolders,
  showPreviewModal,
  showFilter,
  windowWidth,
  toggleDeleteModal,
  userId = '',
  status = '',
  assignmentTests,
  togglePrintModal,
  userRole,
  userClassList,
  setItemsToFolder,
  selectedItems,
  toggleAddItemFolderModal,
  toggleRemovalFolderModal,
  bulkDownloadGradesAndResponses,
  showEmbedLinkModal,
  toggleTagsEditModal,
  isDemoPlayground = false,
  isProxiedByEAAccount = false,
  isPremiumUser,
}) => {
  const [expandedRows, setExpandedRows] = useState([])
  const [details, setdetails] = useState(true)
  const [premiumPopup, setPremiumPopup] = useState(null)
  // Show first three rows opened in every re-render
  useEffect(() => {
    setExpandedRows(['0', '1', '2'])
  }, [])

  const expandedRowRender = (parentData) => {
    const columns = [
      {
        title: <CheckboxLabel />,
        dataIndex: 'checkbox',
        width: '4%',
        className: 'select-row',
        render: () => (
          <GreyFont daya-cy={parentData.itemId} style={{ display: 'block' }} />
        ),
      },
      {
        dataIndex: 'class',
        width: '25%',
        render: (text, row) => (
          <GreyFont
            className="class-column"
            onClick={() =>
              history.push(
                `/author/classboard/${row.assignmentId}/${row.classId}`
              )
            }
          >
            <Tooltip placement="bottom" title={text}>
              <span data-cy="class">{text}</span>
            </Tooltip>
          </GreyFont>
        ),
      },
      {
        dataIndex: 'testType',
        width: '14%',
        render: (_, row) => (
          <TypeWrapper
            onClick={() =>
              history.push(
                `/author/classboard/${row.assignmentId}/${row.classId}`
              )
            }
          >
            {row && <TestTypeIcon testType={row.testType} />}
            {row.timedAssignment && (
              <TimedTestIndicator data-cy="type" type="p">
                <Tooltip
                  title={
                    <IndicatorText>
                      {' '}
                      Time Limit: {row.timedAssignment / (60 * 1000)} min
                    </IndicatorText>
                  }
                  placement="right"
                >
                  <IconHourGlass color={greyThemeDark3} />
                </Tooltip>
              </TimedTestIndicator>
            )}
          </TypeWrapper>
        ),
      },
      {
        dataIndex: 'assigned',
        width: '12%',
        render: (text, row) => (
          <Tooltip title={text} placement="top">
            <GreyFont
              data-cy="assigned"
              showEllipsis={text.length > 15}
              onClick={() =>
                history.push(
                  `/author/classboard/${row.assignmentId}/${row.classId}`
                )
              }
            >
              {text}
            </GreyFont>
          </Tooltip>
        ),
      },
      {
        dataIndex: 'status',
        width: '14%',
        render: (text, row) =>
          text ? (
            <StatusLabel
              onClick={() =>
                history.push(
                  `/author/classboard/${row.assignmentId}/${row.classId}`
                )
              }
              data-cy="status"
              status={text}
            >
              {text}
            </StatusLabel>
          ) : (
            ''
          ),
      },
      {
        dataIndex: 'submitted',
        width: '8%',
        render: (text, row) => (
          <GreyFont
            onClick={() =>
              history.push(
                `/author/classboard/${row.assignmentId}/${row.classId}`
              )
            }
            data-cy="submitted"
          >
            {text}
          </GreyFont>
        ),
      },
      {
        dataIndex: 'graded',
        width: '8%',
        render: (text, row) => (
          <GreyFont
            onClick={() =>
              history.push(
                `/author/classboard/${row.assignmentId}/${row.classId}`
              )
            }
            data-cy="graded"
          >
            {text}
          </GreyFont>
        ),
      },
      {
        width: '5%',
        render: () => <GreyFont />,
      },
      {
        dataIndex: 'action',
        width: '5%',
        render: (_, row) => (
          <ActionsWrapper
            data-cy="PresentationIcon"
            data-test={row.assignmentId}
          >
            <Tooltip placement="bottom" title="Live Class Board">
              <Link
                data-cy="lcb"
                to={`/author/classboard/${row.assignmentId}/${row.classId}`}
              >
                <IconPresentation alt="Images" />
              </Link>
            </Tooltip>
            <FeaturesSwitch
              inputFeatures="expressGrader"
              actionOnInaccessible="hidden"
              groupId={row.classId}
            >
              <WithDisableMessage
                disabled={row.hasRandomQuestions}
                errMessage={t('common.randomItemsDisableMessage')}
              >
                <Tooltip placement="bottom" title="Express Grader">
                  <Link
                    data-cy="eg"
                    to={`/author/expressgrader/${row.assignmentId}/${row.classId}`}
                    disabled={row.hasRandomQuestions}
                  >
                    <IconAddItem alt="Images" />
                  </Link>
                </Tooltip>
              </WithDisableMessage>
            </FeaturesSwitch>
            <Tooltip placement="bottom" title="Standard Based Report">
              <Link
                data-cy="sbr"
                to={`/author/standardsBasedReport/${row.assignmentId}/${row.classId}`}
              >
                <IconPieChartIcon alt="Images" />
              </Link>
            </Tooltip>
          </ActionsWrapper>
        ),
      },
      {
        dataIndex: 'select-row',
        width: '5%',
        render: () => <GreyFont />,
      },
    ]
    const expandTableList = []
    let filterData = assignmentsByTestId?.[parentData.itemId] || []
    let getInfo
    if (status) {
      filterData = filterData.filter(
        (assignment) => assignment.status === status
      )
    }
    filterData.forEach((assignment, index) => {
      if (!assignment.redirect) {
        getInfo = convertExpandTableData(assignment, parentData, index)
        expandTableList.push(getInfo)
      }
    })

    return (
      <ExpandedTable
        data-cy={parentData.itemId}
        columns={columns}
        dataSource={expandTableList}
        pagination={false}
        class="expandTable"
      />
    )
  }

  const enableExtend = () => setdetails(false)

  const disableExtend = () => setdetails(true)

  const handleExpandedRowsChange = (rowIndex) => {
    setExpandedRows((state) => {
      if (state.includes(rowIndex)) {
        return state.filter((item) => item !== rowIndex)
      }
      return [...state, rowIndex]
    })
  }

  const getAssignmentsByTestId = (Id) =>
    (assignmentsByTestId[Id] || []).filter((item) => !item.redirect)

  const getTestTypeLabel = (testType) => {
    if (
      [
        TEST_TYPES_VALUES_MAP.COMMON_ASSESSMENT,
        TEST_TYPES_VALUES_MAP.SCHOOL_COMMON_ASSESSMENT,
      ].includes(testType)
    ) {
      return TEST_TYPE_LABELS[testType]
    }
    return testType
  }

  let data = tests.map((testItem, i) =>
    convertTableData(
      testItem,
      getAssignmentsByTestId(testItem._id),
      i,
      userId,
      itemsInFolders
    )
  )

  if (status) {
    data = data.filter((d) =>
      getAssignmentsByTestId(d.itemId).find(
        (assignment) => assignment.status === status
      )
    )
  }

  const handleSelectRow = (row) => (e) => {
    const selectedIndex = selectedItems.findIndex(
      (r) => r.itemId === row.itemId
    )
    if (e.target && e.target.checked && selectedIndex === -1) {
      setItemsToFolder([...selectedItems, row])
    } else if (e.target && selectedIndex !== -1) {
      selectedItems.splice(selectedIndex, 1)
      setItemsToFolder([...selectedItems])
    } else if (!e.target && toggleAddItemFolderModal) {
      // this case is from action button of an item
      setItemsToFolder([row])
      toggleAddItemFolderModal({
        items: [row],
        isOpen: true,
      })
    }
  }

  const handleSelectAllRow = (e) => {
    if (e.target.checked) {
      setItemsToFolder(data)
    } else {
      setItemsToFolder([])
    }
  }

  const toggleMoveFolderModal = () => {
    if (toggleAddItemFolderModal) {
      toggleAddItemFolderModal({
        items: selectedItems,
        isOpen: true,
      })
    }
  }

  const handleRemoveItemsFromFolder = (row) => {
    if (!isEmpty(row)) {
      toggleRemovalFolderModal({
        items: [row],
        isOpen: true,
      })
    } else if (!isEmpty(selectedItems)) {
      toggleRemovalFolderModal({
        items: selectedItems,
        isOpen: true,
      })
    }
  }

  const handleDownloadResponses = (testId) => {
    bulkDownloadGradesAndResponses({
      data: {},
      testId,
      testType: null,
      isResponseRequired: true,
    })
  }

  const columns = [
    {
      title: 'Assignment Name',
      dataIndex: 'name',
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) =>
        a.name.localeCompare(b.name, 'en', { ignorePunctuation: true }),
      width: '20%',
      className: 'assignment-name',
      align: 'left',
      render: (text, row) => (
        <Tooltip
          placement="bottom"
          title={
            <div>
              {text} (Id: {row.itemId.slice(-shortTestIdKeyLength)})
            </div>
          }
        >
          <FlexContainer style={{ marginLeft: 0 }} justifyContent="left">
            <div>
              <TestThumbnail src={row.thumbnail} />
            </div>
            <AssignmentTD
              data-cy="assignmentName"
              data-test={row.itemId}
              showFilter={showFilter}
            >
              {text}
            </AssignmentTD>
          </FlexContainer>
        </Tooltip>
      ),
    },
    {
      title: 'Class',
      dataIndex: 'class',
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => a.class - b.class,
      width: '10%',
      render: (text, row) => (
        <ExpandDivdier data-cy="ButtonToShowAllClasses">
          <IconArrowDown
            onclick={() => false}
            src={arrowUpIcon}
            style={{
              transform: expandedRows.includes(`${row.key}`)
                ? 'rotate(180deg)'
                : '',
            }}
          />
          {text}
        </ExpandDivdier>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'testType',
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => {
        // Handling the undefined testtype however All the test should have test type.
        if (!a.testType || !b.testType) return false
        return a.testType.localeCompare(b.testType)
      },
      width: '14%',
      render: (text = testTypesConstants.TEST_TYPES_VALUES_MAP.ASSESSMENT) => (
        <TitleCase data-cy="testType">{getTestTypeLabel(text)}</TitleCase>
      ),
    },
    {
      title: 'Assigned by',
      dataIndex: 'assigned',
      sortDirections: ['descend', 'ascend'],
      width: '11%',
      render: (text) => <GreyFont data-cy="assignedBy"> {text} </GreyFont>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      sortDirections: ['descend', 'ascend'],
      width: '14%',
      render: () => (
        <GreyFont data-cy="testStatus">{t('common.assigned')} </GreyFont>
      ),
    },
    {
      title: 'Submitted',
      dataIndex: 'submitted',
      sortDirections: ['descend', 'ascend'],
      width: '8%',
      render: (text) => <GreyFont data-cy="testSubmitted"> {text} </GreyFont>,
    },
    {
      title: 'Graded',
      dataIndex: 'graded',
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => a.graded - b.graded,
      width: '8%',
      render: (text) => <GreyFont data-cy="testGraded"> {text} </GreyFont>,
    },
    {
      width: '5%',
      render: (_, row) => {
        const { showViewSummary, currentAssignment } = row
        const { testId, termId, testType } = currentAssignment
        return (
          <AnalyzeLink
            testId={testId}
            termId={termId}
            testType={testType}
            showAnalyseLink={showViewSummary}
          />
        )
      },
    },
    {
      title: () => {
        const menu = (
          <Menu>
            <Menu.Item
              data-cy="add-to-folder"
              onClick={() => toggleMoveFolderModal()}
            >
              Add to Folder
            </Menu.Item>
            <Menu.Item
              data-cy="remove-from-folder"
              onClick={() => handleRemoveItemsFromFolder()}
            >
              Remove from Folder
            </Menu.Item>
          </Menu>
        )
        return (
          selectedItems.length > 0 && (
            <ActionDiv>
              <Dropdown
                overlay={menu}
                trigger={['click']}
                placement="bottomRight"
              >
                <EduButton
                  height="22px"
                  width="100%"
                  maxWidth="75px"
                  ml="0px"
                  data-cy="assignmentActions"
                  isBlue
                  isGhost
                >
                  ACTIONS
                </EduButton>
              </Dropdown>
            </ActionDiv>
          )
        )
      },
      className: 'assignment-actions',
      dataIndex: 'action',
      width: '5%',
      render: (_, row) => {
        const assignmentTest = assignmentTests.find(
          (at) => at._id === row.itemId
        )
        return (
          <ActionDiv onClick={(e) => e.stopPropagation()}>
            <Dropdown
              overlay={ActionMenu({
                onOpenReleaseScoreSettings,
                currentAssignment: row?.currentAssignment || {},
                history,
                showPreviewModal,
                toggleEditModal,
                toggleDeleteModal,
                row,
                userId,
                assignmentTest,
                togglePrintModal,
                addItemToFolder: handleSelectRow(row),
                removeItemsFromFolder: () => handleRemoveItemsFromFolder(row),
                canEdit:
                  row.canEdit &&
                  !(row.hasAdminAssignments && userRole === roleuser.TEACHER),
                userClassList,
                canUnassign: !(
                  row.hasAdminAssignments && userRole === roleuser.TEACHER
                ),
                handleDownloadResponses,
                userRole,
                showEmbedLinkModal,
                toggleTagsEditModal,
                isDemoPlaygroundUser: isDemoPlayground,
                isProxiedByEAAccount,
                showViewSummary: row.showViewSummary,
                isPremiumUser,
                showPremiumPopup: setPremiumPopup,
              })}
              placement="bottomRight"
              trigger={['click']}
              getPopupContainer={(trigger) => trigger.parentNode}
            >
              <EduButton
                ml="0px"
                height="23px"
                width="100%"
                maxWidth="75px"
                isGhost
                data-cy="actions"
              >
                ACTIONS
              </EduButton>
            </Dropdown>
          </ActionDiv>
        )
      },
      onCell: () => ({
        onMouseEnter: () => enableExtend(),
        onMouseLeave: () => disableExtend(),
      }),
    },
    {
      title: () => {
        const isSelectedAll = selectedItems.length === data.length
        return (
          <CheckboxLabel
            size="15px"
            indeterminate={selectedItems.length > 0 && !isSelectedAll}
            onChange={handleSelectAllRow}
            checked={isSelectedAll}
            onClick={(e) => e.stopPropagation()}
          />
        )
      },
      dataIndex: 'checked',
      width: '5%',
      render: (_, row) => {
        const selected = selectedItems.find((r) => r.itemId === row.itemId)
        return (
          <CheckboxLabel
            size="15px"
            checked={!!selected}
            onChange={handleSelectRow(row)}
            onClick={(e) => e.stopPropagation()}
          />
        )
      },
    },
  ]

  if (loading) {
    return <Spin size="large" />
  }

  const NoDataMessage = (
    <>
      <p>There are no assignments found for the filter options selected.</p>
      <p>
        Something Wrong? Check the filters including the school year selected.
      </p>
    </>
  )

  if (data.length < 1) {
    return (
      <NoDataNotification
        style={{ width: 'auto' }}
        heading="Assignments not available"
        description={NoDataMessage}
      />
    )
  }

  return (
    <Container>
      <TableData
        columns={columns}
        expandIconAsCell={false}
        expandIconColumnIndex={-1}
        expandedRowRender={expandedRowRender}
        dataSource={data}
        expandRowByClick={details}
        onRow={(record) => ({
          onClick: () => handleExpandedRowsChange(record.rowIndex),
        })}
        expandedRowKeys={expandedRows}
        scroll={{ x: windowWidth <= 1023 ? 1023 : false }}
      />
      <PremiumPopover
        target={premiumPopup}
        onClose={() => setPremiumPopup(null)}
        descriptionType="report"
        imageType="IMG_DATA_ANALYST"
      />
    </Container>
  )
}

TableList.propTypes = {
  assignmentsByTestId: PropTypes.object.isRequired,
  onOpenReleaseScoreSettings: PropTypes.func,
  itemsInFolders: PropTypes.object.isRequired,
  showPreviewModal: PropTypes.func,
  history: PropTypes.object,
  tests: PropTypes.array,
  showFilter: PropTypes.bool,
  t: PropTypes.func.isRequired,
  togglePrintModal: PropTypes.func,
}

TableList.defaultProps = {
  onOpenReleaseScoreSettings: () => {},
  showPreviewModal: () => {},
  history: {},
  tests: [],
  showFilter: false,
  togglePrintModal: () => {},
}

const enhance = compose(
  withWindowSizes,
  withRouter,
  withNamespaces('assignmentCard'),
  connect(
    (state) => ({
      loading: get(state, 'author_assignments.loading'),
      itemsInFolders: getItemsInFolders(state),
      selectedItems: getSelectedItems(state),
      userId: getUserIdSelector(state),
      assignmentTests: getAssignmentTestsSelector(state),
      userRole: getUserRole(state),
      userClassList: getGroupList(state),
      isDemoPlayground: isDemoPlaygroundUser(state),
      isProxiedByEAAccount: getIsProxiedByEAAccountSelector(state),
      isPremiumUser: isPremiumUserSelector(state),
    }),
    {
      setItemsToFolder: setItemsMoveFolderAction,
      toggleRemovalFolderModal: toggleRemoveItemsFolderAction,
      toggleAddItemFolderModal: toggleMoveItemsFolderAction,
      bulkDownloadGradesAndResponses: bulkDownloadGradesAndResponsesAction,
    }
  )
)

export default enhance(TableList)
