import React, { useState, useMemo, useEffect } from 'react'
import styled from 'styled-components'
import { white, title, themeColorLighter } from '@edulastic/colors'
import { sumBy, maxBy } from 'lodash'
import { notification } from '@edulastic/common'
import { Spin } from 'antd'
import PreviewRubricTable from './PreviewRubricTable'
import { ModalBody } from './ConfirmModal'
import { ConfirmationModal } from '../../../src/components/common/ConfirmationModal'
import { calculateScore } from './helper'

const PreviewRubricModal = ({
  visible,
  toggleModal,
  onRubricResponseUpdate,
  currentRubricData,
  maxScore,
  rubricFeedback,
  shouldValidate = true,
  isDisabled = false,
  hideTotalPoints = false,
  rubricDataLoading = false,
  isGradedExternally,
  aiEvaluationStatus,
}) => {
  const [obtained, setObtained] = useState(0)
  const [rubricResponse, setRubricResponse] = useState({})
  const [validateRubricResponse, setValidateRubricResponse] = useState(false)

  let localMaxScore = 0

  if (!maxScore)
    localMaxScore = useMemo(
      () =>
        sumBy(
          currentRubricData.criteria,
          (c) => maxBy(c.ratings, 'points').points
        ),
      [currentRubricData.criteria]
    )
  const titleContent = (
    <HeaderWrapper key="rubric-header">
      <span data-cy="rubricNameInPreview">{currentRubricData.name}</span>
      {!hideTotalPoints && (
        <span data-cy="totalRating">
          <span>{obtained}</span>&nbsp;<span>/</span>&nbsp;
          <span>{maxScore || localMaxScore}</span>
        </span>
      )}
    </HeaderWrapper>
  )

  const handleChange = (response) => {
    setObtained(response.score)
    setRubricResponse(response)
    setValidateRubricResponse(false)
    if (onRubricResponseUpdate) {
      onRubricResponseUpdate(response)
    }
  }

  const handleCloseRubric = () => {
    const rubricFeedbackLength = Object.keys(
      rubricResponse.rubricFeedback || {}
    ).length
    if (rubricFeedbackLength === 0 || !shouldValidate) {
      setValidateRubricResponse(false)
      toggleModal(null)
    } else if (rubricFeedbackLength === currentRubricData.criteria.length) {
      setValidateRubricResponse(false)
      toggleModal(rubricResponse)
    } else {
      notification({ messageKey: 'pleaseSelectRatingFromEachCriteria' })
      setValidateRubricResponse(true)
    }
  }

  useEffect(() => {
    if (rubricFeedback) {
      setObtained(calculateScore(currentRubricData, rubricFeedback))
    }
  }, [rubricFeedback])

  return (
    <StyledModal
      title={titleContent}
      centered
      textAlign="left"
      visible={visible}
      footer={null}
      onCancel={() => handleCloseRubric()}
      width="80%"
    >
      <StyledModalBody>
        {rubricDataLoading ? (
          <Spin />
        ) : (
          <PreviewRubricTable
            data={currentRubricData}
            handleChange={handleChange}
            rubricFeedback={rubricFeedback}
            validateRubricResponse={validateRubricResponse}
            isDisabled={isDisabled}
            isGradedExternally={isGradedExternally}
            aiEvaluationStatus={aiEvaluationStatus}
          />
        )}
      </StyledModalBody>
    </StyledModal>
  )
}

export default PreviewRubricModal

const StyledModal = styled(ConfirmationModal)`
  max-width: 80%;
  .ant-modal-content {
    background: ${white};
    padding: 25px 0px;
    .ant-modal-close-x {
      height: 60px;
      line-height: 60px;
      .ant-modal-close-icon {
        vertical-align: middle;
      }
    }
    .ant-modal-header {
      background: ${white};
      padding: 0px 42px;
    }
    .ant-modal-body {
      padding: 0px;
      box-shadow: none;
    }
  }
`

const StyledModalBody = styled(ModalBody)`
  align-items: start;
`

const HeaderWrapper = styled.div`
  > span:first-child {
    color: ${title};
    font-size: 25px;
    font-weight: ${(props) => props.theme.bold};
    width: 80%;
    display: inline-block;
    line-height: 30px;
  }

  > span:last-child {
    font-size: 35px;
    font-weight: 100;
    line-height: 1;

    > span:first-child {
      color: ${themeColorLighter};
      font-weight: ${(props) => props.theme.bold};
    }

    > span:last-child {
      color: ${title};
      font-weight: ${(props) => props.theme.bold};
    }
  }
`
