/* eslint-disable react/prop-types */
import React, { useState } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { withNamespaces } from '@edulastic/localization'
import { IconDescription } from '@edulastic/icons'
import { Menu } from 'antd'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-solid-svg-icons'
import { FlexContainer, withKeyboard } from '@edulastic/common'
import { StyledPopover, StyledButton, StyledMenu } from './styled'
import { themes } from '../../../../theme'
import { getDisabledQuestionDropDownIndexMapSelector } from '../../../selectors/test'

const {
  playerSkin: { parcc },
} = themes

const MenuItem = withKeyboard(Menu.Item)

const ReviewToolbar = ({
  t,
  options,
  filterData = {},
  gotoQuestion,
  skipped = [],
  bookmarks,
  blockNavigationToAnsweredQuestions,
  disabledQuestionDropDownIndexMap,
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

  const handleQuestionCLick = (e) =>
    e && gotoQuestion(options[parseInt(e.key, 10)])

  const content = (
    <StyledWrapper>
      <StyledMenu
        style={{ height: '250px', overflow: 'auto' }}
        onClick={handleQuestionCLick}
      >
        {getOptions().map((option) => (
          <MenuItem
            key={option}
            style={!skipped[option] && { paddingLeft: '33px' }}
            disabled={
              blockNavigationToAnsweredQuestions ||
              disabledQuestionDropDownIndexMap[option]
            }
            data-cy="questionSelectOptions"
            onClick={() => {
              handleQuestionCLick({ key: option })
            }}
          >
            {skipped[option] && (
              <FontAwesomeIcon
                icon={faCircle}
                aria-hidden="true"
                color={parcc.menuItem.activeColor}
              />
            )}
            Question {option + 1}
          </MenuItem>
        ))}
      </StyledMenu>
      <FlexContainer style={{ marginTop: '20px' }}>
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
    </StyledWrapper>
  )

  return (
    <Container className="parcc-question-list">
      <StyledPopover
        placement="bottom"
        content={content}
        getPopupContainer={(triggerNode) => triggerNode.parentNode}
        trigger={['hover', 'click']}
      >
        <StyledButton data-cy="options">
          <StyledIconList />
          <span>{t('common.test.review')}</span>
        </StyledButton>
      </StyledPopover>
    </Container>
  )
}

ReviewToolbar.propTypes = {
  t: PropTypes.func.isRequired,
}

const enhance = compose(
  withNamespaces('student'),
  connect((state) => ({
    // // Direct subscribe to disable question dropdown for paarc player
    disabledQuestionDropDownIndexMap: getDisabledQuestionDropDownIndexMapSelector(
      state
    ),
  }))
)
export default enhance(ReviewToolbar)

const StyledCounter = styled.div`
  margin-bottom: 10px;
  font-size: 16px;
  font-weight: bold;
`

const Card = withKeyboard(styled.div`
  height: 80px;
  width: 33%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  font-size: 10px;
  font-weight: 700;
  cursor: pointer;
`)

const Container = styled.div`
  margin-left: 10px;
  display: flex;
  .ant-popover-inner-content {
    padding: 0;
    min-width: 350px;
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
  }
  .ant-popover-content {
    margin-top: 7px;
  }
  .ant-popover-placement-bottom > .ant-popover-content > .ant-popover-arrow {
    display: block;
    top: 13px;
  }
`

const StyledIconList = styled(IconDescription)`
  ${({ theme }) => `
    width: ${theme.default.headerBookmarkIconWidth};
    height: ${theme.default.headerBookmarkIconHeight};
  `}
`

const StyledWrapper = styled.div``
