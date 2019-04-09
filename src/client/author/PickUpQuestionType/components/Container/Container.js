import React, { Component } from "react";
import PropTypes from "prop-types";
import uuid from "uuid/v4";
import { connect } from "react-redux";
import { compose } from "redux";
import { Menu } from "antd";
import { PaddingDiv } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";

import QuestionTypes from "../QuestionType/QuestionTypes";
import { getItemSelector } from "../../../src/selectors/items";
import Header from "../Header/Header";
import Breadcrumb from "../../../src/components/Breadcrumb";
import { setQuestionAction } from "../../../QuestionEditor/ducks";
import { addQuestionAction } from "../../../sharedDucks/questions";
import { toggleSideBarAction } from "../../../src/actions/togglemenu";
import {
  Content,
  LeftSide,
  BarChartIcon,
  EditIcon,
  LayoutIcon,
  LineChartIcon,
  MathIcon,
  MoleculeIcon,
  MoreIcon,
  NewListIcon,
  RightSide,
  SelectionIcon,
  TargetIcon,
  MenuTitle,
  StyledModal,
  StyledModalContainer,
  MobileButtons,
  SelectWidget,
  BackLink,
  RulerIcon,
  PlayIcon
} from "./styled";
import { SMALL_DESKTOP_WIDTH } from "../../../src/constants/others";

class Container extends Component {
  state = {
    currentQuestion: "multiple-choice",
    currentTab: "question-tab",
    isShowCategories: false
  };

  // when a particular question type is picked, populate the "authorQuestions" collection
  selectQuestionType = data => {
    const { setQuestion, addQuestion, history, match, t } = this.props;
    const question = {
      id: uuid(),
      ...data
    };

    setQuestion(question);
    // add question to the questions store.
    addQuestion(question);

    history.push({
      pathname: "/author/questions/create",
      state: {
        ...history.location.state,
        backUrl: match.url,
        backText: t("component.pickupcomponent.headertitle")
      }
    });
  };

  get link() {
    const { history, t } = this.props;

    if (history.location.state) {
      return {
        url: history.location.state.backUrl,
        text: history.location.state.backText
      };
    }

    return {
      url: "/author/items",
      text: t("component.itemDetail.backToItemList")
    };
  }

  handleCategory = ({ key }) => {
    this.setState({ currentQuestion: key });
  };

  handleChangeTab = ({ key }) => {
    this.setState({ currentTab: key });

    if (key === "feature-tab") {
      this.setState({ currentQuestion: "feature" });
    }
    if (key === "question-tab") {
      this.setState({ currentQuestion: "multiple-choice" });
    }
  };

  toggleCategories = () => {
    const { isShowCategories } = this.state;

    this.setState({
      isShowCategories: !isShowCategories
    });
  };

