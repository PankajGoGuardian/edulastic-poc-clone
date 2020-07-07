import { backgroundGrey2 } from "@edulastic/colors";
import { EduButton, notification, EduSwitchStyled } from "@edulastic/common";
import { Input } from "antd";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { getUser } from "../../../src/selectors/user";
import {
  createCollectionRequestAction,
  editCollectionRequestAction,
  getCreateCollectionStateSelector
} from "../../ducks";
import { FieldRow, Heading, ModalBody, StyledModal } from "./ImportContentModal";

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
  const {
    districtIds: [userDistrictId]
  } = user;
  const [fieldData, setFieldData] = useState({
    name: "",
    owner: "",
    districtId: userDistrictId,
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

  const handleCreate = () => {
    if (!fieldData.name) {
      return notification({ messageKey: "collectionNameRequired" });
    }
    if (!fieldData.owner) {
      return notification({ messageKey: "ownerNameRequired" });
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

  const Footer = [
    <EduButton isGhost onClick={handleResponse} disabled={isCreating}>
      CANCEL
    </EduButton>,
    <EduButton onClick={() => handleCreate()} loading={isCreating}>
      {isEditCollection ? "SAVE" : "CREATE"}
    </EduButton>
  ];

  const Title = [<Heading>{isEditCollection ? "Edit Collection" : "Add Collection"}</Heading>];

  const handleFieldChange = (fieldName, value) => {
    const updatedFieldData = { ...fieldData, [fieldName]: value };
    setFieldData(updatedFieldData);
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
          <EduSwitchStyled
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
