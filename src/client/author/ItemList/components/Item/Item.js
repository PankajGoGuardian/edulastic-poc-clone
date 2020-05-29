import React, { Component } from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { IconPlus, IconEye, IconDown, IconVolumeUp, IconNoVolume } from "@edulastic/icons";
import { get } from "lodash";
import { message, Row, Icon } from "antd";
import { withNamespaces } from "@edulastic/localization";
import { question, test as testContants, roleuser } from "@edulastic/constants";
import { MathFormulaDisplay, PremiumTag, helpers, WithResources, EduButton, CheckboxLabel } from "@edulastic/common";
import { testItemsApi } from "@edulastic/api";
import { notification } from "@edulastic/common";
import CollectionTag from "@edulastic/common/src/components/CollectionTag/CollectionTag";
import {
  getTestItemAuthorName,
  getQuestionType,
  getTestItemAuthorIcon,
  hasUserGotAccessToPremiumItem
} from "../../../dataUtils";
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
  IdIcon,
  MoreInfo,
  Details,
  AddRemoveBtn,
  AddRemoveBtnPublisher
} from "./styled";
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
import { getCollectionsSelector, isPublisherUserSelector } from "../../../src/selectors/user";
import { getUserRole } from "../../../src/selectors/user";
import { TestStatus } from "../../../TestList/components/ListItem/styled";
import TestStatusWrapper from "../../../TestList/components/TestStatusWrapper/testStatusWrapper";

const { ITEM_GROUP_TYPES, ITEM_GROUP_DELIVERY_TYPES } = testContants;

