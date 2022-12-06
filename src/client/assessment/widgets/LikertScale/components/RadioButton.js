import React from 'react'
import PropTypes from 'prop-types'
import { StyledButton, StyledSpan, StyledEmojiImage } from './styled/Radio'
import { EDIT } from '../../../constants/constantsForQuestions'

const RadioButton = ({
  option,
  onChangeHandler,
  view,
  isSelected,
  disableOptions,
}) => {
  const isEditView = view === EDIT
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
        {option.emojiUrl ? (
          <StyledEmojiImage src={option.emojiUrl} isSelected={isSelected} />
        ) : (
          <StyledButton
            className="inner"
            width={isEditView ? '20px' : '55px'}
            height={isEditView ? '20px' : '55px'}
            left={isEditView ? '-16px' : '-13px'}
            top={isEditView ? '-16px' : '-13px'}
            margin="20px"
            isSelected={isSelected}
          />
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
