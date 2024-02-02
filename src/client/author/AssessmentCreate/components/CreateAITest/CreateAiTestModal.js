import { EduElse, EduIf, EduThen } from '@edulastic/common'
import React from 'react'

import { STATUS } from './ducks/constants'
import { StyledCreateAiTestModal } from './styled'
import FormFields from './FormFields'
import { StyledBetaTag } from '../../../AssessmentPage/VideoQuiz/styled-components/QuestionForm'
import VerticalTextSlider from '../../../../common/components/VerticalTextSlider'
import { questionGenerationLoadingTexts } from '../../../AssessmentPage/VideoQuiz/constants'

export const CreateAiTestModal = ({
  onCancel,
  isVisible,
  handleFieldDataChange,
  handleAiFormSubmit,
  addItems,
  aiTestStatus,
  aiFormContent,
  updateAlignment,
  isAIQuizFromManualAssessments = false,
}) => {
  return (
    <StyledCreateAiTestModal
      visible={isVisible}
      title={
        aiTestStatus === STATUS.INPROGRESS ? null : (
          <>
            Auto-generate items <StyledBetaTag>BETA</StyledBetaTag>
          </>
        )
      }
      footer={null}
      width="50%"
      onCancel={onCancel}
      centered
      padding="30px 60px"
      bodyPadding="0px"
      borderRadius="10px"
      closeTopAlign="14px"
      closeRightAlign="10px"
      closeIconColor="black"
      maskClosable={false}
      aiTestStatus={aiTestStatus}
      destroyOnClose
    >
      <EduIf condition={aiTestStatus === STATUS.INPROGRESS}>
        <EduThen>
          <VerticalTextSlider
            texts={questionGenerationLoadingTexts}
            textChangeInterval={5}
          />
        </EduThen>
        <EduElse>
          <FormFields
            handleFieldDataChange={handleFieldDataChange}
            handleAiFormSubmit={handleAiFormSubmit}
            onCancel={onCancel}
            addItems={addItems}
            aiFormContent={aiFormContent}
            updateAlignment={updateAlignment}
            isAIQuizFromManualAssessments={isAIQuizFromManualAssessments}
          />
        </EduElse>
      </EduIf>
    </StyledCreateAiTestModal>
  )
}
