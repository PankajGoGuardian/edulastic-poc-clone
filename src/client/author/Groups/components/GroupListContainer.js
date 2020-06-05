import React, { useState } from "react";

// components
import { Button, Icon, Spin, Menu, notification } from "antd";
import { CheckboxLabel, TypeToConfirmModal } from "@edulastic/common";
import { LightGreenSpan } from "@edulastic/common/src/components/TypeToConfirmModal/styled";
import { roleuser } from "@edulastic/constants";

import {
  StyledActionDropDown,
  StyledFilterDiv
} from "../../../admin/Common/StyledComponents";
import {
  LeftFilterDiv,
  MainContainer,
  RightFilterDiv,
  StyledSchoolSearch,
  SubHeaderWrapper,
  TableContainer
} from "../../../common/styled";

import Breadcrumb from "../../src/components/Breadcrumb";
import StudentGroupsTable from "./StudentGroupsTable";

const GroupListContainer = ({
  t,
  match,
  history,
  userRole,
  districtId,
  loading,
  studentGroups,
  showActive,
  setShowActive,
  archiveGroup,
  unarchiveGroup
}) => {
  const [searchName, setSearchName] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [archiveModalProps, setArchiveModalProps] = useState({ visible: false, _id: "", name: "" });

  const resetArchiveModalProps = () => setArchiveModalProps({ visible: false, _id: "", name: "" });

  const handleCreateGroup = () => history.push({
    pathname: `${match.url}/createClass/`,
    state: { type: "group", exitPath: match.url }
  });

  const handleEditGroup = groupId => history.push({
    pathname: `${match.url}/edit/${groupId}`,
    state: { type: "group", exitPath: match.url, showPath: `${match.url}/details/${groupId}` }
  });

  const handleShowGroup = groupId => history.push({
    pathname: `${match.url}/details/${groupId}`,
    state: { type: "group", exitPath: match.url, editPath: `${match.url}/edit/${groupId}` }
  });

  const changeActionMode = e => {
    if (e.key === "archiveGroups") {
      if (selectedRows.length > 0) {
        // TODO: update when Actions dropdown is enabled
        // use deleteClassAction(Classes/ducks) to archive selected groups  
      } else {
        notification({ msg: t("group.validation.archiveGroups") });
      }
    }
  }

  const breadcrumbData = [
    {
      title: userRole === roleuser.SCHOOL_ADMIN ? "MANAGE SCHOOL" : "MANAGE DISTRICT",
      to: userRole === roleuser.SCHOOL_ADMIN ? "/author/classes" : "/author/districtprofile"
    },
    {
      title: "GROUPS",
      to: ""
    }
  ];

  const actionMenu = (
    <Menu onClick={changeActionMode}>
      <Menu.Item key="archiveGroups">{t("group.archiveGroups")}</Menu.Item>
    </Menu>
  )

  const filteredGroups = studentGroups.filter(({ name }) => name.toLowerCase().startsWith(searchName));

  return (
    <MainContainer>
      <SubHeaderWrapper>
        <Breadcrumb data={breadcrumbData} style={{ position: "unset" }} />
      </SubHeaderWrapper>

      <StyledFilterDiv>
        <LeftFilterDiv width={60}>
          <StyledSchoolSearch
            placeholder={t("common.searchbyname")}
            onSearch={setSearchName}
            onChange={e => setSearchName(e.target.value.toLowerCase())}
          />
          <Button style={{ fontSize: "11px" }} type="primary" onClick={handleCreateGroup}>
            {t("group.createGroup")}
          </Button>
        </LeftFilterDiv>
        <RightFilterDiv width={35}>
          <CheckboxLabel
            checked={showActive}
            onChange={e => setShowActive(e.target.checked)}
          >
            {t("group.showActive")}
          </CheckboxLabel>
          {/* <StyledActionDropDown overlay={actionMenu} trigger={["click"]}>
            <Button>
              {t("common.actions")} <Icon type="down" />
            </Button>
          </StyledActionDropDown> */}
        </RightFilterDiv>
      </StyledFilterDiv>

      <TableContainer>
        {loading ? (
          <Spin size="large" />
        ) : (
          <StudentGroupsTable
            t={t}
            data={filteredGroups}
            selectedRows={selectedRows}
            setSelectedRows={setSelectedRows}
            showActive={showActive}
            handleEditGroup={handleEditGroup}
            handleShowGroup={handleShowGroup}
            setArchiveModalProps={setArchiveModalProps}
          />
          )}
      </TableContainer>

      {showActive ? (
        <TypeToConfirmModal
          modalVisible={archiveModalProps.visible}
          title="Archive Group"
          handleOnOkClick={() => archiveGroup({
            _id: archiveModalProps._id,
            districtId,
            exitPath: match.url,
            isGroup: true
          })}
          wordToBeTyped="ARCHIVE"
          primaryLabel="Are you sure you want to archive the following group?"
          secondaryLabel={
            <p style={{ margin: "5px 0" }}>
              <LightGreenSpan>{archiveModalProps.name}</LightGreenSpan>
            </p>
          }
          closeModal={resetArchiveModalProps}
          okButtonText="Archive"
        />
      ) : (
        <TypeToConfirmModal
          modalVisible={archiveModalProps.visible}
          title="Unarchive Group"
          handleOnOkClick={() => unarchiveGroup({
              groupId: archiveModalProps._id,
              exitPath: match.url,
              isGroup: true
            })}
          wordToBeTyped="UNARCHIVE"
          primaryLabel="Are you sure you want to unarchive the following group?"
          secondaryLabel={
            <p style={{ margin: "5px 0" }}>
              <LightGreenSpan>{archiveModalProps.name}</LightGreenSpan>
            </p>
            }
          closeModal={resetArchiveModalProps}
          okButtonText="Unarchive"
        />
        )}
    </MainContainer>
  );
};
export default GroupListContainer;
