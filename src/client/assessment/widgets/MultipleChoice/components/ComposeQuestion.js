import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { arrayMove } from 'react-sortable-hoc'
import produce from 'immer'
import loadable from '@loadable/component'
import Progress from '@edulastic/common/src/components/Progress'
import { getFormattedAttrId } from '@edulastic/common/src/helpers'

import { withNamespaces } from '@edulastic/localization'

import Question from '../../../components/Question'

import { Subtitle } from '../../../styled/Subtitle'
import { updateVariables } from '../../../utils/variables'

const FroalaEditor = loadable(() =>
  import(
    /* webpackChunkName: "froalaCommonChunk" */ '@edulastic/common/src/components/FroalaEditor'
  )
)

class ComposeQuestion extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    item: PropTypes.object.isRequired,
    toolbarId: PropTypes.string,
    fillSections: PropTypes.func,
    cleanSections: PropTypes.func,
    setQuestionData: PropTypes.func.isRequired,
  }

  static defaultProps = {
    toolbarId: 'compose-question',
    fillSections: () => {},
    cleanSections: () => {},
  }

  onChangeQuestion = (stimulus) => {
    const { item, setQuestionData } = this.props
    setQuestionData(
      produce(item, (draft) => {
        draft.stimulus = stimulus
        updateVariables(draft)
      })
    )
  }

  onSortEnd = ({ oldIndex, newIndex }) => {
    const { item, setQuestionData } = this.props
    setQuestionData(
      produce(item, (draft) => {
        // reorder the options and sort the key based on index
        // editing is based on on index!
        draft.options = arrayMove(draft.options, oldIndex, newIndex).map(
          ({ label }, index) => ({
            value: index,
            label,
          })
        )

        let idx = item.validation.validResponse.value.findIndex(
          (val) => val === oldIndex
        )
        if (idx !== -1) {
          draft.validation.validResponse.value[idx] = newIndex
        }

        idx = item.validation.validResponse.value.findIndex(
          (val) => val === newIndex
        )
        if (idx !== -1) {
          draft.validation.validResponse.value[idx] = oldIndex
        }

        if (draft.validation.altResponses) {
          for (let i = 0; i < item.validation.altResponses; i++) {
            const altResponse = draft.validation.altResponses[i]
            idx = item.validation.altResponses[i].value.findIndex(
              (val) => val === oldIndex
            )
            if (idx !== -1) {
              altResponse.value[idx] = newIndex
            }

            idx = item.validation.altResponses[i].value.findIndex(
              (val) => val === newIndex
            )
            if (idx !== -1) {
              altResponse.value[idx] = oldIndex
            }
            return altResponse
          }
        }

        updateVariables(draft)
      })
    )
  }

  remove = (index) => {
    const { item, setQuestionData } = this.props
    setQuestionData(
      produce(item, (draft) => {
        draft.options.splice(index, 1)
        for (let i = index + 1; i < draft.options.length; i++) {
          if (draft.variable) {
            draft.variable.variableStatus[`option-${index - 1}`] =
              draft.variable.variableStatus[`option-${index}`]
          }
        }
        updateVariables(draft)
      })
    )
  }

  render() {
    const {
      t,
      item,
      toolbarId,
      fillSections,
      cleanSections,
      fontSize,
    } = this.props

    return (
      <Question
        dataCy="questiontext"
        questionTextArea
        section="main"
        label={t('component.multiplechoice.composequestion')}
        fillSections={fillSections}
        cleanSections={cleanSections}
      >
        <Subtitle
          id={getFormattedAttrId(
            `${item?.title}-${t('component.multiplechoice.composequestion')}`
          )}
        >
          {t('component.multiplechoice.composequestion')}
        </Subtitle>
        <FroalaEditor
          fallback={<Progress />}
          placeholder={t('component.multiplechoice.questionPlaceholder')}
          value={item.stimulus}
          toolbarId={toolbarId}
          onChange={this.onChangeQuestion}
          border="border"
          fontSize={fontSize}
        />
      </Question>
    )
  }
}

export default withNamespaces('assessment')(ComposeQuestion)
