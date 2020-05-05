import React, { useState } from "react";
import PropTypes from "prop-types";
import { cloneDeep } from "lodash";
import uuidv4 from "uuid/v4";

import MathEssayInputLine from "./components/MathEssayInputLine/index";
import { Wrapper } from "./styled/Wrapper";

export const MathEssayInputContext = React.createContext({});

const MathEssayInput = ({ textFormattingOptions, uiStyle, lines, setLines, item, disableResponse }) => {
  const [currentLineIndex, setCurrentLineIndex] = useState();

  const handleChange = (index, value) => {
    const newLines = cloneDeep(lines);

    if ((!value || value === "<p><br></p>") && newLines.length > 1) {
      newLines.splice(index, 1);
      setCurrentLineIndex(index - 1);
    } else {
      newLines[index].text = value;
    }

    setLines(newLines);
  };

  const onAddNewLine = index => {
    const newLines = cloneDeep(lines);

    if (item.uiStyle.max_lines && newLines.length === item.uiStyle.max_lines) {
      return;
    }

    newLines.splice(index + 1, 0, {
      text: "",
      type: uiStyle.defaultMode,
      index: uuidv4()
    });
    setLines(newLines);
    setCurrentLineIndex(index + 1);
  };

  const handleChangeType = (index, type) => {
    const newLines = cloneDeep(lines);
    newLines[index].type = type;
    setLines(newLines);
  };

  return (
    <div style={{ width: "100%" }}>
      <MathEssayInputContext.Provider value={{ textFormattingOptions, uiStyle }}>
        <Wrapper>
          {lines.map((line, i) => (
            <MathEssayInputLine
              disableResponse={disableResponse}
              key={line.index}
              id={line.index}
              item={item}
              onAddNewLine={() => onAddNewLine(i)}
              onChange={val => handleChange(i, val)}
              line={line}
              active={currentLineIndex === i}
              setActive={outside => {
                if (outside) {
                  setCurrentLineIndex();
                } else {
                  setCurrentLineIndex(i);
                }
              }}
              onChangeType={type => handleChangeType(i, type)}
            />
          ))}
        </Wrapper>
      </MathEssayInputContext.Provider>
    </div>
  );
};

MathEssayInput.propTypes = {
  textFormattingOptions: PropTypes.array,
  lines: PropTypes.array.isRequired,
  setLines: PropTypes.func.isRequired,
  item: PropTypes.object.isRequired,
  uiStyle: PropTypes.object,
  disableResponse: PropTypes.bool
};

MathEssayInput.defaultProps = {
  disableResponse: false,
  textFormattingOptions: [],
  uiStyle: {}
};

export default MathEssayInput;
