/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { get, keyBy, intersection, uniq } from "lodash";
import { Spin, Button, Modal, message } from "antd";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { withWindowSizes } from "@edulastic/common";
import { questionType } from "@edulastic/constants";
import { testItemsApi, passageApi } from "@edulastic/api";
import { themeColor } from "@edulastic/colors";
import Hints from "@edulastic/common/src/components/Hints";
import {
  getItemDetailSelectorForPreview,
  getPassageSelector,
  addPassageAction,
  setPrevewItemAction,
  setQuestionsForPassageAction,
  clearPreviewAction
} from "./ducks";

import { getCollectionsSelector, getUserFeatures } from "../../../selectors/user";
import { changePreviewAction, changeViewAction } from "../../../actions/view";
import { clearAnswersAction } from "../../../actions/answers";
import { getSelectedItemSelector, setTestItemsAction } from "../../../../TestPage/components/AddItems/ducks";
import { setTestDataAndUpdateAction, getTestSelector, updateTestAndNavigateAction } from "../../../../TestPage/ducks";
import { clearItemDetailAction } from "../../../../ItemDetail/ducks";
import { addItemToCartAction } from "../../../../ItemList/ducks";
import AuthorTestItemPreview from "./AuthorTestItemPreview";
import { SMALL_DESKTOP_WIDTH } from "../../../../../assessment/constants/others";
import ReportIssue from "./ReportIssue";

