import React from 'react'
import { get, isEmpty } from 'lodash'
import styled from 'styled-components'
import { CorrectAnswersContainer } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { ChoiceDimensions } from '@edulastic/constants'

import { getFontSize } from '../../../../utils/helpers'

import CorrectResponse from './CorrectResponse'
import AltResponses from './AltResponses'

const {
  maxWidth: defaultMaxW,
  minWidth: defaultMinW,
  minHeight: defaultMinH,
  maxHeight: defaultMaxH,
} = ChoiceDimensions

const ShowAnswers = ({
  t,
  uiStyle,
  showAnswerScore,
  validation,
  options,
  isPrintPreview,
  smallSize,
}) => {
  const styleType = get(uiStyle, 'type', 'button')
  const listItemMinWidth = get(uiStyle, 'choiceMinWidth', defaultMinW)
  const listItemMaxWidth = get(uiStyle, 'choiceMaxWidth', defaultMaxW)
  const fontSize = getFontSize(get(uiStyle, 'fontsize', 'normal'))

  const listItemStyle = {
    minHeight: defaultMinH,
    maxHeight: defaultMaxH,
    minWidth: listItemMinWidth,
    maxWidth: listItemMaxWidth,
  }

  const stemNumeration = uiStyle.validationStemNumeration
  const altResponses = get(validation, 'altResponses', [])

  return (
    <div data-cy="orderlist-showanswer-container">
      <CorrectAnswersContainer
        title={t('component.orderlist.correctanswer')}
        titleMargin="0px 0px 20px"
        showAnswerScore={showAnswerScore}
        score={validation?.validResponse?.score}
      >
        <AnswerContent>
          <CorrectResponse
            validation={validation}
            options={options}
            isPrintPreview={isPrintPreview}
            smallSize={smallSize}
            styleType={styleType}
            listItemStyle={listItemStyle}
            fontSize={fontSize}
            stemNumeration={stemNumeration}
          />
        </AnswerContent>
      </CorrectAnswersContainer>
      {!isEmpty(altResponses) && (
        <CorrectAnswersContainer
          title={t('component.orderlist.alternateAnswer')}
          titleMargin="0px 0px 20px"
        >
          <AltResponses
            uiStyle={uiStyle}
            smallSize={smallSize}
            options={options}
            styleType={styleType}
            fontSize={fontSize}
            altResponses={altResponses}
            showAnswerScore={showAnswerScore}
            stemNumeration={stemNumeration}
            listItemStyle={listItemStyle}
          />
        </CorrectAnswersContainer>
      )}
    </div>
  )
}

export default withNamespaces('assessment')(ShowAnswers)

const AnswerContent = styled.div`
  padding-left: 20px;
`
