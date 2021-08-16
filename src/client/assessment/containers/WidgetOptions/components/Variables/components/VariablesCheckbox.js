import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { get, cloneDeep } from 'lodash'
import { withNamespaces } from '@edulastic/localization'
import { CheckboxLabel } from '@edulastic/common'

import {
  getQuestionDataSelector,
  setQuestionDataAction,
} from '../../../../../../author/QuestionEditor/ducks'

import { Row } from '../../../../../styled/WidgetOptions/Row'
import { Col } from '../../../../../styled/WidgetOptions/Col'

const VariablesCheckbox = ({
  t,
  onGenerate,
  questionData,
  setQuestionData,
}) => {
  const variableEnabled = get(questionData, 'variable.enabled', false)

  const onChange = (evt) => {
    const newData = cloneDeep(questionData)
    const { checked } = evt.target
    if (!newData.variable) {
      newData.variable = {}
    }

    newData.variable.enabled = checked

    if (checked) {
      onGenerate(newData, true)
    } else {
      setQuestionData(newData)
    }
  }

  return (
    <Row gutter={24}>
      <Col md={24}>
        <CheckboxLabel
          data-cy="variableEnabled"
          checked={variableEnabled}
          onChange={onChange}
          size="large"
        >
          {t('component.options.checkVariables')}
        </CheckboxLabel>
      </Col>
    </Row>
  )
}

const enhance = compose(
  withNamespaces('assessment'),
  connect(
    (state) => ({
      questionData: getQuestionDataSelector(state),
    }),
    {
      setQuestionData: setQuestionDataAction,
    }
  )
)

export default enhance(VariablesCheckbox)
