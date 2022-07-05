import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { cloneDeep, get, has, isEmpty, keys } from 'lodash'
import { withNamespaces } from '@edulastic/localization'
import { showBlockerPopup } from '@edulastic/common'
import {
  getQuestionDataSelector,
  setQuestionDataAction,
  generateVariableAction,
  variableSettingsChangedAction,
} from '../../../../../author/QuestionEditor/ducks'

import { Block } from '../../../../styled/WidgetOptions/Block'
import Question from '../../../../components/Question'

import DynamicText from './components/DynamicText'
import VariablesHeader from './components/VariablesHeader'
import VariablesCheckbox from './components/VariablesCheckbox'
import Examples from './components/Examples'
import VariableRow from './components/VariableRow'

import {
  createVariable,
  validSequence,
  generateExamples,
  checkDynamicParameters,
} from '../../../../utils/variables'

const Variables = ({
  t,
  setQuestionData,
  questionData,
  fillSections,
  cleanSections,
  advancedAreOpen,
  generateExam,
  settingUpdated,
}) => {
  const variableEnabled = get(questionData, 'variable.enabled', false)
  const variables = get(questionData, 'variable.variables', {})
  const count = get(questionData, 'variable.combinationsCount', 25)
  const examples = get(questionData, 'variable.examples', [])

  const generate = (newQuestion, shouldNotCheck) => {
    if (shouldNotCheck) {
      return generateExam({ newQuestion, shouldNotCheckUpdate: true })
    }
    const updatedVariables = get(newQuestion, 'variable.variables', variables)
    const { invalid, errMessage } = checkDynamicParameters(
      updatedVariables,
      questionData?.validation,
      questionData.type
    )

    if (invalid) {
      showBlockerPopup(errMessage)
    } else {
      generateExam({ newQuestion, shouldNotCheckUpdate: true })
    }
  }

  const onChangeVariable = (
    variableName,
    param,
    value,
    newQuestionData = null
  ) => {
    const newData = newQuestionData || cloneDeep(questionData)

    if (!has(newData, `variable.variables.${variableName}`)) {
      return
    }

    newData.variable.variables[variableName][param] = value

    if (newData.variable.variables[variableName].type !== 'FORMULA') {
      const newVariables = get(newData, 'variable.variables', variables)
      const newExampleValue = generateExamples(newVariables, count)
      if (!isEmpty(newExampleValue)) {
        const index = Math.floor(Math.random() * newExampleValue.length)
        if (newExampleValue[index]) {
          keys(newExampleValue[index]).forEach((varialeKey) => {
            if (varialeKey !== 'key') {
              newData.variable.variables[varialeKey].exampleValue =
                newExampleValue[index][varialeKey]
            }
          })
        }
      }
    }

    setQuestionData(newData)
    settingUpdated()
  }

  const onSelectType = (variableName, param, value) => {
    const newData = cloneDeep(questionData)
    if (!has(newData, `variable.variables.${variableName}`)) {
      return
    }
    const newVariable = {
      ...createVariable(value),
      id: newData.variable.variables[variableName].id,
      name: newData.variable.variables[variableName].name,
    }
    newData.variable.examples = []
    newData.variable.variables[variableName] = newVariable
    onChangeVariable(variableName, param, value, newData)
  }

  const hasExamples = useMemo(() => !isEmpty(examples), [examples])
  const invalidSeq = useMemo(() => !validSequence(variables), [variables])

  return (
    <Question
      section="advanced"
      label={t('component.options.dynamicParameters')}
      fillSections={fillSections}
      cleanSections={cleanSections}
      advancedAreOpen={advancedAreOpen}
    >
      <DynamicText item={questionData} />
      <VariablesCheckbox onGenerate={generate} />
      {variableEnabled && Object.keys(variables).length > 0 && (
        <Block>
          <VariablesHeader />
          {Object.keys(variables).map((name, index) => (
            <VariableRow
              key={`variable${index}`}
              dataCy={`variable${index}`}
              variable={variables[name]}
              variableName={name}
              hasExamples={hasExamples}
              onSelectType={onSelectType}
              onChange={onChangeVariable}
              invalidSeq={invalidSeq}
            />
          ))}
        </Block>
      )}
      {variableEnabled && Object.keys(variables).length > 0 && (
        <Examples onGenerate={generate} />
      )}
    </Question>
  )
}

Variables.propTypes = {
  setQuestionData: PropTypes.func.isRequired,
  questionData: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  fillSections: PropTypes.func,
  cleanSections: PropTypes.func,
  advancedAreOpen: PropTypes.bool,
}

Variables.defaultProps = {
  advancedAreOpen: false,
  fillSections: () => {},
  cleanSections: () => {},
}

const enhance = compose(
  withNamespaces('assessment'),
  connect(
    (state) => ({
      questionData: getQuestionDataSelector(state),
    }),
    {
      setQuestionData: setQuestionDataAction,
      generateExam: generateVariableAction,
      settingUpdated: variableSettingsChangedAction,
    }
  )
)

export default enhance(Variables)
