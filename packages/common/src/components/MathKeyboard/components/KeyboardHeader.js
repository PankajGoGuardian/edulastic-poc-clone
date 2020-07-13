import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { isObject } from "lodash";
import { math } from "@edulastic/constants";
import { SelectInputStyled } from "@edulastic/common";

const { Option } = SelectInputStyled;
const { EMBED_RESPONSE } = math;

const KeyboardHeader = ({ options, method, showResponse, showDropdown, onInput, onChangeKeypad }) => {
  const handleClickResponseButton = () => {
    onInput(EMBED_RESPONSE);
  };

  return (
    (showDropdown || showResponse) && (
      <Container mb={method !== "all"}>
        {showDropdown && (
          <SelectInputStyled
            data-cy="math-keyboard-dropdown"
            onSelect={onChangeKeypad}
            value={isObject(method) ? method.label : method}
            getPopupContainer={triggerNode => triggerNode.parentNode}
            minWidth="204px" // width when full keypad mode is selected
          >
            {options.map(({ value, label }, index) => (
              <Option value={value} key={index} data-cy={`math-keyboard-dropdown-list-${index}`}>
                {label}
              </Option>
            ))}
          </SelectInputStyled>
        )}
        {showResponse && (
          <ResponseBtn onClick={handleClickResponseButton}>
            <span className="response-embed">
              <span className="response-embed__char">R</span>
              <span className="response-embed__text">Response</span>
            </span>
          </ResponseBtn>
        )}
      </Container>
    )
  );
};

KeyboardHeader.propTypes = {
  options: PropTypes.array.isRequired,
  method: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  showResponse: PropTypes.bool.isRequired,
  showDropdown: PropTypes.bool.isRequired,
  onInput: PropTypes.func,
  onChangeKeypad: PropTypes.func
};

KeyboardHeader.defaultProps = {
  onInput: () => null,
  onChangeKeypad: () => null
};

export default KeyboardHeader;

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  padding: 1rem 1.5rem 0px 1.5rem;
`;

const ResponseBtn = styled.div`
  cursor: pointer;
  margin-left: 8px;
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${props => props.theme.mathKeyboard.numFontSize};
  font-weight: ${props => props.theme.mathKeyboard.numFontWeight};
`;
