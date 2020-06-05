import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";

// components
import PerfectScrollbar from "react-perfect-scrollbar";
import { Modal, Row, Col, Spin, Select, message } from "antd";
import { IconClose, IconPlusCircle, IconCorrect, IconCarets } from "@edulastic/icons";
import { SelectInputStyled, EduButton, withWindowSizes, notification } from "@edulastic/common";

// api, ducks, helpers
import { enrollmentApi } from "@edulastic/api";
import {
  backgrounds,
  borderGrey4,
  greyThemeDark1,
  darkGrey2,
  lightGrey5,
  themeColor,
  lightBlue2,
  white,
  largeDesktopWidth,
  tabletWidth
} from "@edulastic/colors";
import { fetchGroupsAction, getGroupsSelector, groupsLoadingSelector } from "../../../../sharedDucks/groups";
import { requestEnrolExistingUserToClassAction } from "../../../../ClassEnrollment/ducks";

const getParentUrl = urlList => {
  // urlList[2] decides the origin of the createClass route
  switch (urlList[2]) {
    case "reports":
      // equivalent to /author/reports/<report-type>
      return urlList.slice(0, 4).join("/");
    case "manageClass":
    case "gradebook":
    case "groups":
    case "class-enrollment":
      return `/author/${urlList[2]}`;
    default:
      return "/author/manageClass";
  }
};

const ScrollElement = ({ item, onClick, ticked }) => (
  <div data-cy={`${item.lastName}, ${item.firstName}`} className="scrollbar-element" onClick={() => onClick(item._id)}>
    <div className="scrollbar-select">
      <StyledDiv color={darkGrey2} spacing="0.26px" fontStyle="14px/19px Open Sans">
        {item.firstName || ""} {item.lastName || ""}
      </StyledDiv>
      <StyledDiv color={lightGrey5} spacing="0.2px">
        {item.username || ""}
      </StyledDiv>
    </div>
    <IconCorrect data-cy={`isSelected-${ticked}`} color={ticked ? themeColor : white} />
  </div>
);

