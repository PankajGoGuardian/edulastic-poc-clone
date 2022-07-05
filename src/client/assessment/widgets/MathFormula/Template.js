import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { connect } from 'react-redux'
import produce from 'immer'
import { cloneDeep } from 'lodash'
import { math } from '@edulastic/constants'
import { MathInput } from '@edulastic/common'
import { withNamespaces } from '@edulastic/localization'
import { getFormattedAttrId } from '@edulastic/common/src/helpers'
import { greyThemeLighter } from '@edulastic/colors'
import { setQuestionDataAction } from '../../../author/QuestionEditor/ducks'
import { checkAnswerAction } from '../../../author/src/actions/testItem'
import { updateVariables } from '../../utils/variables'

import { Subtitle } from '../../styled/Subtitle'
import Question from '../../components/Question'

import { latexKeys } from './constants'

class Template extends Component {
  render() {
    const { item, setQuestionData, t, fillSections, cleanSections } = this.props

    const handleUpdateTemplate = (val) => {
      setQuestionData(
        produce(item, (draft) => {
          draft.template = val

          // Should remove previous correct answers
          draft.validation.validResponse.value = [
            {
              method: math.methods.EQUIV_SYMBOLIC,
              options: {
                inverseResult: false,
              },
              value: '',
            },
          ]
          if (draft.validation.altResponses) {
            draft.validation.altResponses.forEach((_, i) => {
              draft.validation.altResponses[i].value = [
                {
                  method: math.methods.EQUIV_SYMBOLIC,
                  options: {
                    inverseResult: false,
                  },
                  value: '',
                },
              ]
            })
          }
          updateVariables(draft, latexKeys)
        })
      )
    }

    const handleChangeKeypad = (keypad) => {
      setQuestionData(
        produce(item, (draft) => {
          const symbols = cloneDeep(draft.symbols)
          symbols[0] = keypad
          draft.symbols = symbols
          updateVariables(draft, latexKeys)
        })
      )
    }

    return (
      <Question
        section="main"
        label={t('component.math.template')}
        visible={item.templateDisplay}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle
          id={getFormattedAttrId(
            `${item?.title}-${t('component.math.template')}`
          )}
          data-cy="template-container"
        >
          {t('component.math.template')}
        </Subtitle>
        <MathInput
          isTemplate
          showResponse
          showDropdown
          fullWidth
          height="50px"
          background={greyThemeLighter}
          symbols={item.symbols}
          numberPad={item.numberPad}
          value={item.template}
          onChangeKeypad={handleChangeKeypad}
          onInput={(latex) => {
            handleUpdateTemplate(latex)
          }}
        />
      </Question>
    )
  }
}

Template.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  item: PropTypes.object,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
}

Template.defaultProps = {
  item: {},
  fillSections: () => {},
  cleanSections: () => {},
}

export default compose(
  withNamespaces('assessment'),
  connect(null, {
    setQuestionData: setQuestionDataAction,
    checkAnswer: checkAnswerAction,
  })
)(Template)
