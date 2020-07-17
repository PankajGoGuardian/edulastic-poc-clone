import { EduButton, notification } from "@edulastic/common";
import { IconPlusCircle } from "@edulastic/icons";
import { Button, Col, Icon, Input, Row } from "antd";
import { get, upperFirst } from "lodash";
import React, { useEffect, useRef, useState } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import styled from "styled-components";
import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";
import AdminSubHeader from "../../../src/components/common/AdminSubHeader/SettingSubHeader";
import { ConfirmationModal as ProfileModal } from "../../../src/components/common/ConfirmationModal";
import { getUserId, getUserOrgId, getUserRole } from "../../../src/selectors/user";
import {
  createPerformanceBandAction,
  deletePerformanceBandAction,
  receivePerformanceBandAction,
  setConflitAction,
  setEditableAction,
  setEditingIndexAction,
  setPerformanceBandLocalAction,
  setPerformanceBandNameAction,
  updatePerformanceBandAction
} from "../../ducks";
import { PerformanceBandTable as PerformanceBandTableDumb } from "../PerformanceBandTable/PerformanceBandTable";
import {
  ListItemStyled,
  ModalInput,
  PerformanceBandDiv,
  RowStyled,
  SpinContainer,
  StyledContent,
  StyledLayout,
  StyledList,
  StyledProfileCol,
  StyledProfileRow,
  StyledSpin
} from "./styled";

