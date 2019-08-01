import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Input } from "antd";
import { find } from "lodash";

import NumberPad from "../../components/NumberPad";
import { getInputSelection } from "../../utils/helpers";

const { TextArea } = Input;

const characterMapButtons = [
  "¡",
  "¿",
  "Ç",
  "Ñ",
  "ç",
  "ñ",
  "ý",
  "ÿ",
  "á",
  "â",
  "ã",
  "ä",
  "å",
  "æ",
  "À",
  "Á",
  "Â",
  "Ã",
  "Ä",
  "Å",
  "Æ",
  "à",
  "È",
  "É",
  "Ê",
  "Ë",
  "è",
  "é",
  "ê",
  "ë",
  "Ì",
  "Í",
  "Î",
  "Ï",
  "ì",
  "í",
  "î",
  "ï",
  "Ò",
  "Ó",
  "Ô",
  "Õ",
  "Ö",
  "Ø",
  "ð",
  "ò",
  "ó",
  "ô",
  "õ",
  "ö",
  "Ù",
  "Ú",
  "Û",
  "Ü",
  "ù",
  "ú",
  "û",
  "ü"
];

const ClozeTextInput = ({ resprops, id }) => {
  if (!id) {
    return null;
  }
  const {
    item,
    onChange,
    style,
    placeholder,
    type = "text",
    showIndex = true,
    userAnswers,
    disableResponse,
    responseIds,
    testItem,
    cAnswers,
    view,
    responsecontainerindividuals,
    uiStyle
  } = resprops;
  const ref = useRef();
  const MInput = item.multiple_line ? TextArea : Input;
  const { index } = find(responseIds, response => response.id === id);
  let { value } = find(userAnswers, answer => (answer ? answer.id : "") === id) || { value: "" };

  if (testItem) {
    const { value: correctValue } = find(cAnswers, answer => (answer ? answer.id : "") === id) || { value: "" };
    value = correctValue;
  }
  const [input, setInput] = useState({ id, value });

  const _getValue = val => {
    const newStr = value.split("");
    newStr.splice(selection.start, selection.end - selection.start, val);
    return newStr.join("");
  };

  const _makeCharactersMap = () => {
    const { character_map } = item;
    const make = arr => arr.map(character => ({ value: character, label: character }));

    if (Array.isArray(character_map) && character_map.length > 0) {
      return make(character_map);
    }

    return make(characterMapButtons);
  };

  const handleInputChange = data => {
    if (type === "number" && Number.isNaN(+data.value)) {
      return;
    }
    setInput(data);
  };
  let width = style.width || "auto";
  let height = style.height || "auto";
  const responseStyle = find(responsecontainerindividuals, container => container.id === id);
  if (view === "edit") {
    if (uiStyle.globalSettings) {
      width = (responseStyle && responseStyle.previewWidth) || (style.widthpx || "auto");
      height = style.height || "auto";
    } else {
      width = (responseStyle && responseStyle.widthpx) || (style.widthpx || "auto");
      height = (responseStyle && responseStyle.heightpx) || style.height || "auto";
    }
  } else {
    if (uiStyle.globalSettings) {
      width = (responseStyle && responseStyle.previewWidth) || (style.widthpx || "auto");
      height = style.height || "auto";
    } else {
      width = (responseStyle && responseStyle.widthpx) || style.widthpx || "auto";
      height = (responseStyle && responseStyle.heightpx) || style.height || "auto";
    }
  }
  return (
    <CustomInput
      key={`input_${index}`}
      style={{ ...style, width: "max-content", height: "auto" }}
      title={value.length ? value : null}
    >
      {showIndex && <IndexBox>{index + 1}</IndexBox>}
      <MInput
        ref={ref}
        type={type}
        onChange={e => handleInputChange({ value: e.target.value, id })}
        onBlur={_ => onChange(input)}
        disabled={disableResponse}
        wrap={item.multiple_line ? "" : "off"}
        value={input.value || ""}
        key={`input_${index}`}
        style={{
          ...style,
          resize: "none",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontSize: style.fontSize,
          background: item.background,
          padding: width <= 50 ? "3px" : null,
          width: `${width}px` || "auto",
          height: `${height}px` || "auto"
        }}
        placeholder={placeholder}
      />
      {item.character_map && (
        <NumberPad
          buttonStyle={{ height: "100%", width: 30, position: "absolute", right: 0, top: 0 }}
          onChange={(_, val) => {
            _change({
              value: _getValue(val),
              index
            });
            ref.current.focus();
          }}
          items={[{ value: "á", label: "á" }]}
          characterMapButtons={_makeCharactersMap()}
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
  display: inline-flex;
  margin: 0px 4px;
  position: relative;
  box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.1);
`;

const IndexBox = styled.div`
  padding: 3px 10px;
  color: white;
  display: inline-flex;
  align-items: center;
  height: 100%;
  background: #878282;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
  align-self: stretch;
  height: auto;
`;
