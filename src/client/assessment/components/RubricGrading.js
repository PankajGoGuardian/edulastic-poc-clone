import React, { useState } from 'react'
import styled from 'styled-components'
import { isEqual } from 'lodash'
import { EduButton } from '@edulastic/common'
import { white } from '@edulastic/colors'
import PreviewRubricModal from '../../author/GradingRubric/Components/common/PreviewRubricModal'
import PreviewRubricCard from '../../author/GradingRubric/Components/common/PreviewRubricCard'

const RubricGrading = ({
  rubricData,
  maxScore,
  rubricFeedback,
  currentScore,
  onRubricResponse,
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
      (isEqual(res.rubricFeedback, rubricFeedback) ||
        currentScore !== res.maxScore)
    ) {
      onRubricResponse(res, true)
    }
  }

  return (
    <RubricsWrapper>
      <PreviewRubricCard
        rubricData={rubricData}
        rubricFeedback={rubricFeedback}
        onChange={submitRubricResponse}
      />
      <RubricsButton
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
        />
      )}
    </RubricsWrapper>
  )
}

export default RubricGrading

const RubricsWrapper = styled.div`
  margin-top: 15px;
`

const RubricsButton = styled(EduButton)`
  &:hover {
    &.ant-btn.ant-btn-primary {
      color: ${white};
    }
  }
`
