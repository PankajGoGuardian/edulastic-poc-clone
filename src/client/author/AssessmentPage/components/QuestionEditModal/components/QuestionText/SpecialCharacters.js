import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { withNamespaces } from 'react-i18next'

import {
  CheckboxLabel,
  EduIf,
  FieldLabel,
  TextInputStyled,
} from '@edulastic/common'
import { FormGroup } from '../../common/QuestionForm'
import { setQuestionDataAction } from '../../../../../QuestionEditor/ducks'

const SpecialCharacters = ({ setQuestionData, t: translate, question }) => {
  const { characterMap } = question
  const _change = (propName, value) => {
    const newQuestion = { ...question, [propName]: value }
    setQuestionData(newQuestion)
  }

  const _characterMapChange = (e) => {
    const { value } = e.target
    _change('characterMap', value.split(''))
  }

  return (
    <>
      <FormGroup width="50%">
        <FieldLabel display="inline" mr="16px">
          {translate('component.options.specialcharacters')}
        </FieldLabel>
        <CheckboxLabel
          checked={!!characterMap}
          onChange={(e) => {
            if (e.target.checked) {
              _change('characterMap', [])
            } else {
              _change('characterMap', undefined)
            }
          }}
          data-cy="specialCharacters"
        />
      </FormGroup>
      <FormGroup width="calc(50% - 8px)">
        <EduIf condition={characterMap}>
          <>
            <FieldLabel>
              {translate('component.options.charactersToDisplay')}
            </FieldLabel>
            <TextInputStyled
              value={characterMap?.join('')}
              height="32px"
              size="large"
              onChange={_characterMapChange}
              autoFocus
            />
          </>
        </EduIf>
      </FormGroup>
    </>
  )
}

SpecialCharacters.propTypes = {
  t: PropTypes.func.isRequired,
  setQuestionData: PropTypes.func.isRequired,
}

const enhance = compose(
  withNamespaces('assessment'),
  connect(null, {
    setQuestionData: setQuestionDataAction,
  })
)

export default enhance(SpecialCharacters)
