import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";

import { IconWrapper } from "./styled/IconWrapper";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";
import { CheckBox } from "./styled/CheckBox";

const CheckedBlock = ({ isCorrect, userAnswer, index, isMath }) => {
  console.log(index);
  const filedRef = useRef();
  index = parseInt(index, 10);

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
  }, [userAnswer, isCorrect, isMath]);

  return (
    <CheckBox className={isCorrect ? "right" : "wrong"} key={`input_${index}`}>
      <span className="index">{index + 1}</span>
      <span className="value" ref={filedRef}>
        {userAnswer.value}
      </span>
      <IconWrapper>{isCorrect ? <RightIcon /> : <WrongIcon />}</IconWrapper>
    </CheckBox>
  );
};

CheckedBlock.propTypes = {
  isCorrect: PropTypes.bool,
  userAnswer: PropTypes.any,
  index: PropTypes.oneOfType(PropTypes.number, PropTypes.string).isRequired,
  isMath: PropTypes.bool
};

CheckedBlock.defaultProps = {
  isCorrect: false,
  isMath: false,
  userAnswer: ""
};

export default CheckedBlock;
