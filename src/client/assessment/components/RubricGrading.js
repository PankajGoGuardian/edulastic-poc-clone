import React, { useState } from 'react'
import styled from 'styled-components'
import { isEqual } from 'lodash'
import { EduButton } from '@edulastic/common'
import { themeColor, white } from '@edulastic/colors'
import PreviewRubricModal from '../../author/GradingRubric/Components/common/PreviewRubricModal'
import PreviewRubricCard from '../../author/GradingRubric/Components/common/PreviewRubricCard'

const RubricGrading = ({
  rubricData,
  maxScore,
  rubricFeedback,
  currentScore,
  onRubricResponse,
  isRubricDisabled,
  onChangeScore,
  clearRubricFeedback,
  InputType,
  inputScore,
  showWarningToClear,
  enableScoreInput,
  isGradedExternally,
  aiEvaluationStatus,
}) => {
  const [showPreviewRubric, setShowRubricModal] = useState(false)

  const handleRubricAction = () => {
    setShowRubricModal(true)
  }

  const handleRubricResponse = (res) => {
    onRubricResponse(res)
  }

  const submitRubricResponse = (res) => {
    setShowRubricModal(false)
    if (
      res &&
      (!isEqual(res.rubricFeedback, rubricFeedback) ||
        currentScore !== res.score)
    ) {
      onRubricResponse(res, true)
    } else {
      enableScoreInput()
    }
  }

  return (
    <RubricsWrapper isRubricDisabled={isRubricDisabled}>
      <PreviewRubricCard
        rubricData={rubricData}
        rubricFeedback={rubricFeedback}
        onChange={submitRubricResponse}
        onChangeScore={onChangeScore}
        clearRubricFeedback={clearRubricFeedback}
        InputType={InputType}
        inputScore={inputScore}
        showWarningToClear={showWarningToClear}
      />
      <RubricsButton
        data-cy="viewRubricButton"
        ml="0px"
        noHover
        isGhost
        width="100%"
        onClick={handleRubricAction}
      >
        view rubric details
      </RubricsButton>
      {showPreviewRubric && (
        <PreviewRubricModal
          visible={showPreviewRubric}
          currentRubricData={rubricData}
          onRubricResponseUpdate={handleRubricResponse}
          toggleModal={submitRubricResponse}
          maxScore={maxScore}
          rubricFeedback={rubricFeedback}
          isGradedExternally={isGradedExternally}
          aiEvaluationStatus={aiEvaluationStatus}
        />
      )}
    </RubricsWrapper>
  )
}

export default RubricGrading

const RubricsWrapper = styled.div`
  margin-top: 15px;
  opacity: ${({ isRubricDisabled }) => isRubricDisabled && 0.5};
  pointer-events: ${({ isRubricDisabled }) => isRubricDisabled && 'none'};
`

const RubricsButton = styled(EduButton)`
  &:hover {
    &.ant-btn.ant-btn-primary {
      background-color: ${themeColor};
      color: ${white};
    }
  }
`
