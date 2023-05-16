import React, { useEffect, useState, useContext, useMemo } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { cloneDeep, get, isEmpty } from 'lodash'
import { helpers, AnswerContext } from '@edulastic/common'
import JsxParser from 'react-jsx-parser/lib/react-jsx-parser.min'
import { SHOW, CHECK, CLEAR, EDIT } from '../../constants/constantsForQuestions'
import AnswerBox from './AnswerBox'
import { withCheckAnswerButton } from '../../components/HOC/withCheckAnswerButton'
import ClozeDropDown from './ClozeMathBlock/ClozeDropDown'
import ClozeInput from './ClozeMathBlock/ClozeInput'
import ClozeMathInput from './ClozeMathBlock/ClozeMathInput'
import ClozeMathWithUnit from './ClozeMathBlock/ClozeMathWithUnit'
import ClozeDropDownAnswerDisplay from './ClozeMathDisplay/ClozeDropDownAnswerDisplay'
import ClozeInputAnswerDisplay from './ClozeMathDisplay/ClozeInputAnswerDisplay'
import ClozeMathAnswerDisplay from './ClozeMathDisplay/ClozeMathAnswerDisplay'
import MathSpanWrapper from '../../components/MathSpanWrapper'
import Instructions from '../../components/Instructions'
import { getStylesFromUiStyleToCssStyle } from '../../utils/helpers'