const title = "Manage District";
const BlueBold = styled.b`
  color: #1774f0;
`;

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
  loading,
  setName,
  onDuplicate,
  setEditable,
  hideEdit,
  conflict,
  setDeleteProfileName
}) {
  const setPerf = payload => {
    updatePerformanceBand({ _id, data: payload });
  };
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const performanceBandInstance = useRef();

  useEffect(() => {
    if (conflict) setConfirmVisible(false);
  }, [conflict]);

  return (
    <ListItemStyled>
      <ProfileModal
        title="Delete Profile"
        visible={confirmVisible}
        onCancel={() => setConfirmVisible(false)}
        textAlign="left"
        footer={[
          <EduButton
            isGhost
            onClick={() => {
              setConfirmVisible(false);
              setDeleteText("");
            }}
          >
            NO, CANCEL
          </EduButton>,
          <EduButton
            disabled={deleteText.toUpperCase() != "DELETE"}
            loading={loading}
            onClick={() => {
              remove(_id);
              setDeleteProfileName(name);
            }}
          >
            YES, DELETE
          </EduButton>
        ]}
      >
        <div className="content">
          <p>
            <BlueBold>{name}</BlueBold> will be removed permanently and can’t be used in future tests. This action can
            NOT be undone. If you are sure, please type <BlueBold>DELETE</BlueBold> in the space below.
          </p>
        </div>
        <ModalInput value={deleteText} onChange={e => setDeleteText(e.target.value)} />
      </ProfileModal>
      <StyledProfileRow onClick={() => setEditingIndex(_id)} type="flex">
        <Col span={12}>
          {active && !readOnly ? (
            <Input
              type="text"
              value={name}
              onClick={e => e.stopPropagation()}
              onChange={e => {
                setName({ name: e.target.value, _id });
                if (performanceBandInstance.current) {
                  performanceBandInstance.current.setChanged(true);
                }
              }}
            />
          ) : (
            <h3>{name}</h3>
            )}
        </Col>
        <StyledProfileCol span={12}>
          {hideEdit ? null : (
            <Icon
              type="edit"
              title="edit"
              theme="filled"
              onClick={e => {
                e.stopPropagation();
                setEditable({ value: true, index: _id });
              }}
            />
          )}
          <Icon type="copy" onClick={onDuplicate} />
          {hideEdit ? null : (
            <Icon
              type="delete"
              theme="filled"
              onClick={e => {
                e.stopPropagation();
                setConfirmVisible(true);
              }}
            />
          )}
          {
            <Icon
              type={active ? "up" : "down"}
              theme="outlined"
              onClick={e => {
                e.stopPropagation();
                setEditingIndex(_id);
              }}
            />
          }
        </StyledProfileCol>
      </StyledProfileRow>

      {active ? (
        <RowStyled>
          <Col span={24}>
            <PerformanceBandTableDumb
              ref={performanceBandInstance}
              performanceBandId={_id}
              dataSource={performanceBand}
              createPerformanceband={() => { }}
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

  const {
    loading,
    updating,
    creating,
    history,
    list,
    create,
    update,
    remove,
    profiles,
    currentUserId,
    setName,
    editingIndex,
    setEditingIndex,
    editable,
    setEditable,
    conflict,
    error
  } = props;

  const showSpin = loading || updating || creating;
  useEffect(() => {
    list();
  }, []);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [conflictModalVisible, setConflictModalVisible] = useState(false);
  const [deleteProfileName, setDeleteProfileName] = useState("");

  useEffect(() => {
    setConflictModalVisible(conflict);
  }, [conflict]);

  const handleProfileLimit = () => {
    const canCreateProfile = profiles.filter(x => x.createdBy?._id === currentUserId).length <= 10;
    if (!canCreateProfile) {
      notification({ messageKey: "maximumTenProfilesPerUser" });
      return false;
    }
    return true;
  };

  const addProfile = () => {
    const name = profileName;

    if (name) {
      // needed for unicode aware length
      if ([...name].length > 150) {
        notification({ messageKey: "maximumLengthForProifleName150" });
        return;
      }
      if (profiles.find(p => (p.name || "").toLowerCase() === name.toLocaleLowerCase())) {
        notification({ msg: `Profile with name "${name}" already exists. Please try with a different name` });
        return;
      }
      const initialObj = {
        name,
        orgId: props.orgId,
        orgType: "district",
        performanceBand: [
          {
            color: "#3DB04E",
            name: "Proficient",
            aboveOrAtStandard: true,
            from: 100,
            to: 70
          },
          {
            color: "#576BA9",
            name: "Basic",
            aboveOrAtStandard: true,
            from: 70,
            to: 50
          },
          {
            color: "#F39300",
            name: "Below Basic",
            aboveOrAtStandard: false,
            from: 50,
            to: 0
          }
        ]
      };
      create(initialObj);
      setConfirmVisible(false);
      setProfileName("");
    } else {
      notification({ messageKey: "NameCantBeEmpty" });
    }
  };

  const duplicateProfile = ({ _id, name }) => {
    if (!handleProfileLimit()) {
      return;
    }
    const { _id: profileId, createdBy, institutionIds, createdAt, updatedAt, __v, v1OrgId, ...profile } =
      profiles.find(x => x._id === _id) || {};

    let lastVersion = 0;
    if (/#[0-9]*$/.test(name)) {
      lastVersion = parseInt(name.split("#").slice(-1)[0] || 0);
    }
    create({
      ...profile,
      performanceBand: profile.performanceBand.map(({ key, v1Id, ...x }) => ({ ...x })),
      name: `${name.replace(/#[0-9]*$/, "")}#${lastVersion + 1}`
    });
  };

  return (
    <PerformanceBandDiv>
      <ProfileModal
        title="Delete Profile"
        visible={conflictModalVisible}
        onCancel={() => {
          setConflictModalVisible(false);
          props.setConflitAction(false);
        }}
        footer={[
          <EduButton
            isGhost
            onClick={() => {
              props.setConflitAction(false);
              setConflictModalVisible(false);
            }}
          >
            OK
          </EduButton>
        ]}
      >
        <div className="content">
          <p>
            <BlueBold>{deleteProfileName}</BlueBold> is set as the default value for{" "}
            <BlueBold>{upperFirst(error?.type)} Tests</BlueBold>. Please change the Test Setting before deleting.
          </p>
        </div>
      </ProfileModal>

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
              destroyOnClose
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
              <ModalInput autoFocus value={profileName} onChange={e => setProfileName(e.target.value)} />
            </ProfileModal>
            <EduButton type="primary" onClick={() => handleProfileLimit() && setConfirmVisible(true)}>
              <IconPlusCircle width={19} height={19} /> Create new Profile
            </EduButton>
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
                onDuplicate={() => duplicateProfile(profile)}
                setEditable={setEditable}
                hideEdit={props.role != "district-admin" && currentUserId != get(profile, "createdBy._id")}
                readOnly={
                  (props.role != "district-admin" && currentUserId != get(profile, "createdBy._id")) || !editable
                }
                setEditingIndex={setEditingIndex}
                active={editingIndex === profile._id}
                updatePerformanceBand={props.updateLocal}
                setName={setName}
                conflict={conflict}
                setDeleteProfileName={setDeleteProfileName}
                savePerformance={({ _id: id, performanceBand }) => {
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
      editingIndex: get(state, ["performanceBandReducer", "editingIndex"]),
      conflict: get(state, ["performanceBandReducer", "conflict"], false),
      error: get(state, ["performanceBandReducer", "error"], {}),
      editable: state?.performanceBandReducer?.editable,
      orgId: getUserOrgId(state),
      role: getUserRole(state),
      currentUserId: getUserId(state)
    }),
    {
      list: receivePerformanceBandAction,
      create: createPerformanceBandAction,
      update: updatePerformanceBandAction,
      remove: deletePerformanceBandAction,
      updateLocal: setPerformanceBandLocalAction,
      setName: setPerformanceBandNameAction,
      setEditingIndex: setEditingIndexAction,
      setEditable: setEditableAction,
      setConflitAction
    }
  )
);

// export default enhance(PerformanceBand);
export default enhance(PerformanceBandAlt);
