import { EduButton, FlexContainer, CheckboxLabel } from '@edulastic/common'
import { test } from '@edulastic/constants'
import { withNamespaces } from '@edulastic/localization'
import { Dropdown, Spin, Tooltip, Menu } from 'antd'
import produce from 'immer'
import { get, isEmpty } from 'lodash'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import NoDataNotification from '../../../../common/components/NoDataNotification'
import { receiveAssignmentsSummaryAction } from '../../../src/actions/assignments'
import {
  getAssignmentsSummary,
  getAssignmentTestsSelector,
} from '../../../src/selectors/assignments'
import {
  getUserIdSelector,
  getUserRole,
  getGroupList,
} from '../../../src/selectors/user'
import {
  toggleRemoveItemsFolderAction,
  toggleMoveItemsFolderAction,
  setItemsMoveFolderAction,
} from '../../../src/actions/folder'
import { getSelectedItems } from '../../../src/selectors/folder'
import { canEditTest } from '../../utils'
import ActionMenu from '../ActionMenu/ActionMenu'
import Spinner from '../../../../common/components/Spinner'
import {
  ActionDiv,
  AssignmentTD,
  Container,
  TableData,
  TestThumbnail,
  TypeIcon,
  TypeWrapper,
} from './styled'
import { isDemoPlaygroundUser } from '../../../../student/Login/ducks'

