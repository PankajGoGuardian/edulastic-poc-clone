import React, { useState } from "react";
import styled from "styled-components";
import { Modal, Row, Col, Spin, Select, Checkbox, Input, message } from "antd";
import { IconClose } from "@edulastic/icons";
import { SelectInputStyled, EduButton } from "@edulastic/common";
import { greyThemeDark1, darkGrey2 } from "@edulastic/colors";

const AddToGroupModal = ({ title, description, visible, onSubmit, onCancel, loading, groupList = [] }) => {
  const [selected, setSelected] = useState({});
  const [checked, toggleChecked] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  const handleOnSubmit = () => {
    if (checked) {
      if (!groupName) {
        message.error("Enter a group name for the new group");
      } else if (groupList.find(g => g.name === groupName)) {
        message.error("Group with that name already exists");
      } else {
        onSubmit({ name: groupName, description: groupDescription }, true);
      }
    } else {
      onSubmit(selected);
    }
  };

  return (
    <StyledModal visible={visible} footer={null} onCancel={onCancel} centered>
      {loading ? (
        <Spin size="small" />
      ) : (
        <Row type="flex" align="middle" gutter={[20, 20]}>
          <StyledCol span={24} justify="space-between">
            <StyledDiv fontStyle="22px/30px Open Sans" fontWeight={700}>
              {title}
            </StyledDiv>
            <IconClose height={20} width={20} onClick={onCancel} />
          </StyledCol>
          <StyledCol span={24} marginBottom="5px" justify="left">
            <StyledDiv color={darkGrey2}>{description}</StyledDiv>
          </StyledCol>
          <StyledCol span={24} marginBottom={"10px"} justify="left">
            <Checkbox checked={checked} onChange={() => toggleChecked(!checked)}>
              <StyledDiv fontStyle="11px/15px Open Sans">CREATE A NEW GROUP</StyledDiv>
            </Checkbox>
          </StyledCol>
          {!checked && (
            <StyledCol span={24} marginBottom="20px">
              <SelectInputStyled
                showSearch
                placeholder="Select a group"
                cache="false"
                onChange={setSelected}
                dropdownStyle={{ zIndex: 2000 }}
                labelInValue
              >
                {groupList.map(({ _id, name }) => (
                  <Select.Option key={_id} value={_id}>
                    {name}
                  </Select.Option>
                ))}
              </SelectInputStyled>
            </StyledCol>
          )}
          {checked && (
            <StyledCol span={24} justify="space-between">
              <StyledDiv> Group Name: </StyledDiv>
              <Input style={{ width: "400px" }} value={groupName} onChange={e => setGroupName(e.target.value.trim())} />
            </StyledCol>
          )}
          {checked && (
            <StyledCol span={24} marginBottom="20px" justify="space-between">
              <StyledDiv> Group Description: </StyledDiv>
              <Input
                style={{ width: "400px" }}
                value={groupDescription}
                onChange={e => setGroupDescription(e.target.value)}
              />
            </StyledCol>
          )}
          <StyledCol span={24}>
            <EduButton height="40px" width="200px" isGhost onClick={onCancel} style={{ "margin-left": "0px" }}>
              Cancel
            </EduButton>
            <EduButton
              height="40px"
              width="200px"
              onClick={handleOnSubmit}
              style={{ "margin-left": "20px" }}
              disabled={!checked && !selected.key}
            >
              {checked ? "Create Group" : "Add to Group"}
            </EduButton>
          </StyledCol>
        </Row>
      )}
    </StyledModal>
  );
};

export default AddToGroupModal;

const StyledModal = styled(Modal)`
  .ant-modal-content {
    width: 630px;
    .ant-modal-close {
      display: none;
    }
    .ant-modal-header {
      display: none;
    }
    .ant-modal-body {
      padding: 24px 46px 32px;
    }
  }
`;

const StyledCol = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: ${props => props.justify || "center"};
  margin-bottom: ${props => props.marginBottom};
  svg {
    cursor: pointer;
  }
`;

const StyledDiv = styled.div`
  display: inline;
  text-align: left;
  white-space: nowrap;
  font: ${props => props.fontStyle || "14px/19px Open Sans"};
  font-weight: ${props => props.fontWeight || 600};
  color: ${props => props.color || greyThemeDark1};
`;
