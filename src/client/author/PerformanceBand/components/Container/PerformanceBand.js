import React, { Component, useReducer, useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";
import { createReducer } from "redux-starter-kit";
import uuid from "uuid/v1";
import { List, Row, Col, Button } from "antd";

import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";
import PerformanceBandTable, {
  PerformanceBandTable as PerformanceBandTableDumb
} from "../PerformanceBandTable/PerformanceBandTable";

import { StyledContent, StyledLayout, SpinContainer, StyledSpin, PerformanceBandDiv } from "./styled";

const title = "Manage District";
const menuActive = { mainMenu: "Settings", subMenu: "Performance Bands" };

class PerformanceBand extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { loading, updating, creating, history } = this.props;
    const showSpin = loading || updating || creating;

    return (
      <PerformanceBandDiv>
        <AdminHeader title={title} active={menuActive} history={history} />
        <StyledContent>
          <StyledLayout loading={showSpin ? "true" : "false"}>
            {showSpin && (
              <SpinContainer>
                <StyledSpin size="large" />
              </SpinContainer>
            )}
            <PerformanceBandTable />
          </StyledLayout>
        </StyledContent>
      </PerformanceBandDiv>
    );
  }
}

const initialState = localStorage.performanceBands
  ? JSON.parse(localStorage.performanceBands)
  : [
      {
        name: "test 1",
        id: uuid(),
        performanceBand: [
          {
            color: "#ffffff",
            name: "Proficient",
            aboveOrAtStandard: true,
            from: 100,
            to: 0,
            key: 0
          }
        ]
      }
    ];

function ProfileRow({
  name,
  performanceBand,
  id,
  index,
  setEditingIndex,
  active,
  updatePerformanceBand,
  savePerformance
}) {
  const createPerformanceBand = () => {
    console.log("creating performanceBands", arguments);
  };

  const setPerf = payload => {
    updatePerformanceBand({ id, data: payload });
  };

  const setPerformanceBandData = () => {
    console.log("setting PerformanceBandData", arguments);
  };
  const updatePerf = () => {
    console.log("updating PerformanceBandData", arguments);
  };

  return (
    <List.Item style={{ display: "block" }}>
      <Row>
        <Col span={12}>
          <h3>{name}</h3>
        </Col>
        <Col span={12}>
          <Button onClick={() => setEditingIndex(id)}>edit</Button> <Button>delete</Button>
        </Col>
      </Row>

      {active ? (
        <Row>
          <Col span={23}>
            <PerformanceBandTableDumb
              performanceBandId={id}
              dataSource={performanceBand}
              createPerformanceband={createPerformanceBand}
              updatePerformanceBand={() => {}}
              setPerformanceBandData={setPerf}
            />
          </Col>
        </Row>
      ) : null}
    </List.Item>
  );
}

export function PerformanceBandAlt() {
  const [editingIndex, setEditingIndex] = useState();
  const [state, dispatch] = useReducer(
    createReducer(initialState, {
      addProfile: (state, { payload: name }) => {
        state.push({
          name,
          id: uuid(),
          performanceBand: [
            {
              color: "#ffffff",
              name: "Proficient",
              aboveOrAtStandard: true,
              from: 100,
              to: 0,
              key: 0
            }
          ]
        });
      },
      updatePerformanceBand: (state, { payload }) => {
        const { id, data } = payload;
        console.log("up reducer", { id, data }, payload);
        const ind = state.findIndex(x => x.id === id);
        console.log("up reducer", { ind });
        state[ind].performanceBand = data;
      }
    }),
    initialState
  );

  const saveAll = () => {
    localStorage.performanceBands = JSON.stringify(state);
  };

  const addProfile = () => {
    const name = prompt("name of the profile?");
    if (name) {
      dispatch({ type: "addProfile", payload: name });
    } else {
      alert("name can't be empty");
    }
  };

  return (
    <PerformanceBandDiv>
      <AdminHeader title={title} active={menuActive} history={history} />
      <StyledContent>
        <StyledLayout>
          <Button.Group>
            <Button type="primary" size="large" onClick={addProfile}>
              + Add Profile
            </Button>
            <Button type="default" size="large" onClick={saveAll}>
              Save All
            </Button>
          </Button.Group>
          <List
            dataSource={state}
            bordered
            rowKey="id"
            renderItem={profile => (
              <ProfileRow
                {...profile}
                setEditingIndex={setEditingIndex}
                active={editingIndex === profile.id}
                updatePerformanceBand={payload => dispatch({ type: "updatePerformanceBand", payload })}
                savePerformance={({ _id: id, performanceBand, ...rest }) => {
                  dispatch({ type: "updatePerformanceBand", payload: { id, data: performanceBand } });
                  console.log("rest", rest);
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
  connect(state => ({
    loading: get(state, ["performanceBandReducer", "loading"], false),
    updating: get(state, ["performanceBandReducer", "updating"], false),
    creating: get(state, ["performanceBandReducer", "creating"], false)
  }))
);

//export default enhance(PerformanceBand);
export default PerformanceBandAlt;