const AddToGroupModal = ({
  visible,
  onCancel,
  groupType = "custom",
  checkedStudents,
  loading,
  fetchGroups,
  groupList,
  enrollStudentsToGroup,
  match,
  history,
  windowWidth
}) => {
  const groupTypeText = groupType === "custom" ? "group" : "class";
  const [studentList, setStudentList] = useState([]);
  const [studentsToAdd, setStudentsToAdd] = useState([]);
  const [studentsToRemove, setStudentsToRemove] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState({});

  useEffect(() => {
    fetchGroups();
  }, []);

  useEffect(() => {
    if (visible && selectedGroup.key) {
      (async () => {
        const { students } = await enrollmentApi.fetch(selectedGroup.key);
        setStudentList(students.filter(s => s.enrollmentStatus));
      })();
    }
  }, [selectedGroup, visible]);

  useEffect(() => {
    if (visible) {
      const sIds = studentList.map(s => s._id);
      setStudentsToAdd(checkedStudents.filter(c => !sIds.includes(c._id)).map(c => c._id));
    }
  }, [checkedStudents, studentList, visible]);

  const studentLeftList = checkedStudents
    .filter(c => !studentList.find(s => s._id === c._id))
    .map(item => (
      <ScrollElement
        key={`sal-${item._id}`}
        item={item}
        ticked={studentsToAdd.includes(item._id)}
        onClick={sId => {
          setStudentsToAdd(
            studentsToAdd.includes(sId) ? studentsToAdd.filter(id => id !== sId) : [...studentsToAdd, sId]
          );
        }}
      />
    ));

  const studentRightList = studentList.map(item => (
    <ScrollElement
      key={`srl-${item._id}`}
      item={item}
      ticked={!studentsToRemove.includes(item._id)}
      onClick={sId => {
        setStudentsToRemove(
          studentsToRemove.includes(sId) ? studentsToRemove.filter(id => id !== sId) : [...studentsToRemove, sId]
        );
      }}
    />
  ));

  const handleOnSubmit = async () => {
    const group = groupList.find(g => selectedGroup.key === g._id);
    const { code: classCode, districtId, name } = group;
    // add students
    if (studentsToAdd.length) {
      enrollStudentsToGroup({ classCode, districtId, studentIds: studentsToAdd, type: groupType, name });
      setStudentsToAdd([]);
    } else if (checkedStudents.length) {
      notification({ type: "success", msg: `Students enrolled to ${groupTypeText} ${name} successfully` });
    }
    // remove students
    if (studentsToRemove.length) {
      try {
        await enrollmentApi.removeStudents({ classCode, districtId, studentIds: studentsToRemove });
        notification({ type: "success", msg: `Students removed from ${groupTypeText} ${name} successfully` });
      } catch ({ data: { message: errorMessage } }) {
        notification({ msg: errorMessage });
      }
      setStudentsToRemove([]);
    }
    // warning for no action due to lack of - checked students or existing students to remove
    if (!checkedStudents.length && !studentsToRemove.length) {
      notification({ type: "warn", msg: `Select one or more students to add to or remove from ${groupTypeText}` });
    } else {
      // close modal
      onCancel();
    }
  };

  const handleAddNew = () => {
    if (studentsToAdd.length) {
      const parentUrl = getParentUrl(match.url.split("/"));
      history.push({
        pathname: `${parentUrl}/createClass/`,
        state: { type: groupTypeText, studentIds: studentsToAdd, exitPath: match.url }
      });
    } else {
      notification({ type: "warn", msg: `Select one or more students to add to ${groupTypeText}` });
    }
  };

  const filteredGroups = (groupList || []).filter(g => g.type === groupType);

  // input styles
  const tabletWidthNum = tabletWidth.match(/[0-9]+/)[0];
  const selectorWidth = windowWidth > tabletWidthNum ? "326px" : "260px";
  const addNewButtonWidth = windowWidth > tabletWidthNum ? "192px" : "150px";

  return (
    <StyledModal visible={visible} footer={null} onCancel={onCancel} centered>
      {loading ? (
        <Spin size="small" />
      ) : (
        <Row type="flex" align="middle" gutter={[20, 15]}>
          <StyledCol span={24} justify="space-between">
            <StyledDiv fontStyle="22px/30px Open Sans" fontWeight={700} spacing="-1.1px">
              Add / Remove students from groups
            </StyledDiv>
            <IconClose height={20} width={20} onClick={onCancel} />
          </StyledCol>
          <StyledCol span={24} marginBottom="20px" justify="left">
            <StyledDiv fontStyle="14px/19px Open Sans" color={darkGrey2}>
              Select student group to add or remove selected students
            </StyledDiv>
          </StyledCol>
          {/* TODO: Support for Intervention Set */}
          {/* {true && (
              <StyledCol span={24} justify="left">
                <StyledDiv width="120px"> INTERVENTION SET </StyledDiv>
                <SelectInputStyled
                  showSearch
                  placeholder="Select set"
                  cache="false"
                  onChange={() => { }}
                  width={selectorWidth}
                  dropdownStyle={{ zIndex: 2000 }}
                  labelInValue
                >
                  {[].map(({ _id, name }) => (
                    <Select.Option key={_id} value={_id}>
                      {name}
                    </Select.Option>
                  ))}
                </SelectInputStyled>
                <StyledEduButton
                  data-cy="addNewSet"
                  height="40px"
                  width={addNewButtonWidth}
                  onClick={() => {}}
                  style={{ marginLeft: "10px" }}
                  isGhost
                >
                  <IconPlusCircle width={20} height={20} />
                  ADD NEW
                </StyledEduButton>
              </StyledCol>
            )} */}
          <StyledCol span={24} marginBottom="5px" justify="left">
            <StyledDiv width="120px"> STUDENT GROUP </StyledDiv>
            <SelectInputStyled
              data-cy="selectStudentGroup"
              showSearch
              placeholder="Select group"
              cache="false"
              onChange={setSelectedGroup}
              width={selectorWidth}
              dropdownStyle={{ zIndex: 2000 }}
              notFoundContent="No Groups Found"
              labelInValue
            >
              {filteredGroups.map(({ _id, name }) => (
                <Select.Option key={_id} value={_id}>
                  {name}
                </Select.Option>
                ))}
            </SelectInputStyled>

            <StyledEduButton
              data-cy="addNew"
              height="40px"
              width={addNewButtonWidth}
              onClick={handleAddNew}
              style={{ marginLeft: "10px" }}
              isGhost
            >
              <IconPlusCircle width={20} height={20} />
              ADD NEW
            </StyledEduButton>
          </StyledCol>

          <StyledCol span={24} marginBottom="15px" justify="space-between">
            <div>
              <StyledDiv> SELECTED STUDENTS </StyledDiv>
              <ScrollbarContainer data-cy="students-left">
                <PerfectScrollbar>{studentLeftList || <div />}</PerfectScrollbar>
              </ScrollbarContainer>
            </div>
            <Row>
              <IconLeft />
              <IconRight />
            </Row>
            <div>
              <StyledDiv> STUDENTS ALREADY IN GROUP </StyledDiv>
              <ScrollbarContainer data-cy="students-right">
                <PerfectScrollbar>{studentRightList || <div />}</PerfectScrollbar>
              </ScrollbarContainer>
            </div>
          </StyledCol>

          <StyledCol span={24}>
            <EduButton
              data-cy="cancelGroup"
              height="40px"
              width="200px"
              isGhost
              onClick={onCancel}
              style={{ marginLeft: "0px" }}
            >
              Cancel
            </EduButton>
            <EduButton
              data-cy="createGroup"
              height="40px"
              width="200px"
              onClick={handleOnSubmit}
              style={{ marginLeft: "20px" }}
              disabled={!selectedGroup.key}
            >
              Update Group Membership
            </EduButton>
          </StyledCol>
        </Row>
        )}
    </StyledModal>
  );
};

