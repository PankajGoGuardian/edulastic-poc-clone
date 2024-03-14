import React from 'react'
import PropTypes from 'prop-types'
import { ALPHABET } from '@edulastic/common/src/helpers'
import ColorPicker from '@edulastic/common/src/components/ColorPickers'
import { EduElse, EduIf, EduThen } from '@edulastic/common'
import {
  StyledInnerButton,
  StyledOuterButton,
  StyledSpan,
} from './styled/Radio'
import { EDIT } from '../../../constants/constantsForQuestions'
import { AVAILABLE_SCALE_COLORS } from '../constants'

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

  const spanStyle = isEditView
    ? { margin: '5px 0 5px 5px', position: 'unset', transform: 'unset' }
    : { margin: 'unset', position: 'absolute', transform: 'translateX(-50%)' }

  return (
    <StyledSpan
      onClick={() => onChangeHandler(option.value)}
      style={spanStyle}
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
        isEditView={isEditView}
      >
        <EduIf condition={isEditView}>
          <EduThen>
            <ColorPicker
              onChange={handleColorChange}
              colors={AVAILABLE_SCALE_COLORS}
              componentToRender={({ onClick }) => (
                <StyledInnerButton
                  className="inner"
                  onClick={onClick}
                  width="30px"
                  height="30px"
                  left="-21px"
                  top="-21px"
                  bgColor={option.bgColor}
                  margin="20px"
                >
                  {label}
                </StyledInnerButton>
              )}
            />
          </EduThen>
          <EduElse>
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
          </EduElse>
        </EduIf>
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