class AdvancedTable extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    enableRowClick: true,
    perPage: 20,
    current: 1,
    sort: {},
    columns: [
      {
        title: 'ASSIGNMENT NAME',
        dataIndex: 'title',
        align: 'left',
        sortDirections: ['descend', 'ascend'],
        sorter: true,
        width: '28%',
        sortOrder: false,
        onHeaderCell: (col) => ({ onClick: () => this.handleSort(col, 0) }),
        className: 'assignment-name',
        render: (text, row) => (
          <Tooltip placement="bottom" title={<div>{text}</div>}>
            <FlexContainer style={{ marginLeft: 0, justifyContent: 'unset' }}>
              <div>
                <TestThumbnail src={row.thumbnail} />
              </div>
              <AssignmentTD>{text}</AssignmentTD>
            </FlexContainer>
          </Tooltip>
        ),
      },
      {
        title: 'Type',
        dataIndex: 'testType',
        sortDirections: ['descend', 'ascend'],
        sorter: true,
        sortOrder: false,
        width: '4%',
        align: 'left',
        className: 'assignment-name',
        onHeaderCell: (col) => ({ onClick: () => this.handleSort(col, 1) }),
        render: (_, row) => (
          <TypeWrapper
            paddingLeft="0px"
            width="100%"
            float="none"
            justify="left"
          >
            {row && row.testType === test.type.PRACTICE ? (
              <TypeIcon data-cy="type" type="p">
                P
              </TypeIcon>
            ) : row.testType === test.type.ASSESSMENT ? (
              <TypeIcon data-cy="type">A</TypeIcon>
            ) : (
              <TypeIcon data-cy="type" type="c">
                C
              </TypeIcon>
            )}
          </TypeWrapper>
        ),
      },
      {
        title: 'Classes',
        dataIndex: 'total',
        sortDirections: ['descend', 'ascend'],
        sorter: true,
        sortOrder: false,
        onHeaderCell: (col) => ({ onClick: () => this.handleSort(col, 2) }),
        width: '8%',
        render: (text) => <div>{text}</div>,
      },
      {
        title: 'Students',
        dataIndex: 'totalStudents',
        sortDirections: ['descend', 'ascend'],
        sorter: true,
        sortOrder: false,
        onHeaderCell: (col) => ({ onClick: () => this.handleSort(col, 3) }),
        width: '8%',
        render: (text, data) => {
          if (data.bulkAssignedCountProcessed < data.bulkAssignedCount) {
            return (
              <Tooltip placement="top" title="Assigning In Progress">
                <div style={{ position: 'relative' }}>
                  <Spinner size="18px" />
                </div>
              </Tooltip>
            )
          }
          return <div> {text} </div>
        },
      },
      {
        title: 'Not Started & Absent',
        dataIndex: 'notStartedStudents',
        sortDirections: ['descend', 'ascend'],
        sorter: true,
        sortOrder: false,
        onHeaderCell: (col) => ({ onClick: () => this.handleSort(col, 4) }),
        width: '14%',
        render: (text) => <div>{text} </div>,
      },
      {
        title: 'In Progress',
        dataIndex: 'inProgressStudents',
        sortDirections: ['descend', 'ascend'],
        sorter: true,
        sortOrder: false,
        onHeaderCell: (col) => ({ onClick: () => this.handleSort(col, 5) }),
        width: '8%',
        render: (text) => <div> {text} </div>,
      },
      {
        title: 'Submitted',
        dataIndex: 'submittedStudents',
        sortDirections: ['descend', 'ascend'],
        sorter: true,
        sortOrder: false,
        onHeaderCell: (col) => ({ onClick: () => this.handleSort(col, 6) }),

        width: '8%',
        render: (text) => <div> {text} </div>,
      },
      {
        title: 'Graded',
        dataIndex: 'gradedStudents',
        sortDirections: ['descend', 'ascend'],
        sorter: true,
        sortOrder: false,
        onHeaderCell: (col) => ({ onClick: () => this.handleSort(col, 6) }),

        width: '6%',
        render: (text) => <div> {text} </div>,
      },
      {
        title: () => {
          const { selectedRows } = this.props
          const menu = (
            <Menu>
              <Menu.Item onClick={() => this.toggleMoveFolderModal()}>
                Add to Folder
              </Menu.Item>
              <Menu.Item onClick={() => this.handleRemoveItemsFromFolder()}>
                Remove from Folder
              </Menu.Item>
            </Menu>
          )
          return (
            selectedRows.length > 0 && (
              <ActionDiv>
                <Dropdown
                  overlay={menu}
                  trigger={['click']}
                  placement="bottomRight"
                >
                  <EduButton
                    height="28px"
                    width="100%"
                    data-cy="actions"
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
        dataIndex: 'action',
        width: '10%',
        render: (_, row) => {
          const {
            onOpenReleaseScoreSettings,
            history,
            showPreviewModal,
            toggleEditModal,
            toggleDeleteModal,
            userId = '',
            userRole = '',
            togglePrintModal,
            userClassList,
            assignmentsSummary,
            showEmbedLinkModal,
            toggleTagsEditModal,
            isDemoPlayground = false,
          } = this.props
          const isAssignProgress =
            row.bulkAssignedCountProcessed < row.bulkAssignedCount
          const canEdit = canEditTest(row, userId) && !isAssignProgress
          const assignmentTest = assignmentsSummary.find(
            (at) => at.testId === row.testId
          )
          const currentAssignment = {
            _id: row.assignmentIds[0],
            testId: row.testId,
          }
          return (
            <ActionDiv data-cy="testActions">
              <Dropdown
                data-cy="actionDropDown"
                overlay={ActionMenu({
                  currentAssignment,
                  onOpenReleaseScoreSettings,
                  row,
                  history,
                  showPreviewModal,
                  toggleEditModal,
                  toggleDeleteModal,
                  userId,
                  userRole,
                  assignmentTest,
                  canEdit,
                  togglePrintModal,
                  userClassList,
                  addItemToFolder: this.handleSelectRow(row),
                  removeItemsFromFolder: () =>
                    this.handleRemoveItemsFromFolder(row),
                  showEmbedLinkModal,
                  toggleTagsEditModal,
                  isDemoPlaygroundUser: isDemoPlayground
                })}
                placement="bottomRight"
                trigger={['click']}
              >
                <EduButton
                  height="28px"
                  width="100%"
                  isGhost
                  data-cy="testActions"
                >
                  ACTIONS
                </EduButton>
              </Dropdown>
            </ActionDiv>
          )
        },
        onCell: () => ({
          onMouseEnter: this.disableRowClick,
          onMouseLeave: this.enableRowClick,
        }),
      },
      {
        title: () => {
          const { selectedAll, indeterminate } = this.isSelectedAll()
          return (
            <CheckboxLabel
              size="15px"
              indeterminate={indeterminate}
              onChange={this.handleSelectAllRow}
              checked={selectedAll}
              onClick={(e) => e.stopPropagation()}
            />
          )
        },
        dataIndex: 'checked',
        width: '5%',
        render: (_, row) => (
          <ActionDiv onClick={(e) => e.stopPropagation()}>
            <CheckboxLabel
              size="15px"
              checked={this.isSelectedRow(row)}
              onChange={this.handleSelectRow(row)}
            />
          </ActionDiv>
        ),
      },
    ],
  }

  static getDerivedStateFromProps(nextProps) {
    const { filtering } = nextProps
    if (filtering) {
      return { current: 1 }
    }
    return {}
  }

  fetchSummary = (pageNo, sort) => {
    const { loadAssignmentsSummary, districtId, filters } = this.props
    const { folderId } = filters
    loadAssignmentsSummary({
      districtId,
      filters: { ...filters, pageNo },
      sort,
      folderId,
    })
  }

  enableRowClick = () => this.setState({ enableRowClick: true })

  disableRowClick = () => this.setState({ enableRowClick: false })

  goToAdvancedView = (row) => {
    const { history, districtId } = this.props
    const { enableRowClick } = this.state
    if (enableRowClick) {
      history.push(
        `/author/assignments/${districtId}/${row.testId}?testType=${row.testType}`
      )
    }
  }

  handlePagination = (page) => {
    const { sort } = this.state
    this.fetchSummary(page, sort)
    this.setState({ current: page })
  }

  handleSort = (col, index) => {
    const { columns, current } = this.state
    const { sortOrder } = col
    const newSortOrder =
      sortOrder === false
        ? 'descend'
        : sortOrder === 'descend'
        ? 'ascend'
        : false
    const newColumns = produce(columns, (draft) => {
      draft.forEach((o, indx) => {
        if (indx === index) o.sortOrder = newSortOrder
        else if (indx < 7) o.sortOrder = false
      })
    })
    this.setState({
      columns: newColumns,
      sort: newSortOrder
        ? { sortBy: col.dataIndex, sortOrder: newSortOrder }
        : {},
    })
    this.fetchSummary(
      current,
      newSortOrder ? { sortBy: col.dataIndex, sortOrder: newSortOrder } : {}
    )
  }

  handleSelectRow = (row) => (e) => {
    const {
      toggleAddItemFolderModal,
      setItemsToFolder,
      selectedRows,
    } = this.props
    const selectedIndex = selectedRows.findIndex((r) => r.itemId === row.testId)
    if (e.target && e.target.checked && selectedIndex === -1) {
      setItemsToFolder([
        ...selectedRows,
        { itemId: row.testId, name: row.title },
      ])
    } else if (e.target && selectedIndex !== -1) {
      selectedRows.splice(selectedIndex, 1)
      setItemsToFolder([...selectedRows])
    } else if (!e.target && toggleAddItemFolderModal) {
      // this case is from action button of an item
      setItemsToFolder([{ itemId: row.testId, name: row.title }])
      toggleAddItemFolderModal({
        items: [{ itemId: row.testId, name: row.title }],
        isOpen: true,
      })
    }
  }

  handleSelectAllRow = (e) => {
    const { assignmentsSummary, setItemsToFolder } = this.props
    if (e.target.checked) {
      setItemsToFolder(
        assignmentsSummary.map((r) => ({ itemId: r.testId, title: r.title }))
      )
    } else {
      setItemsToFolder([])
    }
  }

  handleRemoveItemsFromFolder = (row) => {
    const { toggleRemovalFolderModal, selectedRows } = this.props
    if (!isEmpty(row)) {
      toggleRemovalFolderModal({
        items: [{ itemId: row.testId, name: row.title }],
        isOpen: true,
      })
    } else if (!isEmpty(selectedRows)) {
      toggleRemovalFolderModal({
        items: selectedRows,
        isOpen: true,
      })
    }
  }

  toggleMoveFolderModal = () => {
    const { toggleAddItemFolderModal, selectedRows } = this.props
    if (toggleAddItemFolderModal) {
      toggleAddItemFolderModal({
        items: selectedRows,
        isOpen: true,
      })
    }
  }

  isSelectedRow = (row) => {
    const { selectedRows } = this.props
    return !!selectedRows.find((r) => r.itemId === row.testId)
  }

  isSelectedAll = () => {
    const { assignmentsSummary, selectedRows } = this.props
    const selectedAll = selectedRows.length === assignmentsSummary.length
    return {
      selectedAll,
      indeterminate: selectedRows.length > 0 && !selectedAll,
    }
  }

  render() {
    const { assignmentsSummary, totalData, loading } = this.props
    const { perPage, current, columns } = this.state

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

    if (assignmentsSummary.length < 1) {
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
          dataSource={assignmentsSummary.map((item) => ({
            ...item,
            key: `${item.testId}_${item.testType}`,
          }))}
          onRow={(row) => ({
            onClick: () => this.goToAdvancedView(row),
          })}
          pagination={{
            pageSize: perPage,
            onChange: this.handlePagination,
            total: totalData,
            current,
          }}
        />
      </Container>
    )
  }
}

AdvancedTable.propTypes = {
  assignmentsSummary: PropTypes.array.isRequired,
  loadAssignmentsSummary: PropTypes.func.isRequired,
  districtId: PropTypes.string.isRequired,
  onOpenReleaseScoreSettings: PropTypes.func,
  filters: PropTypes.object.isRequired,
  history: PropTypes.object,
}

AdvancedTable.defaultProps = {
  onOpenReleaseScoreSettings: () => {},
  history: {},
}

const enhance = compose(
  withRouter,
  withNamespaces('assignmentCard'),
  connect(
    (state) => ({
      assignmentsSummary: getAssignmentsSummary(state),
      filtering: get(state, 'author_assignments.filtering'),
      totalData: get(state, 'author_assignments.total', 0),
      loading: get(state, 'author_assignments.loading'),
      userId: getUserIdSelector(state),
      userRole: getUserRole(state),
      selectedRows: getSelectedItems(state),
      assignmentTests: getAssignmentTestsSelector(state),
      userClassList: getGroupList(state),
      isDemoPlayground: isDemoPlaygroundUser(state),
    }),
    {
      loadAssignmentsSummary: receiveAssignmentsSummaryAction,
      setItemsToFolder: setItemsMoveFolderAction,
      toggleRemovalFolderModal: toggleRemoveItemsFolderAction,
      toggleAddItemFolderModal: toggleMoveItemsFolderAction,
    }
  )
)

export default enhance(AdvancedTable)
