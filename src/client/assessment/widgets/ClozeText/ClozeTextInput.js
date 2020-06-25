import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { find } from "lodash";
import { AutoExpandInput } from "@edulastic/common";
import { math } from "@edulastic/constants";
import { greyThemeLighter, greyThemeLight } from "@edulastic/colors";
import NumberPad from "../../components/NumberPad";
import { getInputSelection } from "../../utils/helpers";

const { characterMapButtons } = math;

const ClozeTextInput = ({ resprops, id }) => {
  if (!id) {
    return null;
  }
  const { item, onChange, getUiStyles, userAnswers, disableResponse, isReviewTab, cAnswers } = resprops;
  const ref = useRef();

  let { value, index: responseIndex } = find(userAnswers, answer => (answer ? answer.id : "") === id) || { value: "" };

  if (isReviewTab) {
    const { value: correctValue, index: correctAnswerIndex } = find(
      cAnswers,
      answer => (answer ? answer.id : "") === id
    ) || { value: "", index: "" };
    value = correctValue;
    responseIndex = correctAnswerIndex;
  }

  const { btnStyle } = getUiStyles(id, responseIndex);

  const [input, setInput] = useState({ id, value });
  const [selection, setSelection] = useState(false);

  const _getValue = specialChar => {
    // TODO get input ref ? set cursor postion ?
    if (ref.current) {
      const inputElement = item.multiple_line ? ref.current.textAreaRef : ref.current.input;
      if (inputElement) {
        const _selection = getInputSelection(inputElement);
        setSelection(_selection);
        const newStr = value.split("");
        newStr.splice(_selection.start, _selection.end - _selection.start, specialChar);
        return newStr.join("");
      }
    }
  };

  const _makeCharactersMap = () => {
    const { characterMap } = item;
    const make = arr => arr.map(character => ({ value: character, label: character }));

    if (Array.isArray(characterMap) && characterMap.length > 0) {
      return make(characterMap);
    }

    return make(characterMapButtons);
  };

  const handleInputChange = val => {
    if (btnStyle.type === "number" && val) {
      const regex = new RegExp("[+-]?[0-9]+(\\.[0-9]+)?([Ee][+-]?[0-9]*)?", "g");
      const isInputValid = val
        .trim()
        .split("\r\n")
        .filter(v => v) // filter out multiple line feeds in between two strings
        .every(v => {
          const res = regex.test(v);
          return res;
        });
      if (!isInputValid) {
        return;
      }
    }

    setInput({ value: val, id });
  };

  const insertSpecialChar = (_, char) => {
    handleInputChange(_getValue(char));
    ref.current.focus();
  };

  useEffect(() => {
    setInput({ id, value });
  }, [value]);

  useEffect(() => {
    if (selection && ref.current) {
      const em = item.multiple_line ? ref.current.textAreaRef : ref.current.input;
      if (em.setSelectionRange) {
        em.setSelectionRange(selection.start + 1, selection.end + 1);
      }
      setSelection(false);
    }
  }, [selection]);

  const numberPadContainerStyle = {
    display: "inline-flex",
    height: btnStyle.height
  };

  return (
    <CustomInput key={id} style={{ marginBottom: "4px" }}>
      <AutoExpandInput
        key={id}
        inputRef={ref}
        type={btnStyle.type}
        onChange={handleInputChange}
        onBlur={() => onChange(input)}
        disabled={disableResponse}
        multipleLine={item.multiple_line}
        value={input.value}
        style={{ ...btnStyle, padding: "4px 10px" }}
        placeholder={btnStyle.placeholder}
        characterMap={item.characterMap}
      />

      {item.characterMap && (
        <NumberPad
          buttonStyle={{ height: "100%", width: 30 }}
          onChange={insertSpecialChar}
          items={[{ value: "á", label: "á" }]}
          characterMapButtons={_makeCharactersMap()}
          style={numberPadContainerStyle}
        />
      )}
    </CustomInput>
  );
};

ClozeTextInput.propTypes = {
  resprops: PropTypes.object.isRequired,
  id: PropTypes.string.isRequired
};

export default ClozeTextInput;

const CustomInput = styled.div`
  display: inline-block;
  margin: 0px 4px;
  position: relative;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);

  .ant-input {
    border-radius: 4px;
    background: ${greyThemeLighter};
    border: 1px solid ${greyThemeLight};
  }
`;
