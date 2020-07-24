import { backgroundGrey2 } from "@edulastic/colors";
import {
  EduButton,
  notification,
  EduSwitchStyled,
  CustomModalStyled,
  FieldLabel,
  TextInputStyled,
  TextAreaInputStyled
} from "@edulastic/common";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { getUser } from "../../../src/selectors/user";
import {
  createCollectionRequestAction,
  editCollectionRequestAction,
  getCreateCollectionStateSelector
} from "../../ducks";
import { FieldRow, Heading, ModalBody } from "./ImportContentModal";

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
    <CustomModalStyled
      title={Title}
      visible={visible}
      footer={Footer}
      onCancel={() => handleResponse(null)}
      width={400}
      centered
    >
      <ModalBody>
        <StyledFieldRow>
          <FieldLabel>Collection Name</FieldLabel>
          <TextInputStyled value={fieldData.name} onChange={e => handleFieldChange("name", e.target.value)} />
        </StyledFieldRow>
        <StyledFieldRow>
          <FieldLabel>Owner</FieldLabel>
          <TextInputStyled value={fieldData.owner} onChange={e => handleFieldChange("owner", e.target.value)} />
        </StyledFieldRow>
        <StyledFieldRow>
          <FieldLabel>Description</FieldLabel>
          <TextAreaInputStyled
            rows={4}
            height="80px"
            value={fieldData.description}
            onChange={e => handleFieldChange("description", e.target.value)}
          />
        </StyledFieldRow>
        <StyledFieldRow>
          <FieldLabel>
            <span>Collection Active</span>
            <EduSwitchStyled
              size="small"
              checked={fieldData.status}
              onChange={value => handleFieldChange("status", value ? 1 : 0)}
            />
          </FieldLabel>
        </StyledFieldRow>
      </ModalBody>
    </CustomModalStyled>
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
