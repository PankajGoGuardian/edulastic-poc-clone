import React, { useContext, useMemo } from "react";
import PropTypes from "prop-types";
import { uniqBy } from "lodash";
import { NumberPadContext } from "..";
import { ButtonWrapper } from "../styled/ButtonWrapper";
import NumberPadButton from "./NumberPadButton";
import { EmptyWrapper } from "../styled/EmptyWrapper";

const CharacterMap = ({ onClick, buttonStyle }) => {
  const items = useContext(NumberPadContext);
  const isEmpty = label => label === "empty";
  const filteredButtons = useMemo(() => uniqBy(items, "value"), [items]);
  return (
    <ButtonWrapper style={{ flexWrap: "wrap" }}>
      {filteredButtons.map((item, index) => (
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