// render single item
class Item extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    gotoSummary: PropTypes.func,
    showAnser: PropTypes.func.isRequired,
    openPreviewModal: PropTypes.func.isRequired,
    windowWidth: PropTypes.number.isRequired,
    onToggleToCart: PropTypes.func.isRequired,
    selectedToCart: PropTypes.bool,
    page: PropTypes.string.isRequired
  };

  static defaultProps = {
    selectedToCart: false,
    gotoSummary: () => {}
  };

  state = {
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

  handleStimulusClick = () => {
    const { features, item, userId, history, openPreviewModal } = this.props;
    const owner = item.authors && item.authors.some(x => x._id === userId);
    // Author can only edit if owner
    if (features.isCurator || (features.isPublisherAuthor && owner)) {
      return history.push(`/author/items/${item._id}/item-detail`);
    }
    openPreviewModal();
  };

  renderDetails = () => {
    const { item, windowWidth, collections, isPublisherUser } = this.props;
    const questions = get(item, "data.questions", []);
    const getAllTTS = questions.filter(_item => _item.tts).map(_item => _item.tts);
    const details = [
      {
        name: "DOK:",
        text: (questions.find(_item => _item.depthOfKnowledge) || {}).depthOfKnowledge
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
      const ttsSuccess = getAllTTS.filter(_item => _item.taskStatus !== "COMPLETED").length === 0;
      const ttsStatusSuccess = {
        name: ttsSuccess ? <IconVolumeUp /> : <IconNoVolume />
      };
      details.push(ttsStatusSuccess);
    }

    if (!isPublisherUser && hasUserGotAccessToPremiumItem(item.collections, collections)) {
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
    const {
      setTestItems,
      setDataAndSave,
      selectedRows,
      test,
      gotoSummary,
      setPassageItems,
      item,
      page,
      current
    } = this.props;
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

      setDataAndSave({ addToTest: true, item, current });
      notification({ type: "success", messageKey: "itemAddedCart" });
    } else {
      keys = keys.filter(_item => _item !== row._id);
      setDataAndSave({ addToTest: false, item: { _id: row._id }, current });
      notification({ type: "success", messageKey: "itemRemovedCart" });
    }
    setTestItems(keys);
    this.setState({ selectedId: "" });
  };

  handleAddRemove = (item, isAdd) => {
    const {
      test: { itemGroups },
      setCurrentGroupIndex
    } = this.props;
    const staticGroups = itemGroups.filter(g => g.type === ITEM_GROUP_TYPES.STATIC);
    if (isAdd) {
      if (staticGroups.length === 1) {
        const index = itemGroups.findIndex(g => g.groupName === staticGroups[0].groupName);
        if (
          itemGroups[index]?.deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM &&
          item.itemLevelScoring === false
        ) {
          return notification({ type: "warn", messageKey:"itemCantBeAdded"});
        }
        setCurrentGroupIndex(index);
        this.handleSelection(item);
      } else if (staticGroups.length > 1) {
        this.setState({ showSelectGroupModal: true });
      } else {
        return notification({ type: "warn", messageKey:"noStaticGroupFound"});
      }
    } else {
      this.handleSelection(item);
    }
  };

  handleSelectGroupModalResponse = index => {
    const {
      item,
      setCurrentGroupIndex,
      test: { itemGroups }
    } = this.props;
    if (
      itemGroups[index]?.type === ITEM_GROUP_TYPES.STATIC &&
      itemGroups[index]?.deliveryType === ITEM_GROUP_DELIVERY_TYPES.LIMITED_RANDOM &&
      item.itemLevelScoring === false
    ) {
      return notification({ type: "warn", messageKey:"thisItemCantBeAdded"});
    }
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
    const { setAndSavePassageItems, passageItems, page } = this.props;
    this.setState({ passageConfirmModalVisible: false });
    // add all the passage items to test.
    if (value) {
      notification({ type: "success", messageKey: "itemAddedCart" });
      return setAndSavePassageItems({ passageItems, page });
    }

    // open the modal for selecting  testItems manually.
  };

  render() {
    const {
      item,
      t,
      windowWidth,
      selectedToCart,
      search,
      page,
      passageItemsCount,
      test,
      features,
      openPreviewModal,
      userRole
    } = this.props;
    const { isOpenedDetails, selectedId, passageConfirmModalVisible, showSelectGroupModal } = this.state;
    const itemTypes = getQuestionType(item);
    const isPublisher = features.isCurator || features.isPublisherAuthor;
    const staticGroups = test?.itemGroups.filter(g => g.type === ITEM_GROUP_TYPES.STATIC) || 0;
    const groupName =
      staticGroups.length === 1
        ? "Selected"
        : test?.itemGroups?.find(grp => !!grp.items.find(i => i._id === item._id))?.groupName || "Group";
    const hideAddRemove = userRole === roleuser.EDULASTIC_CURATOR;

    return (
      <WithResources resources={[`${appConfig.jqueryPath}/jquery.min.js`]} fallBack={<span />}>
        <Container className="fr-view">
          {passageConfirmModalVisible && (
            <PassageConfirmationModal
              visible={passageConfirmModalVisible}
              closeModal={() => this.setState(() => ({ passageConfirmModalVisible: false }))}
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
                onClickHandler={this.handleStimulusClick}
                stimulus={get(item, ["data", "questions", 0, "stimulus"], question.DEFAULT_STIMULUS)}
              />
              <MathFormulaDisplay dangerouslySetInnerHTML={{ __html: this.description }} />
            </QuestionContent>
            {windowWidth > MAX_TAB_WIDTH &&
              (page === "itemList" ? (
                <ViewButton>
                  <EduButton width="100px" height="40px" isGhost data_cy={item._id} onClick={openPreviewModal}>
                    <IconEye />
                    <span>{t("component.item.view").toUpperCase()}</span>
                  </EduButton>
                  {!hideAddRemove && (
                    <CheckboxLabel checked={selectedToCart} ml="24px" onChange={this.handleToggleItemToCart(item)} />
                  )}
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
                {windowWidth > MAX_TAB_WIDTH && (
                  <TestStatusWrapper status={item.status}>
                    {({ children, ...rest }) => <TestStatus {...rest}>{children}</TestStatus>}
                  </TestStatusWrapper>
                )}
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
                  {!hideAddRemove && (
                    <AddButtonStyled selectedToCart={selectedToCart} onClick={this.handleToggleItemToCart(item)}>
                      {selectedToCart ? "Remove" : <IconPlus />}
                    </AddButtonStyled>
                  )}
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
              <TestStatusWrapper>
                {({ children, ...rest }) => <TestStatus {...rest}>{children}</TestStatus>}
              </TestStatusWrapper>
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
      collections: getCollectionsSelector(state),
      isPublisherUser: isPublisherUserSelector(state),
      userRole: getUserRole(state)
    }),
    {
      setAndSavePassageItems: setAndSavePassageItemsAction,
      setPassageItems: setPassageItemsAction
    }
  )
);

export default enhance(Item);
