import React, { Component, useReducer, useState, useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";
import { createReducer } from "redux-starter-kit";
import uuid from "uuid/v1";
import { List, Row, Col, Button, message } from "antd";

import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";
import PerformanceBandTable, {
  PerformanceBandTable as PerformanceBandTableDumb
} from "../PerformanceBandTable/PerformanceBandTable";
import { getUserOrgId, getUserRole, getUserId } from "../../../src/selectors/user";
import {
  createPerformanceBandAction,
  updatePerformanceBandAction,
  deletePerformanceBandAction,
  receivePerformanceBandAction,
  setPerformanceBandLocalAction
} from "../../ducks";
import ColorPicker from "./ColorPicker";

import { StyledContent, StyledLayout, SpinContainer, StyledSpin, PerformanceBandDiv } from "./styled";

const title = "Manage District";

function ProfileRow({
  name,
  performanceBand,
  _id,
  index,
  setEditingIndex,
  active,
  updatePerformanceBand,
  savePerformance,
  remove,
  update: updateToServer,
  readOnly
}) {
  const setPerf = payload => {
    updatePerformanceBand({ _id, data: payload });
  };

  return (
    <List.Item style={{ display: "block" }}>
      <Row>
        <Col span={12}>
          <h3>{name}</h3>
        </Col>
        <Col span={12}>
          <Button onClick={() => setEditingIndex(x => (x != _id ? _id : undefined))}>
            {readOnly ? "view" : "edit"}
          </Button>

          {readOnly ? null : <Button onClick={() => remove(_id)}>delete</Button>}
        </Col>
      </Row>

      {active ? (
        <Row>
          <Col span={24}>
            <PerformanceBandTableDumb
              performanceBandId={_id}
              dataSource={performanceBand}
              createPerformanceband={() => {}}
              updatePerformanceBand={() => {
                updateToServer(_id);
              }}
              readOnly={readOnly}
              setPerformanceBandData={setPerf}
            />
          </Col>
        </Row>
      ) : null}
    </List.Item>
  );
}

export function PerformanceBandAlt(props) {
  const menuActive =
    props.role === "school-admin"
      ? { mainMenu: "Performance Bands" }
      : { mainMenu: "Settings", subMenu: "Performance Bands" };

  const { loading, updating, creating, history, list, create, update, remove, profiles, currentUserId } = props;
  const showSpin = loading || updating || creating;
  useEffect(() => {
    list();
  }, []);
  const [editingIndex, setEditingIndex] = useState();

  const addProfile = () => {
    const name = prompt("name of the profile?");

    if (name) {
      const initialObj = {
        name,
        orgId: props.orgId,
        orgType: "district",
        performanceBand: [
          {
            color: "#ffffff",
            name: "Proficient",
            aboveOrAtStandard: true,
            from: 100,
            to: 0
          }
        ]
      };
      create(initialObj);
    } else {
      message.error("name can't be empty");
    }
  };

  return (
    <PerformanceBandDiv>
      <AdminHeader title={title} active={menuActive} history={history} />
      <StyledContent>
        <StyledLayout>
          <Button type="primary" style={{ marginBottom: "5px" }} onClick={addProfile}>
            + Create new Profile
          </Button>
          <List
            dataSource={profiles}
            bordered
            rowKey="_id"
            renderItem={profile => (
              <ProfileRow
                {...profile}
                remove={remove}
                update={update}
                readOnly={props.role != "district-admin" && currentUserId != get(profile, "createdBy._id")}
                setEditingIndex={setEditingIndex}
                active={editingIndex === profile._id}
                updatePerformanceBand={props.updateLocal}
                savePerformance={({ _id: id, performanceBand, ...rest }) => {
                  props.updateLocal({ id, data: performanceBand });
                }}
              />
            )}
          />
        </StyledLayout>
      </StyledContent>
    </PerformanceBandDiv>
  );
}

const enhance = compose(
  connect(
    state => ({
      loading: get(state, ["performanceBandReducer", "loading"], false),
      updating: get(state, ["performanceBandReducer", "updating"], false),
      creating: get(state, ["performanceBandReducer", "creating"], false),
      profiles: get(state, ["performanceBandReducer", "profiles"], []),
      orgId: getUserOrgId(state),
      role: getUserRole(state),
      currentUserId: getUserId(state)
    }),
    {
      list: receivePerformanceBandAction,
      create: createPerformanceBandAction,
      update: updatePerformanceBandAction,
      remove: deletePerformanceBandAction,
      updateLocal: setPerformanceBandLocalAction
    }
  )
);

//export default enhance(PerformanceBand);
export default enhance(PerformanceBandAlt);
