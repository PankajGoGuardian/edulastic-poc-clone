import React, { Component, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";
import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";
import StandardsProficiencyTable from "../StandardsProficiencyTable/StandardsProficiencyTable";
import { List, Typography, Icon, Button, Row, Col } from "antd";

import { StandardsProficiencyDiv, StyledContent, StyledLayout, SpinContainer, StyledSpin } from "./styled";
import {
  createStandardsProficiencyAction,
  updateStandardsProficiencyAction,
  deleteStandardsProficiencyAction,
  receiveStandardsProficiencyAction,
  setEditingIndexAction
} from "../../ducks";
import { getUserOrgId } from "../../../src/selectors/user";

const title = "Manage District";
const menuActive = { mainMenu: "Settings", subMenu: "Standards Proficiency" };

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
  const { _id, index, deleteRow, setEditing, active } = props;
  return (
    <List.Item style={{ display: "block" }}>
      <Row>
        <Col span={12}>{get(props, "profile.name", "Untitled")}</Col>
        <Col span={12}>
          <Button.Group>
            <Button onClick={() => setEditing(index)}>{active ? "Close" : "Edit"}</Button>
            <Button onClick={() => deleteRow(_id)}>delete</Button>
          </Button.Group>
        </Col>
      </Row>
      {active && (
        <Row>
          <Col>
            <StandardsProficiencyTable name={get(props, "profile.name", "Untitled")} index={index} _id={_id} />
          </Col>
        </Row>
      )}
    </List.Item>
  );
}

function StandardsProficiency(props) {
  const { loading, updating, creating, history, list, create, update, remove, editingIndex, setEditingIndex } = props;
  const showSpin = loading || updating || creating;

  const createStandardProficiency = () => {
    const name = window.prompt("Please enter the name of the standard proficiency");
    if (name === "") {
      alert("Name cannot be empty");
    } else if (name) {
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
                setEditing={setEditingIndex}
                index={index}
                profile={profile}
                _id={profile._id}
                active={index === editingIndex}
                deleteRow={remove}
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
