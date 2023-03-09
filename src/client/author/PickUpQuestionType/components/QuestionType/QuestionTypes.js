/* eslint-disable react/prop-types */
import React from 'react'
import { get } from 'lodash'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'

import { largeDesktopWidth, mobileWidth } from '@edulastic/colors'

import { Dump } from '../../components'
import Card from '../Card/Card'
import { getCards } from './constants'
import { getIsAudioResponseQuestionEnabled } from '../../../TestPage/ducks'

const dummyArray = Array(7)
  .fill()
  .map((value, index) => index)

const PickUpQuestionTypes = ({
  onSelectQuestionType,
  questionType,
  isPassageItem,
  enableAudioResponseQuestion,
}) => {
  const allQuestionTypes = getCards(
    onSelectQuestionType,
    isPassageItem,
    enableAudioResponseQuestion
  )
  const selectedQuestionTypes = allQuestionTypes.filter(({ type }) => {
    if (Array.isArray(type)) {
      /**
       * some question types can be part of multiple categories
       * like math, text and dropdown
       * @see https://snapwiz.atlassian.net/browse/EV-13704
       */
      return type.includes(questionType)
    }
    return type === questionType
  })
  return (
    <FlexContainer>
      {selectedQuestionTypes.map(
        ({ cardImage, data, onSelectQuestionType: onSelect }) => (
          <Card
            key={data.title}
            title={data.title}
            data={data}
            cardImage={cardImage}
            onSelectQuestionType={onSelect}
          />
        )
      )}
      {dummyArray.map(() => (
        <Dump />
      ))}
    </FlexContainer>
  )
}

const FlexContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 1.2rem;
  @media only screen and (max-width: ${largeDesktopWidth}) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media only screen and (max-width: ${mobileWidth}) {
    grid-template-columns: 1fr;
  }
`

PickUpQuestionTypes.propTypes = {
  onSelectQuestionType: PropTypes.func.isRequired,
}

export default connect(
  (state) => ({
    isPassageItem: get(
      state,
      ['itemDetail', 'item', 'isPassageWithQuestions'],
      false
    ),
    enableAudioResponseQuestion: getIsAudioResponseQuestionEnabled(state),
  }),
  null
)(PickUpQuestionTypes)
