import { themeColor, white } from '@edulastic/colors'
import { FlexContainer, notification, TestTypeIcon } from '@edulastic/common'
import {
  testActivityStatus,
  roleuser,
  test as testConstants,
  testTypes as testTypesConstants,
} from '@edulastic/constants'
import {
  IconCheckSmall,
  IconLeftArrow,
  IconMoreVertical,
  IconVisualization,
  IconTrash,
} from '@edulastic/icons'
import { Button, Dropdown, Menu, Col } from 'antd'
import moment from 'moment'
import produce from 'immer'
import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { useDrop } from 'react-dnd'
import { FaBars } from 'react-icons/fa'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import {
  sortableContainer,
  sortableElement,
  sortableHandle,
} from 'react-sortable-hoc'
import { compose } from 'redux'
import { pick, uniq, get } from 'lodash'
import { curriculumSequencesApi, testsApi } from '@edulastic/api'
import { Tooltip } from '../../../common/utils/helpers'
import {
  resumeAssignmentAction,
  startAssignmentAction,
} from '../../../student/Assignments/ducks'
import { getCurrentGroup, proxyRole } from '../../../student/Login/ducks'
import { removeTestFromModuleAction } from '../../PlaylistPage/ducks'
import Tags from '../../src/components/common/Tags'
import { getUserRole } from '../../src/selectors/user'
import {
  playlistTestRemoveFromModuleAction,
  putCurriculumSequenceAction,
  removeUnitAction,
  setSelectedItemsForAssignAction,
  toggleCheckedUnitItemAction,
  togglePlaylistTestDetailsModalWithId,
  toggleAssignmentsAction,
  setCurrentAssignmentIdsAction,
  editPlaylistTestAction,
} from '../ducks'
import { getProgressData } from '../util'
import ModuleRowView, { InfoProgressBar } from './ModuleRowView'
import AssignmentDragItem from './AssignmentDragItem'
import {
  PlaylistResourceRow,
  SubResource,
  AddResourceToPlaylist,
  AddNewActivityToPlaylist,
} from './PlaylistResourceRow'
import PlaylistTestDetailsModal from './PlaylistTestDetailsModal'
import AssignmentsClasses from './AssignmentsClasses'
import { TestStatus } from '../../TestList/components/ViewModal/styled'
// import { SupportResourceDropTarget } from "./PlaylistResourceRow/styled";

import {
  AssignmentRowContainer,
  DragHandle,
  IconActionButton,
  LastColumn,
  ModuleFocused,
  AssignmentButton,
  ModuleDataWrapper,
  ModuleDataName,
  Assignment,
  ModuleWrapper,
  HideLinkLabel,
  CaretUp,
  Bullet,
  MenuStyled,
} from './styled'
import TestPreviewModal from '../../Assignments/components/Container/TestPreviewModal'
import { getIsPreviewModalVisibleSelector } from '../../../assessment/selectors/test'
import { setIsTestPreviewVisibleAction } from '../../../assessment/actions/test'

const { releaseGradeLabels } = testConstants

const IS_ASSIGNED = 'ASSIGNED'
const NOT_ASSIGNED = 'ASSIGN'

const SortableHOC = sortableContainer(({ children }) => (
  <div onClick={(e) => e.stopPropagation()}>{children}</div>
))

const SortableContainer = (props) => {
  const { mode, children } = props
  return mode === 'embedded' ? (
    <SortableHOC {...props}>{children}</SortableHOC>
  ) : (
    <div>{children}</div>
  )
}

const SortableHandle = sortableHandle(() => (
  <DragHandle>
    <FaBars />
  </DragHandle>
))

const ResourceActivity = (props) => {
  const {
    moduleData,
    id,
    dropContent,
    showSupportingResource,
    droppedItemId,
  } = props

  return (
    <AssignmentRowContainer
      highlightMode={droppedItemId === moduleData.contentId}
    >
      <SortableHandle onClick={(e) => e && e.stopPropagation()} />
      <AssignmentDragItem
        key={`${id}-${moduleData.id}`}
        contentIndex={id}
        showSupportingResource={showSupportingResource}
        handleDrop={dropContent}
        onClick={(e) => e && e.stopPropagation()}
        {...props}
      />
    </AssignmentRowContainer>
  )
}

function OuterDropContainer({ children }) {
  const [{ isOver, contentType }, dropRef] = useDrop({
    accept: 'item',
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      contentType: monitor.getItem()?.contentType,
    }),
    canDrop: (item) => !!item?.contentType,
  })

  /**
   * if contentType is undefined or null, that means its reordering
   */
  const showSupportingResource = contentType && contentType != 'test' && isOver
  return (
    <div ref={dropRef}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, {
          showNewActivity: contentType && isOver,
          showSupportingResource,
        })
      )}
    </div>
  )
}

const SortableElement = sortableElement((props) => {
  const { onDrop, id, moduleIndex, isTestType, fromPlaylist } = props
  return (
    <OuterDropContainer>
      <ResourceActivity {...props} />
      <AddResourceToPlaylist
        index={id}
        moduleIndex={moduleIndex}
        isTestType={isTestType}
        fromPlaylist={fromPlaylist}
      />
      <AddNewActivityToPlaylist
        index={id}
        moduleIndex={moduleIndex}
        onDrop={onDrop}
      />
    </OuterDropContainer>
  )
})

