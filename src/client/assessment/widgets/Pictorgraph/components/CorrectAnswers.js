import React from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import keyBy from 'lodash/keyBy'
import get from 'lodash/get'

import { FlexContainer, Subtitle } from '@edulastic/common'

import { getStemNumeration } from '../../../utils/helpers'
import { IndexBox } from './DragItem/styled/IndexBox'
import { ColumnHeader, ColumnLabel } from '../styled/Column'
import { BorderedContainer } from './ClickToSelect/styled'
import { AnswerBox } from './DragItem/styled/AnswerBox'
import ClickToSelectShowAnswer from './ClickToSelect'

const CorrectAnswers = ({
  answersArr,
  stemNumeration,
  dragItemProps,
  possibleResponse,
  multiRow,
  title,
  classifications = [],
  isClickToSelect,
  droppedChoices,
  elementContainers,
}) => {
  const responsesById = keyBy(possibleResponse, 'id')
  const boxWidth = dragItemProps.width

  return (
    <>
      <Subtitle style={{ marginBottom: 20, marginTop: 20 }}>{title}</Subtitle>
      <ColWrapper multiRow={multiRow}>
        {isClickToSelect && (
          <ClickToSelectShowAnswer
            classifications={classifications}
            showClassName
            droppedChoices={droppedChoices}
            possibleResponses={possibleResponse}
            elementContainers={elementContainers}
            answers={answersArr}
            isShowAnswer
            stemNumeration={stemNumeration}
          />
        )}
        {!isClickToSelect &&
          classifications.map((classification, index) => {
            const answers = answersArr[classification.id] || []
            const indexValue = getStemNumeration(stemNumeration, index)

            return (
              <CorrectAnswerContainer multiRow={multiRow} minWidth={boxWidth}>
                {multiRow && (
                  <IndexBox style={{ margin: 5 }}>{indexValue}</IndexBox>
                )}
                {!multiRow && (
                  <ColumnHeader>
                    <IndexBox>{indexValue}</IndexBox>
                    <ColumnLabel
                      dangerouslySetInnerHTML={{ __html: classification.name }}
                    />
                  </ColumnHeader>
                )}
                <AnswersContainer>
                  {get(droppedChoices, classification.id, []).map((answer) => {
                    const { image, unit, count } =
                      responsesById[answer.id] || {}

                    return (
                      <BorderedContainer
                        margin="0 5px 5px 0"
                        padding="5px 10px"
                        key={classification.id}
                      >
                        <FlexContainer
                          flexDirection="column"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <AnswerBox
                            dangerouslySetInnerHTML={{ __html: image }}
                          />
                          <span>
                            {count} {unit}
                          </span>
                        </FlexContainer>
                      </BorderedContainer>
                    )
                  })}
                  {answers.map((answer) => {
                    const { image, unit, count } =
                      responsesById[answer.id] || {}
                    return (
                      <BorderedContainer
                        margin="0 5px 5px 0"
                        padding="5px 10px"
                        key={classification.id}
                      >
                        <FlexContainer
                          flexDirection="column"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <AnswerBox
                            dangerouslySetInnerHTML={{ __html: image }}
                          />
                          <span>
                            {count} {unit}
                          </span>
                        </FlexContainer>
                      </BorderedContainer>
                    )
                  })}
                </AnswersContainer>
              </CorrectAnswerContainer>
            )
          })}
      </ColWrapper>
    </>
  )
}

CorrectAnswers.propTypes = {
  answersArr: PropTypes.array.isRequired,
  stemNumeration: PropTypes.string.isRequired,
  dragItemProps: PropTypes.object.isRequired,
  possibleResponse: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  multiRow: PropTypes.bool.isRequired,
}

export default CorrectAnswers

const CorrectAnswerContainer = styled.div`
  display: flex;
  align-items: stretch;
  border: 1px dashed;
  margin-right: 16px;
  flex-direction: ${({ multiRow }) => (multiRow ? 'row' : 'column')};
  margin-bottom: ${({ multiRow }) => (multiRow ? '16px' : '40px')};
  min-width: ${({ minWidth }) => minWidth}px;
  &:last-child {
    margin-right: 0px;
  }
`

const ColWrapper = styled.div`
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
  justify-content: flex-start;
`

const AnswersContainer = styled.div`
  display: flex;
  padding: 10px;
  align-items: center;
`