const { duplicateTestItem } = testItemsApi;
class PreviewModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      flag: false,
      passageLoading: false,
      showHints: false,
      showReportIssueField: false
    };
  }

  componentDidMount() {
    const { item, addPassage } = this.props;
    if (item.passageId) {
      this.setState({ passageLoading: true });
      try {
        passageApi.getById(item.passageId).then(response => {
          addPassage(response);
          this.setState({ passageLoading: false });
        });
      } catch (e) {
        this.setState({ passageLoading: false });
      }
    }
  }

  componentWillUnmount() {
    const { clearAnswers } = this.props;
    clearAnswers();
  }

  componentWillReceiveProps(nextProps) {
    const { flag } = this.state;
    const { isVisible } = nextProps;
    if (isVisible && !flag) {
      this.setState({ flag: true });
    }
  }

  closeModal = () => {
    const { onClose, changePreviewMode, clearPreview } = this.props;
    this.setState({ flag: false });
    clearPreview();
    changePreviewMode("clear");
    onClose();
  };

  handleDuplicateTestItem = async () => {
    const { data, testId, history, updateTestAndNavigate, test } = this.props;
    const itemId = data.id;
    this.closeModal();
    const duplicatedItem = await duplicateTestItem(itemId);
    if (testId) {
      updateTestAndNavigate({
        pathname: `/author/items/${duplicatedItem._id}/item-detail/test/${testId}`,
        fadeSidebar: true,
        regradeFlow: true,
        previousTestId: test.previousTestId
      });
    } else {
      history.push(`/author/items/${duplicatedItem._id}/item-detail`);
    }
  };

  // this is the one need to be modified
  editTestItem = () => {
    const { data, history, testId, clearItemStore, changeView, updateTestAndNavigate, test } = this.props;
    const itemId = data.id;

    // change the question editor view to "edit"
    changeView("edit");

    // itemDetail store has leftovers from previous visit to the page,
    // clearing it before navigation.
    clearItemStore();
    if (testId) {
      updateTestAndNavigate({
        pathname: `/author/tests/${testId}/editItem/${itemId}`,
        fadeSidebar: "false",
        regradeFlow: true,
        previousTestId: test.previousTestId
      });
    } else {
      history.push(`/author/items/${itemId}/item-detail`);
    }
  };

  clearView = () => {
    const { changePreviewMode, clearAnswers } = this.props;
    changePreviewMode("clear");
    clearAnswers();
  };

  goToItem = page => {
    const { setQuestionsForPassage, setPrevewItem, item, testItemPreviewData, passage } = this.props;
    const itemId = passage.testItems[page - 1];
    if (!(testItemPreviewData && testItemPreviewData.data)) {
      setPrevewItem(item);
    }
    testItemsApi.getById(itemId).then(response => {
      setQuestionsForPassage(response);
    });
  };

  handleSelection = () => {
    const { setDataAndSave, selectedRows, addItemToCart, test, gotoSummary, item, setTestItems, page } = this.props;
    console.log("page is", page);
    if (page === "itemList") {
      return addItemToCart(item);
    }
    if (!test.title.trim().length && page !== "itemList") {
      this.closeModal();
      gotoSummary();
      console.log("Reaching here");
      return message.error("Name field cannot be empty");
    }
    let keys = [...(selectedRows || [])];
    if (test.safeBrowser && !test.sebPassword) {
      return message.error("Please add a valid password");
    }
    if (!keys.includes(item._id)) {
      keys[keys.length] = item._id;
      setDataAndSave({ addToTest: true, item });
      message.success("Item added to cart");
    } else {
      keys = keys.filter(key => key !== item._id);
      setDataAndSave({ addToTest: false, item: { _id: item._id } });
      message.success("Item removed from cart");
    }
    setTestItems(keys);
  };

  get isAddOrRemove() {
    const { item, selectedRows } = this.props;
    if (selectedRows && selectedRows.length) {
      return !selectedRows.includes(item._id);
    }
    return true;
  }

  toggleHints = () => {
    this.setState(prevState => ({
      showHints: !prevState.showHints
    }));
  };

  toggleReportIssue = () => {
    this.setState(prevState => ({ showReportIssueField: !prevState.showReportIssueField }));
  };

  // TODO consistency for question and resources for previeew
  render() {
    const {
      isVisible,
      collections,
      loading,
      item = { rows: [], data: {}, authors: [] },
      currentAuthorId,
      isEditable = false,
      checkAnswer,
      showAnswer,
      preview,
      passage,
      questions = keyBy(get(item, "data.questions", []), "id"),
      page,
      showAddPassageItemToTestButton = false, // show if add item to test button needs to shown.
      windowWidth,
      userFeatures
    } = this.props;

    const { passageLoading, showHints, showReportIssueField } = this.state;
    const resources = keyBy(get(item, "data.resources", []), "id");

    let allWidgets = { ...questions, ...resources };
    const { authors = [], rows, data = {} } = item;
    const questionsType = data.questions && uniq(data.questions.map(question => question.type));
    const intersectionCount = intersection(questionsType, questionType.manuallyGradableQn).length;
    const isAnswerBtnVisible = questionsType && intersectionCount < questionsType.length;

    const getAuthorsId = authors.map(author => author._id);
    const authorHasPermission = getAuthorsId.includes(currentAuthorId);
    const { allowDuplicate } = collections.find(o => o._id === item.collectionName) || { allowDuplicate: true };
    const allRows = !!item.passageId && !!passage ? [passage.structure, ...rows] : rows;
    const passageTestItems = get(passage, "testItems", []);
    const isPassage = passage && passageTestItems.length;
    if (!!item.passageId && !!passage) {
      allWidgets = { ...allWidgets, ...keyBy(passage.data, "id") };
    }

    const isSmallSize = windowWidth <= SMALL_DESKTOP_WIDTH;

    return (
      <PreviewModalWrapper
        bodyStyle={{ padding: 30 }}
        isSmallSize={isSmallSize}
        width={isSmallSize ? "100%" : "70%"}
        visible={isVisible}
        onCancel={this.closeModal}
        footer={null}
        centered
        className="noOverFlowModal"
      >
        <HeadingWrapper>
          <Title>Preview</Title>
          {isPassage && showAddPassageItemToTestButton && (
            <ButtonsWrapper added={this.isAddOrRemove}>
              <Button onClick={this.handleSelection}>
                {this.isAddOrRemove ? (
                  <>
                    <PlusIcon>+</PlusIcon>
                    {" ADD PASSAGE TO TEST"}
                  </>
                ) : (
                  <>
                    <PlusIcon>-</PlusIcon>
                    {" REMOVE"}
                  </>
                )}
              </Button>
            </ButtonsWrapper>
          )}
        </HeadingWrapper>
        <ModalContentArea>
          <QuestionWrapper padding="0px">
            {loading || item === null || passageLoading ? (
              <ProgressContainer>
                <Spin tip="" />
              </ProgressContainer>
            ) : (
              <>
                <AuthorTestItemPreview
                  cols={allRows}
                  preview={preview}
                  previewTab={preview}
                  verticalDivider={item.verticalDivider}
                  scrolling={item.scrolling}
                  style={{ width: "100%" }}
                  questions={allWidgets}
                  viewComponent="authorPreviewPopup"
                  handleCheckAnswer={checkAnswer}
                  handleShowAnswer={showAnswer}
                  handleShowHints={this.toggleHints}
                  toggleReportIssue={this.toggleReportIssue}
                  showHints={showHints}
                  allowDuplicate={allowDuplicate}
                  /*Giving edit test item functionality to the user who is a curator as curator can edit any test item.*/
                  isEditable={(isEditable && authorHasPermission) || userFeatures.isCurator}
                  isPassage={isPassage}
                  passageTestItems={passageTestItems}
                  handleDuplicateTestItem={this.handleDuplicateTestItem}
                  editTestItem={this.editTestItem}
                  clearView={this.clearView}
                  goToItem={this.goToItem}
                  isAnswerBtnVisible={isAnswerBtnVisible}
                  item={item}
                  page={page}
                  showCollapseBtn
                />
                {showHints && <Hints questions={get(item, [`data`, `questions`], [])} />}
                {showReportIssueField && (
                  <ReportIssue textareaRows="3" item={item} toggleReportIssue={this.toggleReportIssue} />
                )}
              </>
            )}
          </QuestionWrapper>
        </ModalContentArea>
      </PreviewModalWrapper>
    );
  }
}

