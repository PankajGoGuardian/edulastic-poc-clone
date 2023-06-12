import React, { useState } from 'react'
import produce from 'immer'
import PropTypes from 'prop-types'
import {
  cloneDeep,
  set,
  get,
  forEach,
  find,
  findIndex,
  isEmpty,
  isObject,
} from 'lodash'
import { math } from '@edulastic/constants'
import { dynamicVarChecks } from '@edulastic/constants/const/math'
import CorrectAnswers from '../../../components/CorrectAnswers'
import MathFormulaAnswer from './ClozeMathAnswer'
import MathUnitAnswer from './ClozeMathUnitAnswer'
import DropDownAnswer from './ClozeDropDownAnswer'
import InputAnswer from './ClozeInputAnswer'
import { CorrectAnswerContainer } from '../../../styled/CorrectAnswerContainer'
import { CheckboxLabel } from '../../../styled/CheckboxWithLabel'
import { Row } from '../../../styled/WidgetOptions/Row'
import { Col } from '../../../styled/WidgetOptions/Col'

const { methods, simplifiedOptions } = math

const initialMethod = {
  method: methods.EQUIV_SYMBOLIC,
  value: '',
  options: {},
}

const ClozeMathAnswers = ({
  item,
  setQuestionData,
  fillSections,
  cleanSections,
  onChangeKeypad,
  view,
  t,
}) => {
  const [correctTab, setCorrectTab] = useState(0)
  const isAlt = !isEmpty(item.validation.altResponses)

  const _addAnswer = () => {
    const newItem = cloneDeep(item)
    const mathValidAnswers = cloneDeep(
      get(newItem, 'validation.validResponse.value', [])
    )
    const inputValidAnswers = cloneDeep(
      get(newItem, 'validation.validResponse.textinput.value', [])
    )
    const dropdownValidAnswers = cloneDeep(
      get(newItem, 'validation.validResponse.dropdown.value', [])
    )
    const mathUnitValidAnswers = cloneDeep(
      get(newItem, 'validation.validResponse.mathUnits.value', [])
    )

    if (!newItem.validation.altResponses) {
      newItem.validation.altResponses = []
    }
    if (!isEmpty(mathValidAnswers)) {
      mathValidAnswers.map((answer) =>
        answer.map((method) => {
          method.value = ''
          return method
        })
      )
    }
    if (!isEmpty(inputValidAnswers)) {
      inputValidAnswers.map((answer) => {
        answer.value = ''
        return answer
      })
    }
    if (!isEmpty(dropdownValidAnswers)) {
      dropdownValidAnswers.map((answer) => {
        answer.value = ''
        return answer
      })
    }

    if (!isEmpty(mathUnitValidAnswers)) {
      mathUnitValidAnswers.map((answer) => {
        answer.value = ''
        return answer
      })
    }

    newItem.validation.altResponses.push({
      score: newItem?.validation?.validResponse?.score,
      value: mathValidAnswers,
      textinput: { value: inputValidAnswers },
      dropdown: { value: dropdownValidAnswers },
      mathUnits: { value: mathUnitValidAnswers },
    })
    setQuestionData(newItem)
    setCorrectTab(correctTab + 1)
  }

  const handleCloseTab = (tabIndex) => {
    const newItem = cloneDeep(item)
    if (newItem.validation.altResponses) {
      newItem.validation.altResponses.splice(tabIndex, 1)
    }
    if (isEmpty(newItem.validation.altResponses)) {
      delete newItem.validation.altResponses
    }
    setQuestionData(newItem)
    if (correctTab >= 1) {
      setCorrectTab(correctTab - 1)
    }
  }

  const changeScore = (score) => {
    if (score < 0) {
      return
    }
    const points = parseFloat(score, 10)
    setQuestionData(
      produce(item, (draft) => {
        if (correctTab === 0) {
          draft.validation.validResponse.score = points
        } else if (correctTab > 0) {
          draft.validation.altResponses[correctTab - 1].score = points
        }
      })
    )
  }

  const changeExtraOptions = (draft, value, oldOptions, answerId) => {
    let hasSimplified = false
    Object.keys(value).forEach((optkey) => {
      if (
        draft.variable?.enabled &&
        !(
          oldOptions?.[optkey] === value[optkey] ||
          draft.extraOpts?.[optkey] === value[optkey]
        ) &&
        dynamicVarChecks.includes(optkey)
      ) {
        draft.rdv = true
      }
      if (simplifiedOptions.includes(optkey)) {
        hasSimplified = true
        value.isSimplified = true

        if (!draft.extraOpts) {
          draft.extraOpts = {}
        }
        if (!draft.extraOpts[answerId]) {
          draft.extraOpts[answerId] = {}
        }
        draft.extraOpts[answerId][correctTab] = {
          [optkey]: value[optkey],
        }
        delete value[optkey]
      }
    })

    if (!hasSimplified) {
      if (draft.extraOpts && draft.extraOpts[answerId]) {
        delete draft.extraOpts[answerId][correctTab]
      }
      delete value.isSimplified
    }
    return [draft.extraOpts, value]
  }

  const _changeCorrectMethod = ({ methodId, methodIndex, prop, value }) => {
    setQuestionData(
      produce(item, (draft) => {
        const validAnswers = get(draft, 'validation.validResponse.value', [])
        let _value = value
        forEach(validAnswers, (answer) => {
          if (answer[0].id === methodId) {
            if (prop === 'options') {
              const [extraOpts, updatedValue] = changeExtraOptions(
                draft,
                _value,
                answer[methodIndex][prop],
                methodId
              )
              if (extraOpts) {
                draft.extraOpts = extraOpts
              }
              _value = updatedValue
            }
            answer[methodIndex][prop] = _value
            // reset the previous options whenever method changes
            // @see https://snapwiz.atlassian.net/browse/EV-17804
            if (prop === 'method' && isObject(answer[methodIndex]?.options)) {
              answer[methodIndex].options = {}
            }
          }
        })
      })
    )
  }

  const _addCorrectMethod = (methodId) => {
    const newItem = cloneDeep(item)
    const validAnswers = get(newItem, 'validation.validResponse.value', [])
    forEach(validAnswers, (answer) => {
      if (answer[0].id === methodId) {
        answer.push({ ...initialMethod, id: methodId })
      }
    })
    set(newItem, `validation.validResponse.value`, validAnswers)
    setQuestionData(newItem)
  }

  const _addAltMethod = (answerIndex) => (methodId) => {
    const newItem = cloneDeep(item)
    forEach(newItem.validation.altResponses[answerIndex].value, (answer) => {
      if (answer[0].id === methodId) {
        answer.push({ ...initialMethod, id: methodId })
      }
    })
    setQuestionData(newItem)
  }

  const _deleteCorrectMethod = ({ methodIndex, methodId }) => {
    const newItem = cloneDeep(item)
    forEach(newItem.validation.validResponse.value, (answer) => {
      if (answer[0].id === methodId) {
        answer.splice(methodIndex, 1)
      }
    })
    setQuestionData(newItem)
  }

  const _deleteAltMethod = (answerIndex) => ({ methodIndex, methodId }) => {
    const newItem = cloneDeep(item)
    forEach(newItem.validation.altResponses[answerIndex].value, (answer) => {
      if (answer[0].id === methodId) {
        answer.splice(methodIndex, 1)
      }
    })
    setQuestionData(newItem)
  }

  const _updateDropDownCorrectAnswer = ({ value, dropDownId }) => {
    const newItem = cloneDeep(item)
    const validDropDownAnswers = get(
      newItem,
      'validation.validResponse.dropdown.value',
      []
    )
    forEach(validDropDownAnswers, (answer) => {
      if (answer.id === dropDownId) {
        answer.value = value
      }
    })
    set(
      newItem,
      'validation.validResponse.dropdown.value',
      validDropDownAnswers
    )
    setQuestionData(newItem)
  }

  const _updateInputCorrectAnswer = ({ value, answerId }) => {
    const newItem = cloneDeep(item)
    const validInputsAnswers = get(
      newItem,
      'validation.validResponse.textinput.value',
      []
    )
    forEach(validInputsAnswers, (answer) => {
      if (answer.id === answerId) {
        answer.value = value
      }
    })
    const splitWidth = Math.max(value.split('').length * 9, 100)
    const width = Math.min(splitWidth, 400)
    const ind = findIndex(
      newItem.responseContainers,
      (container) => container.id === answerId
    )
    if (ind === -1) {
      const { responseIds } = newItem
      const obj = {}
      Object.keys(responseIds).forEach((key) => {
        const resp = responseIds[key].find((inp) => inp.id === answerId)
        if (resp) {
          obj.index = resp.index
          obj.id = resp.id
          obj.type = key
          obj.widthpx = width
          // newItem.responseContainers.push(obj);
        }
      })
    } else {
      newItem.responseContainers[ind].widthpx = width
    }
    set(newItem, `validation.validResponse.textinput.value`, validInputsAnswers)
    setQuestionData(newItem)
  }

  // -----|-----|-----|------ Alternate answers handlers -----|-----|-----|------ //

  const _changeAltMethod = (answerIndex) => ({
    methodId,
    methodIndex,
    prop,
    value,
  }) => {
    setQuestionData(
      produce(item, (draft) => {
        let _value = value
        forEach(draft.validation.altResponses[answerIndex].value, (answer) => {
          if (answer[0].id === methodId) {
            if (prop === 'options') {
              const [extraOpts, updatedValue] = changeExtraOptions(
                draft,
                _value,
                answer[methodIndex][prop],
                methodId
              )
              if (extraOpts) {
                draft.extraOpts = extraOpts
              }
              _value = updatedValue
            }
            answer[methodIndex][prop] = _value
            // reset the previous options whenever method changes
            // @see https://snapwiz.atlassian.net/browse/EV-17804
            if (prop === 'method' && isObject(answer[methodIndex]?.options)) {
              answer[methodIndex].options = {}
            }
          }
        })
      })
    )
  }

  const _changeAltInputMethod = (answerIndex) => ({ value, answerId }) => {
    const newItem = cloneDeep(item)
    forEach(
      newItem.validation.altResponses[answerIndex].textinput.value,
      (answer) => {
        if (answer.id === answerId) {
          answer.value = value
        }
      }
    )
    setQuestionData(newItem)
  }

  const _changeAltDropDownMethod = (answerIndex) => ({ value, dropDownId }) => {
    const newItem = cloneDeep(item)
    forEach(
      newItem.validation.altResponses[answerIndex].dropdown.value,
      (answer) => {
        if (answer.id === dropDownId) {
          answer.value = value
        }
      }
    )
    setQuestionData(newItem)
  }

  const handleValidationOptionsChange = (name, value) => {
    setQuestionData(
      produce(item, (draft) => {
        draft.validation[name] = value
      })
    )
  }

  const handleAllowedOptions = (type, mathInputIndex) => (
    option,
    variables
  ) => {
    setQuestionData(
      produce(item, (draft) => {
        const prop = draft.responseIds[type].find(
          (el) => el.index === mathInputIndex
        )
        if (prop) {
          prop[option] = variables
        }

        /**
         * this part will case useTemplate option is true
         * if the template is changed, we should be reset correct answer
         */
        if (option === 'template') {
          const correctAns = draft.validation.validResponse.value || []
          correctAns.forEach((answer) => {
            if (answer) {
              answer.forEach((ans) => {
                if (ans.value) {
                  ans.value = ''
                }
              })
            }
          })
          if (draft.validation.altResponses) {
            draft.validation.altResponses.forEach((altAns) => {
              altAns.value.forEach((altAnswer) => {
                if (altAnswer) {
                  altAnswer.forEach((ans) => {
                    if (ans.value) {
                      ans.value = ''
                    }
                  })
                }
              })
            })
          }
        }
      })
    )
  }

  // -----|-----|-----|------ Math Unit answers handler -----|-----|-----|------ //
  const updateValidation = (
    validation,
    altAnswerIndex,
    answerId,
    prop,
    value
  ) => {
    let prevAnswers = validation.validResponse.mathUnits.value
    if (altAnswerIndex !== null) {
      prevAnswers = validation.altResponses[altAnswerIndex].mathUnits.value
    }
    forEach(prevAnswers, (answer) => {
      if (answer.id === answerId) {
        if (prop === 'unit') {
          answer.options[prop] = value
        } else {
          answer[prop] = value
        }
        // reset the previous options whenever method changes
        // @see https://snapwiz.atlassian.net/browse/EV-17804
        if (prop === 'method' && isObject(answer.options)) {
          answer.options = {}
        }
      }
    })
    if (altAnswerIndex !== null) {
      validation.altResponses[altAnswerIndex].mathUnits.value = prevAnswers
    } else {
      validation.validResponse.mathUnits.value = prevAnswers
    }
    return validation
  }

  const _onChangeMathUnitAnswer = (altAnswerIndex) => ({
    answerId,
    prop,
    value,
  }) => {
    setQuestionData(
      produce(item, (draft) => {
        let _value = value
        const mathUnitAnswer = draft.validation.validResponse.mathUnits.value.find(
          (el) => el.id === answerId
        )
        if (prop === 'options') {
          const [extraOpts, updatedValue] = changeExtraOptions(
            draft,
            _value,
            mathUnitAnswer,
            answerId
          )
          if (extraOpts) {
            draft.extraOpts = extraOpts
          }
          _value = updatedValue
        }
        if (prop === 'value' || prop === 'unit' || prop === 'options') {
          draft.validation = updateValidation(
            draft.validation,
            altAnswerIndex,
            answerId,
            prop,
            _value
          )
        } else {
          const mathUnitResponses = draft.responseIds.mathUnits
          forEach(mathUnitResponses, (res) => {
            if (res.id === answerId) {
              res[prop] = _value
            }
          })
          if (prop === 'keypadMode' || prop === 'customUnits') {
            draft.validation = updateValidation(
              draft.validation,
              altAnswerIndex,
              answerId,
              'unit',
              ''
            )
          }
          // Updating validation method
          if (prop === 'method') {
            draft.validation = updateValidation(
              draft.validation,
              altAnswerIndex,
              answerId,
              prop,
              _value
            )
          }
          draft.responseIds.mathUnits = mathUnitResponses
        }
      })
    )
  }

  const mathAnswers = get(item, 'validation.validResponse.value', [])
  const inputAnswers = get(item, 'validation.validResponse.textinput.value', [])
  const dropDownAnswers = get(
    item,
    'validation.validResponse.dropdown.value',
    []
  )
  const mathUnitsAnswers = get(
    item,
    'validation.validResponse.mathUnits.value',
    []
  )

  const { responseIds } = item

  let orderedAnswers = []
  if (responseIds) {
    Object.keys(responseIds).map((key) =>
      responseIds[key].map((r) => {
        if (key === 'inputs') {
          const _answer = find(inputAnswers, (valid) => valid.id === r.id)
          orderedAnswers.push({ index: r.index, type: key, ..._answer })
        } else if (key === 'maths') {
          const _answer = find(mathAnswers, (valid) => valid[0].id === r.id)
          orderedAnswers.push({
            value: _answer,
            index: r.index,
            type: key,
            allowNumericOnly: r.allowNumericOnly,
            allowedVariables: r.allowedVariables,
            useTemplate: r.useTemplate,
            template: r.template,
          })
        } else if (key === 'dropDowns') {
          const _answer = find(dropDownAnswers, (valid) => valid.id === r.id)
          orderedAnswers.push({ index: r.index, type: key, ..._answer })
        } else if (key === 'mathUnits') {
          const _answer = find(mathUnitsAnswers, (valid) => valid.id === r.id)
          orderedAnswers.push({ type: key, ..._answer, ...r })
        }
        return null
      })
    )
  }
  orderedAnswers = orderedAnswers.sort((a, b) => a.index - b.index)

  return (
    <CorrectAnswers
      onTabChange={setCorrectTab}
      correctTab={correctTab}
      onAdd={_addAnswer}
      validation={item.validation}
      onCloseTab={handleCloseTab}
      onChangePoints={changeScore}
      points={
        correctTab === 0
          ? get(item, 'validation.validResponse.score', 1)
          : get(item, `validation.altResponses[${correctTab - 1}].score`)
      }
      fillSections={fillSections}
      cleanSections={cleanSections}
      questionType={item?.title}
      isCorrectAnsTab={correctTab === 0}
    >
      <CorrectAnswerContainer style={{ border: 'none', padding: '0px' }}>
        <Row>
          <Col span={24}>
            {orderedAnswers.map((answer, index) => {
              if (answer.type === 'inputs') {
                if (correctTab === 0) {
                  return (
                    <InputAnswer
                      key={index}
                      item={item}
                      onChange={_updateInputCorrectAnswer}
                      answers={[answer]}
                      tabIndex={correctTab}
                    />
                  )
                }
                if (isAlt) {
                  const _altInputVlaues = get(
                    item,
                    `validation.altResponses[${
                      correctTab - 1
                    }].textinput.value`,
                    []
                  )
                  const altAnswer = {
                    ...answer,
                    ...find(_altInputVlaues, (av) => av.id === answer.id),
                  }
                  return (
                    <InputAnswer
                      item={item}
                      key={index}
                      onChange={_changeAltInputMethod(correctTab - 1)}
                      answers={[altAnswer]}
                      tabIndex={correctTab}
                    />
                  )
                }
              }
              if (answer.type === 'maths') {
                const answerId = answer.value[0].id
                const extraOpts = get(
                  item,
                  ['extraOpts', answerId, correctTab],
                  {}
                )

                if (correctTab === 0) {
                  return (
                    <MathFormulaAnswer
                      item={item}
                      key={index}
                      onChange={_changeCorrectMethod}
                      onChangeAllowedOptions={handleAllowedOptions(
                        answer.type,
                        index
                      )}
                      onAdd={_addCorrectMethod}
                      onDelete={_deleteCorrectMethod}
                      answers={[answer]}
                      onChangeKeypad={onChangeKeypad}
                      extraOptions={extraOpts}
                      tabIndex={correctTab}
                    />
                  )
                }
                if (isAlt) {
                  const _altMathVlaues = get(
                    item,
                    `validation.altResponses[${correctTab - 1}].value`,
                    []
                  )
                  const altAnswer = {
                    ...answer,
                    value: find(_altMathVlaues, (av) => av[0].id === answerId),
                  }
                  return (
                    <MathFormulaAnswer
                      key={index}
                      item={item}
                      onChange={_changeAltMethod(correctTab - 1)}
                      onChangeAllowedOptions={handleAllowedOptions(
                        answer.type,
                        index
                      )}
                      onAdd={_addAltMethod(correctTab - 1)}
                      onDelete={_deleteAltMethod(correctTab - 1)}
                      answers={[altAnswer]}
                      onChangeKeypad={onChangeKeypad}
                      extraOptions={extraOpts}
                      tabIndex={correctTab}
                    />
                  )
                }
              }
              if (answer.type === 'dropDowns') {
                if (correctTab === 0) {
                  return (
                    <DropDownAnswer
                      key={index}
                      item={item}
                      onChange={_updateDropDownCorrectAnswer}
                      answers={[answer]}
                      tabIndex={correctTab}
                    />
                  )
                }
                if (isAlt) {
                  const _altDropDownsVlaues = get(
                    item,
                    `validation.altResponses[${correctTab - 1}].dropdown.value`,
                    []
                  )
                  const altAnswer = {
                    ...answer,
                    ...find(_altDropDownsVlaues, (av) => av.id === answer.id),
                  }
                  return (
                    <DropDownAnswer
                      key={index}
                      item={item}
                      onChange={_changeAltDropDownMethod(correctTab - 1)}
                      answers={[altAnswer]}
                      tabIndex={correctTab}
                    />
                  )
                }
              }
              if (answer.type === 'mathUnits') {
                const answerId = answer.id
                const extraOpts = get(
                  item,
                  ['extraOpts', answerId, correctTab],
                  {}
                )
                if (correctTab === 0) {
                  return (
                    <MathUnitAnswer
                      key={index}
                      item={item}
                      answer={answer}
                      onChange={_onChangeMathUnitAnswer(null)}
                      onChangeAllowedOptions={handleAllowedOptions(
                        answer.type,
                        index
                      )}
                      onChangeKeypad={onChangeKeypad}
                      extraOptions={extraOpts}
                      tabIndex={correctTab}
                      view={view}
                    />
                  )
                }
                if (isAlt) {
                  const _altMathUnitsVlaues = get(
                    item,
                    `validation.altResponses[${
                      correctTab - 1
                    }].mathUnits.value`,
                    []
                  )
                  const altAnswer = {
                    ...answer,
                    ...find(_altMathUnitsVlaues, (av) => av.id === answer.id),
                  }
                  return (
                    <MathUnitAnswer
                      key={index}
                      item={item}
                      answer={altAnswer}
                      onChange={_onChangeMathUnitAnswer(correctTab - 1)}
                      onChangeAllowedOptions={handleAllowedOptions(
                        answer.type,
                        index
                      )}
                      onChangeKeypad={onChangeKeypad}
                      extraOptions={extraOpts}
                      tabIndex={correctTab}
                      view={view}
                    />
                  )
                }
              }
              return null
            })}
          </Col>
        </Row>
      </CorrectAnswerContainer>
      <CheckboxLabel
        data-cy="ignoreCase"
        onChange={() =>
          handleValidationOptionsChange(
            'ignoreCase',
            !item.validation.ignoreCase
          )
        }
        checked={!!item.validation.ignoreCase}
      >
        {t('component.multipart.ignoreCase')}
      </CheckboxLabel>
      <CheckboxLabel
        data-cy="allowSingleLetterMistake"
        onChange={() =>
          handleValidationOptionsChange(
            'allowSingleLetterMistake',
            !item.validation.allowSingleLetterMistake
          )
        }
        checked={!!item.validation.allowSingleLetterMistake}
      >
        {t('component.multipart.allowsinglelettermistake')}
      </CheckboxLabel>
      <CheckboxLabel
        data-cy="mixAndMatchAltAnswer"
        onChange={() =>
          handleValidationOptionsChange(
            'mixAndMatch',
            !item.validation.mixAndMatch
          )
        }
        checked={!!item.validation.mixAndMatch}
      >
        {t('component.multipart.mixNmatch')}
      </CheckboxLabel>
    </CorrectAnswers>
  )
}

ClozeMathAnswers.propTypes = {
  item: PropTypes.object.isRequired,
  onChangeKeypad: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  view: PropTypes.string.isRequired,
}

ClozeMathAnswers.defaultProps = {
  fillSections: () => {},
  cleanSections: () => {},
}

export default ClozeMathAnswers
