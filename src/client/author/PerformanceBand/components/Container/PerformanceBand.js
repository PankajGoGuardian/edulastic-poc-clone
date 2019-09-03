import { Button, Col, Icon, message, Row } from "antd";
import { get } from "lodash";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";
import AdminSubHeader from "../../../src/components/common/AdminSubHeader/SettingSubHeader";
import { getUserId, getUserOrgId, getUserRole } from "../../../src/selectors/user";
import { ConfirmationModal as ProfileModal } from "../../../src/components/common/ConfirmationModal";
import {
  createPerformanceBandAction,
  deletePerformanceBandAction,
  receivePerformanceBandAction,
  setPerformanceBandLocalAction,
  updatePerformanceBandAction
} from "../../ducks";
import { PerformanceBandTable as PerformanceBandTableDumb } from "../PerformanceBandTable/PerformanceBandTable";
import {
  CreateProfile,
  ModalInput,
  PerformanceBandDiv,
  SpinContainer,
  StyledContent,
  StyledLayout,
  StyledSpin,
  ListItemStyled,
  RowStyled,
  StyledProfileRow,
  StyledProfileCol,
  StyledList
} from "./styled";

const title = "Manage District";

function ProfileRow({
  name,
  performanceBand,
  _id,
  setEditingIndex,
  active,
  updatePerformanceBand,
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
      <ProfileModal
        title="Delete Profile"
        visible={confirmVisible}
        onCancel={() => setConfirmVisible(false)}
        textAlign="left"
        footer={[
          <Button ghost onClick={() => setConfirmVisible(false)}>
            NO, CANCEL
          </Button>,
          <Button disabled={deleteText.toUpperCase() != "DELETE"} loading={loading} onClick={() => remove(_id)}>
            YES, DELETE
          </Button>
        ]}
      >
        <div className="content">
          <p>
            <b>{name}</b> will be removed permanently and can’t be used in future tests. This action can NOT be undone.
            If you are sure, please type DELETE in the space below.
          </p>
        </div>
        <ModalInput value={deleteText} onChange={e => setDeleteText(e.target.value)} />
      </ProfileModal>
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
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [profileName, setProfileName] = useState("");

  const addProfile = () => {
    const name = profileName;

    if (name) {
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
      setConfirmVisible(false);
    } else {
      message.error("name can't be empty");
    }
  };

  return (
    <PerformanceBandDiv>
      <AdminHeader title={title} active={menuActive} history={history} />
      <StyledContent>
        <StyledLayout>
          <AdminSubHeader active={menuActive} history={history} />
          {showSpin ? (
            <SpinContainer>
              <StyledSpin size="large" />
            </SpinContainer>
          ) : null}
          <Row type="flex" justify="end">
            <ProfileModal
              title="Create New Profile"
              visible={confirmVisible}
              onCancel={() => setConfirmVisible(false)}
              bodyHeight="100px"
              textAlign="left"
              footer={[
                <Button ghost onClick={() => setConfirmVisible(false)}>
                  CANCEL
                </Button>,
                <Button disabled={profileName === ""} loading={loading} onClick={addProfile}>
                  CREATE
                </Button>
              ]}
            >
              <h4>NAME OF THE PROFILE</h4>
              <ModalInput value={profileName} onChange={e => setProfileName(e.target.value)} />
            </ProfileModal>
            <CreateProfile type="primary" onClick={() => setConfirmVisible(true)}>
              <i>+</i> Create new Profile
            </CreateProfile>
          </Row>
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
