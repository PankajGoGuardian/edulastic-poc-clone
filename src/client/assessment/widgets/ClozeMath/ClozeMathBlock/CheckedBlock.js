import React from "react";
import PropTypes from "prop-types";
import { find, isUndefined } from "lodash";
import { Popover } from "antd";
import { measureText, MathFormulaDisplay } from "@edulastic/common";
import MathSpanWrapper from "../../../components/MathSpanWrapper";
import { IconWrapper } from "./styled/IconWrapper";
import { RightIcon } from "./styled/RightIcon";
import { WrongIcon } from "./styled/WrongIcon";
import { CheckBox } from "./styled/CheckBox";

const CheckedBlock = ({ item, evaluation, userAnswer, id, type, isMath, width, height, onInnerClick, showIndex }) => {
  const { responseIds } = item;
  const { index } = find(responseIds[type], res => res.id === id);
  let { unit = "" } = userAnswer || {};
  if (unit.search("f") !== -1 || unit.search(/\s/g) !== -1) {
    unit = `\\text{${unit}}`;
  }
  let checkBoxClass = "";

  if (userAnswer && evaluation[id] !== undefined) {
    checkBoxClass = evaluation[id] ? "right" : "wrong";
  }

  const showValue =
    userAnswer && userAnswer.value
      ? isMath
        ? userAnswer.value.search("=") === -1
          ? `${userAnswer.value}\\ ${unit}`
          : userAnswer.value.replace(/=/gm, `\\ ${unit}=`)
        : userAnswer.value
      : "";

  const { width: textWidth } = measureText(showValue);
  const avilableWidth = width - (showIndex ? 58 : 26);
  const showPopover = textWidth > avilableWidth;

  const popoverContent = isPopover => (
    <CheckBox
      className={checkBoxClass}
      key={`input_${index}`}
      onClick={onInnerClick}
      style={{
        width: isPopover ? null : width,
        height: !isPopover && height,
        minWidth: width
      }}
    >
      {showIndex && (
        <span className="index" style={{ alignSelf: "stretch", height: "auto" }}>
          {index + 1}
        </span>
      )}
      <span
        className="value"
        style={{ alignItems: "center", fontWeight: "normal", textAlign: "left", paddingLeft: "11px" }}
      >
        {isMath ? (
          <MathSpanWrapper latex={showValue} />
        ) : (
          <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: showValue }} />
        )}
      </span>
      {userAnswer && !isUndefined(evaluation[id]) && (
        <IconWrapper>{checkBoxClass === "right" ? <RightIcon /> : <WrongIcon />}</IconWrapper>
      )}
    </CheckBox>
  );

  return showPopover ? <Popover content={popoverContent(true)}>{popoverContent()}</Popover> : popoverContent();
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