export const submitLTIForm = (signedRequest) => {
  if (signedRequest) {
    const ltiForm = document.createElement('form')
    ltiForm.style.display = 'none'
    ltiForm.setAttribute('target', '_blank')
    ltiForm.setAttribute(
      'action',
      'https://edulasticv2-lti.snapwiz.net/launch-lti'
    )
    ltiForm.setAttribute('method', 'POST')
    ltiForm.setAttribute('id', 'lti-review-form')
    const formBody = Object.keys(signedRequest)
      .map(
        (key) =>
          `<input name="${key}" value="${signedRequest[key]}" type="text" />`
      )
      .join('')
    ltiForm.innerHTML = formBody
    document.body.appendChild(ltiForm)
    ltiForm.submit()
    document.body.removeChild(ltiForm)
  }
}

/** @extends Component<Props> */
class ModuleRow extends Component {
  state = {
    selectedTest: '',
  }

  /**
   * @param {import('./CurriculumSequence').Module} module
   */
  assignModule = (module) => {
    const { setSelectedItemsForAssign, history, playlistId } = this.props

    const moduleItemsIds = []
    module.data.forEach((item) => {
      if (item.contentType === 'test') {
        moduleItemsIds.push(item.contentId)
      }
    })
    setSelectedItemsForAssign(moduleItemsIds)
    history.push({
      pathname: `/author/playlists/assignments/${playlistId}/${module._id}`,
      state: {
        from: 'myPlaylist',
        fromText: 'My Playlist',
        toUrl: `playlists/playlist/${playlistId}/use-this`,
        isAssignPlaylistModule: true,
      },
    })
  }

  assignTest = (moduleId, testId, testVersionId, resources = []) => {
    const { history, playlistId, isSMPlaylist } = this.props
    const resourceIds = resources
      .filter((x) => x.contentSubType === 'STUDENT')
      .map((x) => x.contentId)
    history.push({
      pathname: `/author/playlists/assignments/${playlistId}/${moduleId}/${testId}`,
      state: {
        from: 'myPlaylist',
        fromText: 'My Playlist',
        toUrl: `playlists/playlist/${playlistId}/use-this`,
        testVersionId,
        resourceIds,
        isSparkMathCollection: isSMPlaylist,
        assessmentAssignedFrom: 'Playlist',
      },
    })
  }

  viewTest = async (id, isVersionId) => {
    const { setIsTestPreviewVisible } = this.props
    let testId = id
    if (isVersionId) {
      try {
        const { testId: latestTestId } =
          (await testsApi.getTestIdFromVersionId(testId)) || {}
        if (latestTestId) {
          testId = latestTestId
        } else {
          throw new Error('Failed to fetch latest test id!')
        }
      } catch (e) {
        if (e?.response?.status !== 404) {
          notification({ msg: 'Failed to load test!' })
        }
        console.warn(e)
      }
    }

    this.setState({
      selectedTest: testId,
    })
    setIsTestPreviewVisible(true)
  }

  deleteTest = (moduleIndex, itemId) => {
    const {
      removeItemFromUnit,
      removeItemFromDestinationPlaylist,
      urlHasUseThis,
      customizeInDraft,
      isEditPage,
      hasEditAccess,
    } = this.props

    // isEditPage is true for /edit playlist route. Used to differentiate between /:id and /:id/edit pages
    if (isEditPage && hasEditAccess) {
      removeItemFromUnit({ moduleIndex, itemId })
    } else if (urlHasUseThis || customizeInDraft || hasEditAccess) {
      // urlHasUseThis is ysed for /use-this route, customizeInDraft is used for user having
      // view access, hasEditAccess is for users having edit access
      removeItemFromDestinationPlaylist({ moduleIndex, itemId })
    }
  }

  showDifferentiation = (testId) => {
    const { history, playlistId } = this.props
    history.push({
      pathname: `/author/playlists/differentiation/${playlistId}/use-this`,
      state: {
        testId,
      },
    })
  }

  closePreviewTest = () => {
    const { setIsTestPreviewVisible } = this.props
    this.setState({
      selectedTest: '',
    })
    setIsTestPreviewVisible(false)
  }

