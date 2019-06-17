import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { find } from "lodash";

import { IconWrapper } from "./styled/IconWrapper";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";
import { CheckBox } from "./styled/CheckBox";

const CheckedBlock = ({ item, evaluation, userAnswer, id, type, isMath, width, onInnerClick }) => {
  const filedRef = useRef();
  const { response_ids } = item;
  let { index } = find(response_ids[type], res => res.id === id);
  index = parseInt(index, 10);

  let checkBoxClass = "";

  if (evaluation[index] !== undefined) {
    checkBoxClass = evaluation[index] ? "right" : "wrong";
  }

  const replaceWithMathQuill = () => {
    if (!window.MathQuill || !filedRef.current || !isMath) {
      return;
    }
    const MQ = window.MathQuill.getInterface(2);
    const mQuill = MQ.StaticMath(filedRef.current);
    mQuill.latex(userAnswer.value || "");
  };

  useEffect(() => {
    replaceWithMathQuill();
  }, [userAnswer, evaluation, isMath]);

  return (
    <CheckBox width={width} className={checkBoxClass} key={`input_${index}`} onClick={onInnerClick}>
      <span className="index">{index + 1}</span>
      <span className="value" ref={filedRef}>
        {userAnswer.value}
      </span>
      {evaluation[index] && <IconWrapper>{checkBoxClass === "right" ? <RightIcon /> : <WrongIcon />}</IconWrapper>}
    </CheckBox>
  );
};

CheckedBlock.propTypes = {
  evaluation: PropTypes.array.isRequired,
  userAnswer: PropTypes.any,
  item: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isMath: PropTypes.bool,
  onInnerClick: PropTypes.func
};

CheckedBlock.defaultProps = {
  isMath: false,
  userAnswer: "",
  onInnerClick: () => {}
};

export default CheckedBlock;
