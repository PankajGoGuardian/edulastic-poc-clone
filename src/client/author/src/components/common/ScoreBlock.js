import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import styled from 'styled-components'
import { EduIf } from '@edulastic/common'
import { IconCheck, IconClose } from '@edulastic/icons'
import { mediumDesktopExactWidth } from '@edulastic/colors'
import { getTypeAndMsgBasedOnScore } from '../../../../common/utils/helpers'

const Wrapper = styled.div`
  display: flex;
  align-self: stretch;
  align-items: center;
  height: 28px;
  padding: 0px 14px 0px 10px;
  margin-left: 5px;
  ${({ customStyle }) => ({ ...customStyle })};

  ${({ scoreType, theme }) => {
    const obj = {}
    if (scoreType === 'Correct') {
      obj.backgroundColor = theme.common.correctScoreBlockBgColor
      obj.fillColor = theme.common.correctScoreBlockIconFillColor
    } else if (scoreType === 'Partially Correct') {
      obj.backgroundColor = theme.common.partiallyCorrectScoreBlockBgColor
      obj.fillColor = theme.common.partiallyCorrectScoreBlockIconFillColor
    } else {
      obj.backgroundColor = theme.common.incorrectScoreBlockBgColor
      obj.fillColor = theme.common.incorrectScoreBlockIconFillColor
    }
    return `
      background-color: ${obj.backgroundColor};
      svg {
        position: unset;
        display: flex;
        transform: unset;
        margin-right: 1rem;
        fill: ${obj.fillColor};
      }
    `
  }}

  @media(min-width: ${mediumDesktopExactWidth}) {
    height: 32px;
  }
`

const ScoreBlock = ({ score, maxScore, showScore, customStyle }) => {
  const [type, status] = getTypeAndMsgBasedOnScore(score, maxScore)

  return showScore ? (
    <Wrapper customStyle={customStyle} scoreType={status} data-cy="scoreBlock">
      <div>
        <EduIf condition={status !== 'Incorrect'}>
          <IconCheck aria-label=", Correct answer" />
        </EduIf>
        <EduIf condition={status === 'Incorrect'}>
          <IconClose aria-label=", Incorrect answer" />
        </EduIf>
      </div>
      <div data-cy="score" type={type}>
        {status} ({score}/{maxScore})
      </div>
    </Wrapper>
  ) : null
}

ScoreBlock.propTypes = {
  score: PropTypes.number.isRequired,
  maxScore: PropTypes.number.isRequired,
  showScore: PropTypes.bool.isRequired,
  customStyle: PropTypes.object,
}

ScoreBlock.defaultProps = {
  customStyle: {},
}

const mapStateToProps = (state) => ({
  score: state?.itemScore?.score,
  maxScore: state?.itemScore?.maxScore,
  showScore: state?.itemScore?.showScore || false,
})

export default connect(mapStateToProps)(ScoreBlock)
