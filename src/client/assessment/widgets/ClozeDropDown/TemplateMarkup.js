/* eslint-disable func-names */
/* eslint-disable array-callback-return */
/* eslint-disable no-undef */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { compose } from 'redux'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { find, cloneDeep, last, isArray } from 'lodash'
import 'react-quill/dist/quill.snow.css'
import { getFormattedAttrId } from '@edulastic/common/src/helpers'
import produce from 'immer'

import { withNamespaces } from '@edulastic/localization'
import loadable from '@loadable/component'
import { Progress } from '@edulastic/common/src/components/Progress'

import { updateVariables } from '../../utils/variables'
import { setQuestionDataAction } from '../../../author/QuestionEditor/ducks'

import { Subtitle } from '../../styled/Subtitle'
import Question from '../../components/Question'

const FroalaEditor = loadable(() =>
  import('@edulastic/common/src/components/FroalaEditor')
)

class TemplateMarkup extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    setQuestionData: PropTypes.func.isRequired,
    fillSections: PropTypes.func,
    cleanSections: PropTypes.func,
  }

  static defaultProps = {
    fillSections: () => {},
    cleanSections: () => {},
  }

  onChangeMarkUp = (stimulus) => {
    const { item, setQuestionData } = this.props

    const reduceResponseIds = (tmpl) => {
      const newResponseIds = []
      if (!window.$) {
        return newResponseIds
      }
      const temp = tmpl || ''
      const parsedHTML = $('<div />').html(temp)

      $(parsedHTML)
        .find('textdropdown')
        .each(function (index) {
          const id = $(this).attr('id')
          newResponseIds.push({ index, id })
        })

      return newResponseIds
    }

    const reudceValidations = (responseIds, validation) => {
      const _validation = cloneDeep(validation)
      const _responseIds = cloneDeep(responseIds)
      const validResponses = _validation.validResponse.value

      // remove deleted dropdown answer
      validResponses.map((answer, i) => {
        const { id } = answer
        if (!id) {
          validResponses.splice(i, 1)
        }
        const isExist = find(_responseIds, (response) => response.id === id)
        if (!isExist) {
          validResponses.splice(i, 1)
        }
      })

      // add new correct answers with response id
      _responseIds.map((response) => {
        const { id } = response
        const valid = find(validResponses, (answer) => answer.id === id)
        if (!valid) {
          validResponses.push({ id, value: '' })
        } else {
          valid.index = response.index
        }
      })
      validResponses.sort((a, b) => a.index - b.index)
      _validation.validResponse.value = validResponses

      // reduce alternate answers
      if (isArray(_validation.altResponses)) {
        _validation.altResponses.map((altAnswers) => {
          if (
            _validation.validResponse.value.length > altAnswers.value.length
          ) {
            altAnswers.value.push(last(_validation.validResponse.value))
          }
          altAnswers.value.map((altAnswer, index) => {
            const isExist = find(
              _responseIds,
              (response) => response.id === altAnswer.id
            )
            if (!isExist) {
              altAnswers.value.splice(index, 1)
            }
          })
          altAnswers.value.sort((a, b) => a.index - b.index)
        })
      }

      return _validation
    }

    const reduceOptions = (responseIds, options) => {
      const _options = cloneDeep(options)
      Object.keys(_options).map((id) => {
        const isExist = find(responseIds, (response) => response.id === id)
        if (!isExist) {
          delete _options[id]
        }
      })
      return _options
    }

    setQuestionData(
      produce(item, (draft) => {
        draft.stimulus = stimulus
        draft.responseIds = reduceResponseIds(stimulus)
        draft.validation = reudceValidations(
          draft.responseIds,
          draft.validation
        )
        draft.options = reduceOptions(draft.responseIds, draft.options)
        updateVariables(draft)
      })
    )
  }

  render() {
    const { t, item, fillSections, cleanSections } = this.props

    return (
      <Question
        section="main"
        label={t('component.cloze.dropDown.composequestion')}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle
          id={getFormattedAttrId(
            `${item?.title}-${t('component.cloze.dropDown.composequestion')}`
          )}
        >
          {t('component.cloze.dropDown.composequestion')}
        </Subtitle>

        <FroalaEditor
          fallback={<Progress />}
          data-cy="templateBox"
          toolbarId="cloze-dropdown-template-box"
          placeholder={t('component.cloze.dropDown.thisisstem')}
          additionalToolbarOptions={['textdropdown']}
          value={item.stimulus}
          onChange={this.onChangeMarkUp}
          border="border"
        />
      </Question>
    )
  }
}

const enhance = compose(
  withRouter,
  withNamespaces('assessment'),
  connect(null, { setQuestionData: setQuestionDataAction })
)

export default enhance(TemplateMarkup)
