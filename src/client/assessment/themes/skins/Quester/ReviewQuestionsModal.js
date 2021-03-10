import React, { useState } from 'react'
import { compose } from 'redux'
import styled from 'styled-components'
import { withNamespaces } from '@edulastic/localization'
import { Menu } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { CustomModalStyled, FlexContainer } from '@edulastic/common'
import { StyledButton, StyledMenu } from './styled'
import { themes } from '../../../../theme'

const {
  playerSkin: { parcc },
} = themes

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
}) => {
  const [selectedCard, setSelectedCard] = useState('all')
  const handleCardClick = (cardType) => setSelectedCard(cardType)
  const { totalQuestions, totalBookmarks, totalUnanswered } = filterData
  const cardStyle = {
    background: parcc.review.card.background,
  }

  const getOptions = () => {
    switch (selectedCard) {
      case 'notAnswered':
        return options.filter((o, i) => skipped[i])
      case 'bookmarks':
        return options.filter((o, i) => bookmarks[i])
      default:
        return options
    }
  }

  const handleQuestionCLick = (e) => {
    handleClose()
    gotoQuestion(options[parseInt(e.key, 10)])
  }

  return (
    <CustomModalStyled
      maskClosable={false}
      textAlign="left"
      centered
      visible={showReviewPopup}
      onCancel={handleClose}
      destroyOnClose
      footer={null}
      title="Review"
      width="50%"
    >
      <StyledWrapper>
        <p>
          You have answered{' '}
          <b>
            {totalQuestions - totalUnanswered} of {totalQuestions}
          </b>{' '}
          questions. Click on a question number to go back to it.
        </p>
        <div>
          <StyledButton
            style={{ width: '130px', textAlign: 'center' }}
            onClick={previewPlayer ? finishTest : gotoSummary}
          >
            Submit Test
          </StyledButton>
        </div>
        <div style={{ fontWeight: 'bold', margin: '10px 0', fontSize: '16px' }}>
          Test questions
        </div>
        <FlexContainer style={{ marginBottom: '20px' }}>
          <Card
            style={selectedCard === 'all' ? cardStyle : {}}
            onClick={() => handleCardClick('all')}
          >
            <StyledCounter>{totalQuestions}</StyledCounter>
            <div>All questions</div>
          </Card>
          <Card
            style={selectedCard === 'notAnswered' ? cardStyle : {}}
            onClick={() => handleCardClick('notAnswered')}
          >
            <StyledCounter>{totalUnanswered}</StyledCounter>
            <div>Not answered</div>
          </Card>
          <Card
            style={selectedCard === 'bookmarks' ? cardStyle : {}}
            onClick={() => handleCardClick('bookmarks')}
          >
            <StyledCounter>{totalBookmarks}</StyledCounter>
            <div>Bookmarks</div>
          </Card>
        </FlexContainer>
        <StyledMenu
          style={{ height: '250px', overflow: 'auto', border: '0' }}
          onClick={handleQuestionCLick}
        >
          {getOptions().map((option) => (
            <Menu.Item
              key={option}
              disabled={blockNavigationToAnsweredQuestions}
              data-cy="questionSelectOptions"
            >
              {skipped[option] && (
                <FontAwesomeIcon
                  icon={faCircle}
                  aria-hidden="true"
                  color={parcc.menuItem.activeColor}
                />
              )}
              Q{option + 1}
            </Menu.Item>
          ))}
        </StyledMenu>
      </StyledWrapper>
    </CustomModalStyled>
  )
}

const enhance = compose(withNamespaces('student'))

export default enhance(ReviewQuestionsModal)

const StyledCounter = styled.div`
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
`

const Card = styled.div`
  height: 60px;
  width: 33.33%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
`

const StyledWrapper = styled.div``
