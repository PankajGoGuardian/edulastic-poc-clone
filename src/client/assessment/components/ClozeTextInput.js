import React, { useRef, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Input } from "antd";

import NumberPad from "./NumberPad";
import { getInputSelection } from "../utils/helpers";

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

const ClozeTextInput = ({ index: dropTargetIndex, resprops }) => {
  const { btnStyle, item, onChange, style, placeholder, type, showIndex = true, userAnswers } = resprops;
  const value = userAnswers[dropTargetIndex];
  const ref = useRef();
  const MInput = item.multiple_line ? TextArea : Input;
  const [selection, setSelection] = useState({
    start: 0,
    end: 0
  });

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

  const _change = data => {
    if (type === "number" && Number.isNaN(+data.value)) {
      return;
    }

    onChange({
      ...data,
      type
    });
  };

  return (
    <CustomInput style={style}>
      {showIndex && <IndexBox>{dropTargetIndex + 1}</IndexBox>}
      <MInput
        ref={ref}
        onChange={e =>
          _change({
            value: e.target.value,
            dropTargetIndex
          })
        }
        onSelect={e => setSelection(getInputSelection(e.currentTarget))}
        wrap={item.multiple_line ? "" : "off"}
        value={value}
        key={`input_${dropTargetIndex}`}
        style={{
          ...btnStyle,
          resize: "none",
          height: "100%",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          fontSize: style.fontSize,
          background: item.background
        }}
        placeholder={placeholder}
      />
      {item.character_map && (
        <NumberPad
          buttonStyle={{ height: "100%", width: 30, position: "absolute", right: 0, top: 0 }}
          onChange={(_, val) => {
            _change({
              value: _getValue(val),
              dropTargetIndex
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
  index: PropTypes.number.isRequired
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
`;
