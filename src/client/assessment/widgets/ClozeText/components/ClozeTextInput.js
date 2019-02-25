import React, { useRef, useState, useContext } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Input } from "antd";
import NumberPad from "../../../components/NumberPad";
import { getInputSelection } from "../../../utils/helpers";
import { ClozeTextContext } from "../index";

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

const ClozeTextInput = ({ value, btnStyle, dropTargetIndex, onChange }) => {
  const ref = useRef();
  const { item } = useContext(ClozeTextContext);
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

  return (
    <CustomInput>
      <MInput
        ref={ref}
        onChange={e => {
          onChange({
            value: e.target.value,
            dropTargetIndex,
            type: btnStyle.inputtype
          });
        }}
        onSelect={e => setSelection(getInputSelection(e.currentTarget))}
        wrap={item.multiple_line ? "" : "off"}
        value={value}
        key={`input_${dropTargetIndex}`}
        style={{
          ...btnStyle,
          resize: "none"
        }}
        placeholder={btnStyle.placeholder}
      />
      {item.character_map && (
        <NumberPad
          buttonStyle={{ height: "100%", width: 30 }}
          onChange={(_, val) => {
            onChange({
              value: _getValue(val),
              dropTargetIndex,
              type: btnStyle.inputtype
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
  btnStyle: PropTypes.object.isRequired,
  dropTargetIndex: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.string
};

ClozeTextInput.defaultProps = {
  value: ""
};

export default ClozeTextInput;

const CustomInput = styled.div`
  display: inline-flex;
  margin: 0 10px;
  position: relative;
`;
