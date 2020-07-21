import { Col, Form, Icon, Input } from "antd";
import produce from "immer";
import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { v4 } from "uuid";
import { CustomStyleBtn } from "../../../assessment/styled/ButtonStyles";
import { getUserDetails } from "../../../student/Login/ducks";
import { getCurrentRubricDataSelector, updateRubricDataAction } from "../ducks";
import { EditRubricContainer, FormContainer, RubricFooter } from "../styled";
import Criteria from "./Criteria";

const CreateNew = ({ form, updateRubricData, currentRubricData, isEditable }) => {
  const generateCriteriaData = index => ({
    name: `Criteria Name ${index}`,
    id: v4(),
    ratings: [
      {
        name: "Rating 1",
        desc: "",
        id: v4(),
        points: 0
      },
      {
        name: "Rating 2",
        desc: "",
        id: v4(),
        points: 0
      }
    ]
  });

  const getDefaultRubricData = () => ({
    name: "",
    description: "",
    criteria: [generateCriteriaData(1)]
  });

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

  const getCreateNewForm = () => {
    const { getFieldDecorator } = form;
    return (
      <FormContainer>
        <Form.Item label="RUBRIC NAME">
          {getFieldDecorator("rubricName", {
            initialValue: currentRubricData?.name || "",
            rules: [{ required: true }, { message: "Rubric name can only be alpha numeric.", pattern: /^[a-z\d\s]+$/i }]
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

  const generateCriteria = () =>
    currentRubricData?.criteria?.map(criteria => (
      <Criteria id={criteria.id} key={criteria.id} data={criteria} isEditable={isEditable} />
    ));

  const handleAddCriteria = () => {
    const newCriteria = generateCriteriaData(currentRubricData.criteria.length + 1);
    const newState = produce(currentRubricData, draft => {
      draft.criteria.push(newCriteria);
    });
    updateRubricData(newState);
  };

  const getCreateRubricFields = () => (
    <EditRubricContainer md={24}>
      {generateCriteria()}

      <RubricFooter>
        {isEditable && (
          <CustomStyleBtn margin="0px" onClick={handleAddCriteria}>
            <span>
              <Icon type="plus" />
            </span>
            &nbsp;&nbsp; Add New Criteria
          </CustomStyleBtn>
        )}
      </RubricFooter>
    </EditRubricContainer>
  );

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

  return <Col md={24}>{getContent()}</Col>;
};

const enhance = compose(
  Form.create(),
  connect(
    state => ({
      currentRubricData: getCurrentRubricDataSelector(state),
      user: getUserDetails(state)
    }),
    {
      updateRubricData: updateRubricDataAction
    }
  )
);

export default enhance(CreateNew);
