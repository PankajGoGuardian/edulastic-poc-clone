import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { IconPlus, IconEye, IconDown, IconVolumeUp, IconNoVolume } from "@edulastic/icons";
import { get } from "lodash";
import { message, Row, Icon } from "antd";
import { withNamespaces } from "@edulastic/localization";
import { question, test as testContants } from "@edulastic/constants";
import { MathFormulaDisplay, PremiumTag, helpers, WithResources } from "@edulastic/common";
import { themeColor, red } from "@edulastic/colors";
import { testItemsApi } from "@edulastic/api";
import { getTestItemAuthorName, getQuestionType, getTestItemAuthorIcon } from "../../../dataUtils";
import { MAX_TAB_WIDTH } from "../../../src/constants/others";
import Standards from "./Standards";
import Stimulus from "./Stimulus";
import {
  Container,
  Categories,
  CategoryContent,
  CategoryName,
  Detail,
  DetailCategory,
  Text,
  Label,
  LabelText,
  Question,
  QuestionContent,
  TypeCategory,
  ViewButton,
  ViewButtonStyled,
  AddButtonStyled,
  HeartIcon,
  ShareIcon,
  UserIcon,
  IdIcon,
  MoreInfo,
  Details,
  AddRemoveBtn,
  AddRemoveBtnPublisher
} from "./styled";
import PreviewModal from "../../../src/components/common/PreviewModal";
import {
  setAndSavePassageItemsAction,
  getPassageItemsCountSelector,
  setPassageItemsAction
} from "../../../TestPage/ducks";
import { getUserFeatures } from "../../../../student/Login/ducks";
import PassageConfirmationModal from "../../../TestPage/components/PassageConfirmationModal/PassageConfirmationModal";
import Tags from "../../../src/components/common/Tags";
import appConfig from "../../../../../../app-config";
import SelectGroupModal from "../../../TestPage/components/AddItems/SelectGroupModal";
import { getCollectionsSelector } from "../../../src/selectors/user";
import { hasUserGotAccessToPremiumItem } from "../../../dataUtils";

import CollectionTag from "@edulastic/common/src/components/CollectionTag/CollectionTag";

const { ITEM_GROUP_TYPES } = testContants;

