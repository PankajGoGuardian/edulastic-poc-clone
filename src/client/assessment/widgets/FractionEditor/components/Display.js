import React, { useContext, useState } from 'react'
import styled from 'styled-components'
import get from 'lodash/get'
import PropTypes from 'prop-types'

import {
  Stimulus,
  FlexContainer,
  QuestionNumberLabel,
  AnswerContext,
  QuestionLabelWrapper,
  QuestionSubLabel,
  QuestionContentWrapper,
  EduSwitchStyled,
} from '@edulastic/common'
import Circles from './Circles'
import Rectangles from './Rectangles'
import AnnotationRnd from '../../../components/Annotations/AnnotationRnd'
import Instructions from '../../../components/Instructions'
import { CLEAR, SHOW, EDIT } from '../../../constants/constantsForQuestions'
import CorrectAnswerBox from './CorrectAnswerBox'
import SwitchWrapper from '../styled/SwitchWrapper'

const Display = ({
  saveAnswer,
  item,
  stimulus,
  evaluation,
  previewTab,
  showQuestionNumber,
  userAnswer,
  changePreviewTab,
  isReviewTab,
  showAnswerScore,
  hideCorrectAnswer,
  view,
  t,
}) => {
  const { fractionProperties = {}, annotations = [], itemScore } = item
  const { fractionType } = fractionProperties
  const count = fractionProperties.count || 1
  const selected = userAnswer
  const answerContext = useContext(AnswerContext)
  const hasAnnotations = annotations.length > 0
  const [showAnnotations, toggleAnnotationsVibility] = useState(hasAnnotations)
  const [isStudentResponseEdited, setStudentResponseEdited] = useState(false)
  const handleSelect = (index) => {
    if (
      previewTab === 'check' ||
      (previewTab === 'show' &&
        !answerContext.expressGrader &&
        answerContext.isAnswerModifiable)
    ) {
      saveAnswer([])
      changePreviewTab('clear')
      return
    }
    const _userAnswer = [...userAnswer]
    if (_userAnswer.includes(index)) {
      _userAnswer.splice(_userAnswer.indexOf(index), 1)
    } else {
      _userAnswer.push(index)
    }

    /**
     * @see https://snapwiz.atlassian.net/browse/EV-30495
     * avoid showing red highlight if user response edited from EG and updated response is not evaluated
     */
    if (answerContext.expressGrader && answerContext.isAnswerModifiable) {
      setStudentResponseEdited(true)
    }

    saveAnswer(_userAnswer)
  }
  return (
    <FractionDisplay justifyContent="flex-start" alignItems="baseline">
      <QuestionLabelWrapper>
        {showQuestionNumber && (
          <QuestionNumberLabel>{item.qLabel} </QuestionNumberLabel>
        )}
        {item.qSubLabel && (
          <QuestionSubLabel>({item.qSubLabel})</QuestionSubLabel>
        )}
      </QuestionLabelWrapper>

      <QuestionContentWrapper showQuestionNumber={showQuestionNumber}>
        <FlexContainer justifyContent="space-between">
          <FlexContainer
            justifyContent="flex-start"
            alignItems="baseline"
            width="100%"
            data-cy="questionTitle"
          >
            <StimulusContainer dangerouslySetInnerHTML={{ __html: stimulus }} />
          </FlexContainer>
          {hasAnnotations && answerContext.isAnswerModifiable && (
            <FlexContainer>
              <AnnotationsTitle>
                {t('component.fractionEditor.showAnnotations')}
              </AnnotationsTitle>
              <SwitchWrapper>
                <EduSwitchStyled
                  defaultChecked={showAnnotations}
                  onChange={(checked) => toggleAnnotationsVibility(checked)}
                />
              </SwitchWrapper>
            </FlexContainer>
          )}
        </FlexContainer>
        {/* content */}
        <FractionContainer className="__prevent-page-break">
          <FlexContainer
            alignItems="flex-start"
            flexDirection="row"
            flexWrap="wrap"
            justifyContent="flex-start"
          >
            {Array(count)
              .fill()
              .map((_, index) =>
                fractionType === 'circles' ? (
                  <Circles
                    fractionNumber={index}
                    sectors={fractionProperties.sectors}
                    selected={selected}
                    sectorClick={(_index) => handleSelect(_index)}
                    previewTab={previewTab}
                    isExpressGrader={answerContext.expressGrader}
                    isAnswerModifiable={answerContext.isAnswerModifiable}
                    evaluation={evaluation}
                    isReviewTab={isReviewTab}
                    isStudentResponseEdited={isStudentResponseEdited}
                  />
                ) : (
                  <Rectangles
                    fractionNumber={index}
                    rows={fractionProperties.rows}
                    columns={fractionProperties.columns}
                    selected={selected}
                    onSelect={(_index) => handleSelect(_index)}
                    previewTab={previewTab}
                    isExpressGrader={answerContext.expressGrader}
                    isAnswerModifiable={answerContext.isAnswerModifiable}
                    evaluation={evaluation}
                    isReviewTab={isReviewTab}
                    isStudentResponseEdited={isStudentResponseEdited}
                  />
                )
              )}
          </FlexContainer>
          {showAnnotations && (
            <AnnotationRnd
              question={item}
              setQuestionData={() => {}}
              disableDragging
              noBorder
            />
          )}
        </FractionContainer>
        {view && view !== EDIT && <Instructions item={item} />}
        {previewTab === SHOW && !hideCorrectAnswer && (
          <FractionContainer className="__prevent-page-break">
            <CorrectAnswerBox
              fractionProperties={fractionProperties}
              selected={Array(get(item, 'validation.validResponse.value', 1))
                .fill()
                .map((_, i) => i + 1)}
              showAnswerScore={showAnswerScore}
              itemScore={itemScore}
            />
          </FractionContainer>
        )}
      </QuestionContentWrapper>
    </FractionDisplay>
  )
}

Display.propTypes = {
  t: PropTypes.func.isRequired,
  previewTab: PropTypes.string,
  item: PropTypes.object,
  saveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.array,
  evaluation: PropTypes.any,
  showQuestionNumber: PropTypes.bool,
  stimulus: PropTypes.string,
}

Display.defaultProps = {
  previewTab: CLEAR,
  item: {},
  userAnswer: [],
  evaluation: [],
  showQuestionNumber: false,
  stimulus: '',
}

export default Display

const FractionDisplay = styled(FlexContainer)`
  overflow: auto;
`

const StimulusContainer = styled(Stimulus)`
  margin-top: 14px;
  margin-right: 20px;
  width: 100%;
`

const AnnotationsTitle = styled.span`
  margin-right: 5px;
`

const FractionContainer = styled.div`
  position: relative;
  min-width: 660px;
  min-height: 240px;
  padding: 0px 0px 1rem 0px;
`
