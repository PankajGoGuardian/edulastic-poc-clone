import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import get from "lodash/get";
import { Tag, Input, Popover } from "antd";
import { response as responseDimensions, math } from "@edulastic/constants";
import { dashBorderColor, white } from "@edulastic/colors";
import FlexContainer from "@edulastic/common/src/components/FlexContainer";
import NumberPad from "../../components/NumberPad";

const { characterMapButtons } = math;

const MixMatchCorrectAnswer = ({
  item,
  validResponse,
  alternateResponse,
  uiStyle,
  onUpdateValidationValue,
  addAltAnswerMixMatch
}) => {
  const inputRef = useRef();
  const correctValues = get(validResponse, "value", []);
  const [newValues, setNewTag] = useState(correctValues.reduce((obj, _, i) => ({ ...obj, [i]: "" }), {}));
  const [selection, setSelection] = useState({ start: 0, end: 0 });
  const altResponses = [];
  alternateResponse.forEach(altResponse => {
    altResponse.value.forEach(resp => {
      altResponses[resp.index] = altResponses[resp.index] || [];
      altResponses[resp.index].push({ ...resp, tabId: altResponse.id });
    });
  });
  /**
   * input [{inputtype: "number"/"text"}, {inputtype: "numner"/"text"}]
   * output {0: "number"/"text", 1: "number"/text}
   */
  const responseTypes =
    uiStyle?.responsecontainerindividuals?.reduce((acc, resp) => {
      acc[resp.index] = acc[resp.index] || {};
      acc[resp.index] = resp.inputtype || "text";
      return acc;
    }, {}) || {};

  const { widthpx, inputtype } = uiStyle;
  const btnStyle = {
    minWidth: `${widthpx || responseDimensions.minWidth}px`,
    minHeight: `${responseDimensions.minHeight}px`,
    maxWidth: responseDimensions.clozeTextMaxWidth
    // width: widthpx !== 0 ? widthpx : 140
  };

  const handleClose = ({ id, tabId, value }) => {
    onUpdateValidationValue({ id, tabId, value });
  };

  const handleInputConfirm = answerIndex => {
    if (!newValues[answerIndex].trim().length) return;
    addAltAnswerMixMatch({ index: answerIndex, value: newValues[answerIndex] });
    setNewTag({ ...newValues, [answerIndex]: "" });
  };

  const handleInputChange = answerIndex => e => {
    setNewTag({ ...newValues, [answerIndex]: e.target.value });
  };

  const handleSelect = e => {
    const { selectionStart, selectionEnd } = e.target;
    setSelection({
      start: selectionStart,
      end: selectionEnd
    });
  };

  const insertSpecialChar = answerIndex => (_, char) => {
    setSelection({
      start: selection.start + char.length,
      end: selection.start + char.length
    });

    let value = newValues[answerIndex] || "";
    value = value.slice(0, selection.start) + char + value.slice(selection.end);
    setNewTag({ ...newValues, [answerIndex]: value });
  };

  const makeCharactersMap = () => {
    const { characterMap } = item;
    const make = arr => arr.map(character => ({ value: character, label: character }));

    if (Array.isArray(characterMap) && characterMap.length > 0) {
      return make(characterMap);
    }

    return make(characterMapButtons);
  };

  const correctAnswersBlock = (
    // render all correct answers
    <FlexContainer flexDirection="column" alignItems="flex-start" style={{ flexShrink: 0 }}>
      {correctValues.map(({ index, value }) => (
        <CorrectAnswer style={btnStyle}>
          <div className="index">{index + 1}</div>
          <div className="text">{value}</div>
        </CorrectAnswer>
      ))}
    </FlexContainer>
  );

  const altAnswerBlock = (
    // render as many inputs as correct answers
    <FlexContainer flexDirection="column" alignItems="flex-start" flexWrap="wrap" style={{ flexShrink: 0 }}>
      {correctValues.map((_, answerIndex) => (
        <AlterAnswer id={answerIndex} key={answerIndex}>
          {altResponses[answerIndex] &&
            altResponses[answerIndex].map(({ id, value, tabId }) => (
              <FlexContainer justifyContent="flex-start" key={id}>
                {value.length > 0 && (
                  <Tag
                    className={id}
                    closable
                    onClose={e => {
                      e.preventDefault();
                      handleClose({ id, tabId, value });
                    }}
                  >
                    {value}
                  </Tag>
                )}
              </FlexContainer>
            ))}
          <Popover
            visible={newValues[answerIndex]}
            placement="bottom"
            overlayClassName="text-entry-altanswer-button"
            content={<AddButton onClick={() => handleInputConfirm(answerIndex)}>+ add</AddButton>}
          >
            <Input
              data-cy="mixNmatchAltAns"
              // individual type overriding the global type
              // default to text if neither is set
              type={responseTypes[answerIndex] || inputtype || "text"}
              size="small"
              placeholder="+ Alt Ans"
              value={newValues[answerIndex]}
              onChange={handleInputChange(answerIndex)}
              onSelect={handleSelect}
              ref={inputRef}
            />
          </Popover>
          {item.characterMap && (
            <NumberPad
              buttonStyle={{ width: 30, height: "100%" }}
              onChange={insertSpecialChar(answerIndex)}
              items={[{ value: "á", label: "á" }]}
              characterMapButtons={makeCharactersMap()}
              style={{ display: "inline-flex", height: "100%" }}
            />
          )}
        </AlterAnswer>
      ))}
    </FlexContainer>
  );

  return (
    <Container width="100%" justifyContent="flex-start" flexWrap="nowrap">
      {correctAnswersBlock}
      {altAnswerBlock}
    </Container>
  );
};

MixMatchCorrectAnswer.propTypes = {
  alternateResponse: PropTypes.object.isRequired,
  uiStyle: PropTypes.object.isRequired,
  onUpdateValidationValue: PropTypes.func.isRequired
};

export default MixMatchCorrectAnswer;

const Container = styled(FlexContainer)`
  padding-bottom: 14px;
  overflow: auto;
`;

const CorrectAnswer = styled.div`
  display: flex;
  align-items: stretch;
  height: 32px;
  margin-right: 16px;
  margin-bottom: 8px;
  .index {
    padding: 8px 14px;
    color: ${white};
    display: inline-flex;
    align-items: center;
    background: #878282;
    border-top-left-radius: 4px;
    border-bottom-left-radius: 4px;
    align-self: stretch;
  }
  .text {
    display: inline-flex;
    align-items: center;
    border: 1px ${dashBorderColor} solid;
    background: ${white};
    padding: 8px 16px;
    height: 100%;
  }
`;

const AlterAnswer = styled.div`
  display: flex;
  align-items: center;
  width: fit-content;
  border: 1px ${dashBorderColor} solid;
  padding-left: 8px;
  background: ${white};
  margin-bottom: 8px;
  max-width: 100%;
  flex-wrap: wrap;
  .ant-input {
    border: 0px;
    padding: 8px;
    &:focus {
      box-shadow: none;
    }
    width: 80px;
    min-height: 32px;
  }

  .ant-tag {
    padding: 2px 8px;
    margin-right: 4px;
    white-space: pre-wrap;
  }
`;

const AddButton = styled.div`
  font-size: 10px;
  width: 80px;
  padding: 2px 8px;
  border-radius: 2px;
  cursor: pointer;
  background: ${white};
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.5);
`;
