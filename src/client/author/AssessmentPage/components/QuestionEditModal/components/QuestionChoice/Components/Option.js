import React, { useMemo, memo } from 'react'
import { SortableElement } from 'react-sortable-hoc'
import { helpers } from '@edulastic/common'
import {
  OptionContainer,
  LabelContainer,
  TextInputStyled,
  IconTrash,
} from '../styled-components'
import DragHandle from '../../../../../../../assessment/widgets/MultipleChoice/components/Display/components/DragHandle'

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
      >
        {optionLabel}
      </LabelContainer>
      <TextInputStyled
        value={option.label}
        onChange={(e) =>
          handleOptionChange(option.value, e?.target?.value || '')
        }
        onBlur={(e) =>
          handleOptionChange(
            option.value,
            e?.target?.value || '',
            optionIdx,
            true
          )
        }
        placeholder={`Option #${optionIdx + 1}`}
      />
      <IconTrash onClick={() => handleDeleteOption(option.value)} />
    </OptionContainer>
  )
}

const SortableOption = SortableElement(Option)
export default memo(SortableOption)
