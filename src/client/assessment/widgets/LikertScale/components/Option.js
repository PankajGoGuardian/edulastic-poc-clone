import { withNamespaces } from '@edulastic/localization'
import PropTypes from 'prop-types'
import React, { memo } from 'react'
import { SortableElement } from 'react-sortable-hoc'
import styled from 'styled-components'
import { IconTrash as Icon } from '@edulastic/icons'
import { notification } from '@edulastic/common'
import { TextInputStyled, NumberInputStyled } from './styled/OptionInput'
import { OptionLabelDiv } from './styled/Label'
import { LikertScaleContent } from './styled/LikertScaleContent'
import RadioButton from './RadioButton'
import DragHandle from '../../MultipleChoice/components/Display/components/DragHandle'

const Option = ({
  t,
  idx,
  option,
  onChangeOption,
  onRemoveOption,
  sortOptions,
  view,
  handleSaveAnswer,
  userAnswer,
}) => {
  const isSelected = userAnswer === option.value

  const isInvalidScore = (score) => {
    if (typeof score !== 'number' || score < 0 || score > 9) {
      return true
    }
    return false
  }

  const onChangeOptionData = (value, type) => {
    if (type === 'optionScore' && isInvalidScore(value)) {
      notification({
        type: 'warning',
        messageKey: 'enterValidScore',
      })
      return
    }
    if (onChangeOption) {
      onChangeOption(idx, value, type)
    }
  }

  const handleRemoveOption = () => {
    if (onRemoveOption) {
      onRemoveOption(idx, option.value)
    }
  }

  return (
    <OptionLabelDiv>
      <DragHandle />
      <RadioButton
        option={option}
        onChangeHandler={handleSaveAnswer}
        view={view}
        isSelected={isSelected}
        idx={idx}
        onChange={(val) => onChangeOptionData(val, 'optionBgColor')}
      />
      <LikertScaleContent>
        <TextInputStyled
          maxLength={128}
          value={option.label}
          placeholder={`${t('component.likertScale.optionPlaceholder')} #${
            idx + 1
          }`}
          onChange={(e) => onChangeOptionData(e.target.value, 'optionLabel')}
        />
        <NumberInputStyled
          min={0}
          max={9}
          placeholder="score"
          value={option.score}
          onChange={(val) => onChangeOptionData(val, 'optionScore')}
          onBlur={sortOptions}
        />
      </LikertScaleContent>
      <IconTrash onClick={handleRemoveOption} />
    </OptionLabelDiv>
  )
}

const IconTrash = styled(Icon)`
  fill: ${(props) => props.theme.sortableList.iconTrashColor};
  :hover {
    fill: ${(props) => props.theme.sortableList.iconTrashHoverColor};
  }
  width: 10px;
  height: 14px;
  cursor: pointer;
  margin: 0px -32px 0px 16px;
`

Option.propTypes = {
  t: PropTypes.func.isRequired,
  idx: PropTypes.number.isRequired,
  option: PropTypes.object.isRequired,
  onChangeOption: PropTypes.func.isRequired,
  onRemoveOption: PropTypes.func.isRequired,
  sortOptions: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  handleSaveAnswer: PropTypes.func.isRequired,
  userAnswer: PropTypes.string,
}

Option.defaultProps = {
  userAnswer: '',
}
const SortableOption = SortableElement(Option)
const OptionComponent = withNamespaces('assessment')(SortableOption)
export default memo(OptionComponent)
