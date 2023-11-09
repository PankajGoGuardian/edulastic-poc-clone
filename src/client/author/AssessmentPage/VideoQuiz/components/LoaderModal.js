import React from 'react'
import { EduElse, EduIf, EduThen, EduButton } from '@edulastic/common'

import VerticalTextSlider from '../../../../common/components/VerticalTextSlider'

import {
  questionGenerationLoadingTexts,
  questionGenerationStatus,
} from '../constants'
import {
  StyledLoaderModal,
  StyledaiSummaryContainer,
  StyledCheckContainer,
  StyledIconCheck,
  StyledSummaryText,
  StyledSummaryMessage,
} from '../styled-components/AddBulkModal'

const LoaderModal = ({
  status,
  generatedQuestionsCount,
  setAiQuestionsGenerationStatus,
}) => {
  return (
    <StyledLoaderModal
      modalWidth="700px"
      visible={[
        questionGenerationStatus.IN_PROGRESS,
        questionGenerationStatus.SUCCESS,
      ].includes(status)}
      centered
      destroyOnClose
      closeIcon={null}
      footer={null}
      maskClosable={false}
    >
      <EduIf condition={status === questionGenerationStatus.IN_PROGRESS}>
        <EduThen>
          <VerticalTextSlider
            texts={questionGenerationLoadingTexts}
            textChangeInterval={3}
          />
        </EduThen>
        <EduElse>
          <StyledaiSummaryContainer>
            <StyledCheckContainer>
              <StyledIconCheck />
            </StyledCheckContainer>
            <StyledSummaryText>{`${generatedQuestionsCount} Questions Generated Successfully!`}</StyledSummaryText>
            <StyledSummaryMessage>
              We encourage you to review the questions and make any necessary
              adjustments to ensure they meet your learning objectives and
              preferences.
            </StyledSummaryMessage>
            <EduButton
              onClick={() =>
                setAiQuestionsGenerationStatus(questionGenerationStatus.INITIAL)
              }
            >
              Continue
            </EduButton>
          </StyledaiSummaryContainer>
        </EduElse>
      </EduIf>
    </StyledLoaderModal>
  )
}

export default LoaderModal
