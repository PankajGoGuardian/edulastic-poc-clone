import React from 'react'
import PropTypes from 'prop-types'
import { find, isEmpty } from 'lodash'
import { CorrectAnswersContainer } from '@edulastic/common'
import AnswerBox from './AnswerBox'

const CorrectAnswers = ({
  mathAnswers,
  dropdownAnswers,
  textInputAnswers,
  mathUnitAnswers,
  altMathAnswers,
  altDropDowns,
  altInputs,
  altMathUnitAnswers,
  responseIds,
  extraOpts,
  singleResponseBox,
}) => {
  const { inputs, maths, dropDowns, mathUnits } = responseIds
  let validAnswers = []

  const extraOptions = (id) => {
    if (isEmpty(extraOpts)) {
      return {}
    }
    const opts = extraOpts[id]
    if (!opts) {
      return {}
    }

    return Object.values(opts).reduce(
      (acc, curr) => ({
        ...acc,
        ...curr,
      }),
      {}
    )
  }

  mathAnswers.map((answer) => {
    const { id, index, allowNumericOnly, allowedVariables } = find(
      maths,
      (d) => d.id === answer[0].id
    ) || { index: 0 }

    return validAnswers.push({
      index,
      isMath: true,
      value: answer[0].value,
      method: answer[0].method,
      options: {
        ...(answer[0].options || {}),
        ...extraOptions(id),
        allowedVariables,
        allowNumericOnly,
      },
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
    }
    const { index, id, allowedVariables, allowNumericOnly } = find(
      mathUnits,
      (d) => d.id === ans.id
    ) || { index: 0 }
    let { unit = '' } = ans.options || {}
    unit = unit.trim()

    Object.keys(specialCharMap).forEach((sChar) => {
      const regExp = new RegExp(sChar, 'g')
      unit = unit.replace(regExp, specialCharMap[sChar])
    })

    return validAnswers.push({
      index,
      value: `${ans.value}\\ ${unit}`,
      isMath: true,
      method: ans.method,
      options: {
        ...(ans.options || {}),
        ...extraOptions(id),
        allowedVariables,
        allowNumericOnly,
      },
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
      altMathAnswers[altIndex].forEach((answer) => {
        const { id, index, allowedVariables, allowNumericOnly } = find(
          maths,
          (d) => d.id === answer[0].id
        ) || {
          index: 0,
        }

        if (answer[0].value) {
          return _altAnswers.push({
            index,
            isMath: true,
            value: answer[0].value,
            method: answer[0].method,
            options: {
              ...(answer[0].options || {}),
              ...extraOptions(id),
              allowedVariables,
              allowNumericOnly,
            },
          })
        }
      })
    }
    if (altDropDowns[altIndex]) {
      altDropDowns[altIndex].forEach((answer) => {
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
      altInputs[altIndex].forEach((answer) => {
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
      altMathUnitAnswers[altIndex].forEach((answer) => {
        const { id, allowedVariables, allowNumericOnly, index } = find(
          mathUnits,
          (d) => d.id === answer.id
        ) || {
          index: 0,
        }
        let { unit = '' } = answer.options || {}

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
            method: answer.method,
            options: {
              ...(answer.options || {}),
              ...extraOptions(id),
              allowedVariables,
              allowNumericOnly,
            },
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
        {validAnswers.map((answer) => (
          <AnswerBox
            key={answer.id}
            answer={answer}
            singleResponseBox={singleResponseBox}
          />
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
              <AnswerBox
                key={altAns.id}
                answer={altAns}
                singleResponseBox={singleResponseBox}
              />
            ))}
          </CorrectAnswersContainer>
        ))}
    </>
  )
}

CorrectAnswers.propTypes = {
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

CorrectAnswers.defaultProps = {
  responseIds: {
    dropDown: [],
    inputs: [],
    math: [],
  },
}

export default CorrectAnswers
