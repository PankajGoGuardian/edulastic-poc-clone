import React, { Component } from "react";
import PropTypes from "prop-types";
import uuid from "uuid/v4";
import { connect } from "react-redux";
import { compose } from "redux";
import { Menu } from "antd";
import { questionType } from "@edulastic/constants";
import { PaddingDiv, withWindowSizes } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { withRouter } from "react-router";
import PerfectScrollbar from "react-perfect-scrollbar";
import {
  IconClose,
  IconBarChart,
  IconEdit,
  IconLayout,
  IconLineChart,
  IconMath,
  IconMolecule,
  IconMore,
  IconNewList,
  IconSelection,
  IconTarget,
  IconRulerPencil,
  IconPlay,
  IconMultipart
} from "@edulastic/icons";
import QuestionTypes from "../QuestionType/QuestionTypes";
import { getItemSelector } from "../../../src/selectors/items";
import Header from "../Header/Header";
import { ButtonClose } from "../../../ItemDetail/components/Container/styled";
import { convertItemToMultipartAction, convertItemToPassageWithQuestionsAction } from "../../../ItemDetail/ducks";
import { setQuestionAction } from "../../../QuestionEditor/ducks";
import { addQuestionAction } from "../../../sharedDucks/questions";
import { toggleSideBarAction } from "../../../src/actions/toggleMenu";
import { setQuestionCategory, setQuestionTab } from "../../../src/actions/pickUpQuestion";
import {
  Content,
  LeftSide,
  RightSide,
  MenuTitle,
  StyledModal,
  StyledModalContainer,
  MobileButtons,
  SelectWidget,
  BackLink,
  PickQuestionWrapper,
  LeftMenuWrapper,
  AffixWrapper
} from "./styled";
import { toggleCreateItemModalAction } from "../../../src/actions/testItem";
import Breadcrumb from "../../../src/components/Breadcrumb";

import { SMALL_DESKTOP_WIDTH } from "../../../src/constants/others";

class Container extends Component {
  state = {
    isShowCategories: false
  };