export default compose(
  withRouter,
  withWindowSizes,
  connect(
    state => ({
      groupList: getGroupsSelector(state),
      loading: groupsLoadingSelector(state)
    }),
    {
      fetchGroups: fetchGroupsAction,
      enrollStudentsToGroup: requestEnrolExistingUserToClassAction
    }
  )
)(AddToGroupModal);

const StyledModal = styled(Modal)`
  min-width: 996px;
  padding-bottom: 0px;
  .ant-modal-content {
    width: 996px;

    .ant-modal-close {
      display: none;
    }
    .ant-modal-header {
      display: none;
    }
    .ant-modal-body {
      background-color: #ffffff;
      padding: 24px 46px 32px;
      @media (max-width: ${largeDesktopWidth}) {
        padding: 20px 30px 32px;
      }
    }
    @media (max-width: ${largeDesktopWidth}) {
      width: 707px;
    }
    @media (max-width: ${tabletWidth}) {
      width: 600px;
    }
  }
  @media (max-width: ${largeDesktopWidth}) {
    min-width: 707px;
  }
  @media (max-width: ${tabletWidth}) {
    min-width: 600px;
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
  overflow: hidden;
  text-overflow: ellipsis;
  font: ${props => props.fontStyle || "11px/14px Open Sans"};
  font-weight: ${props => props.fontWeight || 600};
  color: ${props => props.color || greyThemeDark1};
  width: ${props => props.width || "auto"};
  spacing: ${props => props.spacing || "0px"};
`;

const StyledEduButton = styled(EduButton)`
  span {
    margin: 0 45px 0 30px;
    @media (max-width: ${tabletWidth}) {
      margin: 0 20px 0 15px;
    }
  }
  svg {
    .b {
      fill: ${white};
    }
  }
  &:hover,
  &:focus {
    .b {
      fill: ${themeColor};
    }
  }
`;

const ScrollbarContainer = styled.div`
  padding: 20px 0;
  border-radius: 10px;
  margin-top: 15px;
  background-color: ${backgrounds.default};
  .scrollbar-container {
    padding: 0 20px;
    width: 428px;
    height: 40vh;
    .scrollbar-element {
      width: 100%;
      height: 50px;
      cursor: pointer;
      margin-bottom: 5px;
      display: inline-flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 26px;
      border-radius: 5px;
      text-align: center;
      background-color: white;
      border: 1px solid ${borderGrey4};
      .scrollbar-select {
        display: flex;
        flex-direction: column;
        text-align: left;
      }
      &:hover {
        background-color: ${lightBlue2};
        svg {
          fill: ${greyThemeDark1};
        }
      }
      @media (max-width: ${tabletWidth}) {
        padding: 0 20px;
      }
    }
    @media (max-width: ${largeDesktopWidth}) {
      width: 306px;
      height: 270px;
    }
    @media (max-width: ${tabletWidth}) {
      width: 258px;
      height: 215px;
      padding: 0 15px;
    }
  }
  @media (max-width: ${tabletWidth}) {
    padding: 15px 0;
  }
`;

const IconLeft = styled(IconCarets.IconCaretLeft)`
  color: ${themeColor};
  margin: -1px;
  font-size: 12px;
`;

const IconRight = styled(IconCarets.IconCaretRight)`
  color: ${themeColor};
  margin: -2px;
  font-size: 12px;
`;