PreviewModal.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  isEditable: PropTypes.bool,
  item: PropTypes.object.isRequired,
  preview: PropTypes.any.isRequired,
  currentAuthorId: PropTypes.string.isRequired,
  collections: PropTypes.any.isRequired,
  loading: PropTypes.bool,
  gotoSummary: PropTypes.func,
  checkAnswer: PropTypes.func,
  showAnswer: PropTypes.func,
  clearAnswers: PropTypes.func.isRequired,
  changeView: PropTypes.func.isRequired,
  testId: PropTypes.string.isRequired,
  history: PropTypes.any.isRequired,
  windowWidth: PropTypes.number.isRequired
};

PreviewModal.defaultProps = {
  checkAnswer: () => {},
  showAnswer: () => {},
  gotoSummary: () => {},
  loading: false,
  isEditable: false
};

const enhance = compose(
  withRouter,
  withWindowSizes,
  connect(
    (state, ownProps) => {
      const itemId = (ownProps.data || {}).id;
      return {
        item: getItemDetailSelectorForPreview(state, itemId, ownProps.page),
        collections: getCollectionsSelector(state),
        passage: getPassageSelector(state),
        preview: get(state, ["view", "preview"]),
        currentAuthorId: get(state, ["user", "user", "_id"]),
        testItemPreviewData: get(state, ["testItemPreview", "item"], {}),
        selectedRows: getSelectedItemSelector(state),
        test: getTestSelector(state),
        userFeatures: getUserFeatures(state)
      };
    },
    {
      changeView: changeViewAction,
      changePreviewMode: changePreviewAction,
      clearAnswers: clearAnswersAction,
      addPassage: addPassageAction,
      addItemToCart: addItemToCartAction,
      setPrevewItem: setPrevewItemAction,
      setQuestionsForPassage: setQuestionsForPassageAction,
      clearPreview: clearPreviewAction,
      setDataAndSave: setTestDataAndUpdateAction,
      setTestItems: setTestItemsAction,
      clearItemStore: clearItemDetailAction,
      updateTestAndNavigate: updateTestAndNavigateAction
    }
  )
);

export default enhance(PreviewModal);

const ProgressContainer = styled.div`
  min-width: 250px;
  min-height: 150px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PreviewModalWrapper = styled(Modal)`
  height: ${({ isSmallSize }) => (isSmallSize ? "100%" : "auto")};
  border-radius: 5px;
  background: #f7f7f7;
  top: 30px;
  padding: 0px;
  .ant-modal-content {
    background: transparent;
    box-shadow: none;
    .ant-modal-close {
      top: 22px;
      right: 18px;
    }
    .ant-modal-close-icon {
      font-size: 25px;
      color: #000;
    }
  }
`;

const HeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 10px 20px 10px;
  justify-content: space-between;
  margin-top: -15px;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 20px;
`;

const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  button {
    margin-right: 40px;
    background-color: ${props => (!props.added ? "#fff" : themeColor)};
    color: ${props => (!props.added ? themeColor : "#fff")};
    height: 45px;
    width: 210px;
    font-size: 11px;
    &:hover {
      color: ${themeColor};
    }
    &:active,
    &:focus {
      background-color: ${props => (!props.added ? "#fff" : themeColor)};
      color: ${props => (!props.added ? themeColor : "#fff")};
    }
    &:hover,
    &:active,
    &:focus {
      span {
        position: absolute;
      }
    }
  }
  * {
    margin: 0 10px;
  }
`;

export const PlusIcon = styled.span`
  position: absolute;
  display: inline-block;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  margin-right: 10px;
  border: 1px solid ${themeColor};
  color: ${themeColor};
  left: 0px;
  top: 12px;
  font-size: 18px;
  line-height: 1;
`;

const QuestionWrapper = styled.div``;

const ModalContentArea = styled.div``;
