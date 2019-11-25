import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { get } from "lodash";
import { List, Button, Row, Col, message, Modal, Input, Icon } from "antd";
import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";
import AdminSubHeader from "../../../src/components/common/AdminSubHeader/SettingSubHeader";
import StandardsProficiencyTable from "../StandardsProficiencyTable/StandardsProficiencyTable";
import { ConfirmationModal as ProfileModal } from "../../../src/components/common/ConfirmationModal";

import styled from "styled-components";

import {
  CreateProfile,
  ModalInput,
  StandardsProficiencyDiv,
  StyledContent,
  StyledLayout,
  SpinContainer,
  StyledSpin,
  ListItemStyled,
  RowStyled,
  StyledProfileRow,
  StyledProfileCol,
  StyledList
} from "./styled";
import {
  createStandardsProficiencyAction,
  updateStandardsProficiencyAction,
  deleteStandardsProficiencyAction,
  receiveStandardsProficiencyAction,
  setEditingIndexAction,
  setStandardsProficiencyProfileNameAction,
  setEDitableAction
} from "../../ducks";
import { getUserOrgId, getUserRole, getUserId } from "../../../src/selectors/user";

const BlueBold = styled.b`
  color: #1774f0;
`;
const title = "Manage District";

const defaultData = {
  calcAttribute: 5,
  calcType: "MOVING_AVERAGE",
  decay: 30,
  noOfAssessments: 5,
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
  const proficiencyTableInstance = useRef();

  const { _id, index, deleteRow, setEditing, active, readOnly, setName, onDuplicate } = props;
  const profileName = get(props, "profile.name", "");
  return (
    <ListItemStyled>
      <ProfileModal
        title="Delete Profile"
        onCancel={() => setConfirmVisible(false)}
        visible={confirmVisible}
        textAlign="left"
        footer={[
          <Button ghost onClick={() => setConfirmVisible(false)}>
            NO, CANCEL
          </Button>,
          <Button
            disabled={deleteText.toUpperCase() != "DELETE"}
            loading={props.loading}
            onClick={() => deleteRow(_id)}
          >
            YES, DELETE
          </Button>
        ]}
      >
        <div className="content">
          <p>
            <BlueBold>{props.profile.name}</BlueBold> will be removed permanently and can’t be used in future tests.
            This action can NOT be undone. If you are sure, please type <BlueBold>DELETE</BlueBold> in the space below.
          </p>
        </div>
        <ModalInput autoFocus value={deleteText} onChange={e => setDeleteText(e.target.value)} />
      </ProfileModal>

      <StyledProfileRow onClick={e => setEditing(index)} type="flex">
        <Col span={12}>
          {active & !readOnly ? (
            <Input
              value={profileName}
              onClick={e => e.stopPropagation()}
              onChange={e => {
                setName({ _id, name: e.target.value });
                if (proficiencyTableInstance.current) {
                  proficiencyTableInstance.current.setChanged(true);
                }
              }}
            />
          ) : (
            profileName
          )}
        </Col>
        <StyledProfileCol span={12}>
          {props.hideEdit ? null : (
            <Icon
              type="edit"
              theme="filled"
              title="edit"
              onClick={e => {
                e.stopPropagation();
                props.setEditable({ index, value: true });
              }}
            />
          )}
          <Icon
            type="copy"
            onClick={e => {
              e.stopPropagation();
              onDuplicate();
            }}
          />
          {props.hideEdit ? null : (
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
                setEditing(index);
              }}
            />
          }
        </StyledProfileCol>
      </StyledProfileRow>

      {active && (
        <RowStyled>
          <Col span={24}>
            <StandardsProficiencyTable
              wrappedComponentRef={proficiencyTableInstance}
              readOnly={readOnly}
              name={get(props, "profile.name", "Untitled")}
              index={index}
              _id={_id}
            />
          </Col>
        </RowStyled>
      )}
    </ListItemStyled>
  );
}

