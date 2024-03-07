import React from 'react'
import PropTypes from 'prop-types'
import { ALPHABET } from '@edulastic/common/src/helpers'
import {
  StyledInnerButton,
  StyledOuterButton,
  StyledSpan,
} from './styled/Radio'
import { EDIT } from '../../../constants/constantsForQuestions'
import ColorPicker from './ColorPicker'

const RadioButton = ({
  option,
  onChangeHandler,
  view,
  isSelected,
  disableOptions,
  idx,
  onChange,
}) => {
  const isEditView = view === EDIT
  const label = ALPHABET[idx]

  const handleColorChange = (color) => {
    onChange(color)
  }
  return (
    <StyledSpan
      onClick={() => onChangeHandler(option.value)}
      margin={isEditView ? '5px 0 5px 5px' : 'unset'}
      position={isEditView ? 'unset' : 'absolute'}
      transform={isEditView ? 'unset' : 'translateX(-50%)'}
      disableOptions={disableOptions}
      isSelected={isSelected}
      view={view}
    >
      <StyledOuterButton
        className="outer"
        width={isEditView ? '30px' : '70px'}
        height={isEditView ? '30px' : '70px'}
        left="0px"
        top="0px"
        margin="0px"
        isSelected={isSelected}
      >
        {isEditView ? (
          <ColorPicker
            option={option}
            label={label}
            onChange={handleColorChange}
          />
        ) : (
          <StyledInnerButton
            className="inner"
            width="55px"
            height="55px"
            left="-13px"
            top="-13px"
            bgColor={option.bgColor}
            margin="20px"
            isSelected={isSelected}
            fontsize="21px"
          >
            {label}
          </StyledInnerButton>
        )}
      </StyledOuterButton>
    </StyledSpan>
  )
}

RadioButton.propTypes = {
  option: PropTypes.object.isRequired,
  onChangeHandler: PropTypes.func.isRequired,
  view: PropTypes.string.isRequired,
  isSelected: PropTypes.bool.isRequired,
  disableOptions: PropTypes.bool,
}

RadioButton.defaultProps = {
  disableOptions: false,
}

export default RadioButton
