import React, { Component, useReducer, useState, useEffect } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";
import { createReducer } from "redux-starter-kit";
import uuid from "uuid/v1";
import { List, Row, Col, Button, message, Modal, Input, Icon } from "antd";
import styled from "styled-components";

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

import { white, lightGreySecondary, themeColor } from "@edulastic/colors";

const title = "Manage District";
const ListItemStyled = styled(List.Item)`
  display: block;
  background-color: #fff;
  border: 0;
  padding: 0;
`;

const RowStyled = styled(Row)`
  background: ${white};
`;
const StyledProfileRow = styled(Row)`
  padding-left: 30px;
  background-color: ${lightGreySecondary};
  height: 47px;
  line-height: 47px;
  box-sizing: border-box;
  border: 1px solid #e1e1e1;
  margin-bottom: 7px;
  h3 {
    font-weight: 500;
    font-size: 15px;
  }
`;

const StyledProfileCol = styled(Col)`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-flow: row nowrap;
  justify-content: flex-end;
  align-content: center;
  & > i.anticon {
    color: ${themeColor};
    height: 13px;
    width: 13px;
    padding-right: 32px;
  }
`;

const StyledList = styled(List)`
  .ant-list-item {
    border: 0;
  }
`;

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
  readOnly,
  loading
}) {
  const setPerf = payload => {
    updatePerformanceBand({ _id, data: payload });
  };
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleteText, setDeleteText] = useState("");

  return (
    <ListItemStyled>
      <Modal
        title="Delete Profile"
        visible={confirmVisible}
        closable={false}
        footer={[
          <Button disabled={deleteText.toUpperCase() != "DELETE"} loading={loading} onClick={() => remove(_id)}>
            Yes, Delete
          </Button>,
          <Button
            onClick={() => {
              setConfirmVisible(false);
              setDeleteText("");
            }}
          >
            No, Cancel
          </Button>
        ]}
      >
        <div className="content">
          <p>
            <b>{name}</b> will be removed permanently and can’t be used in future tests. This action can NOT be undone.
            If you are sure, please type DELETE in the space below.
          </p>
        </div>
        <Input value={deleteText} onChange={e => setDeleteText(e.target.value)} />
      </Modal>
      <StyledProfileRow type="flex">
        <Col span={12}>
          <h3>{name}</h3>
        </Col>
        <StyledProfileCol span={12}>
          {readOnly ? null : (
            <Icon type="edit" theme="filled" onClick={() => setEditingIndex(x => (x != _id ? _id : undefined))} />
          )}
          <Icon type="copy" onClick={() => {}} />
          {readOnly ? null : <Icon type="delete" theme="filled" onClick={() => setConfirmVisible(true)} />}
          {
            <Icon
              type={active ? "up" : "down"}
              theme="outlined"
              onClick={() => setEditingIndex(x => (x != _id ? _id : undefined))}
            />
          }
        </StyledProfileCol>
      </StyledProfileRow>

      {active ? (
        <RowStyled>
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
        </RowStyled>
      ) : null}
    </ListItemStyled>
  );
}

export function PerformanceBandAlt(props) {
  const menuActive = { mainMenu: "Settings", subMenu: "Performance Bands" };

  const { loading, updating, creating, history, list, create, update, remove, profiles, currentUserId } = props;
  const showSpin = loading || updating || creating;
  useEffect(() => {
    list();
  }, []);
  const [editingIndex, setEditingIndex] = useState();

  const addProfile = () => {
    const name = prompt("name of the profile?");

    if (name) {
      // needed for unicode aware length
      if (!([...name].length <= 150)) {
        message.error("Sorry! Maximum length of Profile Name is 150 characters");
        return;
      }
      if (profiles.find(p => (p.name || "").toLowerCase() === name.toLocaleLowerCase())) {
        message.error(`Profile with name "${name}" already exists. Please try with a different name`);
        return;
      }
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
          {showSpin ? (
            <SpinContainer>
              <StyledSpin size="large" />
            </SpinContainer>
          ) : null}
          <Button type="primary" style={{ marginBottom: "5px" }} onClick={addProfile}>
            + Create new Profile
          </Button>
          <StyledList
            dataSource={profiles}
            rowKey="_id"
            renderItem={profile => (
              <ProfileRow
                {...profile}
                remove={remove}
                loading={loading}
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
