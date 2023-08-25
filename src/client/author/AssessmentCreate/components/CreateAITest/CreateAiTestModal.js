import { CustomModalStyled, EduIf, FlexContainer } from '@edulastic/common'
import React from 'react'
import { Spin } from 'antd'

import { STATUS, STATUS_TEXT } from './ducks/constants'
import { StyledFilterLabel } from './styled'
import FormFields from './FormFields'
import { StyledBetaTag } from '../../../AssessmentPage/VideoQuiz/styled-components/QuestionForm'

export const CreateAiTestModal = ({
  onCancel,
  isVisible,
  handleFieldDataChange,
  handleAiFormSubmit,
  addItems,
  aiTestStatus,
  aiFormContent,
  updateAlignment,
}) => {
  return (
    <CustomModalStyled
      visible={isVisible}
      title={
        <>
          Auto-generate items <StyledBetaTag>BETA</StyledBetaTag>
        </>
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
      destroyOnClose
    >
      <Spin spinning={aiTestStatus === STATUS.INPROGRESS}>
        <FormFields
          handleFieldDataChange={handleFieldDataChange}
          handleAiFormSubmit={handleAiFormSubmit}
          onCancel={onCancel}
          addItems={addItems}
          aiFormContent={aiFormContent}
          updateAlignment={updateAlignment}
        />
        <EduIf condition={aiTestStatus !== STATUS.INIT}>
          <FlexContainer mt="1rem" justifyContent="center" alignItems="center">
            <StyledFilterLabel>{STATUS_TEXT[aiTestStatus]}</StyledFilterLabel>
          </FlexContainer>
        </EduIf>
      </Spin>
    </CustomModalStyled>
  )
}
