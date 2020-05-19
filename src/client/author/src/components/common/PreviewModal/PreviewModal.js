/* eslint-disable react/prop-types */
import PropTypes from "prop-types";
import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { get, keyBy, intersection, uniq } from "lodash";
import { Spin, Button, Modal, message, notification } from "antd";
import styled, { css } from "styled-components";
import { withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { withWindowSizes, EduButton, FlexContainer } from "@edulastic/common";
import { questionType, roleuser } from "@edulastic/constants";
import { testItemsApi, passageApi } from "@edulastic/api";
import { themeColor, white } from "@edulastic/colors";
import { IconClose, IconExpand, IconCollapse } from "@edulastic/icons";
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
import { allowDuplicateCheck } from "../../../utils/permissionCheck";

import { Nav } from "../../../../../assessment/themes/common";
import { getAssignmentsSelector } from "../../../../AssignTest/duck";

const { duplicateTestItem } = testItemsApi;
class PreviewModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      flag: false,
      passageLoading: false,
      showHints: false,
      showReportIssueField: false,
      fullModal: false
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
    const { data, testId, history, updateTestAndNavigate, test, match, isTest = !!testId } = this.props;
    const itemId = data.id;
    this.closeModal();
    const duplicatedItem = await duplicateTestItem(itemId);
    const regradeFlow = match.params.oldId && match.params.oldId !== "undefined";

    if (isTest) {
      updateTestAndNavigate({
        pathname: `/author/tests/${testId}/editItem/${duplicatedItem._id}`,
        fadeSidebar: true,
        regradeFlow,
        previousTestId: test.previousTestId,
        testId,
        isDuplicating: true
      });
    } else {
      history.push(`/author/items/${duplicatedItem._id}/item-detail`);
    }
  };

  // this is the one need to be modified
  editTestItem = () => {
    const {
      data,
      history,
      testId,
      clearItemStore,
      changeView,
      updateTestAndNavigate,
      test,
      isTest = !!testId,
      match
    } = this.props;

    const itemId = data.id;
    const regradeFlow = match.params.oldId && match.params.oldId !== "undefined";

    // change the question editor view to "edit"
    changeView("edit");
    // itemDetail store has leftovers from previous visit to the page,
    // clearing it before navigation.

    clearItemStore();
    if (isTest) {
      updateTestAndNavigate({
        pathname: `/author/tests/${testId}/editItem/${itemId}`,
        fadeSidebar: "false",
        regradeFlow,
        previousTestId: test.previousTestId,
        testId,
        isEditing: true
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

    if (page === "itemList") {
      return addItemToCart(item);
    }
    if (!test?.title?.trim()?.length && page !== "itemList") {
      this.closeModal();
      gotoSummary();
      console.log("Reaching here");
      notification.error({
        message: `Name field cannot be empty`,
        placement: "bottomLeft",
        duration: 1.5
      });
    }
    let keys = [...(selectedRows || [])];
    if (test.safeBrowser && !test.sebPassword) {
      return message.error("Please add a valid password");
    }
    if (!keys.includes(item._id)) {
      keys[keys.length] = item._id;
      setDataAndSave({ addToTest: true, item });
      notification.success({
        message: `Item added to cart`,
        placement: "bottomLeft",
        duration: 1.5
      });
    } else {
      keys = keys.filter(key => key !== item._id);
      setDataAndSave({ addToTest: false, item: { _id: item._id } });
      notification.success({
        message: `Item removed from cart`,
        placement: "bottomLeft",
        duration: 1.5
      });
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

  toggleFullModal = () => {
    this.setState(prevState => ({
      fullModal: !prevState.fullModal
    }));
  };

  navigationBtns = () => {
    const { nextItem, prevItem } = this.props;
    return (
      <>
        <PrevArrow
          onClick={() => {
            this.clearView();
            prevItem();
          }}
          position="absolute"
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </PrevArrow>
        <NextArrow
          onClick={() => {
            this.clearView();
            nextItem();
          }}
          position="absolute"
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </NextArrow>
      </>
    );
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
      userFeatures,
      onlySratchpad,
      changePreviewMode,
      test,
      testAssignments,
      userRole
    } = this.props;

    const { passageLoading, showHints, showReportIssueField, fullModal } = this.state;
    const resources = keyBy(get(item, "data.resources", []), "id");

    let allWidgets = { ...questions, ...resources };
    const { authors = [], rows, data = {} } = item;
    const questionsType = data.questions && uniq(data.questions.map(question => question.type));
    const intersectionCount = intersection(questionsType, questionType.manuallyGradableQn).length;
    const isAnswerBtnVisible = questionsType && intersectionCount < questionsType.length;

    const getAuthorsId = authors.map(author => author._id);
    const authorHasPermission = getAuthorsId.includes(currentAuthorId);

    const allowDuplicate = allowDuplicateCheck(item?.collections, collections, "item");

    const allRows = !!item.passageId && !!passage ? [passage.structure, ...rows] : rows;
    const passageTestItems = get(passage, "testItems", []);
    const isPassage = passage && passageTestItems.length;
    if (!!item.passageId && !!passage) {
      allWidgets = { ...allWidgets, ...keyBy(passage.data, "id") };
    }

    const isSmallSize = windowWidth <= SMALL_DESKTOP_WIDTH;

    const isTestInRegrade = !!test?._id && (testAssignments.length && test.isUsed);
    return (
      <PreviewModalWrapper
        bodyStyle={{ padding: 0 }}
        isSmallSize={isSmallSize}
        width={isSmallSize || fullModal ? "100%" : "70%"}
        height={isSmallSize || fullModal ? "100%" : null}
        visible={isVisible}
        closable={false}
        onCancel={this.closeModal}
        footer={null}
        centered
        className="noOverFlowModal"
      >
        {this.navigationBtns()}
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
          <ModalTopAction>
            <EduButton IconBtn type="primary" width="140px" height="32px" onClick={this.toggleFullModal}>
              {fullModal ? <IconCollapse /> : <IconExpand />} EXPAND
            </EduButton>
            <EduButton
              data-cy="close-preview"
              IconBtn
              isGhost
              width="32px"
              height="32px"
              onClick={this.closeModal}
              title="Close"
            >
              <IconClose />
            </EduButton>
          </ModalTopAction>
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
                  /* Giving edit test item functionality to the user who is a curator as curator can edit any test item. */
                  isEditable={
                    (isEditable && authorHasPermission) ||
                    userFeatures.isCurator ||
                    userRole === roleuser.EDULASTIC_CURATOR
                  }
                  isPassage={isPassage}
                  passageTestItems={passageTestItems}
                  handleDuplicateTestItem={this.handleDuplicateTestItem}
                  editTestItem={this.editTestItem}
                  clearView={this.clearView}
                  goToItem={this.goToItem}
                  isAnswerBtnVisible={isAnswerBtnVisible}
                  item={item}
                  page={page}
                  fullModal={fullModal}
                  showCollapseBtn
                  changePreviewTab={changePreviewMode}
                  onlySratchpad={onlySratchpad}
                  isTestInRegrade={isTestInRegrade}
                  closeModal={this.closeModal}
                />
                {/* we may need to bring hint button back */}
                {/* {showHints && <Hints questions={get(item, [`data`, `questions`], [])} />} */}
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
  windowWidth: PropTypes.number.isRequired,
  prevItem: PropTypes.func,
  nextItem: PropTypes.func
};

PreviewModal.defaultProps = {
  checkAnswer: () => {},
  showAnswer: () => {},
  gotoSummary: () => {},
  prevItem: () => {},
  nextItem: () => {},
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
        item: getItemDetailSelectorForPreview(state, itemId, ownProps.page) || get(state, "itemDetail.item"),
        collections: getCollectionsSelector(state),
        passage: getPassageSelector(state),
        preview: get(state, ["view", "preview"]),
        currentAuthorId: get(state, ["user", "user", "_id"]),
        testItemPreviewData: get(state, ["testItemPreview", "item"], {}),
        selectedRows: getSelectedItemSelector(state),
        test: getTestSelector(state),
        testAssignments: getAssignmentsSelector(state),
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
  position: relative;

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

const ArrowStyle = css`
  max-width: 30px;
  font-size: 26px;
  border-radius: 0px;
  left: 0px;
  svg {
    fill: #878a91;
    path {
      fill: unset;
    }
  }

  &:hover {
    svg {
      fill: ${white};
    }
  }
`;

const PrevArrow = styled(Nav.BackArrow)`
  ${ArrowStyle};
`;

const NextArrow = styled(Nav.NextArrow)`
  ${ArrowStyle};
  left: unset;
  right: 0px;
`;

const HeadingWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 15px 30px;
  background: ${white};
  justify-content: space-between;
  position: relative;
`;

const ModalTopAction = styled(FlexContainer)`
  justify-content: flex-end;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 20px;
  user-select: none;
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

const QuestionWrapper = styled.div`
  display: flex;
`;

const ModalContentArea = styled.div`
  border-radius: 0px;
  padding: 0px 30px;
`;
