/* eslint-disable react/prop-types */
import { passageApi, testItemsApi } from "@edulastic/api";
import { red, themeColor, white, title } from "@edulastic/colors";
import { EduButton, FlexContainer, notification, withWindowSizes } from "@edulastic/common";
import { questionType, roleuser } from "@edulastic/constants";
import { IconClose, IconCollapse, IconCopy, IconExpand, IconPencilEdit, IconTrash, IconClear } from "@edulastic/icons";
import { faAngleLeft, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Icon, Modal, Spin } from "antd";
import { get, intersection, keyBy, uniq } from "lodash";
import PropTypes from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { compose } from "redux";
import styled, { css } from "styled-components";
import { SMALL_DESKTOP_WIDTH } from "../../../../../assessment/constants/others";
import { Nav } from "../../../../../assessment/themes/common";
import FeaturesSwitch from "../../../../../features/components/FeaturesSwitch";
import { getAssignmentsSelector } from "../../../../AssignTest/duck";
import { clearItemDetailAction, deleteItemAction, getItemDeletingSelector } from "../../../../ItemDetail/ducks";
import {
  addItemToCartAction,
  approveOrRejectSingleItem as approveOrRejectSingleItemAction
} from "../../../../ItemList/ducks";
import { getSelectedItemSelector, setTestItemsAction } from "../../../../TestPage/components/AddItems/ducks";
import { getTestSelector, setTestDataAndUpdateAction, updateTestAndNavigateAction } from "../../../../TestPage/ducks";
import { clearAnswersAction } from "../../../actions/answers";
import { changePreviewAction, changeViewAction } from "../../../actions/view";
import { getCollectionsSelector, getUserFeatures, isPublisherUserSelector } from "../../../selectors/user";
import { allowDuplicateCheck } from "../../../utils/permissionCheck";
import ScoreBlock from "../ScoreBlock";
import AuthorTestItemPreview from "./AuthorTestItemPreview";
import {
  addPassageAction,
  clearPreviewAction,
  duplicateTestItemPreviewRequestAction,
  getItemDetailSelectorForPreview,
  getPassageSelector,
  setPrevewItemAction,
  setQuestionsForPassageAction
} from "./ducks";
import ReportIssue from "./ReportIssue";
import { ButtonsWrapper, RejectButton } from "./styled";

class PreviewModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      flag: false,
      passageLoading: false,
      showHints: false,
      showReportIssueField: false,
      fullModal: false,
      isRejectMode: false
    };
  }

  componentDidMount() {
    const { item } = this.props;
    if (item.passageId) {
      this.loadPassage(item.passageId);
    }
  }

  loadPassage(id) {
    /**
     * FIXME: move this to redux-saga
     */
    const { addPassage } = this.props;
    this.setState({ passageLoading: true });
    try {
      passageApi.getById(id).then(response => {
        addPassage(response);
        this.setState({ passageLoading: false });
      });
    } catch (e) {
      this.setState({ passageLoading: false });
    }
  }

  componentDidUpdate(prevProps) {
    const { item: newItem } = this.props;
    const { item: oldItem } = prevProps;
    if (oldItem?.passageId !== newItem?.passageId && newItem?.passageId) {
      this.loadPassage(newItem.passageId);
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
    const { data, testId, duplicateTestItem, test, match, isTest = !!testId, passage } = this.props;
    const itemId = data.id;
    const regradeFlow = match.params.oldId && match.params.oldId !== "undefined";
    if (!passage) {
      return duplicateTestItem({ data, testId, test, match, isTest, itemId, regradeFlow });
    }

    const { testItemPreviewData } = this.props;

    Modal.confirm({
      title: "Clone Passage Item",
      content: `This passage has ${
        passage.testItems.length
        } Items associated with it. Would you like to clone complete passage or a single item?`,
      onOk: () => {
        duplicateTestItem({
          data,
          testId,
          test,
          match,
          isTest,
          itemId,
          regradeFlow,
          passage,
          currentItem: testItemPreviewData?._id
        });
        Modal.destroyAll();
        this.closeModal();
      },
      onCancel: () => {
        duplicateTestItem({
          data,
          testId,
          test,
          match,
          isTest,
          itemId,
          regradeFlow,
          passage,
          duplicateWholePassage: true
        });
        Modal.destroyAll();
        this.closeModal();
      },
      okText: "Current Item",
      cancelText: "Complete Passage",
      centered: true,
      width: 500,
      okButtonProps: {
        style: { background: themeColor, outline: "none" }
      }
    });

    // const duplicatedItem = await duplicateTestItem(itemId);

    // if (isTest) {
    //   updateTestAndNavigate({
    //     pathname: `/author/tests/${testId}/editItem/${duplicatedItem._id}`,
    //     fadeSidebar: true,
    //     regradeFlow,
    //     previousTestId: test.previousTestId,
    //     testId,
    //     isDuplicating: true,
    //     passage
    //   });
    // } else {
    //   history.push(`/author/items/${duplicatedItem._id}/item-detail`);
    // }
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
    const {
      setQuestionsForPassage,
      setPrevewItem,
      item,
      testItemPreviewData,
      passage,
      updateCurrentItemFromPassagePagination
    } = this.props;
    const itemId = passage.testItems[page - 1];
    if (!(testItemPreviewData && testItemPreviewData.data)) {
      setPrevewItem(item);
    }
    testItemsApi.getById(itemId).then(response => {
      if (response?._id && updateCurrentItemFromPassagePagination) {
        /**
         * Whenever we are changing the item using the navigation in the passage
         * we need to update the state in the ItemListContainer component as well
         * why? @see https://snapwiz.atlassian.net/browse/EV-15223
         */
        updateCurrentItemFromPassagePagination(response._id);
      }
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
      notification({ messageKey: "nameShouldNotEmpty" });
    }
    let keys = [...(selectedRows || [])];
    if (test.safeBrowser && !test.sebPassword) {
      notification({ messageKey: "enterValidPassword" });
      return;
    }
    if (!keys.includes(item._id)) {
      keys[keys.length] = item._id;
      setDataAndSave({ addToTest: true, item });
      notification({ type: "success", messageKey: "itemAddedTest" });
    } else {
      keys = keys.filter(key => key !== item._id);
      setDataAndSave({ addToTest: false, item: { _id: item._id } });
      notification({ type: "success", messageKey: "itemRemovedTest" });
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

  getBtnStyle = addedToTest => ({
    backgroundColor: !addedToTest ? "#fff" : themeColor,
    color: !addedToTest ? themeColor : "#fff",
    borderColor: !addedToTest ? themeColor : ""
  });

  handleDeleteItem = () => {
    const {
      item: { _id },
      deleteItem,
      isEditable,
      page,
      closeModal
    } = this.props;
    if (!isEditable) {
      notification({ messageKey: "dontHaveWritePermission" });
      return;
    }
    if (closeModal) closeModal();
    return deleteItem({ id: _id, isItemPrevew: page === "addItems" || page === "itemList" });
  };

  handleApproveOrRejectSingleItem = value => {
    const { approveOrRejectSingleItem: _approveOrRejectSingleItem, item } = this.props;
    if (item?._id) {
      _approveOrRejectSingleItem({ itemId: item._id, status: value });
    }
  };

  handleReject = () => this.setState({ isRejectMode: true });

  // TODO consistency for question and resources for previeew
  render() {
    const {
      isVisible,
      collections,
      loading,
      item = { rows: [], data: {}, authors: [] },
      userId,
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
      userRole,
      deleting,
      isPublisherUser
    } = this.props;

    const { passageLoading, showHints, showReportIssueField, fullModal, isRejectMode } = this.state;
    const resources = keyBy(get(item, "data.resources", []), "id");

    let allWidgets = { ...questions, ...resources };
    const { authors = [], rows, data = {} } = item;
    const questionsType = data.questions && uniq(data.questions.map(question => question.type));
    const intersectionCount = intersection(questionsType, questionType.manuallyGradableQn).length;
    const isAnswerBtnVisible = questionsType && intersectionCount < questionsType.length;
    const isOwner = authors.some(author => author._id === userId);

    const allowDuplicate = allowDuplicateCheck(item?.collections, collections, "item") || isOwner || isPublisherUser;

    const allRows = !!item.passageId && !!passage ? [passage.structure, ...rows] : rows;
    const passageTestItems = get(passage, "testItems", []);
    const isPassage = passage && passageTestItems.length;
    if (!!item.passageId && !!passage) {
      allWidgets = { ...allWidgets, ...keyBy(passage.data, "id") };
    }

    const isSmallSize = windowWidth <= SMALL_DESKTOP_WIDTH;

    const isTestInRegrade = !!test?._id && (testAssignments.length && test.isUsed);
    const isDisableEdit = !(
      (isEditable && isOwner) ||
      userRole === roleuser.EDULASTIC_CURATOR ||
      userFeatures.isCurator
    );
    const isDisableDuplicate = !(allowDuplicate && userRole !== roleuser.EDULASTIC_CURATOR);
    const disableEdit = item?.algoVariablesEnabled && isTestInRegrade;

    return (
      <PreviewModalWrapper
        bodyStyle={{ padding: 0 }}
        wrapClassName="preview-full-modal"
        isSmallSize={isSmallSize}
        width={isSmallSize || fullModal ? "100%" : "75%"}
        height={isSmallSize || fullModal ? "100%" : null}
        visible={isVisible}
        closable={false}
        onCancel={this.closeModal}
        footer={null}
        centered
        className="noOverFlowModal"
        fullModal={fullModal}
      >
        {this.navigationBtns()}
        <HeadingWrapper>
          <Title>Preview</Title>
          <FlexContainer justifyContent="flex-end" width="100%">
            <ScoreBlock
              customStyle={{
                position: "relative",
                top: "unset",
                right: "unset",
                bottom: "unset",
                left: "unset",
                margin: "0 5px",
                transform: "unset"
              }}
            />
          </FlexContainer>

          <ModalTopAction>
            {isPassage && showAddPassageItemToTestButton ? (
              <EduButton
                isBlue
                isGhost={!this.isAddOrRemove}
                height="28px"
                justifyContent="center"
                onClick={this.handleSelection}
              >
                {this.isAddOrRemove ? "ADD PASSAGE TO TEST" : "REMOVE FROM TEST"}
              </EduButton>
            ) : (
              <EduButton isBlue height="28px" justifyContent="center" onClick={this.handleSelection}>
                {this.isAddOrRemove ? "Add To Test" : "Remove from Test"}
              </EduButton>
              )}
            <ButtonsWrapper
              justifyContent="flex-end"
              wrap="nowrap"
              style={{ visibility: onlySratchpad && "hidden", position: "relative", marginLeft: "5px" }}
            >
              {isAnswerBtnVisible && (
                <>
                  <EduButton isGhost height="28px" data-cy="check-answer-btn" onClick={checkAnswer}>
                    CHECK ANSWER
                  </EduButton>
                  <EduButton isGhost height="28px" data-cy="show-answers-btn" onClick={showAnswer}>
                    SHOW ANSWER
                  </EduButton>
                </>
              )}
              {page !== "itemAuthoring" && (
                <EduButton
                  title="Clear"
                  IconBtn
                  isGhost
                  width="28px"
                  height="28px"
                  data-cy="clear-btn"
                  onClick={this.clearView}
                >
                  <IconClear width="15" height="15" color={themeColor} />
                </EduButton>
              )}
              {disableEdit && userRole !== roleuser.EDULASTIC_CURATOR ? (
                <EduButton
                  IconBtn
                  noHover
                  isGhost
                  disabled
                  height="28px"
                  width="28px"
                  title="Editing the question with dynamic parameters is disabled during the Test edit and regrade."
                >
                  <IconPencilEdit color={themeColor} />
                </EduButton>
              ) : (
                <EduButton
                  IconBtn
                  isGhost
                  height="28px"
                  width="28px"
                  title={isDisableEdit ? "Edit permission is restricted by the author" : "Edit item"}
                  noHover={isDisableEdit}
                  disabled={isDisableEdit}
                  onClick={this.editTestItem}
                >
                  <IconPencilEdit color={themeColor} title="Edit item" />
                </EduButton>
                )}
              <EduButton
                IconBtn
                isGhost
                width="28px"
                height="28px"
                title={isDisableDuplicate ? "Clone permission is restricted by the author" : "Clone"}
                noHover={isDisableDuplicate}
                disabled={isDisableDuplicate}
                onClick={this.handleDuplicateTestItem}
              >
                <IconCopy color={themeColor} />
              </EduButton>
              {isOwner &&
                !(userFeatures?.isPublisherAuthor && item.status === "published") &&
                (page === "addItems" || page === "itemList") && (
                  <EduButton
                    IconBtn
                    title="Delete item"
                    isGhost
                    height="28px"
                    width="28px"
                    onClick={this.handleDeleteItem}
                    disabled={deleting}
                  >
                    <IconTrash title="Delete item" />
                    {/* <span>delete</span> */}
                  </EduButton>
                )}
              <FeaturesSwitch inputFeatures="isCurator" actionOnInaccessible="hidden">
                <>
                  {item.status === "inreview" ? (
                    <RejectButton
                      title="Reject"
                      isGhost
                      height="28px"
                      onClick={this.handleReject}
                      disabled={isRejectMode}
                    >
                      <Icon type="stop" color={red} />
                      <span>Reject</span>
                    </RejectButton>
                  ) : null}
                  {item.status === "inreview" || item.status === "rejected" ? (
                    <EduButton
                      title="Approve"
                      isGhost
                      height="28px"
                      onClick={() => this.handleApproveOrRejectSingleItem("published")}
                    >
                      <Icon type="check" color={themeColor} />
                      <span>Approve</span>
                    </EduButton>
                  ) : null}
                </>
              </FeaturesSwitch>
            </ButtonsWrapper>

            <EduButton
              IconBtn
              isGhost
              type="primary"
              width="28px"
              height="28px"
              onClick={this.toggleFullModal}
              title={fullModal ? "Collapse" : "Expand"}
            >
              {fullModal ? <IconCollapse /> : <IconExpand />}
            </EduButton>
            <EduButton
              data-cy="close-preview"
              IconBtn
              isGhost
              width="28px"
              height="28px"
              onClick={this.closeModal}
              title="Close"
              noHover
              style={{ border: "none", boxShadow: "none" }}
            >
              <IconClose width={10} height={10} color={`${title} !important`} />
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
                      (isEditable && isOwner) || userFeatures.isCurator || userRole === roleuser.EDULASTIC_CURATOR
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
  userId: PropTypes.string.isRequired,
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
  checkAnswer: () => { },
  showAnswer: () => { },
  gotoSummary: () => { },
  prevItem: () => { },
  nextItem: () => { },
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
        userId: get(state, ["user", "user", "_id"]),
        testItemPreviewData: get(state, ["testItemPreview", "item"], {}),
        selectedRows: getSelectedItemSelector(state),
        test: getTestSelector(state),
        testAssignments: getAssignmentsSelector(state),
        userFeatures: getUserFeatures(state),
        isPublisherUser: isPublisherUserSelector(state),
        deleting: getItemDeletingSelector(state)
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
      updateTestAndNavigate: updateTestAndNavigateAction,
      duplicateTestItem: duplicateTestItemPreviewRequestAction,
      deleteItem: deleteItemAction,
      approveOrRejectSingleItem: approveOrRejectSingleItemAction
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
  border-radius: ${({ fullModal }) => (fullModal ? "0px" : "5px")};
  background: #f7f7f7;
  top: 30px;
  padding: 0px;
  position: relative;
  margin: ${({ fullModal }) => (fullModal ? "0px" : "20px auto")};

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

export const PlusIcon = styled.div`
  position: relative;
  width: 20px;
  height: 20px;
  background: #fff;
  border-radius: 50%;
  border: 1px solid ${themeColor};
  color: ${themeColor};
  font-size: 18px;
  line-height: 1;
  margin-right: 10px;
`;

const QuestionWrapper = styled.div`
  display: flex;
`;

const ModalContentArea = styled.div`
  border-radius: 0px;
  padding: 0px 30px;
`;
