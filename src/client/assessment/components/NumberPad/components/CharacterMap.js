import React, { useContext } from "react";
import PropTypes from "prop-types";

import { NumberPadContext } from "..";
import { ButtonWrapper } from "../styled/ButtonWrapper";
import NumberPadButton from "./NumberPadButton";

const CharacterMap = ({ onClick, buttonStyle }) => {
  const items = useContext(NumberPadContext);

  return (
    <ButtonWrapper style={{ flexWrap: "wrap" }}>
      {items.map((item, index) => (
        <NumberPadButton buttonStyle={buttonStyle} onClick={() => onClick(item.value)} key={index}>
          {item.label}
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
