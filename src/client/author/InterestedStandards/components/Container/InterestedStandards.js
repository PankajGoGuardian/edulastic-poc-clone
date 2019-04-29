import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { compose } from "redux";
import { get } from "lodash";

import { Row, Col, Button, Icon } from "antd";
import {
  StyledContent,
  StyledLayout,
  SpinContainer,
  StyledSpin,
  StyledSaveButton,
  StyledSubjectTitle,
  StyledSubjectLine,
  StyledSubjectCloseButton,
  StyledSubjectContent
} from "./styled";

import AdminHeader from "../../../src/components/common/AdminHeader/AdminHeader";
import StandardSetModal from "../StandardSetsModal/StandardSetsModal";
// actions
import {
  receiveInterestedStandardsAction,
  updateInterestedStandardsAction,
  saveInterestedStandardsAction,
  deleteStandardAction
} from "../../ducks";

import { getDictCurriculumsAction } from "../../../src/actions/dictionaries";
import { getCurriculumsListSelector } from "../../../src/selectors/dictionaries";
import { getUserOrgId } from "../../../src/selectors/user";

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
    const { loadInterestedStandards, userOrgId, getCurriculums } = this.props;
    loadInterestedStandards({ orgId: userOrgId });
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
    const { updateInterestedStandards, interestedStaData } = this.props;
    let saveData = {
      orgId: interestedStaData.orgId,
      orgType: interestedStaData.orgType,
      curriculums: []
    };

    for (let i = 0; i < interestedStaData.curriculums.length; i++) {
      saveData.curriculums.push({
        _id: interestedStaData.curriculums[i]._id,
        name: interestedStaData.curriculums[i].name,
        subject: interestedStaData.curriculums[i].subject
      });
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
    const { userOrgId, curriculums, updateInterestedStandards } = this.props;
    const curriculumsData = [];
    for (let i = 0; i < updatedStandards.length; i++) {
      const selStandards = curriculums.filter(item => item.curriculum === updatedStandards[i]);
      curriculumsData.push({
        _id: selStandards[0]._id,
        name: selStandards[0].curriculum,
        subject: selStandards[0].subject
      });
    }
    const standardsData = {
      orgId: userOrgId,
      orgType: "district",
      curriculums: curriculumsData
    };
    updateInterestedStandards(standardsData);
    this.hideMyStandardSetsModal();
  };

  closeCurriculum = (e, id) => {
    const { deleteStandard } = this.props;
    deleteStandard(id);
  };

  render() {
    const { loading, updating, saving, history, curriculums, interestedStaData } = this.props;
    const showSpin = loading || updating || saving;

    const { standardSetsModalVisible } = this.state;

    // show list start
    const subjectArray = ["Mathematics", "ELA", "Science", "Social Studies", "Other Subjects"];
    let selectedStandards = [],
      standardsList = [];
    if (interestedStaData != null && interestedStaData.hasOwnProperty("curriculums")) {
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
          subjectStandards.push(
            <StyledSubjectLine>
              <StyledSubjectCloseButton onClick={e => this.closeCurriculum(e, selectedStandards[i][j]._id)}>
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
      <div>
        <AdminHeader title={title} active={menuActive} history={history} />
        <StyledContent>
          <StyledLayout loading={showSpin ? "true" : "false"}>
            {showSpin && (
              <SpinContainer>
                <StyledSpin size="large" />
              </SpinContainer>
            )}
            <Row>
              <Col span={12}>
                <Button type="primary" onClick={this.showMyStandardSetsModal} shape="round" ghost>
                  Select your standard sets
                </Button>
              </Col>
              <Col span={12}>
                <StyledSaveButton type="primary" onClick={this.saveInterestedStandards}>
                  Save
                </StyledSaveButton>
              </Col>
            </Row>

            <StyledSubjectContent>
              <Col span={24}>{standardsList}</Col>
            </StyledSubjectContent>
            <StandardSetModal
              modalVisible={standardSetsModalVisible}
              saveMyStandardsSet={this.updateMyStandardSets}
              closeModal={this.hideMyStandardSetsModal}
              standardList={curriculums}
              interestedStaData={interestedStaData}
            />
          </StyledLayout>
        </StyledContent>
      </div>
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
      userOrgId: getUserOrgId(state),
      curriculums: getCurriculumsListSelector(state)
    }),
    {
      loadInterestedStandards: receiveInterestedStandardsAction,
      updateInterestedStandards: updateInterestedStandardsAction,
      saveInterestedStandards: saveInterestedStandardsAction,
      getCurriculums: getDictCurriculumsAction,
      deleteStandard: deleteStandardAction
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