// render single item
class Item extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    checkAnswer: PropTypes.func.isRequired,
    showAnser: PropTypes.func.isRequired,
    windowWidth: PropTypes.number.isRequired,
    onToggleToCart: PropTypes.func.isRequired,
    selectedToCart: PropTypes.bool,
    page: PropTypes.string
  };

  static defaultProps = {
    selectedToCart: false,
    gotoSummary: () => {}
  };

  state = {
    isShowPreviewModal: false,
    isOpenedDetails: false,
    passageConfirmModalVisible: false,
    selectedId: ""
  };

  moveToItem = () => {
    const { history, item, t } = this.props;
    history.push({
      pathname: `/author/items/${item._id}/item-detail`,
      state: {
        backText: t("component.itemAdd.backToItemList"),
        backUrl: "/author/items",
        itemDetail: true
      }
    });
  };

  handleToggleItemToCart = item => async () => {
    const { onToggleToCart, selectedToCart, setPassageItems } = this.props;
    if (!selectedToCart && item.passageId) {
      const passageItems = await testItemsApi.getPassageItems(item.passageId);
      setPassageItems(passageItems);

      if (passageItems.length > 1) {
        return this.setState({
          passageConfirmModalVisible: true
        });
      }
    }
    onToggleToCart(item);
  };

  get description() {
    const { item } = this.props;
    return get(item, "rows[0].widgets[0].entity.stimulus", "");
  }

  get itemStimulus() {
    const { item } = this.props;
    const stimulus = get(item, ["data", "questions", 0, "stimulus"], question.DEFAULT_STIMULUS);
    return helpers.sanitizeForReview(stimulus);
  }

  closeModal = () => {
    this.setState({ isShowPreviewModal: false });
  };

  previewItem = () => {
    this.setState({ isShowPreviewModal: true });
  };

  redirectToEdit = () => {
    const { item, history } = this.props;
    history.push(`/author/items/${item._id}/item-detail`);
  };

  renderDetails = () => {
    const { item, windowWidth, collections } = this.props;
    const questions = get(item, "data.questions", []);
    const getAllTTS = questions.filter(item => item.tts).map(item => item.tts);
    const details = [
      {
        name: "DOK:",
        text: (questions.find(item => item.depthOfKnowledge) || {}).depthOfKnowledge
      },
      {
        name: getTestItemAuthorIcon(item, collections),
        text: getTestItemAuthorName(item, collections)
      },
      {
        name: <IdIcon />,
        text: item._id,
        type: "id"
      },
      {
        name: windowWidth > 1024 ? <ShareIcon /> : "",
        text: windowWidth > 1024 ? "9578 (1)" : ""
      },
      {
        name: <HeartIcon />,
        text: "9"
      }
    ];
    if (getAllTTS.length) {
      const ttsSuccess = getAllTTS.filter(item => item.taskStatus !== "COMPLETED").length === 0;
      const ttsStatusSuccess = {
        name: ttsSuccess ? <IconVolumeUp /> : <IconNoVolume />
      };
      details.push(ttsStatusSuccess);
    }

    if (hasUserGotAccessToPremiumItem(item.collections, collections)) {
      details.unshift({ name: <PremiumTag />, type: "premium" });
    }

    return details.map(
      (detail, index) =>
        (detail.text || detail.type === "premium") &&
        detail.text !== "Edulastic Certified" && (
          <DetailCategory key={`DetailCategory_${index}`}>
            <CategoryName>{detail.name}</CategoryName>
            {detail.type !== "premium" && (
              <CategoryContent>
                <Text title={detail.type === "id" ? detail.text : ""}>
                  {detail.type === "id" ? detail.text.substr(detail.text.length - 6) : detail.text}
                </Text>
              </CategoryContent>
            )}
          </DetailCategory>
        )
    );
  };

  toggleDetails = () => {
    const { isOpenedDetails } = this.state;

    this.setState({
      isOpenedDetails: !isOpenedDetails
    });
  };

  handleSelection = async row => {
    const { setTestItems, setDataAndSave, selectedRows, test, gotoSummary, setPassageItems, item, page } = this.props;
    if (!test.title?.trim().length && page !== "itemList") {
      gotoSummary();
      return message.error("Name field cannot be empty");
    }

    let keys = [];
    if (test.safeBrowser && !test.sebPassword) {
      return message.error("Please add a valid password");
    }

    this.setState({ selectedId: item._id });
    if (selectedRows !== undefined) {
      (selectedRows || []).forEach((selectedRow, index) => {
        keys[index] = selectedRow;
      });
    }
    if (!keys.includes(row._id)) {
      keys[keys.length] = row._id;
      if (item.passageId) {
        const passageItems = await testItemsApi.getPassageItems(item.passageId);
        setPassageItems(passageItems);
        if (passageItems.length > 1) {
          return this.setState({ selectedId: "", passageConfirmModalVisible: true });
        }
      }

      setDataAndSave({ addToTest: true, item, current: this.props.current });
      message.success("Item added to cart");
    } else {
      keys = keys.filter(item => item !== row._id);
      setDataAndSave({ addToTest: false, item: { _id: row._id }, current: this.props.current });
      message.success("Item removed from cart");
    }
    setTestItems(keys);
    this.setState({ selectedId: "" });
  };

  handleAddRemove = (item, isAddOrRemove) => {
    const {
      test: { itemGroups },
      setCurrentGroupIndex
    } = this.props;
    const staticGroups = itemGroups.filter(g => g.type === ITEM_GROUP_TYPES.STATIC);
    if (isAddOrRemove) {
      if (staticGroups.length === 1) {
        const index = itemGroups.findIndex(g => g.groupName === staticGroups[0].groupName);
        setCurrentGroupIndex(index);
        this.handleSelection(item);
      } else if (staticGroups.length > 1) {
        this.setState({ showSelectGroupModal: true });
      } else {
        return message.warning("No Static group found.");
      }
    } else {
      this.handleSelection(item);
    }
  };

  handleSelectGroupModalResponse = index => {
    const { item, setCurrentGroupIndex } = this.props;
    if (index || index === 0) {
      setCurrentGroupIndex(index);
      this.handleSelection(item);
    }
    this.setState({ showSelectGroupModal: false });
  };

  get isAddOrRemove() {
    const { item, selectedRows } = this.props;
    if (selectedRows && selectedRows.length) {
      return !selectedRows.includes(item._id);
    }
    return true;
  }

  /**
   *  TODO: find a friggin better name for the handler!
   *  handles the user response from the Passage confirmation modal.
   *  {Bool} value: user wants to select all the items?
   */
  handleResponse = value => {
    const { setAndSavePassageItems, passageItems, selectedRows = [] } = this.props;
    this.setState({ passageConfirmModalVisible: false });
    // add all the passage items to test.
    if (value) {
      message.success("Item added to cart");
      return setAndSavePassageItems(passageItems);
    }

    // open the modal for selecting  testItems manually.
    this.setState({ isShowPreviewModal: true });
  };

  render() {
    const {
      item,
      t,
      windowWidth,
      selectedToCart,
      search,
      userId,
      checkAnswer,
      showAnswer,
      page,
      passageItemsCount,
      gotoSummary,
      test,
      features
    } = this.props;
    const {
      isOpenedDetails,
      isShowPreviewModal = false,
      selectedId,
      passageConfirmModalVisible,
      showSelectGroupModal
    } = this.state;
    const owner = item.authors && item.authors.some(x => x._id === userId);
    const isEditable = owner;
    const itemTypes = getQuestionType(item);
    const isPublisher = features.isCurator || features.isPublisherAuthor;
    const staticGroups = test?.itemGroups.filter(g => g.type === ITEM_GROUP_TYPES.STATIC) || 0;
    const groupName =
      staticGroups.length === 1
        ? "Selected"
        : test?.itemGroups?.find(grp => !!grp.items.find(i => i._id === item._id))?.groupName || "Group";

    return (
      <WithResources resources={[`${appConfig.jqueryPath}/jquery.min.js`]} fallBack={<span />}>
        <Container className="fr-view">
          {isShowPreviewModal && (
            <PreviewModal
              isVisible={isShowPreviewModal}
              page={page}
              showAddPassageItemToTestButton={true}
              showEvaluationButtons
              onClose={this.closeModal}
              data={{ ...item, id: item._id }}
              isEditable={isEditable}
              owner={owner}
              testId={test?._id}
              isTest={!!test}
              checkAnswer={() => checkAnswer({ ...item, isItem: true })}
              showAnswer={() => showAnswer(item)}
              gotoSummary={gotoSummary}
            />
          )}
          {passageConfirmModalVisible && (
            <PassageConfirmationModal
              visible={passageConfirmModalVisible}
              closeModal={() => this.setState(prev => ({ passageConfirmModalVisible: false }))}
              itemsCount={passageItemsCount}
              handleResponse={this.handleResponse}
            />
          )}
          {showSelectGroupModal && (
            <SelectGroupModal
              visible={showSelectGroupModal}
              test={test}
              handleResponse={this.handleSelectGroupModalResponse}
            />
          )}
          <Question>
            <QuestionContent>
              <Stimulus
                onClickHandler={isPublisher ? this.redirectToEdit : this.previewItem}
                stimulus={get(item, ["data", "questions", 0, "stimulus"], question.DEFAULT_STIMULUS)}
              />
              <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: this.description }} />
            </QuestionContent>
            {windowWidth > MAX_TAB_WIDTH &&
              (page === "itemList" ? (
                <ViewButton>
                  <ViewButtonStyled data_cy={item._id} onClick={this.previewItem}>
                    <IconEye /> {t("component.item.view")}
                  </ViewButtonStyled>
                  <AddButtonStyled selectedToCart={selectedToCart} onClick={this.handleToggleItemToCart(item)}>
                    {selectedToCart ? "Remove" : <IconPlus />}
                  </AddButtonStyled>
                </ViewButton>
              ) : isPublisher ? (
                <AddRemoveBtnPublisher
                  data-cy={item._id}
                  loading={selectedId === item._id}
                  onClick={() => this.handleAddRemove(item, this.isAddOrRemove)}
                  isAddOrRemove={this.isAddOrRemove}
                >
                  {this.isAddOrRemove ? "ADD" : `${groupName}`}
                  {this.isAddOrRemove ? "" : <Icon type="close" />}
                </AddRemoveBtnPublisher>
              ) : (
                <AddRemoveBtn
                  data-cy={item._id}
                  loading={selectedId === item._id}
                  onClick={() => this.handleAddRemove(item, this.isAddOrRemove)}
                  isAddOrRemove={this.isAddOrRemove}
                >
                  {this.isAddOrRemove ? "ADD" : "REMOVE"}
                </AddRemoveBtn>
              ))}
          </Question>
          <Row type="flex" align="center">
            <Detail>
              <TypeCategory>
                {windowWidth > MAX_TAB_WIDTH && <Standards item={item} search={search} />}
                {windowWidth > MAX_TAB_WIDTH && <Tags tags={item.tags} key="tags" />}
                <CategoryContent>
                  {itemTypes.map(itemType => (
                    <Label>
                      <LabelText>{itemType}</LabelText>
                    </Label>
                  ))}
                  {item.collectionName ? <PremiumTag /> : null}
                  <CollectionTag collectionName={item?.collectionName} />
                </CategoryContent>
              </TypeCategory>
              {windowWidth > MAX_TAB_WIDTH && <Categories>{this.renderDetails()}</Categories>}
            </Detail>
            {windowWidth <= MAX_TAB_WIDTH &&
              (page === "itemList" ? (
                <ViewButton>
                  <MoreInfo onClick={this.toggleDetails} isOpenedDetails={isOpenedDetails}>
                    <IconDown />
                  </MoreInfo>
                  <ViewButtonStyled onClick={this.moveToItem}>
                    {t("component.item.view")}
                    <IconEye />
                  </ViewButtonStyled>
                  <AddButtonStyled selectedToCart={selectedToCart} onClick={this.handleToggleItemToCart(item)}>
                    {selectedToCart ? "Remove" : <IconPlus />}
                  </AddButtonStyled>
                </ViewButton>
              ) : (
                <ViewButton>
                  <MoreInfo onClick={this.toggleDetails} isOpenedDetails={isOpenedDetails}>
                    <IconDown />
                  </MoreInfo>
                  {isPublisher ? (
                    <AddRemoveBtnPublisher
                      data-cy={item._id}
                      loading={selectedId === item._id}
                      onClick={() => this.handleAddRemove(item, this.isAddOrRemove)}
                      isAddOrRemove={this.isAddOrRemove}
                    >
                      {this.isAddOrRemove ? "ADD" : `${groupName}`}
                      {this.isAddOrRemove ? "" : <Icon type="close" />}
                    </AddRemoveBtnPublisher>
                  ) : (
                    <AddRemoveBtn
                      loading={selectedId === item._id}
                      onClick={() => this.handleAddRemove(item, this.isAddOrRemove)}
                      isAddOrRemove={this.isAddOrRemove}
                    >
                      {this.isAddOrRemove ? "ADD" : "REMOVE"}
                    </AddRemoveBtn>
                  )}
                </ViewButton>
              ))}
          </Row>
          {windowWidth <= MAX_TAB_WIDTH && (
            <Details isOpenedDetails={isOpenedDetails}>
              <Standards item={item} search={search} />
              <Tags tags={item.tags} key="tags" />
              <Categories>{this.renderDetails()}</Categories>
            </Details>
          )}
        </Container>
      </WithResources>
    );
  }
}

const enhance = compose(
  withRouter,
  withNamespaces("author"),
  connect(
    state => ({
      passageItemsCount: getPassageItemsCountSelector(state),
      passageItems: state.tests.passageItems,
      features: getUserFeatures(state),
      collections: getCollectionsSelector(state)
    }),
    {
      setAndSavePassageItems: setAndSavePassageItemsAction,
      setPassageItems: setPassageItemsAction
    }
  )
);

export default enhance(Item);
