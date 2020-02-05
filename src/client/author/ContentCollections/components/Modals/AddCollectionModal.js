import React, { useState, useEffect } from "react";
import { Button, Input, Switch, message } from "antd";
import styled from "styled-components";
import { connect } from "react-redux";
import { StyledModal, ModalBody, Heading, YesButton, FieldRow } from "./ImportContentModal";
import { getUser } from "../../../src/selectors/user";
import { backgroundGrey2 } from "@edulastic/colors";
import {
  createCollectionRequestAction,
  getCreateCollectionStateSelector,
  editCollectionRequestAction
} from "../../ducks";

const { TextArea } = Input;

const AddCollectionModal = ({
  visible,
  handleResponse,
  user,
  createCollectionRequest,
  isCreating,
  isEditCollection,
  editCollectionData,
  editCollectionRequest,
  searchValue
}) => {
  const [fieldData, setFieldData] = useState({
    name: "",
    owner: "",
    districtId: user.districtId,
    description: "",
    status: 1
  });

  useEffect(() => {
    if (isEditCollection) {
      const { updatedAt, _id, stats, createdAt, buckets, ...rest } = editCollectionData;
      const collectionData = {
        ...fieldData,
        ...rest
      };
      setFieldData(collectionData);
    }
  }, []);

  const Footer = [
    <Button ghost onClick={handleResponse} disabled={isCreating}>
      CANCEL
    </Button>,
    <YesButton onClick={() => handleCreate()} loading={isCreating}>
      {isEditCollection ? "SAVE" : "CREATE"}
    </YesButton>
  ];

  const Title = [<Heading>{isEditCollection ? "Edit Collection" : "Add Collection"}</Heading>];

  const handleFieldChange = (fieldName, value) => {
    const updatedFieldData = { ...fieldData, [fieldName]: value };
    setFieldData(updatedFieldData);
  };

  const handleCreate = () => {
    if (!fieldData.name) {
      return message.error("Collection name is required.");
    }
    if (!fieldData.owner) {
      return message.error("Owner name is required.");
    }
    const payload = {
      data: fieldData,
      id: editCollectionData?._id,
      searchValue
    };
    if (isEditCollection) {
      editCollectionRequest(payload);
    } else {
      createCollectionRequest(payload);
    }
    handleResponse();
  };

  return (
    <StyledModal title={Title} visible={visible} footer={Footer} onCancel={() => handleResponse(null)} width={400}>
      <ModalBody>
        <StyledFieldRow>
          <label>Collection Name</label>
          <Input value={fieldData.name} onChange={e => handleFieldChange("name", e.target.value)} />
        </StyledFieldRow>
        <StyledFieldRow>
          <label>Owner</label>
          <Input value={fieldData.owner} onChange={e => handleFieldChange("owner", e.target.value)} />
        </StyledFieldRow>
        <StyledFieldRow>
          <label>Description</label>
          <TextArea
            rows={4}
            value={fieldData.description}
            onChange={e => handleFieldChange("description", e.target.value)}
          />
        </StyledFieldRow>
        <StyledFieldRow>
          <span>Collection Active</span>
          <Switch
            size="small"
            checked={fieldData.status}
            onChange={value => handleFieldChange("status", value ? 1 : 0)}
          />
        </StyledFieldRow>
      </ModalBody>
    </StyledModal>
  );
};

export default connect(
  state => ({ user: getUser(state), isCreating: getCreateCollectionStateSelector(state) }),
  { createCollectionRequest: createCollectionRequestAction, editCollectionRequest: editCollectionRequestAction }
)(AddCollectionModal);

const StyledFieldRow = styled(FieldRow)`
  &:last-child {
    margin-bottom: 0px;
  }

  > span:first-child {
    font-size: ${props => props.theme.smallFontSize};
    text-transform: uppercase;
  }

  .ant-switch {
    margin-left: 20px;
  }

  textarea {
    background: ${backgroundGrey2};
  }
`;

export const CheckBoxGroup = styled.div`
  width: 100%;
  .ant-checkbox-wrapper {
    width: 30%;
    > span:first-child {
      margin-right: 10px;
    }
    > span:last-child {
      font-size: ${props => props.theme.smallFontSize};
      text-transform: uppercase;
    }
  }
`;
