/* eslint-disable react/prop-types */
import { smallDesktopWidth, mediumDesktopExactWidth } from '@edulastic/colors'
import { IconBookmark, IconCheck } from '@edulastic/icons'
import { withKeyboard } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import PropTypes from 'prop-types'
import React from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { TokenStorage } from '@edulastic/api'
import { Tooltip } from '../../../common/utils/helpers'

const TestButton = ({
  t: i18Translate,
  checkAnswer,
  settings,
  answerChecksUsedForItem,
  toggleBookmark,
  isBookmarked = false,
  checkAnswerInProgress,
  blockNavigationToAnsweredQuestions = false,
  LCBPreviewModal,
  isPremiumContentWithoutAccess = false,
}) => {
  const handleCheckAnswer = () => {
    if (
      isPremiumContentWithoutAccess ||
      checkAnswerInProgress ||
      typeof checkAnswer !== 'function'
    ) {
      return null
    }
    checkAnswer()
  }

  const hideCheckAnswer = !TokenStorage.getAccessToken()
  return (
    <Container>
      {!blockNavigationToAnsweredQuestions && !LCBPreviewModal && (
        <Tooltip placement="top" title={i18Translate('common.test.bookmark')}>
          <StyledButton
            onClick={(e) => !isPremiumContentWithoutAccess && toggleBookmark(e)}
            active={isBookmarked}
            disabled={isPremiumContentWithoutAccess}
          >
            <StyledIconBookmark />
            <span>{i18Translate('common.test.bookmark')}</span>
          </StyledButton>
        </Tooltip>
      )}
      {settings.maxAnswerChecks > 0 && !hideCheckAnswer && (
        <Tooltip
          placement="top"
          title={
            checkAnswerInProgress
              ? i18Translate('common.test.checkAnswerInfoTexts.inProgress')
              : answerChecksUsedForItem >= settings.maxAnswerChecks
              ? i18Translate(
                  'common.test.checkAnswerInfoTexts.usageLimitExceeded'
                )
              : i18Translate('common.test.checkanswer')
          }
        >
          <StyledButton
            onClick={handleCheckAnswer}
            data-cy="checkAnswer"
            disabled={isPremiumContentWithoutAccess}
          >
            <StyledIconCheck />
            <span> {i18Translate('common.test.checkanswer')}</span>
          </StyledButton>
        </Tooltip>
      )}

      {/* {showHintButton(questions) ? (
        <Tooltip placement="top" title="Hint">
          <StyledButton onClick={handletoggleHints}>
            <StyledIconLightBulb />
            <span>{t("common.test.hint")}</span>
          </StyledButton>
        </Tooltip>
      ) : null} */}
    </Container>
  )
}

TestButton.propTypes = {
  t: PropTypes.func.isRequired,
  LCBPreviewModal: PropTypes.bool,
}

TestButton.defaultProps = {
  LCBPreviewModal: false,
}

const mapStateToProps = (state) => ({
  checkAnswerInProgress: state?.test?.checkAnswerInProgress,
})

const enhance = compose(withNamespaces('student'), connect(mapStateToProps))

export default enhance(TestButton)

const Container = styled.div`
  margin-left: 5px;
  display: flex;
`

const StyledButton = withKeyboard(styled.div`
  margin-right: 5px;
  text-transform: uppercase;
  display: flex;
  align-items: center;
  padding: 5px 10px;
  letter-spacing: 0.5px;
  border-radius: 4px;
  border: 1px solid;
  cursor: pointer;
  font-weight: 600;
  ${({ disabled }) => disabled && `cursor: not-allowed;`}
  ${({ theme, active }) => `
    height: ${theme.default.headerLeftButtonHeight};
    font-size: ${theme.default.headerButtonFontSize};
    color: ${
      active
        ? theme.header.headerButtonHoverColor
        : theme.header.headerButtonColor
    };
    background: ${
      active ? theme.default.headerLeftButtonBgHoverColor : 'transparent'
    };
    border-color: ${theme.default.headerButtonBorderColor};
    
    &:hover,
    &:focus,
    &:active {
      background: ${theme.default.headerLeftButtonBgHoverColor};
      border-color: ${theme.default.headerLeftButtonBgHoverColor};
      color: ${theme.header.headerButtonHoverColor};
      svg {
        fill: ${theme.header.headerButtonHoverColor};
      }
    }
    svg {
      margin-right: 10px;
      fill: ${
        active
          ? theme.header.headerButtonHoverColor
          : theme.header.headerButtonColor
      };
      &:hover {
        fill: ${theme.header.headerButtonHoverColor};
      }
    }
  `}

  @media (max-width: ${smallDesktopWidth}) {
    span {
      display: none;
    }
    svg {
      margin-right: 0px;
    }
  }

  @media (min-width: ${mediumDesktopExactWidth}) {
    height: 40px;
  }
`)

const StyledIconCheck = styled(IconCheck)`
  ${({ theme }) => `
    width: ${theme.default.headerCheckIconWidth};
    height: ${theme.default.headerCheckIconHeight};
  `}
`
const StyledIconBookmark = styled(IconBookmark)`
  ${({ theme }) => `
    width: ${theme.default.headerBookmarkIconWidth};
    height: ${theme.default.headerBookmarkIconHeight};
  `}
`
