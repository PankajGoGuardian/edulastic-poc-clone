import React, { useContext } from "react";
import PropTypes from "prop-types";

import { NumberPadContext } from "..";
import { ButtonWrapper } from "../styled/ButtonWrapper";
import NumberPadButton from "./NumberPadButton";
import { EmptyWrapper } from "../styled/EmptyWrapper";

const CharacterMap = ({ onClick, buttonStyle }) => {
  const items = useContext(NumberPadContext);

  const isEmpty = label => label === "empty";

  return (
    <ButtonWrapper style={{ flexWrap: "wrap" }}>
      {items.map((item, index) => (
        <NumberPadButton
          buttonStyle={{ ...buttonStyle, position: "initial" }}
          onClick={() => onClick(item.value)}
          key={index}
        >
          {isEmpty(item.label) ? <EmptyWrapper>{item.label}</EmptyWrapper> : item.label}
        </NumberPadButton>
      ))}
    </ButtonWrapper>
  );
};

CharacterMap.propTypes = {
  onClick: PropTypes.func,
  buttonStyle: PropTypes.object
};

CharacterMap.defaultProps = {
  onClick: () => {},
  buttonStyle: {}
};

export default CharacterMap;
