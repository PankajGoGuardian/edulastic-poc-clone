import React, { Component } from "react";
import PropTypes from "prop-types";
import uuid from "uuid/v4";
import { connect } from "react-redux";
import { compose } from "redux";
import { Menu } from "antd";
import { PaddingDiv, withWindowSizes } from "@edulastic/common";
import { withNamespaces } from "@edulastic/localization";
import { IconClose } from "@edulastic/icons";
import QuestionTypes from "../QuestionType/QuestionTypes";
import { getItemSelector } from "../../../src/selectors/items";
import Header from "../Header/Header";
import Breadcrumb from "../../../src/components/Breadcrumb";
import { ButtonClose } from "../../../ItemDetail/components/Container/styled";
import { setQuestionAction } from "../../../QuestionEditor/ducks";
import { addQuestionAction } from "../../../sharedDucks/questions";
import { toggleSideBarAction } from "../../../src/actions/toggleMenu";
import { setQuestionCategory, setQuestionTab } from "../../../src/actions/pickUpQuestion";
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
    isShowCategories: false
  };

  // when a particular question type is picked, populate the "authorQuestions" collection
  selectQuestionType = data => {
    // FIXME: Weird! connect not working properly. setQuestion not available as a prop
    // TODO: found the issue because of an indirect circular dependency. Found all the possible locations and eventually need to be fixed all the circular dependency issues
    const { setQuestion, addQuestion, history, match, t, modalItemId, navigateToQuestionEdit } = this.props;

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

    const breadcrumbData = modalItemId
      ? [
          {
            title: "ITEM DETAIL",
            to: "",
            onClick: navigateToItemDetail
          },
          {
            title: "SELECT A QUESTION TYPE",
            to: ""
          }
        ]
      : [
          {
            title: "ITEM BANK",
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
          <Menu
            mode="inline"
            style={{
              background: "transparent",
              border: 0
            }}
            selectedKeys={[selectedCategory]}
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
              display: windowWidth > SMALL_DESKTOP_WIDTH ? "block" : "none"
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
            <QuestionTypes onSelectQuestionType={this.selectQuestionType} questionType={selectedCategory} />
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
              selectedKeys={[selectedCategory]}
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
  withWindowSizes,
  connect(
    state => ({
      item: getItemSelector(state),
      selectedCategory: state.pickUpQuestion.selectedCategory,
      selectedTab: state.pickUpQuestion.selectedTab
    }),
    {
      setQuestion: setQuestionAction,
      addQuestion: addQuestionAction,
      toggleSideBar: toggleSideBarAction,
      setCategory: setQuestionCategory,
      setTab: setQuestionTab
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
  selectedTab: PropTypes.string.isRequired
};

Container.defaultProps = {
  modalItemId: undefined,
  onModalClose: () => {},
  navigateToQuestionEdit: () => {},
  navigateToItemDetail: () => {}
};

export default enhance(Container);
