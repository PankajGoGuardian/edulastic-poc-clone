import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import moment from "moment";
import { v4 } from "uuid";
import { Row, Col, Form, Input, Icon } from "antd";
import {
  SaveButton,
  EditRubricContainer,
  CancelRubricButton,
  SaveRubricButton,
  RubricDetailsContainer,
  FormContainer,
  RubricFooter
} from "../styled";
import produce from "immer";
import { getUserDetails } from "../../../student/Login/ducks";
import { updateRubricDataAction, getCurrentRubricDataSelector } from "../ducks";
import Criteria from "./Criteria";

const CreateNew = ({ form, updateRubricData, currentRubricData, isEditable, user }) => {
  const generateCriteriaData = index => ({
    name: `Criteria Name ${index}`,
    id: v4(),
    ratings: [
      {
        name: "Rating 1",
        desc: "",
        id: v4(),
        points: "0"
      },
      {
        name: "Rating 2",
        desc: "",
        id: v4(),
        points: "1"
      }
    ]
  });

  const getDefaultRubricData = () => ({
    name: "",
    description: "",
    criteria: [generateCriteriaData(1)]
  });

  const getContent = () => {
    if (!currentRubricData) {
      const defaultData = getDefaultRubricData();
      updateRubricData(defaultData);
    }
    return (
      <>
        {getCreateNewForm()}
        {getCreateRubricFields()}
      </>
    );
  };

  const getCreateNewForm = () => {
    const { getFieldDecorator } = form;
    return (
      <FormContainer>
        <Form.Item label="RUBRIC NAME">
          {getFieldDecorator("rubricName", {
            initialValue: currentRubricData?.name || "",
            rules: [{ required: true }, { message: "Rubric name can only be alpha numeric.", pattern: /^[a-z\d\ ]+$/i }]
          })(
            <Input
              placeholder={isEditable ? "Enter rubric name" : ""}
              onChange={e => handleFieldChange("rubricName", e)}
              disabled={!isEditable}
            />
          )}
        </Form.Item>
        <Form.Item label="DESCRIPTION">
          <Input
            value={currentRubricData?.description || ""}
            placeholder={isEditable ? "Enter Description" : ""}
            onChange={e => handleFieldChange("rubricDesc", e)}
            disabled={!isEditable}
          />
        </Form.Item>
      </FormContainer>
    );
  };

  const getCreateRubricFields = () => {
    return (
      <EditRubricContainer md={24}>
        {generateCriteria()}

        <RubricFooter>
          {isEditable && (
            <span className="add-criteria-button" onClick={handleAddCriteria}>
              <span>
                <Icon type="plus" />
              </span>
              &nbsp;&nbsp; Add New Criteria
            </span>
          )}
        </RubricFooter>
      </EditRubricContainer>
    );
  };

  const generateCriteria = () => {
    return currentRubricData?.criteria?.map(criteria => (
      <Criteria id={criteria.id} key={criteria.id} data={criteria} isEditable={isEditable} />
    ));
  };

  const handleAddCriteria = () => {
    const newCriteria = generateCriteriaData(currentRubricData.criteria.length + 1);
    const newState = produce(currentRubricData, draft => {
      draft.criteria.push(newCriteria);
    });
    updateRubricData(newState);
  };

  const handleFieldChange = (fieldType, e) => {
    const newState = produce(currentRubricData, draft => {
      if (fieldType === "rubricName") {
        draft.name = e.target.value;
      } else if (fieldType === "rubricDesc") {
        draft.description = e.target.value;
      }
    });

    updateRubricData(newState);
  };

  return <Col md={24}>{getContent()}</Col>;
};

const enhance = compose(
  Form.create(),
  connect(
    state => ({
      //questionData: getQuestionDataSelector(state)
      currentRubricData: getCurrentRubricDataSelector(state),
      user: getUserDetails(state)
    }),
    {
      //setQuestionData: setQuestionDataAction
      updateRubricData: updateRubricDataAction
    }
  )
);

export default enhance(CreateNew);
