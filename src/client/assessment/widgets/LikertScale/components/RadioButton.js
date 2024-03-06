import React from 'react'
import PropTypes from 'prop-types'
import { ALPHABET } from '@edulastic/common/src/helpers'
import { StyledButton, StyledSpan } from './styled/Radio'
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
      <StyledButton
        className="outer"
        width={isEditView ? '30px' : '70px'}
        height={isEditView ? '30px' : '70px'}
        left="0px"
        top="0px"
        margin="0px"
      >
        {isEditView ? (
          <ColorPicker
            option={option}
            label={label}
            onChange={handleColorChange}
          />
        ) : (
          <StyledButton
            className="inner"
            width={isEditView ? '30px' : '55px'}
            height={isEditView ? '30px' : '55px'}
            left={isEditView ? '-21px' : '-13px'}
            top={isEditView ? '-21px' : '-13px'}
            bgColor={option.bgColor}
            margin="20px"
            isSelected={isSelected}
          >
            {label}
          </StyledButton>
        )}
      </StyledButton>
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
