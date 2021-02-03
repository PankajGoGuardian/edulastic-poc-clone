import React, { useEffect } from 'react'
import {
  notification,
  EduButton,
  FlexContainer,
  MathFormulaDisplay,
} from '@edulastic/common'
import { test as testConstants } from '@edulastic/constants'
import { Select, Tooltip } from 'antd'
import { ConfirmationModal } from '../../author/src/components/common/ConfirmationModal'

const { Option } = Select

const { languageCodes } = testConstants

const TestInfoModal = ({
  pauseAllowed,
  allowedTime,
  multiLanguageEnabled,
  showInformationModal,
  setSelectedLanguage,
  languagePreference,
  timedAssignment,
  hasInstruction,
  instruction,
  setShowInformationModal,
  attemptCount,
  maxAttempts,
  startAssignment,
  testId,
  assignmentId,
  testType,
  classId,
  assignmentTitle,
}) => {
  useEffect(() => {
    if (showInformationModal && !!languagePreference) {
      setSelectedLanguage('')
    }
  }, [showInformationModal])
  const timedContent = pauseAllowed ? (
    <p>
      This is a timed assignment which should be finished within the time limit
      set for this assignment. The time limit for this assignment is
      <span data-cy="test-time" style={{ fontWeight: 700 }}>
        {allowedTime / (60 * 1000)} minutes
      </span>
      . Do you want to continue?
    </p>
  ) : (
    <p>
      This is a timed assignment which should be finished within the time limit
      set for this assignment. The time limit for this assignment is
      <span data-cy="test-time" style={{ fontWeight: 700 }}>
        {allowedTime / (60 * 1000)} minutes
      </span>
      and you can’t quit in between. Do you want to continue?
    </p>
  )

  const handleContinue = () => {
    if (multiLanguageEnabled && !languagePreference) {
      return notification({ type: 'warn', messageKey: 'selectLanguage' })
    }
    if (attemptCount < maxAttempts) {
      startAssignment({
        testId,
        assignmentId,
        testType,
        classId,
        languagePreference,
      })
    }
    setShowInformationModal(false)
  }

  return (
    <ConfirmationModal
      textAlign="initial"
      title={
        <Tooltip title={assignmentTitle}>
          <div
            style={{
              width: '300px',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
            }}
          >
            {assignmentTitle}
          </div>
        </Tooltip>
      }
      visible={showInformationModal}
      destroyOnClose
      onCancel={() => setShowInformationModal(false)}
      footer={[
        <EduButton isGhost onClick={() => setShowInformationModal(false)}>
          Cancel
        </EduButton>,
        <EduButton data-cy="continue" onClick={handleContinue}>
          Continue
        </EduButton>,
      ]}
    >
      <FlexContainer flexDirection="column">
        {multiLanguageEnabled && (
          <>
            <p>
              This test is offered in multiple languages. Please select your
              preferred language.
            </p>
            <p>
              <Select
                getPopupContainer={(e) => e.parentElement}
                value={languagePreference}
                style={{ width: 200 }}
                onChange={setSelectedLanguage}
              >
                <Option value="" disabled>
                  Select Language
                </Option>
                <Option value={languageCodes.ENGLISH}>English</Option>
                <Option value={languageCodes.SPANISH}>Spanish</Option>
              </Select>
            </p>
          </>
        )}
        {timedAssignment && timedContent}
        {hasInstruction && instruction && (
          <MathFormulaDisplay
            dangerouslySetInnerHTML={{ __html: instruction }}
          />
        )}
      </FlexContainer>
    </ConfirmationModal>
  )
}

export default TestInfoModal
