import React from "react";
import PropTypes from "prop-types";
import { FlexContainer } from "@edulastic/common";
import { StyledButton } from "../../styled";
import { editingOptions } from "../../constants/controls";

const EditingOption = ({ onClickEditBtn, disabled }) => {
  const { leftOps, rightOps } = editingOptions;
  const onClickHandler = mode => () => {
    onClickEditBtn(mode);
  };

  return (
    <FlexContainer id="editing-options" flex={1}>
      <FlexContainer>
        {leftOps.map(btn => (
          <StyledButton
            key={btn.mode}
            id={btn.mode}
            pos={btn.pos}
            isEditBtn
            onClick={onClickHandler(btn.mode)}
            disabled={disabled}
          >
            <span />
          </StyledButton>
        ))}
      </FlexContainer>
      <FlexContainer>
        {rightOps.map(btn => (
          <StyledButton
            key={btn.mode}
            id={btn.mode}
            pos={btn.pos}
            isEditBtn
            onClick={onClickHandler(btn.mode)}
            disabled={disabled}
          >
            <span />
          </StyledButton>
        ))}
      </FlexContainer>
    </FlexContainer>
  );
};

EditingOption.propTypes = {
  onClickEditBtn: PropTypes.func
};

EditingOption.defaultProps = {
  onClickEditBtn: () => null
};

export default EditingOption;
