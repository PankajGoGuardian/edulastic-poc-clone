import React from 'react';
import PropTypes from 'prop-types';
import { PaddingDiv, FlexContainer } from '@edulastic/common';
import { IconCheck, IconClose } from '@edulastic/icons';
import { green, red } from '@edulastic/colors';

import { MultiChoiceContent, CheckboxContainer, Label, Icon } from './styles';
import { ALPHABET } from '../constants/others';

const getFontSize = size => {
  switch (size) {
    case 'small':
      return '10px';
    case 'normal':
      return '13px';
    case 'large':
      return '17px';
    case 'xlarge':
      return '20px';
    case 'xxlarge':
      return '24px';
    default:
      return '12px';
  }
};

const Option = ({
  index,
  item,
  showAnswer,
  userSelections,
  onChange,
  smallSize,
  uiStyle,
  correct
}) => {
  const isSelected = userSelections.includes(item.value);

  let className = '';

  if (showAnswer) {
    className = 'right';
  }

  if (correct) {
    className = 'right';
  }

  if (correct === false) {
    className = 'wrong';
  }

  const fontSize = getFontSize(uiStyle.fontsize);

  const container = (
    <CheckboxContainer smallSize={smallSize} hide={uiStyle.type === 'block'}>
      <input
        type="checkbox"
        name="mcq_group"
        value={index}
        checked={isSelected}
        onChange={onChange}
      />
      <span>{ALPHABET[index]}</span>
      <div />
    </CheckboxContainer>
  );

  const renderCheckbox = () => {
    switch (uiStyle.type) {
      case 'radioBelow':
        return (
          <FlexContainer flexDirection="column" justifyContent="center">
            <MultiChoiceContent
              fontSize={fontSize}
              smallSize={smallSize}
              style={{ marginBottom: 10 }}
            >
              <span>{item.label}</span>
            </MultiChoiceContent>
            {container}
          </FlexContainer>
        );
      case 'block':
        return (
          <FlexContainer alignItems="center">
            <MultiChoiceContent fontSize={fontSize} smallSize={smallSize}>
              <span>{item.label}</span>
            </MultiChoiceContent>
            {container}
          </FlexContainer>
        );
      case 'standard':
      default:
        return (
          <React.Fragment>
            {container}
            <MultiChoiceContent fontSize={fontSize} smallSize={smallSize}>
              {item.label}
            </MultiChoiceContent>
          </React.Fragment>
        );
    }
  };

  const width = uiStyle.columns ? `${100 / uiStyle.columns - 1}%` : '100%';
  const labelClassName =
    isSelected && !className && uiStyle.type === 'block' && !showAnswer
      ? 'checked'
      : className;

  return (
    <Label
      width={width}
      smallSize={smallSize}
      showAnswer
      className={labelClassName}
    >
      <PaddingDiv top={smallSize ? 0 : 10} bottom={smallSize ? 0 : 10}>
        <FlexContainer
          justifyContent={
            uiStyle.type === 'radioBelow' ? 'center' : 'space-between'
          }
        >
          {renderCheckbox()}
          <Icon>
            {className === 'right' && (
              <IconCheck color={green} width={20} height={20} />
            )}
            {className === 'wrong' && <IconClose color={red} />}
          </Icon>
        </FlexContainer>
      </PaddingDiv>
    </Label>
  );
};

Option.propTypes = {
  index: PropTypes.number.isRequired,
  showAnswer: PropTypes.bool,
  checkAnswer: PropTypes.bool,
  item: PropTypes.any.isRequired,
  userSelections: PropTypes.array,
  validation: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  smallSize: PropTypes.bool,
  uiStyle: PropTypes.object.isRequired
};

Option.defaultProps = {
  showAnswer: false,
  smallSize: false,
  checkAnswer: false,
  userSelections: [],
  validation: {}
};

export default React.memo(Option);
