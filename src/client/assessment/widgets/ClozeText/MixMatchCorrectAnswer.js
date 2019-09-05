import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import get from "lodash/get";
import { Tag, Input } from "antd";
import { response as responseDimensions } from "@edulastic/constants";
import { dashBorderColor, white } from "@edulastic/colors";
import FlexContainer from "@edulastic/common/src/components/FlexContainer";

const MixMatchCorrectAnswer = ({
  validResponse,
  alternateResponse,
  uiStyle,
  onUpdateValidationValue,
  addAltAnswerMixMatch
}) => {
  const correctValues = get(validResponse, "value", []);
  const [newValues, setNewTag] = useState(correctValues.reduce((obj, _, i) => ({ ...obj, [i]: "" }), {}));
  const altResponses = [];
  alternateResponse.forEach(altResponse => {
    altResponse.value.forEach(resp => {
      altResponses[resp.index] = altResponses[resp.index] || [];
      altResponses[resp.index].push({ ...resp, tabId: altResponse.id });
    });
  });

  const { widthpx } = uiStyle;
  const btnStyle = {
    minWidth: `${responseDimensions.minWidth}px`,
    minHeight: `${responseDimensions.minHeight}px`,
    width: widthpx !== 0 ? widthpx : 140
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

  const correctAnswersBlock = (
    // render all correct answers
    <FlexContainer flexDirection="column" alignItems="flex-start">
      {correctValues.map(({ id, index, value }) => (
        <CorrectAnswer style={btnStyle}>
          <div className="index">{index + 1}</div>
          <div className="text">{value}</div>
        </CorrectAnswer>
      ))}
    </FlexContainer>
  );

  const altAnswerBlock = (
    // render as many inputs as correct answers
    <FlexContainer flexDirection="column" alignItems="flex-start" flexWrap="wrap" style={{ width: "70%" }}>
      {correctValues.map((_, answerIndex) => (
        <AlterAnswer id={answerIndex}>
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
          <Input
            type="text"
            size="small"
            placeholder="+ Alt Ans"
            value={newValues[answerIndex]}
            onChange={handleInputChange(answerIndex)}
            onBlur={e => handleInputConfirm(answerIndex)}
          />
        </AlterAnswer>
      ))}
    </FlexContainer>
  );

  return (
    <FlexContainer justifyContent="flex-start" flexWrap="wrap">
      {correctAnswersBlock}
      {altAnswerBlock}
    </FlexContainer>
  );
};

MixMatchCorrectAnswer.propTypes = {
  response: PropTypes.object.isRequired,
  alternateResponse: PropTypes.object.isRequired,
  uiStyle: PropTypes.object.isRequired,
  onUpdateValidationValue: PropTypes.func.isRequired
};

export default MixMatchCorrectAnswer;

const CorrectAnswer = styled.div`
  display: flex;
  height: 44px;
  margin-right: 16px;
  margin-bottom: 8px;
  .index {
    padding: 8px 14px;
    color: ${white};
    display: inline-flex;
    align-items: center;
    height: 100%;
    background: #878282;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    align-self: stretch;
    height: 100%;
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
  }

  .ant-tag {
    padding: 4px 8px;
    margin-right: 4px;
    white-space: pre-wrap;
  }
`;