  render() {
    const { t, windowWidth, toggleSideBar } = this.props;
    const { currentQuestion, currentTab, mobileViewShow, isShowCategories } = this.state;
    const breadcrumbData = [
      {
        title: "<&nbsp;&nbsp;&nbsp;ITEM LIST",
        to: "/author/items"
      },
      {
        title: "ITEM DETAIL",
        to: `/author/items/${window.location.pathname.split("/")[3]}/item-detail`
      },
      {
        title: "SELECT A QUESTION TYPE",
        to: ""
      }
    ];

    return (
      <Content showMobileView={mobileViewShow}>
        <Header title={t("component.pickupcomponent.headertitle")} link={this.link} toggleSideBar={toggleSideBar} />
        <LeftSide>
          <Menu
            mode="horizontal"
            selectedKeys={[currentTab]}
            onClick={this.handleChangeTab}
            style={{
              background: "transparent",
              borderBottom: 0,
              display: "none"
            }}
          >
            <Menu.Item key="question-tab">{t("component.pickupcomponent.question")}</Menu.Item>
            <Menu.Item key="feature-tab">{t("component.pickupcomponent.feature")}</Menu.Item>
          </Menu>
          <MenuTitle>{t("component.pickupcomponent.selectAType")}</MenuTitle>
          <Menu
            mode="inline"
            style={{
              background: "transparent",
              border: 0
            }}
            selectedKeys={[currentQuestion]}
            onClick={this.handleCategory}
          >
            <Menu.Item key="multiple-choice">
              <NewListIcon />
              {"Multiple Choice"}
            </Menu.Item>
            <Menu.Item key="fill-blanks">
              <SelectionIcon />
              {"Fill in the Blanks"}
            </Menu.Item>
            <Menu.Item key="classify">
              <LayoutIcon />
              {"Classify, Match & Order"}
            </Menu.Item>
            <Menu.Item key="edit">
              <EditIcon />
              {"Written & Spoken"}
            </Menu.Item>
            <Menu.Item key="highlight">
              <TargetIcon />
              {"Highlight"}
            </Menu.Item>
            <Menu.Item key="math">
              <MathIcon />
              {"Math"}
            </Menu.Item>
            <Menu.Item key="graphing">
              <LineChartIcon />
              {"Graphing"}
            </Menu.Item>
            <Menu.Item key="charts">
              <BarChartIcon />
              {"Charts"}
            </Menu.Item>
            <Menu.Item key="chemistry">
              <MoleculeIcon />
              {"Chemistry"}
            </Menu.Item>
            <Menu.Item key="video-passages">
              <PlayIcon />
              {"Video & Passages"}
            </Menu.Item>
            <Menu.Item key="rulers-calculators">
              <RulerIcon />
              {"Rulers & Calculators"}
            </Menu.Item>
            <Menu.Item key="other">
              <MoreIcon />
              {"Other"}
            </Menu.Item>
          </Menu>
        </LeftSide>
        <RightSide>
          <Breadcrumb
            data={breadcrumbData}
            style={{
              position: "relative",
              top: 0,
              padding: "17px 0px",
              display: windowWidth > SMALL_DESKTOP_WIDTH ? "initial" : "none"
            }}
          />
          <MobileButtons>
            <BackLink to={`/author/items/${window.location.pathname.split("/")[3]}/item-detail`}>
              Back to Item Detail
            </BackLink>
            <SelectWidget onClick={this.toggleCategories}>Select widget</SelectWidget>
          </MobileButtons>
          <PaddingDiv
            style={{
              position: "relative",
              top: 0,
              overflow: "auto",
              height: "auto",
              background: "#fff",
              borderRadius: "10px",
              padding: windowWidth > SMALL_DESKTOP_WIDTH ? "35px" : "20px 15px 10px",
              boxShadow: "0 2px 5px 0 rgba(0, 0, 0, 0.07)",
              minHeight: "calc(100vh - 190px)"
            }}
          >
            <QuestionTypes onSelectQuestionType={this.selectQuestionType} questionType={currentQuestion} />
          </PaddingDiv>
        </RightSide>

        <StyledModal
          open={isShowCategories}
          onClose={this.toggleCategories}
          classNames={{
            overlay: "modal-overlay",
            modal: "modal"
          }}
        >
          <StyledModalContainer>
            <MenuTitle>{t("component.pickupcomponent.selectAType")}</MenuTitle>
            <Menu
              mode="inline"
              style={{
                background: "transparent",
                border: 0
              }}
              selectedKeys={[currentQuestion]}
              onClick={this.handleCategory}
            >
              <Menu.Item key="multiple-choice" onClick={this.toggleCategories}>
                <NewListIcon />
                {"Multiple Choice"}
              </Menu.Item>
              <Menu.Item key="fill-blanks" onClick={this.toggleCategories}>
                <SelectionIcon />
                {"Fill in the Blanks"}
              </Menu.Item>
              <Menu.Item key="classify" onClick={this.toggleCategories}>
                <LayoutIcon />
                {"Classify, Match & Order"}
              </Menu.Item>
              <Menu.Item key="edit" onClick={this.toggleCategories}>
                <EditIcon />
                {"Written & Spoken"}
              </Menu.Item>
              <Menu.Item key="highlight" onClick={this.toggleCategories}>
                <TargetIcon />
                {"Highlight"}
              </Menu.Item>
              <Menu.Item key="math" onClick={this.toggleCategories}>
                <MathIcon />
                {"Math"}
              </Menu.Item>
              <Menu.Item key="graphing" onClick={this.toggleCategories}>
                <LineChartIcon />
                {"Graphing"}
              </Menu.Item>
              <Menu.Item key="charts" onClick={this.toggleCategories}>
                <BarChartIcon />
                {"Charts"}
              </Menu.Item>
              <Menu.Item key="chemistry" onClick={this.toggleCategories}>
                <MoleculeIcon />
                {"Chemistry"}
              </Menu.Item>
              <Menu.Item key="video-passages" onClick={this.toggleCategories}>
                <PlayIcon />
                {"Video & Passages"}
              </Menu.Item>
              <Menu.Item key="rulers-calculators" onClick={this.toggleCategories}>
                <RulerIcon />
                {"Rulers & Calculators"}
              </Menu.Item>
              <Menu.Item key="other" onClick={this.toggleCategories}>
                <MoreIcon />
                {"Other"}
              </Menu.Item>
            </Menu>
          </StyledModalContainer>
        </StyledModal>
      </Content>
    );
  }
}

const enhance = compose(
  withNamespaces("author"),
  connect(
    state => ({
      item: getItemSelector(state)
    }),
    {
      setQuestion: setQuestionAction,
      addQuestion: addQuestionAction,
      toggleSideBar: toggleSideBarAction
    }
  )
);

Container.propTypes = {
  history: PropTypes.object.isRequired,
  t: PropTypes.func.isRequired,
  setQuestion: PropTypes.func.isRequired,
  addQuestion: PropTypes.func.isRequired,
  match: PropTypes.object.isRequired,
  windowWidth: PropTypes.number.isRequired,
  toggleSideBar: PropTypes.func.isRequired
};

export default enhance(Container);