  // when a particular question type is picked, populate the "authorQuestions" collection
  selectQuestionType = data => {
    const {
      convertToMultipart,
      setQuestion,
      addQuestion,
      history,
      match,
      t,
      modalItemId,
      navigateToQuestionEdit,
      isTestFlow,
      convertToPassageWithQuestions
    } = this.props;

    const { testId, itemId, id } = match.params;

    // in case of combination multipart
    if (data.type === questionType.COMBINATION_MULTIPART) {
      convertToMultipart({ isTestFlow, itemId: itemId || id, testId });
      return;
    }

    // handle case of passage with questions
    if (data.type === questionType.PASSAGE_WITH_QUESTIONS || data.type === questionType.PASSAGE) {
      convertToPassageWithQuestions({
        isTestFlow,
        itemId: itemId || id,
        testId,
        canAddMultipleItems: data.type === questionType.PASSAGE_WITH_QUESTIONS
      });
      return;
    }

    // FIXME: Weird! connect not working properly. setQuestion not available as a prop
    // TODO: found the issue because of an indirect circular dependency. Found all the possible locations and eventually need to be fixed all the circular dependency issues

    const question = {
      id: uuid(),
      ...data
    };

    setQuestion(question);
    // add question to the questions store.
    addQuestion(question);

    if (modalItemId) {
      navigateToQuestionEdit();
      return;
    }

    if (isTestFlow) {
      history.push({
        pathname: `/author/tests/${testId}/createItem/${itemId}/questions/create/${question.type}`,
        state: {
          ...history.location.state,
          backUrl: match.url,
          backText: t("component.pickupcomponent.headertitle"),
          fadeSidebar: true
        }
      });
      return;
    }

    history.push({
      pathname: `/author/questions/create/${question.type}`,
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
    const { setCategory } = this.props;
    setCategory(key);
  };

  handleChangeTab = ({ key }) => {
    const { setCategory, setTab } = this.props;

    setTab(key);

    if (key === "feature-tab") {
      setCategory("feature");
    }

    if (key === "question-tab") {
      setCategory("multiple-choice");
    }
  };

  toggleCategories = () => {
    const { isShowCategories } = this.state;

    this.setState({
      isShowCategories: !isShowCategories
    });
  };

  get breadcrumb() {
    const { location, testName, modalItemId, navigateToItemDetail, toggleModalAction, testId, isTestFlow } = this.props;

    if (isTestFlow) {
      const testPath = `/author/tests/${testId || "create"}`;
      return [
        {
          title: "TEST LIBRARY",
          to: "/author/tests"
        },
        {
          title: testName,
          to: testPath,
          onClick: toggleModalAction,
          state: { persistStore: true }
        },
        {
          title: "SELECT A QUESTION TYPE",
          to: ""
        }
      ];
    }
    return [
      {
        title: "ITEM BANK",
        to: "/author/items"
      },
      {
        title: "SELECT THE TYPE OF WIDGET",
        to: `/author/items/${window.location.pathname.split("/")[3]}/item-detail`
      },
      {
        title: "SELECT A QUESTION TYPE",
        to: ""
      }
    ];
  }

  render() {
    const {
      t,
      windowWidth,
      toggleSideBar,
      modalItemId,
      onModalClose,
      navigateToItemDetail,
      selectedCategory,
      selectedTab
    } = this.props;
    const { mobileViewShow, isShowCategories } = this.state;

    return (
      <Content showMobileView={mobileViewShow}>
        <Header
          title={t("component.pickupcomponent.headertitle")}
          link={this.link}
          toggleSideBar={toggleSideBar}
          renderExtra={() =>
            modalItemId && (
              <ButtonClose onClick={onModalClose}>
                <IconClose />
              </ButtonClose>
            )
          }
        />
        <PickQuestionWrapper>
          <LeftSide>
            <Menu
              mode="horizontal"
              selectedKeys={[selectedTab]}
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
            <AffixWrapper>
              <PerfectScrollbar>
                <LeftMenuWrapper mode="inline" selectedKeys={[selectedCategory]} onClick={this.handleCategory}>
                  <Menu.Item key="multiple-choice">
                    <IconNewList />
                    {"Multiple Choice"}
                  </Menu.Item>
                  <Menu.Item key="fill-blanks">
                    <IconSelection />
                    {"Fill in the Blanks"}
                  </Menu.Item>
                  <Menu.Item key="classify">
                    <IconLayout />
                    {"Classify, Match & Order"}
                  </Menu.Item>
                  <Menu.Item key="edit">
                    <IconEdit />
                    {"Reading & Comprehension"}
                  </Menu.Item>
                  <Menu.Item key="highlight">
                    <IconTarget />
                    {"Highlight"}
                  </Menu.Item>
                  <Menu.Item key="math">
                    <IconMath />
                    {"Math"}
                  </Menu.Item>
                  <Menu.Item key="graphing">
                    <IconLineChart />
                    {"Graphing"}
                  </Menu.Item>
                  <Menu.Item key="charts">
                    <IconBarChart />
                    {"Charts"}
                  </Menu.Item>
                  <Menu.Item key="multipart">
                    <IconMultipart />
                    {"Multipart"}
                  </Menu.Item>
                  <Menu.Item key="video-passages">
                    <IconPlay />
                    {"Video & Text"}
                  </Menu.Item>
                  <Menu.Item key="rulers-calculators">
                    <IconRulerPencil />
                    {"Tools"}
                  </Menu.Item>
                  <Menu.Item key="other">
                    <IconMore />
                    {"Other"}
                  </Menu.Item>
                </LeftMenuWrapper>
              </PerfectScrollbar>
            </AffixWrapper>
          </LeftSide>
          <RightSide>
            <Breadcrumb
              data={this.breadcrumb}
              style={{
                position: "relative",
                top: 0,
                padding: "0px 0px 15px",
                display: windowWidth > SMALL_DESKTOP_WIDTH ? "block" : "none"
              }}
            />
            <MobileButtons>
              <BackLink to={`/author/items/${window.location.pathname.split("/")[3]}/item-detail`}>
                Back to Item Detail
              </BackLink>
              <SelectWidget data-cy="selectWidget" onClick={this.toggleCategories}>
                Select widget
              </SelectWidget>
            </MobileButtons>
            <PaddingDiv
              style={{
                position: "relative",
                top: 0,
                overflow: "auto",
                height: "auto",
                background: "#fff",
                borderRadius: "10px",
                padding: windowWidth > SMALL_DESKTOP_WIDTH ? "34px 25px" : "20px 15px 10px",
                boxShadow: "0 2px 5px 0 rgba(0, 0, 0, 0.07)",
                minHeight: "calc(100vh - 190px)"
              }}
            >
              <QuestionTypes onSelectQuestionType={this.selectQuestionType} questionType={selectedCategory} />
            </PaddingDiv>
          </RightSide>
        </PickQuestionWrapper>

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
              selectedKeys={[selectedCategory]}
              onClick={this.handleCategory}
            >
              <Menu.Item key="multiple-choice" onClick={this.toggleCategories}>
                <IconNewList />
                {"Multiple Choice"}
              </Menu.Item>
              <Menu.Item key="fill-blanks" onClick={this.toggleCategories}>
                <IconSelection />
                {"Fill in the Blanks"}
              </Menu.Item>
              <Menu.Item key="classify" onClick={this.toggleCategories}>
                <IconLayout />
                {"Classify, Match & Order"}
              </Menu.Item>
              <Menu.Item key="edit" onClick={this.toggleCategories}>
                <IconEdit />
                {"Reading & Comprehension"}
              </Menu.Item>
              <Menu.Item key="highlight" onClick={this.toggleCategories}>
                <IconTarget />
                {"Highlight"}
              </Menu.Item>
              <Menu.Item key="math" onClick={this.toggleCategories}>
                <IconMath />
                {"Math"}
              </Menu.Item>
              <Menu.Item key="graphing" onClick={this.toggleCategories}>
                <IconLineChart />
                {"Graphing"}
              </Menu.Item>
              <Menu.Item key="charts" onClick={this.toggleCategories}>
                <IconBarChart />
                {"Charts"}
              </Menu.Item>
              <Menu.Item key="multipart">
                <IconMultipart />
                {"Multipart"}
              </Menu.Item>
              <Menu.Item key="video-passages" onClick={this.toggleCategories}>
                <IconPlay />
                {"Video & Text"}
              </Menu.Item>
              <Menu.Item key="rulers-calculators" onClick={this.toggleCategories}>
                <IconRulerPencil />
                {"Tools"}
              </Menu.Item>
              <Menu.Item key="other" onClick={this.toggleCategories}>
                <IconMore />
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
  withWindowSizes,
  withRouter,
  connect(
    state => ({
      item: getItemSelector(state),
      selectedCategory: state.pickUpQuestion.selectedCategory,
      selectedTab: state.pickUpQuestion.selectedTab,
      testName: state.tests.entity.title,
      testId: state.tests.entity._id
    }),
    {
      setQuestion: setQuestionAction,
      addQuestion: addQuestionAction,
      toggleSideBar: toggleSideBarAction,
      setCategory: setQuestionCategory,
      setTab: setQuestionTab,
      toggleModalAction: toggleCreateItemModalAction,
      convertToMultipart: convertItemToMultipartAction,
      convertToPassageWithQuestions: convertItemToPassageWithQuestionsAction
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
  toggleSideBar: PropTypes.func.isRequired,
  modalItemId: PropTypes.string,
  onModalClose: PropTypes.func,
  navigateToQuestionEdit: PropTypes.func,
  navigateToItemDetail: PropTypes.func,
  setCategory: PropTypes.func.isRequired,
  setTab: PropTypes.func.isRequired,
  selectedCategory: PropTypes.string.isRequired,
  selectedTab: PropTypes.string.isRequired,
  location: PropTypes.object.isRequired,
  testName: PropTypes.string.isRequired,
  testId: PropTypes.string.isRequired,
  toggleModalAction: PropTypes.string.isRequired
};

Container.defaultProps = {
  modalItemId: undefined,
  onModalClose: () => {},
  navigateToQuestionEdit: () => {},
  navigateToItemDetail: () => {}
};

export default enhance(Container);
