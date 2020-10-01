import React from 'react'
import {
  MathFormulaDisplay,
  QuestionNumberLabel,
  QuestionSubLabel,
  FlexContainer,
  QuestionLabelWrapper,
} from '@edulastic/common'
import Preview from '../../../client/assessment/widgets/MatrixChoice/components/Preview'

const MatrixChoice = ({
  item,
  showQuestionNumber,
  previewTab = 'clear',
  smallSize,
}) => {
  const saveAnswer = (prop) => console.log('prop', prop)

  return (
    <FlexContainer alignItems="flex-start" justifyContent="flex-start">
      <QuestionLabelWrapper>
        {showQuestionNumber && (
          <QuestionNumberLabel>{item.qLabel}</QuestionNumberLabel>
        )}
        {item.qSubLabel && (
          <QuestionSubLabel>({item.qSubLabel})</QuestionSubLabel>
        )}
      </QuestionLabelWrapper>

      <MathFormulaDisplay
        style={{ marginBottom: 20 }}
        dangerouslySetInnerHTML={{ __html: item.stimulus }}
      />
      {/* <div style={{ width: "100%" }}> */}
      <Preview
        smallSize={smallSize}
        saveAnswer={saveAnswer}
        userAnswer={userAnswer[item.id]}
        item={item}
        previewTab={previewTab}
      />
      {/* </div> */}
    </FlexContainer>
  )
}

export default MatrixChoice