  processStudentAssignmentAction = (
    moduleId,
    moduleData,
    isAssigned,
    assignmentRows = []
  ) => {
    let uta = moduleData.userTestActivities || {}
    const {
      classId: groupId,
      playlistClassList,
      startAssignment,
      resumeAssignment,
      playlistId,
      history,
    } = this.props
    const testId = uta.testId || moduleData.contentId
    if (isAssigned) {
      // TODO: filter out the assignments in assignmentRows by classIds in case of multiple assignments
      const {
        testType,
        assignmentId,
        classId,
        maxAttempts,
        status,
        releaseScore,
      } = assignmentRows[0] || {}
      uta = {
        testId,
        classId,
        testType,
        assignmentId,
        utaAssignmentId: uta.assignmentId,
        taStatus: uta.status,
        testActivityId: uta._id,
        isPlaylist: {
          moduleId,
          playlistId,
        },
        redirect: uta.redirect,
        attempts: uta.totalAttempts,
      }
      const isRedirected = assignmentRows.find((el) => el.redirect)
      if (isRedirected && uta.redirect) {
        uta.isRedirected = true
        uta.text = 'RETAKE'
        uta.action = () => startAssignment(uta)
      } else if (
        uta.taStatus === testActivityStatus.SUBMITTED &&
        uta.utaAssignmentId
      ) {
        if (
          releaseScore === releaseGradeLabels.DONT_RELEASE ||
          releaseScore === releaseGradeLabels.SCORE_ONLY
        ) {
          uta.hideButton = true
        }
        uta.text = 'REVIEW'
        uta.action = () =>
          history.push({
            pathname: `/home/class/${uta.classId}/test/${uta.testId}/testActivityReport/${uta.testActivityId}`,
            fromPlayList: true,
          })
        if (uta.attempts < maxAttempts) {
          uta.retake = {
            text: 'RETAKE',
            action: () => startAssignment(uta),
          }
        }
      } else if (
        uta.taStatus === testActivityStatus.ABSENT &&
        uta.utaAssignmentId
      ) {
        uta.text = 'ABSENT'
      } else if (uta.testActivityId && uta.utaAssignmentId) {
        // In case previous uta was derived from practice flow then check for assignment ID and proceed
        uta.text = 'RESUME ASSIGNMENT'
        uta.action = () => resumeAssignment(uta)
      } else {
        const isAssignmentNotOpen = status === 'NOT OPEN'
        uta.text = isAssignmentNotOpen ? 'NOT AVAILABLE' : 'START ASSIGNMENT'
        const classDetails =
          isAssignmentNotOpen &&
          moduleData?.assignments?.[0]?.class?.find(({ _id }) =>
            [uta.groupId, groupId, playlistClassList[0]].includes(_id)
          )
        if (
          classDetails &&
          classDetails.startDate &&
          classDetails.status === 'NOT OPEN'
        ) {
          const startDate = moment(classDetails.startDate).format(
            'MM/DD/YYYY HH:mm'
          )
          uta.title = `Open Date : ${startDate}`
          uta.disabled = true
        }
        uta.action = () => startAssignment(uta)
      }
    } else {
      uta = {
        testId,
        classId: uta.groupId || groupId || playlistClassList[0],
        testType: 'practice',
        taStatus: uta.status,
        testActivityId: uta._id,
        isPlaylist: {
          moduleId,
          playlistId,
        },
      }

      if (uta.testActivityId && uta.taStatus !== testActivityStatus.SUBMITTED) {
        uta.text = 'RESUME PRACTICE'
        uta.action = () => resumeAssignment(uta)
      } else {
        uta.text = 'START PRACTICE'
        uta.action = () => startAssignment(uta)
      }
    }
    return uta
  }

  toggleModule = (module, moduleIndex) => {
    const {
      updateCurriculumSequence,
      playlistId,
      curriculum,
      collapsed,
      onCollapseExpand,
    } = this.props
    const dataToUpdate = produce(curriculum, (draftState) => {
      const currentModule = draftState.modules.find(
        (el) => el._id === module._id
      )
      currentModule.hidden = !module.hidden
      currentModule.data = currentModule.data.map((test) => ({
        ...test,
        hidden: !module.hidden,
      }))
      if (
        (collapsed && !currentModule.hidden) ||
        (!collapsed && currentModule.hidden)
      ) {
        onCollapseExpand(moduleIndex)
      }
    })
    const changedItem =
      dataToUpdate.modules.find((el) => el._id === module._id) || {}
    updateCurriculumSequence({
      id: playlistId,
      curriculumSequence: dataToUpdate,
      toggleModuleNotification: true,
      changedItem,
    })
  }

  hideTest = (moduleId, assignment) => {
    const {
      updateCurriculumSequence,
      playlistId,
      curriculum,
      currentAssignmentIds,
      setCurrentAssignmentIds,
    } = this.props

    const dataToUpdate = produce(curriculum, (draftState) => {
      const module = draftState.modules.find((el) => el._id === moduleId)
      const content = module.data.find(
        (el) => el.contentId === assignment.contentId
      )
      content.hidden = !content.hidden
      // if Hide is clicked and assignment rows expanded, then hide assignment rows
      if (content.hidden && currentAssignmentIds.includes(content.contentId)) {
        const prevState = [...currentAssignmentIds]
        prevState.splice(
          currentAssignmentIds.find((x) => x === content.contentId),
          1
        )
        setCurrentAssignmentIds(prevState)
      }
      const allTestInHidden = module.data.filter((t) => !t.hidden)
      if (!allTestInHidden.length && content.hidden) {
        module.hidden = true
      } else {
        module.hidden = false
      }
    })

    const changedItem = { ...assignment, hidden: !assignment.hidden }
    updateCurriculumSequence({
      id: playlistId,
      curriculumSequence: dataToUpdate,
      toggleTestNotification: true,
      changedItem,
    })
  }

