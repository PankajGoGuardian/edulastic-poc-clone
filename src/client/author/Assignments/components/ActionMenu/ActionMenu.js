import React from 'react'
import { Menu, Tooltip } from 'antd'
import { Link } from 'react-router-dom'
import qs from 'qs'

import { assignmentApi } from '@edulastic/api'
import { captureSentryException, notification } from '@edulastic/common'
import { IconPrint, IconBarChart, IconEdit } from '@edulastic/icons'
import {
  roleuser,
  test,
  testTypes as testTypesConstants,
} from '@edulastic/constants'

import classIcon from '../../assets/manage-class.svg'
import viewIcon from '../../assets/view.svg'
import infomationIcon from '../../assets/information.svg'
import responsiveIcon from '../../assets/responses.svg'
import { Container, StyledMenu, StyledLink, SpaceElement } from './styled'
import DuplicateTest from './ItemClone'

const { duplicateAssignment } = assignmentApi
const { testContentVisibility: testContentVisibilityOptions } = test

const getReportPathForAssignment = (testId = '', assignment = {}, row = {}) => {
  const q = {}
  q.termId = assignment.termId || row.termId
  q.assessmentTypes = assignment.testType || row.testType
  q.subject = 'All'
  q.grade = 'All'
  return `${testId}?${qs.stringify(q)}`
}

