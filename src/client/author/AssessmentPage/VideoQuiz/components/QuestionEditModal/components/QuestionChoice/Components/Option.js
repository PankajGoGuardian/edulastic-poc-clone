import React, { useMemo, memo } from 'react'
import { SortableElement } from 'react-sortable-hoc'
import { helpers } from '@edulastic/common'
import {
  OptionContainer,
  LabelContainer,
  StyledInputContainer,
  IconTrash,
} from '../styled-components'
import DragHandle from '../../../../../../../../assessment/widgets/MultipleChoice/components/Display/components/DragHandle'
import QuestionTextArea from '../../../../../../../../assessment/components/QuestionTextArea'

const Option = ({
  optionIdx,
  option,
  handleOptionChange,
  handleDeleteOption,
  isSelected,
  handleChangeCorrectAnswers,
  ...restProps
}) => {
  const optionLabel = useMemo(() => {
    return helpers.getNumeration(optionIdx, 'uppercase')
  }, [optionIdx])

  return (
    <OptionContainer {...restProps}>
      <DragHandle />
      <LabelContainer
        isSelected={isSelected}
        style={{ display: !optionLabel && 'none' }}
        onClick={() => handleChangeCorrectAnswers(option.value)}
        data-cy="label"
      >
        {optionLabel}
      </LabelContainer>
      <StyledInputContainer
        onBlur={() =>
          handleOptionChange(option.value, option.label || '', optionIdx, true)
        }
      >
        <QuestionTextArea
          fontSize="16px"
          value={option.label}
          placeholder={`Option #${optionIdx + 1}`}
          toolbarId={`mcq-option-${optionIdx}`}
          onChange={(value) => handleOptionChange(option.value, value || '')}
          backgroundColor
        />
      </StyledInputContainer>
      <IconTrash
        onClick={() => handleDeleteOption(option.value)}
        data-cy="deleteOptionButton"
      />
    </OptionContainer>
  )
}

const SortableOption = SortableElement(Option)
export default memo(SortableOption)