  showResource = async (contentId, resource) => {
    resource =
      resource &&
      pick(resource, [
        'toolProvider',
        'url',
        'customParams',
        'consumerKey',
        'sharedSecret',
      ])
    const { playlistId, module } = this.props
    try {
      const signedRequest = await curriculumSequencesApi.getSignedRequest({
        playlistId,
        moduleId: module._id,
        contentId,
        resource,
      })
      submitLTIForm(signedRequest)
    } catch (e) {
      notification({ messageKey: 'FailedToLoadTheResource' })
    }
  }

  addModuleMenuClick = (e) => {
    const { domEvent } = e
    domEvent.stopPropagation()

    const { addModule } = this.props
    if (addModule) {
      addModule()
    }
  }

  editModuleMenuClick = (e) => {
    const { domEvent } = e
    domEvent.stopPropagation()
    const { editModule, module, moduleIndex } = this.props
    if (editModule) {
      editModule(moduleIndex, module)
    }
  }

  deleteModuleMenuClick = (e) => {
    const { domEvent } = e
    domEvent.stopPropagation()

    const { deleteModule, moduleIndex } = this.props
    if (deleteModule) {
      deleteModule(moduleIndex)
    }
  }

  unassignTest = (testId, assignments, moduleId) => {
    const { playlistId, toggleUnassignModal } = this.props
    const assignmentIds = uniq(
      assignments.map(({ assignmentId }) => assignmentId)
    )
    toggleUnassignModal({
      testId,
      assignmentIds,
      playlistId,
      moduleId,
    })
  }

  onEditTest = (testId, isTestAssigned) => {
    const { editPlaylistTest, playlistId } = this.props
    editPlaylistTest({ testId, playlistId, isTestAssigned })
  }