const ActionMenu = ({
  onOpenReleaseScoreSettings = () => {},
  currentAssignment = {},
  history = {},
  showPreviewModal = false,
  toggleEditModal = () => {},
  togglePrintModal = () => {},
  addItemToFolder = () => {},
  removeItemsFromFolder = () => {},
  row = {},
  userId = '',
  userRole = '',
  assignmentTest = {},
  canEdit = true,
  handleDownloadResponses,
  showEmbedLinkModal = () => {},
  toggleTagsEditModal = () => {},
  isDemoPlaygroundUser = false,
  isProxiedByEAAccount = false,
  showViewSummary = false,
}) => {
  const getAssignmentDetails = () =>
    !Object.keys(currentAssignment).length ? row : currentAssignment
  const assignmentDetails = getAssignmentDetails()
  const currentTestId = assignmentDetails.testId
  const currentAssignmentId = assignmentDetails._id
  const currentClassId = assignmentDetails.classId
  const shouldSendAssignmentId =
    testTypesConstants.TEST_TYPES.COMMON.includes(assignmentTest?.testType) ||
    !assignmentTest?.authors?.find((a) => a._id === userId)
  const isAssignmentOwner = row?.assignedBy?.some(({ _id }) => _id === userId)

  const handleShowPreview = () => {
    if (
      [
        test.testContentVisibility.GRADING,
        test.testContentVisibility.HIDDEN,
      ].includes(assignmentDetails?.testContentVisibility)
    ) {
      return notification({ messageKey: 'previewOfItemsRestricted' })
    }
    if (shouldSendAssignmentId) {
      showPreviewModal(
        currentTestId,
        currentAssignmentId,
        assignmentDetails?.classId
      )
    } else {
      showPreviewModal(currentTestId)
    }
  }

  const createDuplicateAssignment = (cloneItems) => {
    duplicateAssignment({
      _id: currentTestId,
      title: assignmentDetails.title,
      cloneItems,
    })
      .then((testItem) => {
        const duplicateTestId = testItem._id
        history.push(`/author/tests/${duplicateTestId}`)
      })
      .catch((err) => {
        const {
          data: { message: errorMessage },
        } = err.response
        captureSentryException(err)
        if (err?.status === 403) {
          return notification({
            msg: 'You do not have the permission to clone the test.',
          })
        }
        notification({
          msg: errorMessage || 'User does not have duplicate permission.',
        })
      })
  }

  const handlePrintTest = () => {
    const isAdmin =
      userRole === roleuser.DISTRICT_ADMIN || userRole === roleuser.SCHOOL_ADMIN
    const { assignmentVisibility = [] } = row
    const { HIDDEN, GRADING } = testContentVisibilityOptions
    if (
      !isAdmin &&
      (assignmentVisibility.includes(HIDDEN) ||
        assignmentVisibility.includes(GRADING))
    ) {
      return notification({
        type: 'warn',
        messageKey: 'viewItemsRestriccedByAdmin',
      })
    }
    togglePrintModal(currentTestId, currentAssignmentId, currentClassId)
  }
  const isAdmin =
    roleuser.DISTRICT_ADMIN === userRole || roleuser.SCHOOL_ADMIN === userRole
  const isReleaseScoreRestricted =
    [roleuser.DISTRICT_ADMIN, roleuser.SCHOOL_ADMIN].includes(
      currentAssignment?.assignedBy?.role
    ) &&
    userRole === roleuser.TEACHER &&
    assignmentTest?.freezeSettings
  return (
    <Container>
      <StyledMenu>
        <Menu.Item
          data-cy="add-to-folder"
          key="add-to-folder"
          onClick={addItemToFolder}
        >
          Add to Folder
        </Menu.Item>
        <Menu.Item
          data-cy="remove-from-folder"
          key="remove-from-folder"
          onClick={removeItemsFromFolder}
        >
          Remove from Folder
        </Menu.Item>
        <Menu.Item data-cy="assign" key="assign">
          <Link
            to={{
              pathname: `/author/assignments/${currentTestId}`,
              state: {
                from: 'assignments',
                fromText: 'Assignments',
                toUrl: '/author/assignments',
              },
            }}
            rel="noopener noreferrer"
          >
            <img alt="icon" src={responsiveIcon} />
            <SpaceElement />
            Assign
          </Link>
        </Menu.Item>
        {!row.hasAutoSelectGroups && (
          <Menu.Item
            data-cy="duplicate"
            key="duplicate"
            disabled={isDemoPlaygroundUser}
            title={
              isDemoPlaygroundUser
                ? 'This feature is not available in demo account.'
                : ''
            }
          >
            <DuplicateTest duplicateTest={createDuplicateAssignment} />
          </Menu.Item>
        )}

        <Menu.Item data-cy="preview" key="preview" onClick={handleShowPreview}>
          <StyledLink target="_blank" rel="noopener noreferrer">
            <img alt="icon" src={viewIcon} />
            <SpaceElement />
            Preview
          </StyledLink>
        </Menu.Item>
        <Menu.Item data-cy="view-details" key="view-details">
          <Link
            to={`/author/tests/tab/review/id/${currentTestId}`}
            rel="noopener noreferrer"
          >
            <img alt="icon" src={infomationIcon} />
            <SpaceElement />
            View Test Details
          </Link>
        </Menu.Item>
        {!assignmentTest?.isDocBased && (
          <Menu.Item
            data-cy="print-assignment"
            key="print-assignment"
            onClick={handlePrintTest}
          >
            <StyledLink target="_blank" rel="noopener noreferrer">
              <IconPrint />
              <SpaceElement />
              Print Test
            </StyledLink>
          </Menu.Item>
        )}
        <Menu.Item
          data-cy="release-grades"
          disabled={isReleaseScoreRestricted}
          key="release-grades"
          onClick={() =>
            onOpenReleaseScoreSettings(currentTestId, currentAssignmentId)
          }
        >
          <Tooltip
            title={
              isReleaseScoreRestricted
                ? 'Release Score policy is restricted by admin for this assignment.'
                : null
            }
            placement="left"
          >
            <img alt="icon" src={responsiveIcon} />
            <SpaceElement />
            Release Scores
          </Tooltip>
        </Menu.Item>
        <Menu.Item
          data-cy="summary-grades"
          key="summary-report"
          disabled={
            // admin accounts do not have assignmentDetails
            !isAdmin && !showViewSummary
          }
        >
          <Link
            to={`/author/reports/assessment-summary/test/${getReportPathForAssignment(
              currentTestId,
              assignmentDetails,
              row
            )}`}
          >
            <IconBarChart />
            <SpaceElement />
            View Summary Report
          </Link>
        </Menu.Item>
        {canEdit && (
          <Menu.Item
            data-cy="edit-Assignment"
            key="edit-Assignment"
            onClick={() => toggleEditModal(currentTestId)}
          >
            <StyledLink target="_blank" rel="noopener noreferrer">
              <img alt="icon" src={classIcon} />
              <SpaceElement />
              Edit Test
            </StyledLink>
          </Menu.Item>
        )}
        {userRole === roleuser.TEACHER && (
          <Menu.Item
            data-cy="download-responses"
            key="download-responses"
            disabled={isProxiedByEAAccount}
            title={
              isProxiedByEAAccount
                ? 'Bulk action disabled for EA proxy accounts.'
                : ''
            }
            onClick={() => handleDownloadResponses(currentTestId)}
          >
            <StyledLink target="_blank" rel="noopener noreferrer">
              <img alt="icon" src={classIcon} />
              <SpaceElement />
              Download Responses
            </StyledLink>
          </Menu.Item>
        )}

        {/** Hiding Unassign option for now, please uncomment it to get it back */}
        {/* {(isAssignmentOwner || isCoAuthor || isAdmin) && canUnassign && (
          <Menu.Item
            data-cy="delete-Assignment"
            key="delete-Assignment"
            onClick={() => toggleDeleteModal(currentTestId)}
          >
            <StyledLink target="_blank" rel="noopener noreferrer">
              <IconTrashAlt />
              <SpaceElement />
              Unassign
            </StyledLink>
          </Menu.Item>
        )} */}
        <Menu.Item
          data-cy="embed-link"
          key="embed-link"
          onClick={() => showEmbedLinkModal(currentTestId)}
        >
          <StyledLink target="_blank" rel="noopener noreferrer">
            <i className="fa fa-link" aria-hidden="true" />
            <SpaceElement />
            Embed Link
          </StyledLink>
        </Menu.Item>

        {isAssignmentOwner && (
          <Menu.Item
            data-cy="edit-tags"
            key="edit-tags"
            onClick={() => toggleTagsEditModal(currentTestId)}
          >
            <StyledLink target="_blank" rel="noopener noreferrer">
              <IconEdit height="13px" width="13px" />
              <SpaceElement />
              Edit Tags
            </StyledLink>
          </Menu.Item>
        )}
      </StyledMenu>
    </Container>
  )
}

export default ActionMenu