function StandardsProficiency(props) {
  const {
    loading,
    updating,
    creating,
    history,
    list,
    create,
    update,
    remove,
    editingIndex,
    setEditingIndex,
    setName,
    setEditable,
    editable
  } = props;
  const showSpin = loading || updating || creating;
  const menuActive = { mainMenu: "Settings", subMenu: "Standards Proficiency" };

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [profileName, setProfileName] = useState("");

  const handleProfileLimit = () => {
    const canCreateProfile = props.profiles.filter(x => x.createdBy._id === props.userId).length <= 10;
    if (!canCreateProfile) {
      message.error("Maximum 10 profiles per user is allowed");
      return false;
    }
    return true;
  };

  const createStandardProficiency = () => {
    const name = profileName;
    if (name === "") {
      message.error("Name cannot be empty");
    } else if (name) {
      // needed for unicode aware length
      if ([...name].length > 150) {
        message.error("Sorry! Maximum length of Profile Name is 150 characters");
        return;
      }

      if (props.profiles.find(p => (p.name || "").toLowerCase() === name.toLowerCase())) {
        message.error(`Profile with name "${name}" already exists. Please try with a different name`);
        return;
      }
      create({ ...defaultData, name, orgId: props.orgId, orgType: "district" });
      setConfirmVisible(false);
      setProfileName("");
    }
  };

  const duplicateProfile = ({ _id, name }) => {
    if (!handleProfileLimit()) {
      return;
    }
    const { _id: profileId, createdBy, institutionIds, createdAt, updatedAt, __v, ...profile } =
      props.profiles.find(x => x._id === _id) || {};
    console.log("profile", profile);
    let lastVersion = 0;
    if (/#[0-9]*$/.test(name)) {
      lastVersion = parseInt(name.split("#").slice(-1)[0] || 0);
    }
    create({
      noOfAssessments: 5,
      ...profile,
      name: `${name.replace(/#[0-9]*$/, "")}#${lastVersion + 1}`,
      orgId: props.orgId,
      orgType: "district",
      scale: profile.scale.map(({ key, ...x }) => ({ ...x }))
    });
  };

  useEffect(() => {
    list();
  }, []);

  return (
    <StandardsProficiencyDiv>
      <AdminHeader title={title} active={menuActive} history={history} />
      <StyledContent>
        <StyledLayout loading={showSpin ? "true" : "false"}>
          <AdminSubHeader active={menuActive} history={history} />
          {showSpin && (
            <SpinContainer>
              <StyledSpin size="large" />
            </SpinContainer>
          )}

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
                <Button disabled={profileName === ""} loading={loading} onClick={() => createStandardProficiency()}>
                  CREATE
                </Button>
              ]}
            >
              <h4>PLEASE ENTER THE NAME OF THE STANDARD PROFICIENCY</h4>
              <ModalInput value={profileName} onChange={e => setProfileName(e.target.value)} />
            </ProfileModal>
            <CreateProfile type="primary" onClick={() => handleProfileLimit() && setConfirmVisible(true)}>
              <i>+</i> Create new Profile
            </CreateProfile>
          </Row>

          <StyledList
            dataSource={props.profiles}
            bordered
            rowKey="_id"
            renderItem={(profile, index) => (
              <ProfileRow
                readOnly={(props.role === "school-admin" && get(profile, "createdBy._id") != props.userId) || !editable}
                hideEdit={props.role === "school-admin" && get(profile, "createdBy._id") != props.userId}
                setEditable={setEditable}
                onDuplicate={() => duplicateProfile(profile)}
                setName={setName}
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
    editable: state?.standardsProficiencyReducer?.editable,
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
    setEditingIndex: setEditingIndexAction,
    setName: setStandardsProficiencyProfileNameAction,
    setEditable: setEDitableAction
  }
);

export default enhance(StandardsProficiency);

StandardsProficiency.propTypes = {
  loading: PropTypes.bool.isRequired,
  updating: PropTypes.bool.isRequired,
  creating: PropTypes.bool.isRequired,
  profiles: PropTypes.array
};
