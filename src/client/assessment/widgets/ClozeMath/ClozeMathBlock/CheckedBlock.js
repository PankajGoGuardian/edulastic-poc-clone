import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { find, isUndefined } from "lodash";
import { Tooltip } from "antd";

import { IconWrapper } from "./styled/IconWrapper";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";
import { CheckBox } from "./styled/CheckBox";

const CheckBoxedMathBox = ({ value }) => {
  const filedRef = useRef();

  const replaceWithMathQuill = () => {
    if (!window.MathQuill || !filedRef.current) {
      return;
    }
    const MQ = window.MathQuill.getInterface(2);
    const mQuill = MQ.StaticMath(filedRef.current);
    mQuill.latex(value || "");
  };

  useEffect(() => {
    replaceWithMathQuill();
  }, [value]);

  return <span ref={filedRef} />;
};

const CheckedBlock = ({ item, evaluation, userAnswer, id, type, isMath, width, height, onInnerClick }) => {
  const { response_ids } = item;
  const { index } = find(response_ids[type], res => res.id === id);

  let checkBoxClass = "";

  if (userAnswer && evaluation[id] !== undefined) {
    checkBoxClass = evaluation[id] ? "right" : "wrong";
  }

  return (
    <Tooltip placement="bottomLeft" title={isMath ? <CheckBoxedMathBox value={userAnswer.value} /> : userAnswer.value}>
      <CheckBox width={width} height={height} className={checkBoxClass} key={`input_${index}`} onClick={onInnerClick}>
        <span className="index">{index + 1}</span>
        <span className="value">{isMath ? <CheckBoxedMathBox value={userAnswer.value} /> : userAnswer.value}</span>
        {userAnswer && !isUndefined(evaluation[id]) && (
          <IconWrapper>{checkBoxClass === "right" ? <RightIcon /> : <WrongIcon />}</IconWrapper>
        )}
      </CheckBox>
    </Tooltip>
  );
};

CheckedBlock.propTypes = {
  evaluation: PropTypes.array.isRequired,
  userAnswer: PropTypes.any,
  item: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  isMath: PropTypes.bool,
  onInnerClick: PropTypes.func,
  width: PropTypes.string,
  height: PropTypes.string
};

CheckedBlock.defaultProps = {
  isMath: false,
  userAnswer: "",
  onInnerClick: () => {},
  width: 120,
  height: "auto"
};

export default CheckedBlock;
