import React, { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Icon } from "antd";
import { MathInput, MathSpan } from "@edulastic/common";

import { getFontSize } from "../../../../../../utils/helpers";
import CustomTextInput from "./components/CustomTextInput/index";

import { Wrapper } from "./styled/Wrapper";
import { Button } from "./styled/Button";
import { Buttons } from "./styled/Buttons";

const MathEssayInputLine = ({
  onAddNewLine,
  setActive,
  onChange,
  line,
  id,
  active,
  item,
  onChangeType,
  disableResponse
}) => {
  const inputRef = useRef();
  const fontSize = getFontSize(item?.uiStyle?.fontsize);
  const isEmpty = line.text === "<p><br></p>" || line.text === "";
  const isText = line.type === "text";

  const handleFocus = val => {
    if (val) {
      setActive(false);
    }
  };

  const changeType = type => () => onChangeType(type);

  const renderMathText = text =>
    isText ? text : `<p><span class="input__math" data-latex="${text}"></span>&nbsp;</p>`;

  useEffect(() => {
    if (active && inputRef.current) {
      setTimeout(() => {
        if (!isText) {
          inputRef.current.setFocus();
        } else {
          console.log(inputRef);
        }
      }, 30);
    }
  }, [active, isText]);

  const actionButtons = active && !disableResponse && (
    <Buttons>
      {isEmpty && <Button activated={!isText} onClick={changeType("math")} label="M" title="Math" />}
      {isEmpty && <Button activated={isText} onClick={changeType("text")} label="T" title="Text" />}
      {!isEmpty && <Button onClick={onAddNewLine} id="add-new-line" label={<Icon type="enter" />} title="New line" />}
    </Buttons>
  );

  const inputProps = Object.assign(
    {},
    isText
      ? { onChange, toolbarId: `toolbarId${id}`, fontSize }
      : {
          onInput: onChange,
          symbols: item.symbols,
          numberPad: item.numberPad,
          fullWidth: true,
          style: {
            border: 0,
            height: "auto",
            minHeight: "auto",
            background: "inherit",
            fontSize
          }
        }
  );

  const handleKeyUp = input => e => {
    // on pressing enter triggering new line button
    if (e?.keyCode === 13 && !!input) {
      const addNewLineButton = document.getElementById("add-new-line");
      if (addNewLineButton) {
        addNewLineButton.click();
      }
    }
  };

  const ResolvedComponent = isText ? CustomTextInput : MathInput;

  return (
    <Wrapper active={disableResponse ? false : active}>
      {disableResponse ? (
        <MathSpan dangerouslySetInnerHTML={{ __html: renderMathText(line.text) }} />
      ) : (
        <ResolvedComponent
          ref={inputRef}
          value={line.text}
          onFocus={handleFocus}
          {...inputProps}
          onKeyUp={e => handleKeyUp(line.text)(e)}
        />
      )}
      {actionButtons}
    </Wrapper>
  );
};

MathEssayInputLine.propTypes = {
  line: PropTypes.object,
  item: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onAddNewLine: PropTypes.func.isRequired,
  onChangeType: PropTypes.func.isRequired,
  active: PropTypes.bool.isRequired,
  setActive: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired,
  disableResponse: PropTypes.bool
};

MathEssayInputLine.defaultProps = {
  disableResponse: false,
  line: {
    text: "",
    type: "text"
  }
};

export default MathEssayInputLine;
