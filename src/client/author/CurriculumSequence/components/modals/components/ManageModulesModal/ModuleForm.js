import React, { useState } from "react";
import PropTypes from "prop-types";
import { notification, TextInputStyled, FlexContainer, FroalaEditor } from "@edulastic/common";
import { Title, AddNewModuleContainer, AddBtnsWrapper, StyledButton } from "../styled";

const ModuleForm = ({ moduleIndex, module, isEdit, onCancel, onSave }) => {
  const [moduleData, setModuleData] = useState(module || {});

  const handleChangeModuleData = prop => ({ target: { value } }) => {
    value && setModuleData({ ...moduleData, [prop]: value });
  };

  const handleChangeDescription = desc => {
    if (desc) {
      setModuleData({ ...moduleData, moduleDescription: desc });
    }
  };

  const handleModuleSave = () => {
    const { moduleGroupName, moduleId, moduleName, moduleDescription } = moduleData;
    if (!moduleGroupName.trim()) {
      return notification({ type: "warning", messageKey: "manageModalGroupNameEmpty" });
    }

    if (!moduleId.trim()) {
      return notification({ type: "warning", messageKey: "manageModalModuleIDEmpty" });
    }

    if (!moduleName.trim()) {
      return notification({ type: "warning", messageKey: "manageModalModuleNameEmpty" });
    }

    onSave({ moduleGroupName, moduleId, moduleName, moduleDescription });
  };

  const fieldContatinerProp = {
    flexDirection: "column",
    alignItems: "flex-start"
  };

  return (
    <AddNewModuleContainer data-cy={`module-${moduleIndex + 1}`}>
      <FlexContainer {...fieldContatinerProp} width="100%">
        <Title>Module Or Chapter Name</Title>
        <TextInputStyled
          data-cy="module-group-name"
          onChange={handleChangeModuleData("moduleGroupName")}
          value={moduleData.moduleGroupName}
          maxLength={24}
        />
      </FlexContainer>
      <FlexContainer width="100%">
        <FlexContainer flex={1} {...fieldContatinerProp}>
          <Title>Unit Number</Title>
          <TextInputStyled
            data-cy="module-id"
            maxLength={4}
            value={moduleData.moduleId}
            onChange={handleChangeModuleData("moduleId")}
          />
        </FlexContainer>
        <FlexContainer flex={3} {...fieldContatinerProp} marginLeft="16px">
          <Title>Unit Name</Title>
          <TextInputStyled
            data-cy="module-name"
            value={moduleData.moduleName}
            maxLength={100}
            onChange={handleChangeModuleData("moduleName")}
          />
        </FlexContainer>
      </FlexContainer>
      <FlexContainer {...fieldContatinerProp} width="100%">
        <Title>Description</Title>
        <FroalaEditor
          value={moduleData.moduleDescription || ""}
          border="border"
          onChange={handleChangeDescription}
          toolbarId="module-description"
        />
      </FlexContainer>
      <AddBtnsWrapper>
        <StyledButton isGhost key="cancel" onClick={onCancel}>
          CANCEL
        </StyledButton>
        <StyledButton key="submit" onClick={handleModuleSave}>
          {isEdit ? "UPDATE" : "ADD"}
        </StyledButton>
      </AddBtnsWrapper>
    </AddNewModuleContainer>
  );
};

ModuleForm.propTypes = {
  module: PropTypes.object
};

ModuleForm.defaultProps = {
  module: {}
};

export default ModuleForm;
