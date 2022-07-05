import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal } from 'antd'
import { themeColor } from '@edulastic/colors'
import {
  MathFormulaDisplay,
  CustomModalStyled,
  EduButton,
} from '@edulastic/common'
import {
  launchAssignmentFromLinkAction,
  startAssignmentAction,
  redirectToDashboardAction,
  retakeModalResponseAction,
} from './Assignments/ducks'
import { changeClassAction, getUserRole } from './Login/ducks'
import { showTestInstructionsAction } from './sharedDucks/AssignmentModule/ducks'
import { ConfirmationModal } from '../author/src/components/common/ConfirmationModal'

const StartAssignment = ({
  match,
  launchAssignment,
  changeClass,
  userRole,
  timedAssignment,
  startAssignment,
  redirectToDashboard,
  showInstruction,
  assignment,
  setShowTestInstruction,
  history,
  showRetakeModal,
  retakeModalResponse,
}) => {
  useEffect(() => {
    const { assignmentId, groupId } = match.params
    if (userRole === 'student') {
      changeClass(groupId)
    }
    launchAssignment({ assignmentId, groupId })
  }, [])

  useEffect(() => {
    if (timedAssignment) {
      const { assignmentId, groupId } = match.params
      const {
        pauseAllowed,
        allowedTime,
        testId,
        testType = 'assessment',
        safeBrowser,
        hasInstruction,
        instruction,
      } = timedAssignment
      let instructionContent = ''
      if (hasInstruction && instruction) {
        // TODO: Reuse TestInfoModal component
        instructionContent = (
          <p data-testid="instruction">
            <br />
            <MathFormulaDisplay
              dangerouslySetInnerHTML={{ __html: instruction }}
            />
          </p>
        )
      }

      const content = pauseAllowed ? (
        <p data-testid="timed-instruction">
          {' '}
          This is a timed assignment which should be finished within the time
          limit set for this assignment. The time limit for this assignment is{' '}
          <span data-cy="test-time" style={{ fontWeight: 700 }}>
            {' '}
            {allowedTime / (60 * 1000)} minutes
          </span>
          . Do you want to continue?
          {instructionContent}
        </p>
      ) : (
        <p>
          {' '}
          This is a timed assignment which should be finished within the time
          limit set for this assignment. The time limit for this assignment is{' '}
          <span data-cy="test-time" style={{ fontWeight: 700 }}>
            {' '}
            {allowedTime / (60 * 1000)} minutes
          </span>{' '}
          and you can’t quit in between. Do you want to continue?
          {instructionContent}
        </p>
      )

      Modal.confirm({
        title: 'Do you want to Continue ?',
        content,
        onOk: () => {
          console.warn('==Initiating assignment==', {
            testId,
            assignmentId,
            testType,
            groupId,
          })
          startAssignment({
            testId,
            assignmentId,
            testType,
            classId: groupId,
            safeBrowser,
          })
          console.warn('==Initiated assignment successfully==')
          Modal.destroyAll()
        },
        onCancel: () => {
          redirectToDashboard()
          Modal.destroyAll()
        },
        okText: 'Continue',
        centered: true,
        width: 500,
        okButtonProps: {
          style: { background: themeColor },
        },
      })
    }
  }, [timedAssignment])

  const cancelInstructions = () => {
    setShowTestInstruction({ showInstruction: false, assignment: {} })
    history.push('/home/assignments')
  }

  const continueToTest = () => {
    const { assignmentId, groupId } = match.params
    const { testId, testType = 'assessment', safeBrowser } = assignment
    startAssignment({
      testId,
      assignmentId,
      testType,
      classId: groupId,
      safeBrowser,
    })
    setShowTestInstruction({ showInstruction: false, assignment: {} })
  }

  if (showInstruction && assignment.instruction) {
    const { instruction } = assignment
    const footer = [
      <EduButton onClick={cancelInstructions} isGhost>
        <span>Cancel</span>
      </EduButton>,
      <EduButton onClick={continueToTest}>
        <span>Continue</span>
      </EduButton>,
    ]

    return (
      <CustomModalStyled
        centered
        destroyOnClose
        maskClosable={false}
        title="Do you want to Continue ?"
        visible={showInstruction}
        footer={footer}
        onOk={continueToTest}
        onCancel={cancelInstructions}
      >
        <MathFormulaDisplay
          dangerouslySetInnerHTML={{ __html: instruction }}
          style={{ marginTop: '1rem' }}
        />
      </CustomModalStyled>
    )
  }
  return (
    <div>
      {showRetakeModal && (
        <ConfirmationModal
          title="Retake Assignment"
          visible={showRetakeModal}
          destroyOnClose
          onCancel={() => retakeModalResponse(false)}
          footer={[
            <EduButton isGhost onClick={() => retakeModalResponse(false)}>
              Cancel
            </EduButton>,
            <EduButton
              data-cy="launch-retake"
              onClick={() => retakeModalResponse(true)}
            >
              Launch
            </EduButton>,
          ]}
        >
          <p>
            You are going to attempt the assignment again. Are you sure you want
            to Start?
          </p>
        </ConfirmationModal>
      )}
      <div> Initializing Assignment... </div>
    </div>
  )
}

StartAssignment.propTypes = {
  match: PropTypes.object.isRequired,
  launchAssignment: PropTypes.func.isRequired,
  changeClass: PropTypes.func.isRequired,
}

export default connect(
  ({ studentAssignment }) => ({
    timedAssignment: studentAssignment.unconfirmedTimedAssignment,
    showInstruction: studentAssignment.showInstruction,
    assignment: studentAssignment.assignment,
    showRetakeModal: studentAssignment.showRetakeModal,
  }),
  {
    launchAssignment: launchAssignmentFromLinkAction,
    startAssignment: startAssignmentAction,
    redirectToDashboard: redirectToDashboardAction,
    changeClass: changeClassAction,
    userRole: getUserRole,
    setShowTestInstruction: showTestInstructionsAction,
    retakeModalResponse: retakeModalResponseAction,
  }
)(StartAssignment)
