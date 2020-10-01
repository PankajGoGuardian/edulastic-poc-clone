import React from 'react'
import PropTypes from 'prop-types'

import { withNamespaces } from '@edulastic/localization'

import { getStemNumeration } from '../../utils/helpers'
import { StyledCorrectAnswerbox } from './styled/StyledCorrectAnswerbox'
import { CorrectAnswerTitle } from './styled/CorrectAnswerTitle'
import { AnswerBox } from './AnswerBox'

const CorrectAnswerBoxLayout = ({
  hasGroupResponses,
  fontSize,
  userAnswers,
  altAnsIndex,
  cleanValue,
  groupResponses,
  btnStyle,
  stemNumeration,
  centerText,
  t,
}) => {
  let results

  if (hasGroupResponses) {
    results = {}
    userAnswers.forEach((userAnswer) => {
      if (results[userAnswer.group] === undefined) {
        results[userAnswer.group] = []
      }
      results[userAnswer.group].push(userAnswer.data)
    })
  } else {
    results = userAnswers
  }

  const getLabel = (value) => {
    if (hasGroupResponses) {
      const Group = groupResponses.find((group) =>
        group.options.find((option) => option.value === value)
      )
      if (Group) {
        const Item = Group.options.find((option) => option.value === value)
        if (Item) {
          return Item.label
        }
      }
    } else {
      const Item = groupResponses.find((option) => option.value === value)
      if (Item) {
        return Item.label
      }
    }
  }

  return (
    <StyledCorrectAnswerbox fontSize={fontSize}>
      <CorrectAnswerTitle>
        {altAnsIndex
          ? `${t('component.cloze.altAnswers')} ${altAnsIndex}`
          : t('component.cloze.correctAnswer')}
      </CorrectAnswerTitle>
      <div>
        {hasGroupResponses &&
          Object.keys(results).map((key, index) => (
            <div key={index}>
              <h3>{groupResponses[key] && groupResponses[key].title}</h3>
              {results[key].map((value, responseIndex) => {
                const numeration = getStemNumeration(
                  stemNumeration,
                  responseIndex
                )
                const label =
                  Array.isArray(groupResponses) && !cleanValue
                    ? getLabel(value)
                    : value
                return (
                  <AnswerBox
                    key={numeration}
                    btnStyle={btnStyle}
                    index={index}
                    numeration={numeration}
                    label={label}
                    centerText={centerText}
                  />
                )
              })}
            </div>
          ))}

        {!hasGroupResponses &&
          results.map((result, index) => {
            const numeration = getStemNumeration(stemNumeration, index)
            const label =
              Array.isArray(groupResponses) &&
              groupResponses.length > 0 &&
              !cleanValue
                ? getLabel(result)
                : result
            return (
              <AnswerBox
                btnStyle={btnStyle}
                index={index}
                numeration={numeration}
                label={label}
                centerText={centerText}
              />
            )
          })}
      </div>
    </StyledCorrectAnswerbox>
  )
}

CorrectAnswerBoxLayout.propTypes = {
  hasGroupResponses: PropTypes.bool,
  fontSize: PropTypes.string,
  userAnswers: PropTypes.array,
  groupResponses: PropTypes.array,
  t: PropTypes.func.isRequired,
  cleanValue: PropTypes.bool,
  btnStyle: PropTypes.object,
  altAnsIndex: PropTypes.number,
  stemNumeration: PropTypes.string,
  centerText: PropTypes.bool,
}

CorrectAnswerBoxLayout.defaultProps = {
  hasGroupResponses: false,
  groupResponses: [],
  fontSize: '13px',
  userAnswers: [],
  cleanValue: false,
  altAnsIndex: 0,
  stemNumeration: 'numerical',
  btnStyle: {},
  centerText: false,
}

export default React.memo(withNamespaces('assessment')(CorrectAnswerBoxLayout))