  render() {
    const {
      onCollapseExpand,
      collapsed,
      padding,
      status,
      module,
      moduleIndex,
      mode,
      dropContent,
      curriculum,
      moduleStatus: completed,
      removeUnit,
      handleTestsSort,
      urlHasUseThis,
      isStudent,
      summaryData,
      playlistMetrics,
      playlistId,
      playlistTestDetailsModalData,
      togglePlaylistTestDetails,
      hasEditAccess,
      isDesktop,
      isMobile,
      showRightPanel,
      setEmbeddedVideoPreviewModal,
      onDrop,
      proxyUserRole,
      isManageContentActive,
      userRole,
      fromPlaylist,
      isPlaylistDetailsPage,
      isSparkMathPlaylist,
      handleActionClick,
      customizeInDraft,
      currentAssignmentIds,
      toggleAssignments,
      isPreviewModalVisible,
      blurCurrentModuleRow,
    } = this.props
    const { selectedTest } = this.state
    const { assignTest } = this
    const { _id, data = [] } = module
    const isParentRoleProxy = proxyUserRole === 'parent'

    const contentData = isStudent
      ? data.filter((test) => test?.status !== 'draft')
      : data

    const menu = (
      <Menu data-cy="addContentMenu">
        {curriculum.modules.map((moduleItem) => (
          <Menu.Item data-cy="addContentMenuItem">
            <span>{moduleItem.title}</span>
          </Menu.Item>
        ))}
        <Menu.Item data-cy="addContentMenuItemAssignNow">
          <span>Assign Now</span>
        </Menu.Item>
      </Menu>
    )
    return (
      (isStudent && module.hidden) || (
        <>
          {isPreviewModalVisible && selectedTest && (
            <TestPreviewModal
              isModalVisible={isPreviewModalVisible}
              testId={selectedTest}
              playlistId={playlistId}
              showStudentPerformance
              closeTestPreviewModal={this.closePreviewTest}
              resetOnClose={() => {
                this.setState({
                  selectedTest: '',
                })
              }}
              unmountOnClose
            />
          )}

          <ModuleWrapper
            data-cy={`row-module-${moduleIndex + 1}`}
            key={`${data.length}-${module.id}`}
            collapsed={collapsed}
            padding={padding}
            onClick={() => onCollapseExpand(moduleIndex)}
          >
            <ModuleRowView
              mode={mode}
              module={module}
              moduleIndex={moduleIndex}
              summaryData={summaryData}
              isStudent={isStudent}
              isDesktop={isDesktop}
              isMobile={isMobile}
              urlHasUseThis={urlHasUseThis}
              hasEditAccess={hasEditAccess}
              moduleStatus={completed}
              collapsed={collapsed}
              blurCurrentModuleRow={blurCurrentModuleRow}
              removeUnit={removeUnit}
              toggleModule={this.toggleModule}
              assignModule={this.assignModule}
              addModuleMenuClick={this.addModuleMenuClick}
              editModuleMenuClick={this.editModuleMenuClick}
              deleteModuleMenuClick={this.deleteModuleMenuClick}
              isPlaylistDetailsPage={isPlaylistDetailsPage}
              isManageContentActive={isManageContentActive}
              customizeInDraft={customizeInDraft}
            />

            {!collapsed && (
              // eslint-disable-next-line
              <SortableContainer
                mode={mode}
                lockAxis="y"
                lockOffset={['0%', '0%']}
                onSortEnd={handleTestsSort}
                lockToContainerEdges
                useDragHandle
              >
                {contentData.map((moduleData, index) => {
                  const {
                    assignments = [],
                    contentId,
                    contentType,
                    hidden,
                    status: testStatus,
                    contentTitle,
                  } = moduleData
                  const isTestType = contentType === 'test'
                  const statusList = assignments
                    .flatMap((item) => item.class || [])
                    .flatMap((item) => item.status || [])
                  const contentCompleted =
                    statusList.filter((_status) => _status === 'DONE')
                      .length === statusList.length && statusList.length > 0
                  const isAssigned = assignments.length > 0
                  const rowInlineStyle = {
                    opacity: hidden ? `.5` : `1`,
                    pointerEvents: hidden ? 'none' : 'all',
                  }

                  const progressData = getProgressData(
                    playlistMetrics,
                    _id,
                    contentId,
                    assignments
                  )
                  const {
                    contentId: _contentId = '',
                    moduleId: _moduleId = '',
                  } =
                    JSON.parse(
                      sessionStorage.getItem(`playlist/${playlistId}`)
                    ) || {}
                  const isPrevActiveContent =
                    contentId === _contentId && module._id === _moduleId
                  const assignmentRows = assignments.flatMap((assignment) => {
                    const {
                      testType,
                      _id: assignmentId,
                      maxAttempts,
                      assignedBy,
                      releaseScore,
                    } = assignment
                    return assignment.class.map(
                      ({
                        name,
                        status: _status,
                        assignedCount,
                        inProgressNumber,
                        inGradingNumber,
                        _id: classId,
                        gradedNumber = 0,
                        redirect = false,
                        releaseScore: _releaseScore,
                      }) => ({
                        name,
                        status: _status,
                        assignedCount,
                        inProgressNumber,
                        inGradingNumber,
                        testType,
                        assignmentId,
                        classId,
                        gradedNumber,
                        submittedCount: inGradingNumber + gradedNumber,
                        redirect,
                        assignedBy: assignedBy?.name,
                        maxAttempts,
                        releaseScore: _releaseScore || releaseScore,
                      })
                    )
                  })

                  // process user test activity to get student assignment actions
                  const uta = isStudent
                    ? this.processStudentAssignmentAction(
                        _id,
                        moduleData,
                        isAssigned,
                        assignmentRows
                      )
                    : {}

                  const moreMenu = (
                    <MenuStyled data-cy="assessmentItemMoreMenu">
                      <CaretUp className="fa fa-caret-up" />
                      {!isStudent &&
                        (testStatus === 'published' || isAssigned) && (
                          <Menu.Item
                            onClick={() => {
                              const testIdFromAssignments =
                                moduleData?.assignments?.[0]?.testId
                              const testId =
                                testIdFromAssignments || moduleData.contentId
                              assignTest(
                                _id,
                                testId,
                                moduleData.contentVersionId,
                                moduleData.resources
                              )
                            }}
                          >
                            Assign Test
                          </Menu.Item>
                        )}
                      {!isStudent && isAssigned && (
                        <Menu.Item
                          onClick={() =>
                            togglePlaylistTestDetails({
                              id: moduleData?.assignments?.[0]?.testId,
                              isTestAssigned:
                                moduleData?.assignments?.length > 0,
                            })
                          }
                        >
                          View Test Details
                        </Menu.Item>
                      )}
                      {!isStudent && (
                        <Menu.Item
                          data-cy="view-test"
                          onClick={() => {
                            const testIdFromAssignments =
                              moduleData?.assignments?.[0]?.testId
                            const testId =
                              testIdFromAssignments || moduleData.contentId
                            this.viewTest(
                              testId,
                              moduleData?.contentVersionId !== testId
                            )
                          }}
                        >
                          Preview Test
                        </Menu.Item>
                      )}
                      {!isStudent && (
                        <Menu.Item
                          data-cy="edit-test"
                          onClick={() => {
                            const testIdFromAssignments =
                              moduleData?.assignments?.[0]?.testId
                            const testId =
                              testIdFromAssignments || moduleData.contentId
                            this.onEditTest(
                              testId,
                              moduleData?.assignments?.length > 0
                            )
                          }}
                        >
                          Edit test
                        </Menu.Item>
                      )}
                      {!isStudent && isSparkMathPlaylist && (
                        <Menu.Item
                          data-cy="show-differentiation"
                          onClick={() =>
                            this.showDifferentiation(moduleData.contentId)
                          }
                        >
                          DIfferentiation
                        </Menu.Item>
                      )}
                      {!isStudent && isAssigned && (
                        <Menu.Item
                          data-cy="unassign-test"
                          onClick={() =>
                            this.unassignTest(
                              moduleData.contentId,
                              assignmentRows,
                              module._id
                            )
                          }
                        >
                          Unassign
                        </Menu.Item>
                      )}
                      {/* <Menu.Item
                          data-cy="moduleItemMoreMenuItem"
                          onClick={() => handleRemove(moduleIndex, moduleData.contentId)}
                        >
                          Remove
                        </Menu.Item> */}
                    </MenuStyled>
                  )

                  const showHideAssessmentButton = hasEditAccess &&
                    (urlHasUseThis ||
                      (status === 'published' && mode === 'embedded')) && (
                      <HideLinkLabel
                        textColor={themeColor}
                        fontWeight="Bold"
                        data-cy={
                          moduleData.hidden ? 'make-visible' : 'make-hidden'
                        }
                        onClick={() => this.hideTest(module._id, moduleData)}
                      >
                        {moduleData.hidden ? 'SHOW' : 'HIDE'}
                      </HideLinkLabel>
                    )

                  const assessmentInfoProgress = (
                    <InfoProgressBar
                      isDesktop={isDesktop}
                      isStudent={isStudent}
                      columnStyle={rowInlineStyle}
                      urlHasUseThis={urlHasUseThis}
                      data={progressData}
                      renderExtra={isMobile ? showHideAssessmentButton : ''}
                      isAssessment
                    />
                  )

                  const assessmentActions = urlHasUseThis ? (
                    !isStudent ? (
                      <>
                        {showHideAssessmentButton}
                        <LastColumn
                          align="center"
                          justify="flex-end"
                          paddingRight="0"
                          width={!urlHasUseThis || isStudent ? 'auto' : null}
                        >
                          {(urlHasUseThis ||
                            (status === 'published' && mode === 'embedded')) &&
                            (isAssigned ? (
                              <AssignmentButton
                                assigned={isAssigned}
                                style={rowInlineStyle}
                              >
                                <Button
                                  data-cy={
                                    currentAssignmentIds.includes(
                                      moduleData.contentId
                                    )
                                      ? 'hide-assignment'
                                      : 'show-assignment'
                                  }
                                  onClick={() =>
                                    toggleAssignments({
                                      testId: moduleData.contentId,
                                      playlistId,
                                    })
                                  }
                                  style={{ padding: '0 6px' }}
                                >
                                  <IconCheckSmall color={white} />
                                  &nbsp;&nbsp;
                                  {currentAssignmentIds.includes(
                                    moduleData.contentId
                                  ) || isPrevActiveContent
                                    ? 'HIDE ASSIGNMENTS'
                                    : 'SHOW ASSIGNMENTS'}
                                </Button>
                              </AssignmentButton>
                            ) : (
                              (urlHasUseThis ||
                                (status === 'published' &&
                                  mode === 'embedded')) &&
                              userRole !== roleuser.EDULASTIC_CURATOR && (
                                <AssignmentButton assigned={isAssigned}>
                                  <Button
                                    data-cy="assignButton"
                                    title={
                                      testStatus === 'draft' &&
                                      'Publish the test to assign'
                                    }
                                    disabled={testStatus === 'draft'}
                                    onClick={() =>
                                      assignTest(
                                        _id,
                                        moduleData.contentId,
                                        moduleData.contentVersionId,
                                        moduleData.resources
                                      )
                                    }
                                  >
                                    {isAssigned ? (
                                      <IconCheckSmall color={white} />
                                    ) : (
                                      <IconLeftArrow
                                        color={themeColor}
                                        width={13.3}
                                        height={9.35}
                                      />
                                    )}
                                    {isAssigned ? IS_ASSIGNED : NOT_ASSIGNED}
                                  </Button>
                                </AssignmentButton>
                              )
                            ))}

                          {isDesktop && (mode === 'embedded' || urlHasUseThis) && (
                            <Dropdown
                              overlay={moreMenu}
                              trigger={['click']}
                              style={rowInlineStyle}
                              arrow
                            >
                              <IconActionButton data-cy="moreMenu">
                                <IconMoreVertical
                                  width={5}
                                  height={14}
                                  color={themeColor}
                                />
                              </IconActionButton>
                            </Dropdown>
                          )}
                          {(urlHasUseThis || mode === 'embedded') &&
                            isManageContentActive &&
                            (hasEditAccess || customizeInDraft) && (
                              <IconActionButton
                                data-cy="assignmentDeleteOptionsIcon"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  this.deleteTest(
                                    moduleIndex,
                                    moduleData.contentId
                                  )
                                }}
                              >
                                <IconTrash color={themeColor} />
                              </IconActionButton>
                            )}
                        </LastColumn>
                      </>
                    ) : (
                      !moduleData.hidden && (
                        <>
                          <LastColumn
                            width={!urlHasUseThis || isStudent ? 'auto' : null}
                          >
                            {!isParentRoleProxy && uta.hideButton !== true && (
                              <AssignmentButton assigned={false}>
                                <Tooltip title={uta.title}>
                                  <Button
                                    data-cy={uta.text}
                                    onClick={uta.action}
                                    disabled={uta.disabled}
                                  >
                                    {uta.text}
                                  </Button>
                                </Tooltip>
                              </AssignmentButton>
                            )}
                            {uta.retake && !isParentRoleProxy && (
                              <AssignmentButton assigned={false}>
                                <Button
                                  data-cy={uta.retake.text}
                                  onClick={uta.retake.action}
                                >
                                  {uta.retake.text}
                                </Button>
                              </AssignmentButton>
                            )}
                          </LastColumn>
                        </>
                      )
                    )
                  ) : (
                    <LastColumn
                      width={!urlHasUseThis || isStudent ? 'auto' : null}
                    >
                      <AssignmentButton>
                        <Button
                          onClick={() => {
                            const testIdFromAssignments =
                              moduleData?.assignments?.[0]?.testId
                            const testId =
                              testIdFromAssignments || moduleData.contentId
                            this.viewTest(
                              testId,
                              moduleData?.contentVersionId !== testId
                            )
                          }}
                        >
                          <IconVisualization width="14px" height="14px" />
                          Preview
                        </Button>
                      </AssignmentButton>

                      {mode === 'embedded' &&
                      status !== 'published' &&
                      (hasEditAccess || customizeInDraft) ? (
                        <IconActionButton
                          data-cy="assignmentDeleteOptionsIcon"
                          onClick={(e) => {
                            e.stopPropagation()
                            this.deleteTest(moduleIndex, moduleData.contentId)
                          }}
                        >
                          <IconTrash color={themeColor} />
                        </IconActionButton>
                      ) : null}
                    </LastColumn>
                  )

                  const assessmentColums = isDesktop ? (
                    <>
                      {assessmentInfoProgress}
                      {assessmentActions}
                    </>
                  ) : (
                    <>
                      {assessmentInfoProgress}
                      <Dropdown
                        overlay={
                          <>
                            {assessmentActions}
                            {moreMenu}
                          </>
                        }
                        trigger={['click']}
                      >
                        <IconActionButton onClick={(e) => e.stopPropagation()}>
                          <IconMoreVertical
                            width={5}
                            height={14}
                            color={themeColor}
                          />
                        </IconActionButton>
                      </Dropdown>
                    </>
                  )

                  const testType = isTestType && urlHasUseThis && (
                    <TestTypeIcon
                      testType={
                        moduleData.assignments?.[0]?.testType ||
                        moduleData?.testType ||
                        testTypesConstants.TEST_TYPES_VALUES_MAP.PRACTICE
                      }
                    />
                  )

                  const identifiers = moduleData?.standards?.map(
                    (identifier) => identifier.name || []
                  )

                  const testTags = isTestType && (
                    <FlexContainer
                      height="25px"
                      alignItems="center"
                      justifyContent="flex-start"
                    >
                      <Tags
                        margin="5px 0px 0px 0px"
                        flexWrap="nowrap"
                        tags={identifiers}
                        completed={urlHasUseThis && contentCompleted}
                        show={2}
                        isPlaylist
                      />
                      {!urlHasUseThis && (
                        <TestStatus
                          status={moduleData.status}
                          view="tile"
                          noMargin={!moduleData.standardIdentifiers}
                        >
                          {moduleData.status}
                        </TestStatus>
                      )}
                    </FlexContainer>
                  )

                  const assignmentsRow = (currentAssignmentIds.includes(
                    moduleData.contentId
                  ) ||
                    isPrevActiveContent) &&
                    !isStudent && (
                      <AssignmentsClasses
                        moduleId={module?._id}
                        contentId={moduleData.contentId}
                        assignmentRows={assignmentRows}
                        handleActionClick={handleActionClick}
                      />
                    )

                  if (
                    mode === 'embedded' &&
                    !(isStudent && moduleData.hidden) &&
                    (hasEditAccess || customizeInDraft)
                  ) {
                    return (
                      <SortableElement
                        {...this.props}
                        key={`content-${moduleData.contentId}`}
                        moduleData={moduleData}
                        index={index}
                        id={index}
                        menu={menu}
                        dropContent={dropContent}
                        moreMenu={moreMenu}
                        isAssigned={isAssigned}
                        standardTags={moduleData.standardIdentifiers}
                        assignTest={this.assignTest}
                        viewTest={this.viewTest}
                        deleteTest={this.deleteTest}
                        onClick={(e) => e.stopPropagation()}
                        showResource={this.showResource}
                        urlHasUseThis={urlHasUseThis}
                        setEmbeddedVideoPreviewModal={
                          setEmbeddedVideoPreviewModal
                        }
                        assessmentColums={assessmentColums}
                        testTags={testTags}
                        testType={testType}
                        assignmentsRow={assignmentsRow}
                        isDesktop={isDesktop}
                        isStudent={isStudent}
                        showRightPanel={showRightPanel}
                        isManageContentActive={isManageContentActive}
                        toggleTest={() => this.hideTest(module._id, moduleData)}
                        fromPlaylist={fromPlaylist}
                        showHideAssessmentButton={showHideAssessmentButton}
                        onDrop={onDrop}
                        moduleIndex={moduleIndex}
                        isTestType={isTestType}
                      />
                    )
                  }

                  return (
                    !(isStudent && moduleData.hidden) && (
                      <AssignmentRowContainer
                        // using currentAssignmentIds to get info about current test (for which show assignments is clicked)
                        blurCurrentTestRow={
                          !(
                            currentAssignmentIds.includes(
                              moduleData.contentId
                            ) ||
                            !contentData.some((item) =>
                              currentAssignmentIds.includes(item.contentId)
                            )
                          )
                        }
                      >
                        <ModuleFocused />
                        <DragHandle>
                          <Bullet />
                        </DragHandle>
                        <div
                          className="item"
                          style={{ width: 'calc(100% - 35px)' }}
                        >
                          <Assignment
                            data-test={moduleData.contentId}
                            data-cy="moduleAssignment"
                            key={moduleData.contentId}
                            borderRadius="unset"
                            boxShadow="unset"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                            }}
                          >
                            {!isTestType && (
                              <PlaylistResourceRow
                                data={moduleData}
                                mode={mode}
                                urlHasUseThis={urlHasUseThis}
                                showResource={this.showResource}
                                showHideAssessmentButton={
                                  showHideAssessmentButton
                                }
                                isManageContentActive={isManageContentActive}
                                setEmbeddedVideoPreviewModal={
                                  setEmbeddedVideoPreviewModal
                                }
                              />
                            )}
                            {isTestType && (
                              <>
                                <Col
                                  data-cy="assigment-row-first"
                                  urlHasUseThis={urlHasUseThis}
                                  style={{
                                    ...rowInlineStyle,
                                    marginRight: urlHasUseThis && 'auto',
                                    width: isDesktop ? '' : '100%',
                                  }}
                                >
                                  <ModuleDataWrapper
                                    display={
                                      showRightPanel || !isDesktop
                                        ? 'block'
                                        : 'flex'
                                    }
                                  >
                                    <ModuleDataName
                                      onClick={() => {
                                        return (
                                          !isStudent &&
                                          togglePlaylistTestDetails({
                                            id: moduleData?.assignments?.length
                                              ? moduleData?.assignments?.[0]
                                                  ?.testId
                                              : moduleData?.contentId,
                                            ...(moduleData?.assignments?.length
                                              ? { requestLatest: false }
                                              : {
                                                  requestLatest:
                                                    testStatus !== 'draft',
                                                }),
                                            isTestAssigned:
                                              moduleData?.assignments?.length >
                                              0,
                                          })
                                        )
                                      }}
                                    >
                                      <Tooltip
                                        title={get(
                                          assignments,
                                          '[0].title',
                                          contentTitle
                                        )}
                                      >
                                        <span data-cy="testName">
                                          {get(
                                            assignments,
                                            '[0].title',
                                            contentTitle
                                          )}
                                        </span>
                                        {testType}
                                      </Tooltip>
                                      {!isDesktop && testTags}
                                    </ModuleDataName>
                                    {isDesktop && testTags}
                                  </ModuleDataWrapper>
                                </Col>
                                {assessmentColums}
                              </>
                            )}
                          </Assignment>
                          {moduleData?.resources?.length > 0 && (
                            <SubResource
                              data={moduleData}
                              urlHasUseThis={urlHasUseThis}
                              showResource={this.showResource}
                              isManageContentActive={isManageContentActive}
                              setEmbeddedVideoPreviewModal={
                                setEmbeddedVideoPreviewModal
                              }
                            />
                          )}
                          {assignmentsRow}
                        </div>
                      </AssignmentRowContainer>
                    )
                  )
                })}
              </SortableContainer>
            )}
          </ModuleWrapper>
          {playlistTestDetailsModalData?.isVisible && moduleIndex === 0 && (
            <PlaylistTestDetailsModal
              onClose={togglePlaylistTestDetails}
              modalInitData={playlistTestDetailsModalData}
              viewAsStudent={this.viewTest}
              playlistId={playlistId}
              onEditTest={this.onEditTest}
            />
          )}
        </>
      )
    )
  }
}

