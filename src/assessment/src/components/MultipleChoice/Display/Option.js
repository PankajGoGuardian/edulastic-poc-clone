import React from 'react';
import PropTypes from 'prop-types';
import { PaddingDiv } from '@edulastic/common';
import { IconCheck, IconClose } from '@edulastic/icons';
import { green, red } from '@edulastic/colors';

import { FlexContainer, MultiChoiceContent, CheckboxContainer, Label } from './styles';
import { ALPHABET } from '../constants/others';

const Option = ({
  index,
  item,
  showAnswer,
  checkAnswer,
  userSelections,
  validation,
  onChange,
  smallSize,
  uiStyle,
}) => {
  console.log(uiStyle);
  const isValidUserSelections = userSelections.includes(item.value);
  const isValidAltResponses = () => {
    const values = [];
    validation.alt_responses.forEach((res) => {
      values.push(...res.value);
    });

    return values.includes(parseInt(item.value, 10)) && isValidUserSelections;
  };

  let className = '';
  const isValidResponse =
    validation &&
    validation.valid_response &&
    validation.valid_response.value.includes(parseInt(item.value, 10));

  if (isValidUserSelections && checkAnswer) {
    if (isValidResponse) {
      className = 'right';
    } else if (validation.alt_responses.length && isValidAltResponses()) {
      className = 'right';
    } else {
      className = 'wrong';
    }
  }

  if (userSelections && userSelections.length === 0) {
    className = '';
  }

  if (showAnswer && isValidResponse) {
    className = 'right';
  }

  return (
    <Label smallSize={smallSize} showAnswer className={className}>
      <PaddingDiv top={smallSize ? 0 : 10} bottom={smallSize ? 0 : 10}>
        <FlexContainer>
          <CheckboxContainer smallSize={smallSize}>
            <input
              type="checkbox"
              name="mcq_group"
              value={index}
              checked={isValidUserSelections}
              onChange={onChange}
            />
            <span>{ALPHABET[index]}</span>
            <div />
          </CheckboxContainer>
          <MultiChoiceContent smallSize={smallSize}>{item.label}</MultiChoiceContent>
          <PaddingDiv right={15} height={20}>
            {className === 'right' && <IconCheck color={green} width={20} height={20} />}
            {className === 'wrong' && <IconClose color={red} />}
          </PaddingDiv>
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
  uiStyle: PropTypes.object.isRequired,
};

Option.defaultProps = {
  showAnswer: false,
  smallSize: false,
  checkAnswer: false,
  userSelections: [],
  validation: {},
};

export default Option;
