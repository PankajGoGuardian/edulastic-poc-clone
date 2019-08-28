import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { find, isUndefined } from "lodash";
import { Tooltip } from "antd";

import { IconWrapper } from "./styled/IconWrapper";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";
import { CheckBox } from "./styled/CheckBox";

const CheckBoxedMathBox = ({ value, style }) => {
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

  return <span className="value" ref={filedRef} style={style} />;
};

CheckBoxedMathBox.propTypes = {
  value: PropTypes.string.isRequired,
  style: PropTypes.object.isRequired
};

const CheckedBlock = ({ item, evaluation, userAnswer, id, type, isMath, width, height, onInnerClick, showIndex }) => {
  const { responseIds } = item;
  const { index } = find(responseIds[type], res => res.id === id);
  let { unit = "" } = userAnswer || {};
  if (unit.search("f") !== -1) {
    unit = `\\text{${unit}}`;
  }
  let checkBoxClass = "";

  if (userAnswer && evaluation[id] !== undefined) {
    checkBoxClass = evaluation[id] ? "right" : "wrong";
  }

  return (
    <Tooltip
      placement="bottomLeft"
      title={
        isMath ? (
          <CheckBoxedMathBox
            value={
              userAnswer && userAnswer.value.search("=") === -1
                ? `${userAnswer.value}\\ ${unit}`
                : userAnswer && userAnswer.value.replace(/=/gm, `\\ ${unit}=`)
            }
          />
        ) : (
          userAnswer && userAnswer.value
        )
      }
    >
      <CheckBox className={checkBoxClass} key={`input_${index}`} onClick={onInnerClick} style={{ height }}>
        {showIndex && (
          <span className="index" style={{ alignSelf: "stretch", height: "auto" }}>
            {index + 1}
          </span>
        )}
        <span className="value" style={{ width, alignItems: "center" }}>
          {isMath ? (
            <CheckBoxedMathBox
              value={
                userAnswer && userAnswer.value.search("=") === -1
                  ? `${userAnswer.value}\\ ${unit}`
                  : userAnswer && userAnswer.value.replace(/=/gm, `\\ ${unit}=`)
              }
              style={{ height, width, minWidth: "unset", display: "block" }}
            />
          ) : (
            userAnswer && userAnswer.value
          )}
        </span>
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
  showIndex: PropTypes.bool,
  isMath: PropTypes.bool,
  onInnerClick: PropTypes.func,
  width: PropTypes.string,
  height: PropTypes.string
};

CheckedBlock.defaultProps = {
  isMath: false,
  showIndex: false,
  userAnswer: "",
  onInnerClick: () => {},
  width: 120,
  height: "auto"
};

export default CheckedBlock;
