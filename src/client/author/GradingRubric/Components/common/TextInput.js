import React from 'react'
import { connect } from 'react-redux'
import { Input } from 'antd'
import produce from 'immer'
import styled from 'styled-components'
import { backgroundGrey } from '@edulastic/colors'
import { MathFormulaDisplay } from '@edulastic/common'
import {
  getCurrentRubricDataSelector,
  updateRubricDataAction,
} from '../../ducks'
import DescriptionTextArea from '../../../../assessment/components/QuestionTextArea'

const TextInput = ({
  id,
  parentId,
  isEditable,
  textType,
  componentFor,
  value: currentValue,
  currentRubricData,
  updateRubricData,
  isFullScreen,
}) => {
  const fieldMapping = {
    textarea: 'desc',
    text: 'name',
    number: 'points',
  }

  const handleChange = (value) => {
    let nextState = null
    if (componentFor === 'Criteria') {
      nextState = produce(currentRubricData, (draftState) => {
        draftState.criteria.find((c) => c.id === id)[
          fieldMapping[textType]
        ] = value
      })
      updateRubricData(nextState)
    } else if (componentFor === 'Rating') {
      if (
        (textType === 'number' &&
          ((!Number.isNaN(Number(value)) && value >= 0) || value === '')) ||
        ['text', 'textarea'].includes(textType)
      ) {
        nextState = produce(currentRubricData, (draftState) => {
          draftState.criteria
            .find((c) => c.id === parentId)
            .ratings.find((r) => r.id === id)[fieldMapping[textType]] =
            textType === 'number' ? (value === '' ? value : +value) : value
        })
        updateRubricData(nextState)
      }
    }
  }

  let placeholder = ''
  if (isEditable) {
    if (componentFor === 'Criteria') {
      placeholder = 'Enter a criteria name'
    } else if (textType === 'number') {
      placeholder = '0'
    } else {
      placeholder = 'Label'
    }
  }

  let extraProps = {}
  if (textType === 'number')
    extraProps = {
      min: 0,
    }

  if (textType === 'textarea') {
    const froalaToolbarId = `rubric-rating-description-${
      isFullScreen ? 'fullscreen-' : ''
    }${id}`

    const foralaEditorTools = isFullScreen
      ? undefined
      : ['bold', 'italic', 'underline', 'formatUL']

    if (isEditable)
      return (
        <DescriptionTextArea
          value={currentValue}
          placeholder={isEditable ? 'Enter Description' : ''}
          toolbarId={froalaToolbarId}
          onChange={(value) => handleChange(value)}
          readOnly={false}
          toolbarSize="SM"
          buttons={foralaEditorTools}
        />
      )
    if (!isEditable)
      return <TextArea dangerouslySetInnerHTML={{ __html: currentValue }} />
  } else
    return (
      <StyledInput
        placeholder={placeholder}
        type={textType}
        {...extraProps}
        disabled={!isEditable || false}
        value={currentValue}
        onChange={(e) => handleChange(e.target.value)}
      />
    )
}

export default connect(
  (state) => ({
    currentRubricData: getCurrentRubricDataSelector(state),
  }),
  { updateRubricData: updateRubricDataAction }
)(TextInput)

const StyledInput = styled(Input)`
  border: none;
  border-radius: 2px;
  background: ${backgroundGrey};
  height: 35px;
  text-overflow: ellipsis;
  font-weight: ${(props) => props.theme.bold};
  cursor: default;

  &:focus,
  &:active {
    cursor: text;
  }
  &:disabled {
    cursor: default;
    color: inherit;
    background: ${backgroundGrey};
    &:hover,
    &:focus {
      box-shadow: none;
    }
  }
`

const TextArea = styled(MathFormulaDisplay)`
  height: 92px !important;
  background: ${backgroundGrey};
  border-radius: 2px;
  border: none;
  cursor: default;
  overflow-y: auto;
  white-space: normal;
  padding: 7px;
`
