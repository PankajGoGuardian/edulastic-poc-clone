import React, { Component, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";
import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";
import StandardsProficiencyTable from "../StandardsProficiencyTable/StandardsProficiencyTable";
import { List, Typography, Icon, Button, Row, Col, message, Modal, Input } from "antd";

import { StandardsProficiencyDiv, StyledContent, StyledLayout, SpinContainer, StyledSpin } from "./styled";
import {
  createStandardsProficiencyAction,
  updateStandardsProficiencyAction,
  deleteStandardsProficiencyAction,
  receiveStandardsProficiencyAction,
  setEditingIndexAction
} from "../../ducks";
import { getUserOrgId, getUserRole, getUserId } from "../../../src/selectors/user";

const title = "Manage District";

const defaultData = {
  calcAttribute: 5,
  calcType: "MOVING_AVERAGE",
  decay: 30,
  noOfAssessment: 5,
  scale: [
    {
      score: 4,
      shortName: "E",
      threshold: 90,
      masteryLevel: "Exceeds Mastery",
      color: "#C8EB9B"
    },
    {
      score: 3,
      shortName: "M",
      threshold: 80,
      masteryLevel: "Mastered",
      color: "#F3FCCF"
    },
    {
      score: 2,
      shortName: "A",
      threshold: 70,
      masteryLevel: "Almost Mastered",
      color: "#FDFDC8"
    },
    {
      score: 1,
      shortName: "N",
      threshold: 0,
      masteryLevel: "Not Mastered",
      color: "#FDE2B3"
    }
  ]
};

function ProfileRow(props) {
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleteText, setDeleteText] = useState("");

  const { _id, index, deleteRow, setEditing, active, readOnly } = props;
  return (
    <List.Item style={{ display: "block" }}>
      <Modal
        title="Delete Profile"
        onCancel={() => setConfirmVisible(false)}
        visible={confirmVisible}
        footer={[
          <Button disabled={deleteText != "DELETE"} loading={props.loading} onClick={() => deleteRow(_id)}>
            Yes, Delete
          </Button>,
          <Button onClick={() => setConfirmVisible(false)}>No, Cancel</Button>
        ]}
      >
        <div className="content">
          <p>
            <b>{props.profile.name}</b> will be removed permanently and can’t be used in future tests. This action can
            NOT be undone. If you are sure, please type DELETE in the space below.
          </p>
        </div>
        <Input value={deleteText} onChange={e => setDeleteText(e.target.value)} />
      </Modal>

      <Row>
        <Col span={12}>{get(props, "profile.name", "Untitled")}</Col>
        <Col span={12}>
          <Button.Group>
            <Button onClick={() => setEditing(index)}>{active ? "Close" : readOnly ? "View" : "Edit"}</Button>
            {readOnly ? null : <Button onClick={() => setConfirmVisible(true)}>delete</Button>}
          </Button.Group>
        </Col>
      </Row>
      {active && (
        <Row>
          <Col>
            <StandardsProficiencyTable
              readOnly={readOnly}
              name={get(props, "profile.name", "Untitled")}
              index={index}
              _id={_id}
            />
          </Col>
        </Row>
      )}
    </List.Item>
  );
}

function StandardsProficiency(props) {
  const { loading, updating, creating, history, list, create, update, remove, editingIndex, setEditingIndex } = props;
  const showSpin = loading || updating || creating;
  const menuActive =
    props.role === "school-admin"
      ? { mainMenu: "Standards Proficiency" }
      : { mainMenu: "Settings", subMenu: "Standards Proficiency" };

  const createStandardProficiency = () => {
    const name = window.prompt("Please enter the name of the standard proficiency");
    if (name === "") {
      message.error("Name cannot be empty");
    } else if (name) {
      if (props.profiles.find(p => p.name === name)) {
        message.error(`Profile with name "${name}" already exists. Please try with a different name`);
        return;
      }
      create({ ...defaultData, name, orgId: props.orgId, orgType: "district" });
    }
  };

  useEffect(() => {
    list();
  }, []);

  return (
    <StandardsProficiencyDiv>
      <AdminHeader title={title} active={menuActive} history={history} />
      <StyledContent>
        <StyledLayout loading={showSpin ? "true" : "false"}>
          {showSpin && (
            <SpinContainer>
              <StyledSpin size="large" />
            </SpinContainer>
          )}
          <List
            dataSource={props.profiles}
            bordered
            rowKey="_id"
            header={
              <Button type="primary" onClick={() => createStandardProficiency()} style={{ marginBottom: 5 }}>
                + Create New Profile
              </Button>
            }
            renderItem={(profile, index) => (
              <ProfileRow
                readOnly={props.role === "school-admin" && get(profile, "createdBy._id") != props.userId}
                setEditing={setEditingIndex}
                index={index}
                profile={profile}
                _id={profile._id}
                active={index === editingIndex}
                deleteRow={remove}
                loading={showSpin}
              />
            )}
          />
        </StyledLayout>
      </StyledContent>
    </StandardsProficiencyDiv>
  );
}

const enhance = connect(
  state => ({
    loading: get(state, ["standardsProficiencyReducer", "loading"], false),
    updating: get(state, ["standardsProficiencyReducer", "updating"], false),
    creating: get(state, ["standardsProficiencyReducer", "creating"], false),
    profiles: get(state, ["standardsProficiencyReducer", "data"], []),
    orgId: getUserOrgId(state),
    role: getUserRole(state),
    userId: getUserId(state),
    editingIndex: get(state, "standardsProficiencyReducer.editingIndex")
  }),
  {
    create: createStandardsProficiencyAction,
    update: updateStandardsProficiencyAction,
    list: receiveStandardsProficiencyAction,
    remove: deleteStandardsProficiencyAction,
    setEditingIndex: setEditingIndexAction
  }
);

export default enhance(StandardsProficiency);

StandardsProficiency.propTypes = {
  loading: PropTypes.bool.isRequired,
  updating: PropTypes.bool.isRequired,
  creating: PropTypes.bool.isRequired,
  profiles: PropTypes.array
};
