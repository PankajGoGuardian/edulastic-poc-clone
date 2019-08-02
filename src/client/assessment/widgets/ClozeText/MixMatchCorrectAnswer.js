import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { get, find, isArray } from "lodash";
import { Tag, Input } from "antd";
import { response as responseDimensions } from "@edulastic/constants";
import { dashBorderColor, white } from "@edulastic/colors";

const MixMatchCorrectAnswer = ({ response, alternateResponse, uiStyle, onUpdateValidationValue }) => {
  const [newValues, setNewTag] = useState({});

  const correctValues = get(response, "value", []);
  const alterValues = get(alternateResponse, "value", []);
  const { widthpx } = uiStyle;
  const btnStyle = {
    minWidth: `${responseDimensions.minWidth}px`,
    minHeight: `${responseDimensions.minHeight}px`,
    width: widthpx !== 0 ? widthpx : 140
  };

  const getAnswersFromAlter = id => {
    const altVal = find(alterValues, _val => _val.id === id);
    if (altVal) {
      if (isArray(altVal.value)) {
        return altVal.value;
      }
    }
    return [];
  };

  const handleClose = (id, removedIndex, valueIndex) => () => {
    const answres = getAnswersFromAlter(id);
    answres.splice(removedIndex, 1);
    alterValues.splice(valueIndex, 1, {
      id,
      valueIndex,
      value: answres
    });
    onUpdateValidationValue(alterValues);
  };

  const handleInputConfirm = (id, index) => () => {
    if (!newValues[id]) {
      return;
    }
    const answres = getAnswersFromAlter(id);
    answres.push(newValues[id]);
    alterValues.splice(index, 1, {
      id,
      index,
      value: answres
    });
    onUpdateValidationValue(alterValues);
    setNewTag({ [id]: "" });
  };

  const handleInputChange = id => e => {
    setNewTag({ [id]: e.target.value });
  };

  return correctValues.map(({ id, index, value }) => (
    <AnswerContainer>
      <CorrectAnswer style={btnStyle}>
        <div className="index">{index + 1}</div>
        <div className="text">{value}</div>
      </CorrectAnswer>
      <AlterAnswer key={id}>
        {getAnswersFromAlter(id).map((tag, answerIndex) => (
          <Tag key={tag} closable onClose={handleClose(id, answerIndex, index)}>
            {tag}
          </Tag>
        ))}
        <Input
          type="text"
          size="small"
          value={newValues[id]}
          onChange={handleInputChange(id)}
          onBlur={handleInputConfirm(id, index)}
          onPressEnter={handleInputConfirm(id, index)}
        />
      </AlterAnswer>
    </AnswerContainer>
  ));
};

MixMatchCorrectAnswer.propTypes = {
  response: PropTypes.object.isRequired,
  alternateResponse: PropTypes.object.isRequired,
  uiStyle: PropTypes.object.isRequired,
  onUpdateValidationValue: PropTypes.func.isRequired
};

export default MixMatchCorrectAnswer;

const AnswerContainer = styled.div`
  display: flex;
  margin-bottom: 8px;
`;

const CorrectAnswer = styled.div`
  display: flex;
  height: 44px;
  margin-right: 16px;
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
  }
`;
