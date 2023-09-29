import React from 'react'
import PropTypes from 'prop-types'
import { Input, Popover } from 'antd'

import { EduIf } from '@edulastic/common'
import { QuestionText } from '../../common/Form'
import { isSubmitButton } from '../../../../common/helpers'

import CharacterMap from '../../../../../../assessment/components/CharacterMap'
import { Addon, InputWrapper, TextEntryInput } from '../../styled'

export default class FormText extends React.Component {
  static propTypes = {
    saveAnswer: PropTypes.func.isRequired,
    mode: PropTypes.oneOf(['edit', 'review', 'report']).isRequired,
    question: PropTypes.object.isRequired,
    onCreateAnswer: PropTypes.func.isRequired,
    answer: PropTypes.string,
  }

  state = {
    selection: { start: 0, end: 0 },
  }

  setText = (text) => {
    const { saveAnswer } = this.props
    saveAnswer(text)
  }

  setSelection = ({ start, end }) => {
    this.setState((prevState) => ({
      ...prevState,
      selection: { start, end },
    }))
  }

  handleSelect = (e) => {
    const { selectionStart, selectionEnd } = e.target

    if (selectionStart !== selectionEnd) {
      this.setSelection({
        start: selectionStart,
        end: selectionEnd,
      })
    } else {
      this.setSelection({
        start: 0,
        end: 0,
      })
    }

    this.setSelection({
      start: selectionStart,
      end: selectionEnd,
    })
  }

  static defaultProps = {
    answer: '',
  }

  handleChange = ({ target: { value } }) => {
    const { saveAnswer } = this.props
    saveAnswer(value)
  }

  renderView = () => {
    const {
      question: { validation },
    } = this.props

    if (!validation) return this.renderForm()

    const {
      validResponse: { value },
    } = validation

    if (!value || !value.length) return this.renderAnswerCreateForm()

    return <QuestionText>{value}</QuestionText>
  }

  handleBlur = (ev) => {
    // preventing blur event when relatedTarget is submit button
    if (!isSubmitButton(ev)) {
      const { clearHighlighted, saveQuestionResponse } = this.props
      clearHighlighted()
      saveQuestionResponse()
    }
  }

  renderForm = () => {
    const { answer, highlighted = false, characterMap } = this.props
    const {
      selection: { start, end },
    } = this.state

    return (
      <InputWrapper>
        <TextEntryInput
          size="large"
          value={answer}
          data-cy="textInput"
          onChange={this.handleChange}
          onSelect={this.handleSelect}
          onBlur={this.handleBlur}
          ref={(el) => highlighted && el?.focus()}
        />
        <EduIf condition={characterMap && characterMap.length}>
          <Popover
            placement="bottomLeft"
            trigger="click"
            content={
              <CharacterMap
                characters={characterMap}
                onSelect={(char) => {
                  this.setSelection({
                    start: start + char.length,
                    end: start + char.length,
                  })
                  this.setText(
                    answer.slice(0, start) + char + answer.slice(end)
                  )
                }}
              />
            }
          >
            <Addon>á</Addon>
          </Popover>
        </EduIf>
      </InputWrapper>
    )
  }

  renderReport = () => {
    const { answer, view } = this.props
    return (
      <QuestionText check={['check', 'show'].includes(view)}>
        {answer}
      </QuestionText>
    )
  }

  renderAnswerCreateForm = () => {
    const {
      question: { id, type },
      onCreateAnswer,
      highlighted = false,
      isEditModalVisible = false,
    } = this.props

    return (
      <Input
        size="large"
        onPressEnter={onCreateAnswer(id, type)}
        ref={(el) => highlighted && !isEditModalVisible && el?.focus()}
      />
    )
  }

  render() {
    const { mode } = this.props

    switch (mode) {
      case 'edit':
        return this.renderView()
      case 'review':
        return this.renderForm()
      case 'report':
        return this.renderReport()
      default:
        return null
    }
  }
}
