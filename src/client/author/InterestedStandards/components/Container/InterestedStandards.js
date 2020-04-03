import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";
import { roleuser } from "@edulastic/constants";

import { Row, Col, Button, Icon, Checkbox } from "antd";
import {
  StyledContent,
  StyledLayout,
  SpinContainer,
  StyledSpin,
  StyledSaveButton,
  StyledSubjectTitle,
  StyledSubjectLine,
  StyledSubjectCloseButton,
  StyledSubjectContent,
  StyledCheckbox,
  InterestedStandardsDiv,
  DropdownWrapper
} from "./styled";

import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";
import AdminSubHeader from "../../../src/components/common/AdminSubHeader/SettingSubHeader";
import StandardSetModal from "../StandardSetsModal/StandardSetsModal";
// actions
import {
  receiveInterestedStandardsAction,
  updateInterestedStandardsAction,
  saveInterestedStandardsAction,
  deleteStandardAction,
  updateStandardsPreferencesAction
} from "../../ducks";

import { getDictCurriculumsAction } from "../../../src/actions/dictionaries";
import { getCurriculumsListSelector } from "../../../src/selectors/dictionaries";
import { getUserOrgId, getUserRole } from "../../../src/selectors/user";
import SaSchoolSelect from "../../../src/components/common/SaSchoolSelect";

const title = "Manage District";
const menuActive = { mainMenu: "Settings", subMenu: "Interested Standards" };

class InterestedStandards extends Component {
  constructor(props) {
    super(props);

    this.state = {
      standardSetsModalVisible: false
    };
  }

