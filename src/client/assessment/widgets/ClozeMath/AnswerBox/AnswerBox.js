/* eslint-disable array-callback-return */
import React from 'react'
import PropTypes from 'prop-types'
import { find, isEmpty } from 'lodash'
import styled from 'styled-components'
import { CorrectAnswersContainer } from '@edulastic/common'
import AnswerBoxText from './AnswerBoxText'

const AnswerBox = ({
  mathAnswers,
  dropdownAnswers,
  textInputAnswers,
  mathUnitAnswers,
  altMathAnswers,
  altDropDowns,
  altInputs,
  altMathUnitAnswers,
  responseIds,
}) => {
  const { inputs, maths, dropDowns, mathUnits } = responseIds
  let validAnswers = []
  mathAnswers.map((answer) => {
    const { index } = find(maths, (d) => d.id === answer[0].id) || { index: 0 }
    return validAnswers.push({
      index,
      value: answer[0].value,
      isMath: true,
    })
  })

  dropdownAnswers.map((answer) => {
    const { index } = find(dropDowns, (d) => d.id === answer.id) || {
      index: 0,
    }
    return validAnswers.push({
      index,
      value: answer.value,
      isMath: false,
    })
  })

  textInputAnswers.map((answer) => {
    const { index } = find(inputs, (d) => d.id === answer.id) || { index: 0 }
    return validAnswers.push({
      index,
      value: answer.value,
      isMath: false,
    })
  })

  mathUnitAnswers.map((ans) => {
    const specialCharMap = {
      '#': '\\#',
      '\\$': '\\$',
      '%': '\\%',
      '&': '\\&',
      _: '\\_',
    }
    const { index } = find(mathUnits, (d) => d.id === ans.id) || { index: 0 }
    let { unit = '' } = ans.options
    unit = unit.trim()

    Object.keys(specialCharMap).map((sChar) => {
      const regExp = new RegExp(sChar, 'g')
      unit = unit.replace(regExp, specialCharMap[sChar])
    })

    return validAnswers.push({
      index,
      value: `${ans.value}\\ ${unit}`,
      isMath: true,
    })
  })

  validAnswers = validAnswers.sort((a, b) => a.index - b.index)

  const maxAltLen = Math.max(
    altMathAnswers.length,
    altDropDowns.length,
    altInputs.length
  )
  const altAnswers = new Array(maxAltLen).fill(true).map((_, altIndex) => {
    const _altAnswers = []

    if (altMathAnswers[altIndex]) {
      altMathAnswers[altIndex].map((answer) => {
        const { index } = find(maths, (d) => d.id === answer[0].id) || {
          index: 0,
        }
        if (answer[0].value) {
          return _altAnswers.push({
            index,
            value: answer[0].value,
            isMath: true,
          })
        }
      })
    }
    if (altDropDowns[altIndex]) {
      altDropDowns[altIndex].map((answer) => {
        const { index } = find(dropDowns, (d) => d.id === answer.id) || {
          index: 0,
        }
        if (answer.value) {
          return _altAnswers.push({
            index,
            value: answer.value,
            isMath: false,
          })
        }
      })
    }

    if (altInputs[altIndex]) {
      altInputs[altIndex].map((answer) => {
        const { index } = find(inputs, (d) => d.id === answer.id) || {
          index: 0,
        }
        if (answer.value) {
          return _altAnswers.push({
            index,
            value: answer.value,
            isMath: false,
          })
        }
      })
    }

    if (altMathUnitAnswers[altIndex]) {
      altMathUnitAnswers[altIndex].map((answer) => {
        const { index } = find(mathUnits, (d) => d.id === answer.id) || {
          index: 0,
        }
        let { unit = '' } = answer.options

        if (
          unit &&
          unit.search('text{') === -1 &&
          (unit.search('f') !== -1 || unit.search(/\s/g) !== -1)
        ) {
          unit = `\\text{${unit}}`
        }
        if (answer.value) {
          return _altAnswers.push({
            index,
            value:
              answer.value.search('=') === -1
                ? `${answer.value}\\ ${unit}`
                : answer.value.replace(/=/gm, `\\ ${unit}=`),
            isMath: true,
          })
        }
      })
    }

    return _altAnswers.sort((a, b) => a.index - b.index)
  })

  return (
    <>
      <CorrectAnswersContainer
        minHeight="auto"
        title="Correct answers"
        padding="15px 25px 20px"
        titleMargin="0px 0px 12px"
      >
        {validAnswers.map((answer, index) => (
          <Answer key={index}>
            <Label>{answer.index + 1}</Label>
            <AnswerBoxText isMath={answer.isMath}>{answer.value}</AnswerBoxText>
          </Answer>
        ))}
      </CorrectAnswersContainer>

      {!isEmpty(altAnswers) &&
        altAnswers.map((altAnswer, index) => (
          <CorrectAnswersContainer
            minHeight="auto"
            title={`Alternate answers ${index + 1}`}
            padding="15px 25px 20px"
            titleMargin="0px 0px 12px"
          >
            {altAnswer.map((altAns) => (
              <Answer>
                <Label>{altAns.index + 1}</Label>
                <AnswerBoxText isMath={altAns.isMath}>
                  {altAns.value}
                </AnswerBoxText>
              </Answer>
            ))}
          </CorrectAnswersContainer>
        ))}
    </>
  )
}

AnswerBox.propTypes = {
  mathAnswers: PropTypes.array.isRequired,
  altMathAnswers: PropTypes.array.isRequired,
  dropdownAnswers: PropTypes.array.isRequired,
  altDropDowns: PropTypes.array.isRequired,
  textInputAnswers: PropTypes.array.isRequired,
  altInputs: PropTypes.array.isRequired,
  mathUnitAnswers: PropTypes.array.isRequired,
  altMathUnitAnswers: PropTypes.array.isRequired,
  responseIds: PropTypes.object,
}

AnswerBox.defaultProps = {
  responseIds: {
    dropDown: [],
    inputs: [],
    math: [],
  },
}

export default AnswerBox

const Answer = styled.div`
  display: inline-flex;
  margin-right: 15px;
  min-height: 32px;
  margin-bottom: 10px;
  border: ${({
    theme: {
      answerBox: { borderWidth, borderStyle, borderColor },
    },
  }) => `${borderWidth} ${borderStyle} ${borderColor}`};
  border-radius: ${({
    theme: {
      answerBox: { borderRadius },
    },
  }) => borderRadius};
`

const Label = styled.div`
  width: 32px;
  color: ${({ theme }) => theme.answerBox.indexBoxColor};
  background: ${({ theme }) => theme.answerBox.indexBoxBgColor};
  border-top-left-radius: ${({ theme }) => theme.answerBox.borderRadius};
  border-bottom-left-radius: ${({ theme }) => theme.answerBox.borderRadius};
  display: flex;
  align-items: center;
  align-self: stretch;
  justify-content: center;
  font-weight: 700;
`
