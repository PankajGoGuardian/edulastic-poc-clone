import React, { useState } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { themeColor } from '@edulastic/colors'
import { withNamespaces } from '@edulastic/localization'
import {
  CustomModalStyled,
  EduButton,
  FlexContainer,
  withKeyboard,
} from '@edulastic/common'
import { StyledMenu, MenuItem } from './styled'
import { getDisabledQuestionDropDownIndexMapSelector } from '../../../selectors/test'

const getItemStatusColor = (selectedCard) => {
  switch (selectedCard) {
    case 'notAnswered':
      return '#b1b1b1'
    case 'answered':
      return '#5aabeb'
    case 'bookmarks':
      return '#f8c165'
    default:
      return '#b1b1b1'
  }
}

const ReviewQuestionsModal = ({
  options,
  filterData = {},
  gotoQuestion,
  skipped = [],
  bookmarks,
  blockNavigationToAnsweredQuestions,
  handleClose,
  showReviewPopup,
  gotoSummary,
  previewPlayer,
  finishTest,
  disabledQuestionDropDownIndexMap,
}) => {
  const [selectedCard, setSelectedCard] = useState('notAnswered')
  const handleCardClick = (cardType) => setSelectedCard(cardType)
  const { totalQuestions, totalBookmarks, totalUnanswered } = filterData

  const getOptions = () => {
    switch (selectedCard) {
      case 'notAnswered':
        return options.filter((o, i) => skipped[i])
      case 'answered':
        return options.filter((o, i) => !skipped[i])
      case 'bookmarks':
        return options.filter((o, i) => bookmarks[i])
      default:
        return options
    }
  }

  const handleQuestionCLick = (e) => {
    handleClose()
    e && gotoQuestion(options[parseInt(e.key, 10)])
  }

  return (
    <CustomModalStyled
      maskClosable={false}
      textAlign="left"
      centered
      visible={showReviewPopup}
      onCancel={handleClose}
      destroyOnClose
      footer={[
        <EduButton
          height="40px"
          isGhost
          key="cancelButton"
          onClick={handleClose}
          style={{ padding: '10px 40px' }}
        >
          NO, CANCEL
        </EduButton>,
        <EduButton
          height="40px"
          key="okButton"
          onClick={previewPlayer ? finishTest : gotoSummary}
          style={{ padding: '10px 40px' }}
        >
          SUBMIT TEST
        </EduButton>,
      ]}
      title="Review"
      width="640px"
    >
      <div>
        <LeadingParagraph>
          You have answered{' '}
          <b>
            {totalQuestions - totalUnanswered} of {totalQuestions}
          </b>{' '}
          questions. Click on a question number to go back to it.
        </LeadingParagraph>
        <FlexContainer
          marginBottom="20px"
          alignItems="center"
          justifyContent="space-between"
        >
          <QuestionHead>Questions</QuestionHead>
          <ReviewFilters>
            <Card
              selected={selectedCard === 'notAnswered'}
              onClick={() => handleCardClick('notAnswered')}
            >
              <div>UNANSWERED ({totalUnanswered})</div>
            </Card>
            <Card
              selected={selectedCard === 'answered'}
              onClick={() => handleCardClick('answered')}
            >
              <div>ANSWERED ({totalQuestions - totalUnanswered})</div>
            </Card>
            <Card
              selected={selectedCard === 'bookmarks'}
              onClick={() => handleCardClick('bookmarks')}
            >
              <div>BOOKMARKED ({totalBookmarks})</div>
            </Card>
          </ReviewFilters>
        </FlexContainer>
        <StyledMenu
          style={{ height: '250px', overflow: 'auto', border: '0' }}
          onClick={handleQuestionCLick}
        >
          {getOptions().map((option) => (
            <MenuItem
              key={option}
              disabled={
                blockNavigationToAnsweredQuestions ||
                disabledQuestionDropDownIndexMap[option]
              }
              data-cy="questionSelectOptions"
              bg={getItemStatusColor(selectedCard)}
              onClick={() => {
                handleQuestionCLick({ key: option })
              }}
            >
              {option + 1}
            </MenuItem>
          ))}
        </StyledMenu>
        <LegendsContainer>
          <LegendWrapper>
            <LegendColor color={getItemStatusColor('unanswered')} />
            UNANSWERED
          </LegendWrapper>
          <LegendWrapper>
            <LegendColor color={getItemStatusColor('answered')} />
            ANSWERED
          </LegendWrapper>
          <LegendWrapper>
            <LegendColor color={getItemStatusColor('bookmarks')} />
            BOOKMARKED
          </LegendWrapper>
        </LegendsContainer>
      </div>
    </CustomModalStyled>
  )
}

const enhance = compose(
  withNamespaces('student'),
  connect((state) => ({
    // Direct subscribe to disable question dropdown for quester player
    disabledQuestionDropDownIndexMap: getDisabledQuestionDropDownIndexMapSelector(
      state
    ),
  }))
)

export default enhance(ReviewQuestionsModal)

const Card = withKeyboard(styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  font-size: 10px;
  cursor: pointer;
  padding: 2px 15px;
  border-right: 1px solid #1ab394;
  color: #1ab394;
  background: ${(props) => (props.selected ? '#3f85e5' : '#ffffff')};
  color: ${(props) => (props.selected ? '#ffffff' : '#40b395')};
  width: 130px;
  font-weight: 600;
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${themeColor};
  }
  &:hover {
    color: #ffffff;
    background: #3f85e5;
  }
  :last-child {
    border: none;
  }
`)

const LegendsContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
  font-size: 10px;
`
const LegendWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 10px;
`
const LegendColor = styled.div`
  background: ${(props) => props.color};
  margin-right: 10px;
  width: 12px;
  height: 12px;
`
const QuestionHead = styled.div`
  font-weight: bold;
  margin: 10px 0;
  font-size: 16px;
`

const ReviewFilters = styled.div`
  display: flex;
  border: 1px solid #40b394;
  border-radius: 3px;
`

const LeadingParagraph = styled.div`
  width: 90%;
`
