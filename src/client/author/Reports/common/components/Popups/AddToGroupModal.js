import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import * as moment from "moment";
import { Modal, Row, Col, Spin, Select, Checkbox, Input, message } from "antd";

import { IconClose } from "@edulastic/icons";
import { SelectInputStyled, EduButton } from "@edulastic/common";
import { greyThemeDark1, darkGrey2 } from "@edulastic/colors";
import { groupApi } from "@edulastic/api";

import {
  addGroupAction,
  fetchGroupsAction,
  getGroupsSelector,
  groupsLoadingSelector
} from "../../../../sharedDucks/groups";
import { getUserId } from "../../../../../student/Login/ducks";
import { requestEnrolExistingUserToClassAction } from "../../../../ClassEnrollment/ducks";
import { getUserOrgData } from "../../../../src/selectors/user";

const AddToGroupModal = ({
  visible,
  onCancel,
  groupType = "custom",
  checkedStudents,
  // studentList, //TODO: fetch & filter students from group that belong in this list (needs discussion)
  loading,
  fetchGroups,
  groupList,
  addToGroups,
  enrollStudentsToGroup,
  orgData,
  userId
}) => {
  const [selectedStudents, setSelectedStudents] = useState(checkedStudents);
  const [selectedGroup, setSelectedGroup] = useState({});
  const [checked, toggleChecked] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    setSelectedStudents(checkedStudents);
  }, [checkedStudents]);

  const addStudents = async (group = {}) => {
    const { districtId, terms, defaultSchool } = orgData;
    const term = terms.length && terms.find(term => term.endDate > Date.now() && term.startDate < Date.now());
    if (selectedStudents.length) {
      // fetch group info for new / existing group
      if (checked) {
        try {
          group = await groupApi.createGroup({
            type: groupType,
            name: groupName,
            description: groupDescription,
            startDate: moment().format("x"),
            endDate: moment(term ? term.endDate : moment().add(1, "year")).format("x"),
            districtId,
            institutionId: defaultSchool,
            grades: [],
            subject: "Other Subjects",
            standardSets: [],
            tags: [],
            parent: { id: userId },
            owners: [userId]
          });
        } catch ({ data: { message: errorMessage } }) {
          message.error(errorMessage);
        }
        addToGroups(group);
      } else {
        group = groupList.find(g => selectedGroup.key === g._id);
      }
      // enroll students to group
      enrollStudentsToGroup({
        classCode: group.code,
        studentIds: selectedStudents,
        districtId
      });
    }
    onCancel();
  };

  const handleOnSubmit = () => {
    if (checked) {
      if (!groupName || !groupDescription) {
        message.error("Group name & description cannot be empty for the new group");
      } else if (groupList.find(g => g.name === groupName)) {
        message.error("Group or class with that name already exists");
      } else {
        addStudents();
      }
    } else {
      addStudents();
    }
  };

  const filteredGroups = (groupList || []).filter(g => g.type === groupType);
  // TODO: this does not work as the students belonging to the table
  // need to fetch the students in that group, to be done as part of the mock update
  // const filteredStudentList = (studentList || []).filter(s => s.groupId === selectedGroup._id);

  return (
    <StyledModal visible={visible} footer={null} onCancel={onCancel} centered>
      {loading ? (
        <Spin size="small" />
      ) : (
        <Row type="flex" align="middle" gutter={[20, 20]}>
          <StyledCol span={24} justify="space-between">
            <StyledDiv fontStyle="22px/30px Open Sans" fontWeight={700}>
              Add To Group
            </StyledDiv>
            <IconClose height={20} width={20} onClick={onCancel} />
          </StyledCol>
          <StyledCol span={24} marginBottom="5px" justify="left">
            <StyledDiv color={darkGrey2}>Add selected students to an existing group or create a new one</StyledDiv>
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
                onChange={setSelectedGroup}
                dropdownStyle={{ zIndex: 2000 }}
                labelInValue
              >
                {filteredGroups.map(({ _id, name }) => (
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
              disabled={!checked && !selectedGroup.key}
            >
              {checked ? "Create Group" : "Add to Group"}
            </EduButton>
          </StyledCol>
        </Row>
      )}
    </StyledModal>
  );
};

export default connect(
  state => ({
    groupList: getGroupsSelector(state),
    loading: groupsLoadingSelector(state),
    orgData: getUserOrgData(state),
    userId: getUserId(state)
  }),
  {
    fetchGroups: fetchGroupsAction,
    addToGroups: addGroupAction,
    enrollStudentsToGroup: requestEnrolExistingUserToClassAction
  }
)(AddToGroupModal);

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