  componentDidMount() {
    const { loadInterestedStandards, userOrgId, getCurriculums, role, schoolId } = this.props;
    const isSchoolLevel = role === roleuser.SCHOOL_ADMIN;
    const orgId = isSchoolLevel ? schoolId : userOrgId;
    const orgType = isSchoolLevel ? "institution" : "district";
    loadInterestedStandards({
      orgId,
      orgType
    });
    getCurriculums();
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.loading || prevState.saving || prevState.updating) return null;
    else
      return {
        dataSource: nextProps.courseList
      };
  }

  updateInterestedStandards = data => {
    const { updateInterestedStandards } = this.props;
    updateInterestedStandards({
      body: data
    });
  };

  saveInterestedStandards = () => {
    const { updateInterestedStandards, interestedStaData, userOrgId, schoolId, role } = this.props;
    const { showAllStandards = true, includeOtherStandards = false } = interestedStaData;

    const isSchoolLevel = role === roleuser.SCHOOL_ADMIN;
    const orgId = isSchoolLevel ? schoolId : userOrgId;
    const orgType = isSchoolLevel ? "institution" : "district";
    let saveData = {
      orgId,
      orgType,
      showAllStandards,
      includeOtherStandards,
      curriculums: []
    };
    if (interestedStaData.curriculums) {
      for (let i = 0; i < interestedStaData.curriculums.length; i++) {
        saveData.curriculums.push({
          _id: interestedStaData.curriculums[i]._id,
          name: interestedStaData.curriculums[i].name,
          subject: interestedStaData.curriculums[i].subject
        });
      }
    }

    updateInterestedStandards(saveData);
  };

  showMyStandardSetsModal = () => {
    this.setState({ standardSetsModalVisible: true });
  };

  hideMyStandardSetsModal = () => {
    this.setState({ standardSetsModalVisible: false });
  };

  updateMyStandardSets = updatedStandards => {
    const { userOrgId, curriculums, updateInterestedStandards, role, schoolId } = this.props;
    const curriculumsData = [];
    for (let i = 0; i < updatedStandards.length; i++) {
      const selStandards = curriculums.filter(item => item.curriculum === updatedStandards[i]);
      curriculumsData.push({
        _id: selStandards[0]._id,
        name: selStandards[0].curriculum,
        subject: selStandards[0].subject
      });
    }
    const isSchoolLevel = role === roleuser.SCHOOL_ADMIN;
    const orgId = isSchoolLevel ? schoolId : userOrgId;
    const orgType = isSchoolLevel ? "institution" : "district";
    const standardsData = {
      orgId,
      orgType,
      curriculums: curriculumsData
    };
    updateInterestedStandards(standardsData);
    this.hideMyStandardSetsModal();
  };

  closeCurriculum = (id, disableClose) => {
    const { deleteStandard } = this.props;
    if (!disableClose) deleteStandard(id);
  };

  updatePreferences = e => {
    const { updateStandardsPreferences } = this.props;
    const { checked, name } = e.target;
    updateStandardsPreferences({ name, value: checked });
  };

  handleSchoolSelect = schoolId => {
    const { loadInterestedStandards } = this.props;
    loadInterestedStandards({
      orgId: schoolId,
      orgType: "institution"
    });
  };

  render() {
    const { loading, updating, saving, history, curriculums, interestedStaData, role } = this.props;
    const readOnly = role === roleuser.SCHOOL_ADMIN;
    const showSpin = loading || updating || saving;
    const { standardSetsModalVisible } = this.state;
    const { showAllStandards = true, includeOtherStandards = false } = interestedStaData;
    let isDisableSaveBtn = true;
    const subjectArray = ["Mathematics", "ELA", "Science", "Social Studies", "Other Subjects"];
    let selectedStandards = [],
      standardsList = [];
    if (interestedStaData != null && interestedStaData.hasOwnProperty("curriculums")) {
      isDisableSaveBtn = interestedStaData.curriculums.length == 0 ? true : false;
      for (let i = 0; i < subjectArray.length; i++) {
        const filtedSubject = interestedStaData.curriculums.filter(item => item.subject === subjectArray[i]);
        if (filtedSubject.length > 0) {
          selectedStandards.push(filtedSubject);
        }
      }
    }

    if (selectedStandards.length > 0) {
      for (let i = 0; i < selectedStandards.length; i++) {
        const subjectStandards = [];
        for (let j = 0; j < selectedStandards[i].length; j++) {
          const disableClose = selectedStandards[i][j]?.orgType === "district" && readOnly;
          subjectStandards.push(
            <StyledSubjectLine>
              <StyledSubjectCloseButton
                disabled={disableClose}
                onClick={() => this.closeCurriculum(selectedStandards[i][j]._id, disableClose)}
              >
                <Icon type="close" />
              </StyledSubjectCloseButton>
              <p>{selectedStandards[i][j].name}</p>
            </StyledSubjectLine>
          );
        }
        standardsList.push(
          <React.Fragment>
            <StyledSubjectTitle>{selectedStandards[i][0].subject}</StyledSubjectTitle>
            {subjectStandards}
          </React.Fragment>
        );
      }
    }
    // show list end

    return (
      <InterestedStandardsDiv>
        <AdminHeader title={title} active={menuActive} history={history} />
        <StyledContent>
          <StyledLayout loading={showSpin ? "true" : "false"}>
            <AdminSubHeader active={menuActive} history={history} />
            {showSpin && (
              <SpinContainer>
                <StyledSpin size="large" />
              </SpinContainer>
            )}
            <Row>
              <Col span={12} style={{ display: "flex", flexDirection: "column" }}>
                <StyledCheckbox onChange={this.updatePreferences} name="showAllStandards" checked={showAllStandards}>
                  Show all standards to the users
                </StyledCheckbox>
                <StyledCheckbox
                  onChange={this.updatePreferences}
                  name="includeOtherStandards"
                  checked={includeOtherStandards}
                >
                  Include other standards opted by the users
                </StyledCheckbox>
                <Button
                  style={{ width: "260px" }}
                  type="primary"
                  onClick={this.showMyStandardSetsModal}
                  shape="round"
                  ghost
                >
                  Select your standard sets
                </Button>
              </Col>
              <Col span={12}>
                <Col span={8}>
                  <DropdownWrapper>
                    <SaSchoolSelect onChange={this.handleSchoolSelect} />
                  </DropdownWrapper>
                </Col>
                <StyledSaveButton type="primary" onClick={this.saveInterestedStandards}>
                  Save
                </StyledSaveButton>
              </Col>
            </Row>

            <StyledSubjectContent>
              <Col span={24}>{standardsList}</Col>
            </StyledSubjectContent>
            {standardSetsModalVisible && (
              <StandardSetModal
                modalVisible={standardSetsModalVisible}
                saveMyStandardsSet={this.updateMyStandardSets}
                closeModal={this.hideMyStandardSetsModal}
                standardList={curriculums}
                interestedStaData={interestedStaData}
              />
            )}
          </StyledLayout>
        </StyledContent>
      </InterestedStandardsDiv>
    );
  }
}

const enhance = compose(
  connect(
    state => ({
      interestedStaData: get(state, ["interestedStandardsReducer", "data"], []),
      loading: get(state, ["interestedStandardsReducer", "loading"], false),
      saving: get(state, ["interestedStandardsReducer", "saving"], false),
      updating: get(state, ["interestedStandardsReducer", "updating"], false),
      schoolId: get(state, "user.saSettingsSchool"),
      userOrgId: getUserOrgId(state),
      curriculums: getCurriculumsListSelector(state),
      role: getUserRole(state)
    }),
    {
      loadInterestedStandards: receiveInterestedStandardsAction,
      updateInterestedStandards: updateInterestedStandardsAction,
      saveInterestedStandards: saveInterestedStandardsAction,
      getCurriculums: getDictCurriculumsAction,
      deleteStandard: deleteStandardAction,
      updateStandardsPreferences: updateStandardsPreferencesAction
    }
  )
);

export default enhance(InterestedStandards);

InterestedStandards.propTypes = {
  loadInterestedStandards: PropTypes.func.isRequired,
  updateInterestedStandards: PropTypes.func.isRequired,
  saveInterestedStandards: PropTypes.func.isRequired,
  interestedStaData: PropTypes.object.isRequired,
  userOrgId: PropTypes.string.isRequired
};