ModuleRow.propTypes = {
  setSelectedItemsForAssign: PropTypes.func.isRequired,
  module: PropTypes.object.isRequired,
  onCollapseExpand: PropTypes.func.isRequired,
  collapsed: PropTypes.bool.isRequired,
  padding: PropTypes.bool.isRequired,
  moduleStatus: PropTypes.bool.isRequired,
  status: PropTypes.string.isRequired,
  removeUnit: PropTypes.func.isRequired,
  editPlaylistTest: PropTypes.func.isRequired,
}

const enhance = compose(
  withRouter,
  connect(
    ({ curriculumSequence, user, test }) => ({
      checkedUnitItems: curriculumSequence.checkedUnitItems,
      isContentExpanded: curriculumSequence.isContentExpanded,
      assigned: curriculumSequence.assigned,
      userRole: getUserRole({ user }),
      isStudent: getUserRole({ user }) === 'student',
      classId: getCurrentGroup({ user }),
      playlistTestDetailsModalData:
        curriculumSequence?.playlistTestDetailsModal,
      proxyUserRole: proxyRole({ user }),
      currentAssignmentIds: curriculumSequence.currentAssignmentIds,
      isPreviewModalVisible: getIsPreviewModalVisibleSelector({ test }),
    }),
    {
      toggleUnitItem: toggleCheckedUnitItemAction,
      setSelectedItemsForAssign: setSelectedItemsForAssignAction,
      removeItemFromUnit: removeTestFromModuleAction,
      removeItemFromDestinationPlaylist: playlistTestRemoveFromModuleAction,
      removeUnit: removeUnitAction,
      startAssignment: startAssignmentAction,
      resumeAssignment: resumeAssignmentAction,
      updateCurriculumSequence: putCurriculumSequenceAction,
      togglePlaylistTestDetails: togglePlaylistTestDetailsModalWithId,
      toggleAssignments: toggleAssignmentsAction,
      setCurrentAssignmentIds: setCurrentAssignmentIdsAction,
      setIsTestPreviewVisible: setIsTestPreviewVisibleAction,
      editPlaylistTest: editPlaylistTestAction,
    }
  )
)

export default enhance(ModuleRow)