const ClozeMathPreview = ({
  type,
  item,
  stimulus,
  userAnswer,
  saveAnswer,
  evaluation,
  testItem,
  options,
  responseIds,
  isExpressGrader,
  changePreviewTab, // Question level
  changePreview, // Item level,
  isV1Migrated,
  disableResponse,
  isPrintPreview,
  allOptions = [],
  enableMagnifier = false,
  hideCorrectAnswer,
  answerScore,
  setDropDownInUse,
  showAnswerScore,
}) => {
  const [newHtml, setNewHtml] = useState('')
  const { isAnswerModifiable } = useContext(AnswerContext)

  const [allAnswers, correctScore, altScores] = useMemo(() => {
    if (isExpressGrader || type === SHOW) {
      const answers = {
        mathAnswers: get(item, 'validation.validResponse.value', []),
        dropdownAnswers: get(
          item,
          'validation.validResponse.dropdown.value',
          []
        ),
        textInputAnswers: get(
          item,
          'validation.validResponse.textinput.value',
          []
        ),
        mathUnitAnswers: get(
          item,
          'validation.validResponse.mathUnits.value',
          []
        ),
        altMathAnswers: get(item, 'validation.altResponses', []).map((alt) =>
          get(alt, 'value', []).map((res) => res)
        ),
        altDropDowns: get(item, 'validation.altResponses', []).map((alt) =>
          get(alt, 'dropdown.value', [])
        ),
        altInputs: get(item, 'validation.altResponses', []).map((alt) =>
          get(alt, 'textinput.value', [])
        ),
        altMathUnitAnswers: get(
          item,
          'validation.altResponses',
          []
        ).map((alt) => get(alt, 'mathUnits.value', [])),
      }

      const _correctScore = get(item, 'validation.validResponse.score')

      const _altScores = get(item, 'validation.altResponses', []).map(
        (alt) => alt?.score
      )

      return [answers, _correctScore, _altScores]
    }
    return []
  }, [item?.validation, type, isExpressGrader])

  const uiStyles = useMemo(() => {
    const { uiStyle = {} } = item

    const cssStyles = getStylesFromUiStyleToCssStyle(item.uiStyle)

    if (uiStyle.responseFontScale) {
      cssStyles.responseFontScale = uiStyle.responseFontScale
    }

    if (parseInt(uiStyle.minWidth, 10) < 25) {
      cssStyles.padding = '4px 2px'
    }

    return cssStyles
  }, [item.uiStyle])

  const handleAddAnswer = (answer, answerType, id) => {
    if (!isAnswerModifiable) return
    let newAnswers = cloneDeep(userAnswer)
    const answers = newAnswers[answerType] || {}
    answers[id] = answer

    newAnswers = {
      ...newAnswers,
      [answerType]: answers,
    }
    saveAnswer(newAnswers)
    if (enableMagnifier) {
      setTimeout(() => {
        const questionWrapper = document.querySelector(
          '.zoomed-container-wrapper .question-wrapper .jsx-parser p'
        )
        if (questionWrapper) {
          questionWrapper.innerHTML = document.querySelector(
            '.unzoom-container-wrapper .question-wrapper .jsx-parser p'
          ).innerHTML
        }
      }, 1000)
    }
  }

  const onInnerClick = () => {
    if (type === CHECK || type === SHOW) {
      changePreviewTab(CLEAR)
      if (changePreview) {
        changePreview(CLEAR)
      }
    }
  }

  useEffect(() => {
    if (window.$) {
      setNewHtml(helpers.parseTemplate(stimulus))
    }
  }, [stimulus])

  const allCorrects = useMemo(() => {
    if (
      (type === CHECK || type === SHOW) &&
      !isEmpty(item.responseIds) &&
      !isEmpty(evaluation)
    ) {
      return Object.keys(item.responseIds)
        .map((key) => item.responseIds[key].map((response) => response.id))
        .flatMap((responseId) => responseId)
        .every((responseId) => evaluation[responseId])
    }
    return false
  }, [evaluation, item.responseIds, type])

  const testUserAnswer = {}
  if (testItem) {
    const keynameMap = {
      textinput: 'inputs',
      dropdown: 'dropDowns',
      value: 'maths',
      mathUnits: 'mathUnits',
    }

    if (item?.validation?.validResponse) {
      Object.keys(item?.validation?.validResponse).forEach((keyName) => {
        if (keynameMap[keyName]) {
          testUserAnswer[keynameMap[keyName]] = {}
          if (keyName !== 'value') {
            item?.validation?.validResponse?.[keyName]?.value?.forEach(
              (answerItem) => {
                testUserAnswer[keynameMap[keyName]][answerItem.id] = {
                  ...answerItem,
                }
              }
            )
          } else {
            item?.validation?.validResponse?.value?.forEach((answerItem) => {
              testUserAnswer[keynameMap[keyName]][answerItem[0].id] = {
                ...answerItem[0],
              }
            })
          }
        }
      })
    }
  }

  /**
   * @see https://snapwiz.atlassian.net/browse/EV-12369
   * not to show response index in check/show answer view if there is only single response box
   */
  const singleResponseBox = useMemo(() => {
    if (!isEmpty(responseIds)) {
      const responseBoxCount =
        Object.keys(responseIds).reduce(
          (acc, key) => acc + (responseIds[key].length || 0),
          0
        ) || []
      return responseBoxCount === 1
    }
    return false
  }, [responseIds])

  return (
    <QuestionWrapper uiStyles={uiStyles}>
      <JsxParser
        disableKeyGeneration // not generating new keys on re-render , fix for EV-9876
        bindings={{
          resProps: {
            options,
            evaluation,
            save: handleAddAnswer,
            answers: testItem ? testUserAnswer : userAnswer,
            item,
            checked: type === CHECK || type === SHOW,
            showIndex: type === SHOW && !singleResponseBox,
            onInnerClick,
            uiStyles,
            responseContainers: item.responseContainers,
            isV1Migrated,
            disableResponse: disableResponse || !isAnswerModifiable,
            isPrintPreview,
            allOptions,
            answerScore,
            allCorrects,
            setDropDownInUse,
          },
        }}
        showWarnings
        components={{
          mathspan: MathSpanWrapper,
          textdropdown: testItem ? ClozeDropDownAnswerDisplay : ClozeDropDown,
          textinput: testItem ? ClozeInputAnswerDisplay : ClozeInput,
          mathinput: testItem ? ClozeMathAnswerDisplay : ClozeMathInput,
          mathunit: testItem ? ClozeMathAnswerDisplay : ClozeMathWithUnit,
        }}
        jsx={newHtml}
      />
      {type !== EDIT && <Instructions item={item} />}
      {(isExpressGrader || type === SHOW) && !hideCorrectAnswer && (
        <AnswerBox
          mathAnswers={allAnswers.mathAnswers}
          dropdownAnswers={allAnswers.dropdownAnswers}
          textInputAnswers={allAnswers.textInputAnswers}
          mathUnitAnswers={allAnswers.mathUnitAnswers}
          altMathAnswers={allAnswers.altMathAnswers}
          altDropDowns={allAnswers.altDropDowns}
          altInputs={allAnswers.altInputs}
          altMathUnitAnswers={allAnswers.altMathUnitAnswers}
          responseIds={responseIds}
          extraOpts={item.extraOpts}
          isPrintPreview={isPrintPreview}
          singleResponseBox={singleResponseBox}
          uiStyles={uiStyles}
          showAnswerScore={showAnswerScore}
          correctScore={correctScore}
          altScores={altScores}
        />
      )}
    </QuestionWrapper>
  )
}

ClozeMathPreview.propTypes = {
  type: PropTypes.string.isRequired,
  item: PropTypes.object.isRequired,
  stimulus: PropTypes.string.isRequired,
  saveAnswer: PropTypes.func.isRequired,
  changePreviewTab: PropTypes.func.isRequired,
  userAnswer: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
    .isRequired,
  evaluation: PropTypes.oneOfType([PropTypes.array, PropTypes.object])
    .isRequired,
  options: PropTypes.object.isRequired,
  responseIds: PropTypes.object.isRequired,
  changePreview: PropTypes.func,
  testItem: PropTypes.bool,
  isExpressGrader: PropTypes.bool,
}

ClozeMathPreview.defaultProps = {
  changePreview: () => {},
  testItem: false,
  isExpressGrader: false,
}

export default withCheckAnswerButton(ClozeMathPreview)

const QuestionWrapper = styled.div`
  font-size: ${(props) => props.uiStyles.fontSize || '16px'};
  font-weight: ${(props) => props.uiStyles.fontWeight};
  position: relative;

  li {
    margin: 4px 0;
  }
  .jsx-parser {
    /**
     * @see https://snapwiz.atlassian.net/browse/EV-35090
     * table cell shows all content in one line
     */
    @media print {
      & td {
        white-space: normal;
      }
    }
  }
`
